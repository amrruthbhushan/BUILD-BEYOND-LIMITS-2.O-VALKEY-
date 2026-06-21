import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { 
  getAllLeads, 
  getLeadById, 
  createLead, 
  updateLead, 
  deleteLead, 
  seedLeads 
} from './db.js';
import { 
  initValkey, 
  client as valkey, 
  getValkeyStatus, 
  getValkeyLogs, 
  registerValkeyLogger 
} from './valkey.js';
import { scoreLead, generateFollowUps } from './ai.js';
import { demoLeads } from './demoData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Maintain SSE clients for Valkey command streams
let sseClients = [];

// Register the Valkey logger callback to stream events to clients
registerValkeyLogger((newLog) => {
  sseClients.forEach(client => {
    client.write(`data: ${JSON.stringify(newLog)}\n\n`);
  });
});

// SSE telemetry route
app.get('/api/valkey/telemetry', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  
  // Send current status immediately
  const statusLog = {
    id: 'status-' + Date.now(),
    timestamp: new Date().toISOString(),
    command: 'INFO',
    args: ['Server-Sent Events Connection Established'],
    status: 'SUCCESS',
    error: '',
    mode: getValkeyStatus().mode
  };
  res.write(`data: ${JSON.stringify(statusLog)}\n\n`);

  sseClients.push(res);

  req.on('close', () => {
    sseClients = sseClients.filter(c => c !== res);
  });
});

// ----------------------------------------------------
// Core Lead Management API
// ----------------------------------------------------

