import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY || '';
let genAI = null;

if (API_KEY) {
  console.log('Gemini API Key detected, initializing Gemini client.');
  genAI = new GoogleGenerativeAI(API_KEY);
} else {
  console.log('No Gemini API Key found in environment. Simulated AI Engine will be used.');
}

// ----------------------------------------------------
// Deterministic AI Simulator (Fallback)
// ----------------------------------------------------
function simulateLeadScoring(lead) {
  const notes = (lead.notes || '').toLowerCase();
  const company = lead.company || 'their company';
  const industry = lead.industry || 'Tech';
  const name = lead.name || 'the prospect';

  let score = 50;
  let category = 'Warm';
  let probability = 45;
  const reasoning = [];

  // Rules based adjustments
  if (notes.includes('budget') || notes.includes('decision maker') || notes.includes('immediate') || notes.includes('pricing') || notes.includes('demo requested')) {
    score += 30;
    reasoning.push('Lead has explicitly mentioned budget or requested a demo/pricing.');
  }
  if (notes.includes('unsubscribed') || notes.includes('not interested') || notes.includes('wrong number') || notes.includes('competitor')) {
    score -= 35;
    reasoning.push('Notes indicate active friction or disinterest (e.g., "not interested" or "competitor").');
  }
  if (lead.email && (lead.email.endsWith('.edu') || lead.email.endsWith('.org'))) {
    score -= 10;
    reasoning.push('Email domain belongs to an educational or non-profit organization.');
  } else if (lead.email && !lead.email.includes('gmail') && !lead.email.includes('yahoo') && !lead.email.includes('outlook')) {
    score += 10;
    reasoning.push('Prospect is using a professional corporate email address.');
  }
  if (lead.phone) {
    score += 5;
    reasoning.push('Direct phone number is available for cold calling/SMS outreach.');
  }

  // Bound score
  score = Math.max(10, Math.min(98, score));

  // Determine category
  if (score >= 75) {
    category = 'Hot';
    probability = Math.floor(70 + (score - 75) * 1.15);
  } else if (score >= 40) {
    category = 'Warm';
    probability = Math.floor(35 + (score - 40) * 0.85);
  } else {
    category = 'Cold';
    probability = Math.floor(10 + score * 0.6);
  }

  // Generate generic smart reasoning bullet points based on fields
  reasoning.push(`Prospect industry (${industry}) shows high product-market fit matching our historical closed deals.`);
  reasoning.push(`Lead is positioned at ${company}, presenting a good mid-market entry point.`);
  if (reasoning.length < 3) {
    reasoning.push('Follow-up scheduled within the next 48 hours to secure discovery call.');
  }

  return {
    score,
    category,
    probability,
    reasoning: reasoning.slice(0, 4)
  };
}

function simulateFollowUps(lead) {
  const name = lead.name || 'there';
  const firstName = name.split(' ')[0];
  const company = lead.company || 'your company';
  const industry = lead.industry || 'industry';
  const notes = lead.notes || '';

  const emailSubject = `Optimizing ${industry} operations at ${company}`;
  const emailBody = `Hi ${firstName},\n\nI hope this email finds you well.\n\nI was researching ${company} and noticed your work in the ${industry} space. Given your current focus, I wanted to share how we help sales and operations teams optimize their workflows and increase conversion rates by up to 25%.\n\n${notes ? `I noticed in my notes that you mentioned: "${notes}". ` : ''}I'd love to schedule a brief 10-minute call this Thursday at 2:00 PM to share some insights tailored to ${company}.\n\nWould you be open to a quick chat?\n\nBest regards,\n[Your Name]\nSales Copilot Team`;

  const linkedin = `Hi ${firstName}, I came across your profile and noticed your focus on ${industry} at ${company}. I'm connecting with leaders in this space to share new insights on AI-driven sales enablement. Let's connect!`;

  const whatsapp = `Hey ${firstName}! This is [Your Name] from Sales Copilot. I saw you were looking into sales automation solutions for ${company}. Let me know if you have 5 minutes for a quick chat today! 🚀`;

  return {
    email: {
      subject: emailSubject,
      body: emailBody
    },
    linkedin,
    whatsapp
  };
}

// ----------------------------------------------------
// Public API Methods
// ----------------------------------------------------

/**
 * Perform AI scoring on lead details
 */
export async function scoreLead(lead) {
  if (!genAI) {
    // Return simulated score immediately
    return simulateLeadScoring(lead);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `
      You are an expert sales analyst AI. Analyze this sales lead and classify it.
      
      Lead Information:
      - Name: ${lead.name}
      - Company: ${lead.company}
      - Email: ${lead.email}
      - Phone: ${lead.phone}
      - Industry: ${lead.industry}
      - Notes/History: ${lead.notes}
      - Current Status: ${lead.status}
      
      Determine:
      1. score: A number between 0 and 100 representing sales readiness.
      2. category: Must be exactly "Hot", "Warm", or "Cold".
      3. probability: A number between 0 and 100 representing conversion probability percentage.
      4. reasoning: An array of 3-4 bullet-point strings detailing why you scored it this way, mentioning specific cues from notes, email type, or industry.
      
      Return ONLY a JSON object matching this schema:
      {
        "score": number,
        "category": "Hot" | "Warm" | "Cold",
        "probability": number,
        "reasoning": string[]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Gemini Lead Scoring failed, falling back to simulator:', error.message);
    return simulateLeadScoring(lead);
  }
}

/**
 * Generate follow-up templates for email, LinkedIn, and WhatsApp
 */
export async function generateFollowUps(lead) {
  if (!genAI) {
    // Return simulated followups immediately
    return simulateFollowUps(lead);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `
      You are a professional sales copywriter. Generate a set of high-converting outreach messages for this prospect.
      
      Prospect Details:
      - Name: ${lead.name}
      - Company: ${lead.company}
      - Email: ${lead.email}
      - Industry: ${lead.industry}
      - Notes/Context: ${lead.notes}
      
      Create three personalized channels:
      1. email: An email template with subject and body. Keep it professional, brief, and with a clear call-to-action.
      2. linkedin: A short connection request or direct message (under 300 characters) that is personalized and soft-sell.
      3. whatsapp: A very friendly, casual, and brief message (under 200 characters) using emojis.
      
      Return ONLY a JSON object matching this schema:
      {
        "email": {
          "subject": "string",
          "body": "string"
        },
        "linkedin": "string",
        "whatsapp": "string"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Gemini Followup generation failed, falling back to simulator:', error.message);
    return simulateFollowUps(lead);
  }
}
