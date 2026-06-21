import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'leads.json');

// Helper to ensure database file exists
async function initDb() {
  try {
    await fs.access(DB_PATH);
  } catch {
    // If not found, write empty array
    await fs.writeFile(DB_PATH, JSON.stringify([], null, 2));
  }
}

// Read all leads
export async function getAllLeads() {
  await initDb();
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return [];
  }
}

// Write leads array to file
async function saveLeads(leads) {
  await initDb();
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(leads, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing to database:', error);
    return false;
  }
}

// Get single lead
export async function getLeadById(id) {
  const leads = await getAllLeads();
  return leads.find(l => l.id === id) || null;
}

// Create lead
export async function createLead(leadData) {
  const leads = await getAllLeads();
  const newLead = {
    id: leadData.id || Date.now().toString(),
    name: leadData.name || '',
    company: leadData.company || '',
    email: leadData.email || '',
    phone: leadData.phone || '',
    industry: leadData.industry || '',
    notes: leadData.notes || '',
    status: leadData.status || 'New', // e.g. New, Contacted, Nurturing, Qualified, Closed-Won, Closed-Lost
    aiScore: leadData.aiScore || null,
    aiReasoning: leadData.aiReasoning || null,
    aiProbability: leadData.aiProbability || null, // Conversion probability e.g. 75
    aiCategory: leadData.aiCategory || null, // Hot, Warm, Cold
    createdAt: leadData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  leads.push(newLead);
  await saveLeads(leads);
  return newLead;
}

// Update lead
export async function updateLead(id, updatedFields) {
  const leads = await getAllLeads();
  const idx = leads.findIndex(l => l.id === id);
  if (idx === -1) return null;

  leads[idx] = {
    ...leads[idx],
    ...updatedFields,
    updatedAt: new Date().toISOString()
  };
  await saveLeads(leads);
  return leads[idx];
}

// Delete lead
export async function deleteLead(id) {
  const leads = await getAllLeads();
  const filtered = leads.filter(l => l.id !== id);
  if (filtered.length === leads.length) return false;
  await saveLeads(filtered);
  return true;
}

// Seed or overwrite leads
export async function seedLeads(leadsArray) {
  await saveLeads(leadsArray);
  return leadsArray;
}
