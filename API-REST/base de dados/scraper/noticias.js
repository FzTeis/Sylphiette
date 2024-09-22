//=============> ======== <==============\\

const {
  axios,
  cheerio,
  unescapeHtml,
  default_criador,
  useragent_1,
  removerAcentos,
  linkfy,
  fs
} = require('./defaults.js')

//==========> Vasco <==========\\

const Vasco = () => new Promise((resolve, reject) => {
  axios.get(`https://vasco.com.br/noticias/`, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('#page-content > div:nth-child(3) > div > div > div > div').each((i, e) => {
        dados.push({
          noticia: $(e).find('div > div > div:nth-child(2) > a > div > h2').text()?.trim(),
          imagem: $(e).find('div > a > div > img').attr('data-src') || '',
          desc: $(e).find('div > div > div:nth-child(2) > div > a > p').text()?.trim() || '',
          link: $(e).find('a:first').attr('href'),
        });
      });
      resolve({
        status: res.status,
        fonte: 'https://vasco.com.br/noticias/',
        criador: default_criador,
        resultado: dados.filter(a => a.noticia && a.link)
      });
    })
    .catch((e) => {
      reject(e)
    });
});

//==========> G1 Globo <==========\\

const G1 = () => new Promise((resolve, reject) => {
  axios.get(`https://g1.globo.com/`, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('.type-materia').each((i, e) => {
        dados.push({
          noticia: $(e).find('a:first').text(),
          imagem: $(e).find('img').attr('src') || '',
          desc: $(e).find('.feed-post-body-resumo:first').text() || '',
          categoria: $(e).find('.feed-post-metadata-section:first').text()?.trim(),
          link: $(e).find('a:first').attr('href'),
          postado: $(e).find('span.feed-post-datetime:first').text()
        });
      });
      resolve({
        status: res.status,
        fonte: 'https://g1.globo.com/',
        criador: default_criador,
        resultado: dados
      });
    })
    .catch((e) => {
      reject(e)
    });
});

//==========> Poder 360 <==========\\

const Poder360 = () => new Promise((resolve, reject) => {
  axios.get(`https://www.poder360.com.br/`, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('.box-news-list__news').each((i, e) => {
        dados.push({
          noticia: $(e).find('h2 > a').text(),
          imagem: $(e).find('img').attr('srcset') || $(e).find('img').attr('src'),
          link: $(e).find('h2 > a').attr('href')
        });
      });
      resolve({
        status: res.status,
        fonte: 'https://www.poder360.com.br/',
        criador: default_criador,
        resultado: dados
      });
    })
    .catch((e) => {
      reject(e)
    });
});

//==========> Jovem Pan (censurada) <==========\\

const JovemPan = () => new Promise((resolve, reject) => {
  axios.get(`https://jovempan.com.br/`, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('div.featured-news').each((i, e) => {
        dados.push({
          noticia: unescapeHtml($(e).find('p.title').text()?.trim()),
          imagem: $(e).find('img').attr('src'),
          link: $(e).find('a').attr('href')
        });
      });
      $('div.news-small').each((i, e) => {
        if ($(e).find('a').attr('href')) {
          dados.push({
            noticia: unescapeHtml($(e).find('p.title').text() || $(e).find('p.title-edicase').text()),
            imagem: $(e).find('img').attr('src'),
            categoria: $(e).find('h6.category').text()?.trim() || $(e).find('h6.category-edicase').text()?.trim(),
            link: $(e).find('a').attr('href')
          });
        };
      });
      $('a.item').each((i, e) => {
        dados.push({
          noticia: unescapeHtml($(e).find('p.title').text()?.trim()),
          imagem: $(e).find('img').attr('src'),
          categoria: $(e).find('h6.category').text()?.trim(),
          link: $(e).attr('href')
        });
      });
      resolve({
        status: res.status,
        fonte: 'https://jovempan.com.br/',
        criador: default_criador,
        resultado: dados.filter(a => a.noticia && a.link?.includes('jovempan'))
      });
    })
    .catch((e) => {
      reject(e)
    });
});

//==========> UOL <==========\\

