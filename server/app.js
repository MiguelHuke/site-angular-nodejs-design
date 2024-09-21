require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuração do transportador de e-mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Rota para enviar e-mail
app.post('/api/contact/send', async (req, res) => {
  const { email, content, attachment } = req.body;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'test@suamaeaquelaursa.org',
      subject: 'Novo Contato',
      text: content,
      attachments: attachment ? [{ filename: attachment.originalname, content: attachment.buffer }] : []
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recebemos seu contato',
      text: 'Obrigado por entrar em contato.'
    });
    res.status(200).json({ message: 'E-mail enviado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao enviar e-mail.' });
  }
});

// Rota para obter imagens do portfólio
app.get('/api/portfolio/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const { data } = await axios.get(`https://www.behance.net/${username}`);
    const $ = cheerio.load(data);
    const images = [];
    $('img').each((i, elem) => {
      const src = $(elem).attr('src');
      if (src && src.includes('/projects/') &&
        !src.includes('/tools/') && 
        !src.includes('/icons/') &&
        $(elem).closest('header').length === 0 && 
        $(elem).closest('footer').length === 0) {
      images.push(src);
    }
  });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar imagens.' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
