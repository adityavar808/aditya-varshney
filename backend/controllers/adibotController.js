const { GoogleGenerativeAI } = require('@google/generative-ai');
const AdibotModel = require('../models/adibotModel');
const ServiceModel = require('../models/serviceModel');
const ProjectModel = require('../models/projectModel');
const SkillModel = require('../models/skillModel');

// GET /api/adibot/context (admin only)
const getContext = async (req, res) => {
  try {
    const doc = await AdibotModel.getContext();
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/adibot/context (admin only)
const updateContext = async (req, res) => {
  const { customContext, geminiApiKey } = req.body;
  try {
    const doc = await AdibotModel.updateContext(customContext, geminiApiKey);
    res.json({ success: true, doc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/adibot/chat (public)
const handleChatRequest = async (req, res) => {
  const { messages } = req.body;
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages history array is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_actual_gemini_api_key_here') {
    return res.status(500).json({ error: 'Gemini API Key is not configured on the backend server.' });
  }

  try {
    // 1. Fetch dynamic DB context items using their built-in CRUD helpers
    const doc = await AdibotModel.getContext();
    const services = await ServiceModel.getAll();
    const projects = await ProjectModel.getAll();
    const skills = await SkillModel.getAll();

    // 2. Synthesize complete context document
    const servicesContext = services.map(s => `- ${s.name} (${s.subtitle}): ${s.description}`).join('\n');
    const projectsContext = projects.map(p => `- ${p.name} [Category: ${p.category}]: Live URL: ${p.liveUrl}`).join('\n');
    const skillsContext = skills.map(sk => `- ${sk.name}: ${sk.tagline}`).join('\n');

    const fullSystemInstruction = `You are Adibot, Aditya Varshney's personal AI representative.
Your task is to answer user queries about Aditya Varshney, his projects, skills, services, and profile.
You should act extremely friendly, helpful, professional, and matching the sleek cyberpunk/omnitrix portfolio aesthetic.
Answer as if you represent Aditya's brand.

Here is the context about Aditya retrieved from MongoDB:

---
${doc.customContext}
---

CURRENT SERVICES OFFERED:
${servicesContext || 'No services added.'}

CURRENT COMPLETED PROJECTS:
${projectsContext || 'No projects added.'}

CURRENT TECHNICAL SKILLS:
${skillsContext || 'No skills added.'}
---

Additional Rules:
- If a user asks questions unrelated to Aditya, politely pivot back to Aditya (e.g. "I'm built to share info about Aditya and his tech capabilities!").
- Keep replies extremely brief, matching the user's level of detail (no more than 1-2 short sentences). If the user says "hi" or "hello", reply with a very short greeting. Do not print long intros. Do not use any markdown formatting, asterisks, or bold text (e.g. do not output "**" for bold); output plain text only.
- ALWAYS use the exact URLs provided in the context (LinkedIn: https://www.linkedin.com/in/adityaavarshney/ and GitHub: https://github.com/adityavar808). Do NOT guess, hallucinate, or alter these URLs.
- Invite the user to write their details in the Contact Form if they want to hire or collaborate with Aditya.`;

    // 3. Initialize Gemini SDK and start a chat session
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      systemInstruction: fullSystemInstruction
    });

    // Format chat history for Gemini:
    // history: [{ role: 'user' | 'model', parts: [{ text: string }] }]
    const formattedHistory = messages.slice(0, -1).map(m => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || !lastMessage.content) {
      return res.status(400).json({ error: 'Last message content is required' });
    }

    const chat = model.startChat({
      history: formattedHistory
    });

    const result = await chat.sendMessage(lastMessage.content);
    const responseText = result.response.text();

    res.json({ reply: responseText });
  } catch (error) {
    console.error('Gemini chat error:', error.message);
    res.status(500).json({ error: `Adibot encountered an error: ${error.message}` });
  }
};

module.exports = { getContext, updateContext, handleChatRequest };
