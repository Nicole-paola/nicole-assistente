const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const HF_TOKEN = process.env.HF_TOKEN;
const HF_API_URL = 'https://api-inference.huggingface.co/models/pierreguillou/llama2-7b-pt-chat';

app.post('/chat', async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) {
    return res.status(400).json({ error: 'O prompt é obrigatório.' });
  }
  try {
    const response = await axios.post(HF_API_URL, { inputs: prompt }, {
      headers: { Authorization: `Bearer ${HF_TOKEN}` }
    });
    const answer = response.data?.[0]?.generated_text || 'Não consegui gerar uma resposta.';
    res.json({ answer });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro ao processar o pedido.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