const Uol = () => new Promise((resolve, reject) => {
  axios.get(`https://www.uol.com.br/`, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('li.accordion__item').each((i, e) => {
        dados.push({
          noticia: unescapeHtml($(e).find('a').attr('title')),
          imagem: $(e).find('img').attr('src'),
          link: $(e).find('a').attr('href')
        });
      });
      resolve({
        status: res.status,
        fonte: 'https://www.uol.com.br/',
        criador: default_criador,
        resultado: dados.filter(a => a.noticia && a.link)
      });
    })
    .catch((e) => {
      reject(e)
    });
});

//==========> CNN Brasil <==========\\

const CNNBrasil = () => new Promise((resolve, reject) => {
  axios.get(`https://www.cnnbrasil.com.br/`, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('li.new__editorias__list__item').each((i, e) => {
        dados.push({
          noticia: unescapeHtml($(e).find('a').attr('title')),
          imagem: $(e).find('img').attr('src'),
          categoria: $(e).find('span.home__title__label').text(),
          link: $(e).find('a').attr('href')
        });
      });
      resolve({
        status: res.status,
        fonte: 'https://www.cnnbrasil.com.br/',
        criador: default_criador,
        resultado: dados
      });
    })
    .catch((e) => {
      reject(e)
    });
});

//==========> Estadão <==========\\

const Estadao = () => new Promise((resolve, reject) => {
  axios.get(`https://www.estadao.com.br/`, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('div.noticia-single-block').each((i, e) => {
        dados.push({
          noticia: unescapeHtml($(e).find('a:first').attr('title')),
          imagem: 'https://www.estadao.com.br' + $(e).find('img').attr('src'),
          desc: $(e).find('div.subheadline').text(),
          link: $(e).find('.chapeu > a').attr('href')
        });
      });
      resolve({
        status: res.status,
        fonte: 'https://www.estadao.com.br/',
        criador: default_criador,
        resultado: dados
      });
    })
    .catch((e) => {
      reject(e)
    });
});

//==========> Terra <==========\\

const Terra = () => new Promise((resolve, reject) => {
  axios.get(`https://www.terra.com.br/noticias/`, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('div[class="card card-news card-h-small  card-has-image  "]').each((i, e) => {
        dados.push({
          noticia: unescapeHtml($(e).find('a.card-news__text--title').text()),
          imagem: $(e).find('img').attr('src'),
          link: $(e).find('a.card-news__text--title').attr('href')
        });
      });
      resolve({
        status: res.status,
        fonte: 'https://www.terra.com.br/noticias/',
        criador: default_criador,
        resultado: dados
      });
    })
    .catch((e) => {
      reject(e)
    });
});

//==========> Exame <==========\\

const Exame = () => new Promise((resolve, reject) => {
  axios.get(`https://exame.com/`, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data, {
        scriptingEnabled: false
      }); // scriptingEnabled: false é para o cheerio não ignorar os <noscript>
      const dados = [];
      $('.cgVWlJ').each((i, e) => {
        if ($(e).find('a').attr('href') && !$(e).find('a').attr('href')?.includes('http')) {
          dados.push({
            noticia: unescapeHtml($(e).find('a:first').text()),
            imagem: $(e).find('noscript > img').attr('src'),
            postado: $(e).find('.hxwSvx').text()?.split('•')[0]?.trim(),
            categoria: $(e).find('.giGgyy').text(),
            link: 'https://exame.com' + $(e).find('a:first').attr('href')
          });
        };
      });
      resolve({
        status: res.status,
        fonte: 'https://exame.com/',
        criador: default_criador,
        resultado: dados
      });
    })
    .catch((e) => {
      reject(e)
    });
});

//==========> Notícias Ao Minuto <==========\\

const NoticiasAoMinuto = () => new Promise((resolve, reject) => {
  axios.get(`https://www.noticiasaominuto.com.br/`, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('div[class="menu-thumb cursor-pointer"]').each((i, e) => {
        dados.push({
          noticia: unescapeHtml($(e).find('p').text()),
          imagem: $(e).find('img').attr('src'),
          postado: $(e).find('.menu-thumb-date').text(),
          categoria: $(e).find('.nm-custom-label-category').text(),
          link: $(e).find('a:first').attr('href')
        });
      });
      resolve({
        status: res.status,
        fonte: 'https://www.noticiasaominuto.com.br/',
        criador: default_criador,
        resultado: dados
      });
    })
    .catch((e) => {
      reject(e)
    });
});

