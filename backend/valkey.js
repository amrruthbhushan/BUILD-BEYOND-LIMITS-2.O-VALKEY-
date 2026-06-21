import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const VALKEY_URL = process.env.VALKEY_URL || 'redis://127.0.0.1:6379';

let client = null;
let isEmulated = false;
let logs = [];
const maxLogs = 50;

// Log function to track command history
function logCommand(command, args, success = true, errorMsg = '') {
  const newLog = {
    id: Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
    command,
    args: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)),
    status: success ? 'SUCCESS' : 'FAILED',
    error: errorMsg,
    mode: isEmulated ? 'EMULATOR' : 'VALKEY'
  };
  
  logs.unshift(newLog);
  if (logs.length > maxLogs) {
    logs.pop();
  }

  // SSE broadcast function (will be registered by server.js)
  if (broadcastCallback) {
    broadcastCallback(newLog);
  }
}

let broadcastCallback = null;
export function registerValkeyLogger(callback) {
  broadcastCallback = callback;
}

export function getValkeyLogs() {
  return logs;
}

// In-Memory Storage Emulator
const memoryStore = new Map();
const listStore = new Map();

const emulator = {
  get: async (key) => {
    try {
      const val = memoryStore.get(key) || null;
      logCommand('GET', [key]);
      return val;
    } catch (err) {
      logCommand('GET', [key], false, err.message);
      throw err;
    }
  },
  
  set: async (key, value, mode, duration) => {
    try {
      memoryStore.set(key, String(value));
      const displayArgs = [key, value];
      if (mode && duration) displayArgs.push(mode, duration);
      logCommand('SET', displayArgs);
      return 'OK';
    } catch (err) {
      logCommand('SET', [key, value], false, err.message);
      throw err;
    }
  },

  setex: async (key, seconds, value) => {
    try {
      memoryStore.set(key, String(value));
      // In-memory expiration simulation (optional, just delete after timeout)
      setTimeout(() => {
        if (memoryStore.get(key) === String(value)) {
          memoryStore.delete(key);
          logCommand('EXPIRED', [key]);
        }
      }, seconds * 1000);
      
      logCommand('SETEX', [key, seconds, value]);
      return 'OK';
    } catch (err) {
      logCommand('SETEX', [key, seconds, value], false, err.message);
      throw err;
    }
  },

  lpush: async (key, ...values) => {
    try {
      if (!listStore.has(key)) {
        listStore.set(key, []);
      }
      const list = listStore.get(key);
      list.unshift(...values);
      logCommand('LPUSH', [key, ...values]);
      return list.length;
    } catch (err) {
      logCommand('LPUSH', [key, ...values], false, err.message);
      throw err;
    }
  },

  lrange: async (key, start, stop) => {
    try {
      const list = listStore.get(key) || [];
      const end = stop === -1 ? list.length : stop + 1;
      const slice = list.slice(start, end);
      logCommand('LRANGE', [key, start, stop]);
      return slice;
    } catch (err) {
      logCommand('LRANGE', [key, start, stop], false, err.message);
      throw err;
    }
  },

  del: async (key) => {
    try {
      let deleted = 0;
      if (memoryStore.has(key)) {
        memoryStore.delete(key);
        deleted = 1;
      }
      if (listStore.has(key)) {
        listStore.delete(key);
        deleted = 1;
      }
      logCommand('DEL', [key]);
      return deleted;
    } catch (err) {
      logCommand('DEL', [key], false, err.message);
      throw err;
    }
  },

  keys: async (pattern) => {
    try {
      const allKeys = [...memoryStore.keys(), ...listStore.keys()];
      // Simple pattern matcher
      const regexPattern = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      const matches = allKeys.filter(k => regexPattern.test(k));
      logCommand('KEYS', [pattern]);
      return matches;
    } catch (err) {
      logCommand('KEYS', [pattern], false, err.message);
      throw err;
    }
  }
};

// Initialize Connection
export async function initValkey() {
  console.log(`Connecting to Valkey at: ${VALKEY_URL}`);
  
  return new Promise((resolve) => {
    // We set a max connect timeout of 2 seconds so we don't block start up if Valkey is down
    const redisOptions = {
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      lazyConnect: true
    };
    
    const rawClient = new Redis(VALKEY_URL, redisOptions);
    
    rawClient.connect().then(() => {
      console.log('Successfully connected to Valkey server.');
      isEmulated = false;
      client = {
        get: async (key) => {
          const val = await rawClient.get(key);
          logCommand('GET', [key]);
          return val;
        },
        set: async (key, val) => {
          const res = await rawClient.set(key, val);
          logCommand('SET', [key, val]);
          return res;
        },
        setex: async (key, seconds, val) => {
          const res = await rawClient.setex(key, seconds, val);
          logCommand('SETEX', [key, seconds, val]);
          return res;
        },
        lpush: async (key, ...vals) => {
          const res = await rawClient.lpush(key, ...vals);
          logCommand('LPUSH', [key, ...vals]);
          return res;
        },
        lrange: async (key, start, stop) => {
          const res = await rawClient.lrange(key, start, stop);
          logCommand('LRANGE', [key, start, stop]);
          return res;
        },
        del: async (key) => {
          const res = await rawClient.del(key);
          logCommand('DEL', [key]);
          return res;
        },
        keys: async (pattern) => {
          const res = await rawClient.keys(pattern);
          logCommand('KEYS', [pattern]);
          return res;
        }
      };
      resolve(client);
    }).catch((err) => {
      console.warn(`Valkey connection failed: ${err.message}. Falling back to in-memory Emulator.`);
      isEmulated = true;
      client = emulator;
      logCommand('SYSTEM_FALLBACK', ['Local Memory Valkey Emulator Activated']);
      resolve(client);
    });
  });
}

export function getValkeyStatus() {
  return {
    connected: !isEmulated,
    mode: isEmulated ? 'EMULATOR' : 'VALKEY',
    url: isEmulated ? 'in-memory-fallback' : VALKEY_URL
  };
}

export { client };
