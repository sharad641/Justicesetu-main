const express = require('express');
const router = express.Router();

// AI endpoint using Groq (Llama3)
router.post('/ask', async (req, res) => {
  try {
    const { query, history } = req.body;
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    console.log('[AI] Query received:', query?.substring(0, 40));
    console.log('[AI] Groq Key present:', !!GROQ_API_KEY, '| Key length:', GROQ_API_KEY?.length);

    if (!GROQ_API_KEY) {
      return res.status(500).json({ message: 'GROQ_API_KEY not configured in .env' });
    }

    const systemPrompt = "You are Nyaya, the JusticeSetu AI Legal Inference Engine. You specialize exclusively in the Indian Penal Code, civil cases, and supreme court rulings. Reply strictly in simple, concise, and highly formatted text. Use **bold headers** and bullet points. Keep all responses accurate, under 250 words, and extremely professional.";

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).map(m => ({
        role: m.type === 'bot' ? 'assistant' : 'user',
        content: m.text
      })),
      { role: 'user', content: query }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        temperature: 0.2
      })
    });

    console.log('[AI] Groq response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[AI] Groq API Error:', JSON.stringify(errorData, null, 2));
      return res.status(response.status).json({
        message: `AI Error ${response.status}: ${errorData?.error?.message || 'Unknown error'}`
      });
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;

    console.log('[AI] Success! Answer length:', answer.length);
    res.json({ answer });

  } catch (error) {
    console.error('[AI] Route Error:', error.message);
    res.status(500).json({ message: 'AI Service currently unavailable.' });
  }
});

module.exports = router;
