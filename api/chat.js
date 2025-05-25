// arquivo: api/chat.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  const prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'O prompt é obrigatório.' });
  }

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/OpenAssistant/oasst-sft-1-pythia-12b", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const result = await response.json();

    const output = result?.[0]?.generated_text || 'Não consegui gerar uma resposta.';

    res.status(200).json({ answer: output });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao processar o pedido.' });
  }
}
