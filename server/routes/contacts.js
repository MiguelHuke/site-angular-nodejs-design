const express = require('express');
const router = express.Router();
const { sendEmail } = require('../services/emailService');
const { scrapeImages } = require('../services/scrapeService');

router.post('/send', async (req, res) => {
  const { email, content, attachment } = req.body;
  try {
    // Enviar e-mail para a empresa
    await sendEmail('teste@suamaeaquelaursa.org', 'Novo Contato', content, attachment);
    // Enviar e-mail automático para o usuário
    await sendEmail(email, 'Recebemos seu contato', 'Obrigado por entrar em contato.');
    res.status(200).send({ message: 'E-mail enviado com sucesso!' });
  } catch (error) {
    res.status(500).send({ error: 'Erro ao enviar e-mail.' });
  }
});

router.get('/portfolio/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const images = await scrapeImages(username);
    res.status(200).json(images);
  } catch (error) {
    res.status(500).send({ error: 'Erro ao buscar imagens.' });
  }
});

module.exports = router;