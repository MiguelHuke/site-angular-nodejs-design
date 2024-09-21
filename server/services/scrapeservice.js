const axios = require('axios');
const cheerio = require('cheerio');

const scrapeImages = async (username) => {
  const { data } = await axios.get(`https://www.behance.net/${username}`);
  const $ = cheerio.load(data);

  const images = [];
  $('img').each((i, elem) => {
    const src = $(elem).attr('src');
    if (src /*&& src.includes('/projects/')*/) { // Verifica se a URL da imagem contém "/project/"
     // console.log(src);
      images.push(src);
    }
  });

  return images;
};

module.exports = { scrapeImages };