// Get all leads
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await getAllLeads();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single lead
app.get('/api/leads/:id', async (req, res) => {
  try {
    const lead = await getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new lead
app.post('/api/leads', async (req, res) => {
  try {
    const newLead = await createLead(req.body);
    
    // Log creation in lead history in Valkey
    if (valkey) {
      await valkey.lpush(`history:lead:${newLead.id}`, `Lead created: ${newLead.name} at ${newLead.company}`);
      await valkey.set(`session:last_modified_lead`, newLead.id);
    }
    
    res.status(201).json(newLead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update lead
app.put('/api/leads/:id', async (req, res) => {
  try {
    const updatedLead = await updateLead(req.params.id, req.body);
    if (!updatedLead) return res.status(404).json({ error: 'Lead not found' });
    
    // If the core details change, invalidate AI cache to force re-evaluation
    if (valkey) {
      await valkey.del(`ai:score:${req.params.id}`);
      await valkey.del(`ai:followup:${req.params.id}`);
      await valkey.lpush(`history:lead:${req.params.id}`, `Lead updated (AI Cache Invalidated)`);
      await valkey.set(`session:last_modified_lead`, req.params.id);
    }

    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete lead
app.delete('/api/leads/:id', async (req, res) => {
  try {
    const success = await deleteLead(req.params.id);
    if (!success) return res.status(404).json({ error: 'Lead not found' });

    // Clean up Valkey caches for this lead
    if (valkey) {
      await valkey.del(`ai:score:${req.params.id}`);
      await valkey.del(`ai:followup:${req.params.id}`);
      await valkey.del(`history:lead:${req.params.id}`);
      await valkey.set(`session:last_deleted_lead`, req.params.id);
    }

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------
// AI Operations & Valkey Caching API
// ----------------------------------------------------

// Run AI Scoring
app.post('/api/leads/:id/score', async (req, res) => {
  try {
    const lead = await getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    const cacheKey = `ai:score:${lead.id}`;
    let scoreResult = null;

    // Check Valkey Cache
    if (valkey) {
      const cached = await valkey.get(cacheKey);
      if (cached) {
        scoreResult = JSON.parse(cached);
        await valkey.lpush(`history:lead:${lead.id}`, `Fetched AI Score from cache`);
      }
    }

    if (!scoreResult) {
      // Cache miss - execute AI score logic
      scoreResult = await scoreLead(lead);
      
      // Save results back to Lead JSON DB (persistent state)
      await updateLead(lead.id, {
        aiScore: scoreResult.score,
        aiCategory: scoreResult.category,
        aiProbability: scoreResult.probability,
        aiReasoning: scoreResult.reasoning
      });

      // Save to Valkey Cache (expiry: 1 hour / 3600 seconds)
      if (valkey) {
        await valkey.setex(cacheKey, 3600, JSON.stringify(scoreResult));
        await valkey.lpush(`history:lead:${lead.id}`, `Generated new AI Score: ${scoreResult.category} (${scoreResult.score}%)`);
      }
    }

    res.json({ leadId: lead.id, ...scoreResult });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Run AI Follow-up Generator
app.post('/api/leads/:id/followups', async (req, res) => {
  try {
    const lead = await getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    const cacheKey = `ai:followup:${lead.id}`;
    let followupResult = null;

    // Check Valkey Cache
    if (valkey) {
      const cached = await valkey.get(cacheKey);
      if (cached) {
        followupResult = JSON.parse(cached);
        await valkey.lpush(`history:lead:${lead.id}`, `Fetched AI outreach templates from cache`);
      }
    }

    if (!followupResult) {
      // Cache miss - generate outreach scripts
      followupResult = await generateFollowUps(lead);

      // Save to Valkey Cache (expiry: 1 hour / 3600 seconds)
      if (valkey) {
        await valkey.setex(cacheKey, 3600, JSON.stringify(followupResult));
        await valkey.lpush(`history:lead:${lead.id}`, `Generated outreach templates (Email, LinkedIn, WhatsApp)`);
      }
    }

    res.json(followupResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get lead history log from Valkey
app.get('/api/leads/:id/history', async (req, res) => {
  try {
    let history = [];
    if (valkey) {
      history = await valkey.lrange(`history:lead:${req.params.id}`, 0, -1);
    } else {
      history = ['Local memory emulator: History logs restricted'];
    }
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------
// Valkey Diagnostics API
// ----------------------------------------------------

app.get('/api/valkey/status', (req, res) => {
  res.json(getValkeyStatus());
});

app.get('/api/valkey/logs', (req, res) => {
  res.json(getValkeyLogs());
});

// ----------------------------------------------------
// Setup & Reset Utilities
// ----------------------------------------------------

// Reset/Seed Database Endpoint
app.post('/api/db/reset', async (req, res) => {
  try {
    await seedLeads(demoLeads);

    // Flush cache/emulator mock keys
    if (valkey) {
      // We log flushing operations
      await valkey.set('session:last_system_reset', new Date().toISOString());
      
      // In emulator mode we can just reset lists/memory
      // In real redis we can run flushall, but for safety let's delete keys we manage
      const keys = await valkey.keys('*');
      for (const key of keys) {
        await valkey.del(key);
      }
      await valkey.lpush('history:system', 'Database and cache reset complete');
    }

    res.json({ message: 'Database successfully seeded with 20 demo leads. Cache cleared.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Session Memory Mock
app.get('/api/session', async (req, res) => {
  try {
    let sessionData = {
      username: 'admin@copilot.ai',
      role: 'Sales Manager',
      lastActive: new Date().toISOString()
    };

    if (valkey) {
      const cachedSession = await valkey.get('session:user');
      if (cachedSession) {
        sessionData = JSON.parse(cachedSession);
      } else {
        await valkey.set('session:user', JSON.stringify(sessionData));
      }
    }
    res.json(sessionData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------
// Boot Server
// ----------------------------------------------------
async function startServer() {
  // Initialize Valkey connection first
  await initValkey();

  // Check if DB file is empty, if so, seed demo data automatically
  const currentLeads = await getAllLeads();
  if (currentLeads.length === 0) {
    console.log('Database empty on boot, auto-seeding 20 demo leads.');
    await seedLeads(demoLeads);
  }

  app.listen(PORT, () => {
    console.log(`Sales Copilot Backend running on port ${PORT}`);
  });
}

startServer();
