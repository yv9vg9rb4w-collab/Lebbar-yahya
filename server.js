// server.cjs
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config(); // ✅ charge le fichier .env
const OpenAI = require('openai');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ✅ clé sécurisée
});

app.post('/api/ask', async (req, res) => {
  try {
    const { prompt } = req.body;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur avec OpenAI" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