//==========> Veja Abril <==========\\

const VejaAbril = () => new Promise((resolve, reject) => {
  axios.get(`https://veja.abril.com.br/`, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('a[class="card a"]').each((i, e) => {
        dados.push({
          noticia: unescapeHtml($(e).find('.title').text()),
          imagem: $(e).find('img').attr('data-src') || 'https://telegra.ph/file/2003e814c68cf402903cf.jpg',
          categoria: $(e).find('.category:first').text(),
          link: $(e).attr('href')
        });
      });
      resolve({
        status: res.status,
        fonte: 'https://veja.abril.com.br/',
        criador: default_criador,
        resultado: dados
      });
    })
    .catch((e) => {
      reject(e)
    });
});

//==========> A Gazeta <==========\\

const AGazeta = () => new Promise((resolve, reject) => {
  axios.get(`https://www.agazeta.com.br/brasil`, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('#resultList > article').each((i, e) => {
        dados.push({
          noticia: unescapeHtml($(e).find('a > header > div').text()),
          desc: unescapeHtml($(e).find('a > header > p').text()),
          imagem: $(e).find('a > figure > img').attr('data-cfsrc'),
          categoria: $(e).find('a > header > label:first').text(),
          link: $(e).find('a').attr('href')
        });
      });
      resolve({
        status: res.status,
        fonte: 'https://www.agazeta.com.br/brasil',
        criador: default_criador,
        resultado: dados
      });
    })
    .catch((e) => {
      reject(e)
    });
});

//==========> BBC <==========\\

const BBC = () => new Promise((resolve, reject) => {
  axios.get(`https://www.bbc.com/portuguese`, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('script').each((i, e) => {
        if ($(e).text().includes('window.SIMORGH_DATA=')) {
          const json = JSON.parse($(e).text().replace('window.SIMORGH_DATA=', ''))
          json.pageData.content.groups.forEach((a) => {
            for (const b of a.items) {
              if (!b.headlines?.headline || !b.locators?.assetUri) continue;
              dados.push({
                noticia: b.headlines?.headline,
                desc: b.summary,
                imagem: b.indexImage?.href || b.imageThumbnail?.href,
                link: 'https://www.bbc.com' + b.locators?.assetUri
              })
            }
          })
        }
      })
      resolve({
        status: res.status,
        fonte: 'https://www.bbc.com/portuguese',
        criador: default_criador,
        resultado: dados
      });
    })
    .catch((e) => {
      reject(e)
    });
});

//==========> Ultimas Notícias  <==========\\

const TodaNoticias = () => new Promise((resolve, reject) => {
  Promise.all([G1(), Poder360(), JovemPan(), Uol(), CNNBrasil(), Estadao(), Terra(), Exame(), NoticiasAoMinuto(), VejaAbril(), BBC(), AGazeta()])
    .then((data) => {
      const dados = [];
      for (const a of data.map((a) => a.resultado.slice(0, 20))) dados.push(...a);
      resolve({
        status: (dados && dados.length >= 0),
        criador: default_criador,
        resultado: dados.shuffle()
      });
    })
    .catch((e) => {
      reject(e)
    });
});

module.exports = {}
module.exports.BBC = BBC
module.exports.CNNBrasil = CNNBrasil
module.exports.Estadao = Estadao
module.exports.Exame = Exame
module.exports.G1 = G1
module.exports.JovemPan = JovemPan
module.exports.NoticiasAoMinuto = NoticiasAoMinuto
module.exports.Poder360 = Poder360
module.exports.Terra = Terra
module.exports.Uol = Uol
module.exports.VejaAbril = VejaAbril
module.exports.Vasco = Vasco
module.exports.AGazeta = AGazeta
module.exports.TodaNoticias = TodaNoticias