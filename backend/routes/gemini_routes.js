// routes/geminiSolutions.js
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get('/solutions', async (req, res) => {
  try {
    const { disease } = req.query;
    
    if (!disease) {
      return res.status(400).json({ error: 'Disease parameter is required' });
    }

    // Get the model (Gemini 1.5 Pro)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Create a prompt for Gemini - requesting concise solutions
    const prompt = `
      I've detected "${disease}" in my crops. Please provide:
      
      1. Brief explanation of this plant disease (1 sentence)
      2. Top 2-3 most effective treatments
      3. Simple application instructions
      4. 1-2 key preventive measures
      
      Format the response as 5-6 short, actionable bullet points TOTAL (not per section).
      Keep each bullet point to one concise sentence.
    `;

    // Generate content with Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response into an array of solutions and limit to max 6 items
    const solutions = text
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '').trim())
      .slice(0, 6);

    res.json({ solutions });
  } catch (error) {
    console.error('Error querying Gemini:', error);
    res.status(500).json({ error: 'Failed to get solutions from Gemini' });
  }
});


export default router;