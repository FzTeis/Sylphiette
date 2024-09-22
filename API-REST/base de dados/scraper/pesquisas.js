//=============> ======== <==============\\

const {
  axios,
  cheerio,
  encodeUrl,
  fs,
  linkfy,
  qs,
  randomIntFromInterval,
  removerAcentos,
  useragent_1,
  default_criador
} = require('./defaults.js');

//=============> Amazon <==============\\

const AmazonSearch = (q) => new Promise((resolve, reject) => {
  axios.get(`https://www.amazon.com.br/s?k=${removerAcentos(q)}&ref=nb_sb_noss`, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const dados = [];
      const $ = cheerio.load(res.data)
      $('div[data-component-type="s-search-result"]').each((i, e) => {
        dados.push({
          titulo: $(e).find('span[class="a-size-small a-color-base a-text-normal"]').text(),
          valor: $(e).find('span[class="a-offscreen"]:first').text(),
          imagem: $(e).find('img.s-image').attr('srcset') ? (linkfy.find($(e).find('img.s-image').attr('srcset'))?.pop()?.href || $(e).find('img.s-image').attr('src')) : $(e).find('img.s-image').attr('src'),
          link: 'https://www.amazon.com.br' + $(e).find('a:first').attr('href')
        });
      });
      resolve({
        status: res.status,
        criador: default_criador,
        resultado: dados
      });
    })
    .catch((e) => {
      reject(e)
    });
});

//=============> Play Store <==============\\

const PlayStoreSearch = (q) => new Promise((resolve, reject) => {
  axios.get(`https://play.google.com/store/search?q=${removerAcentos(q)}&c=apps`, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('.VfPpkd-aGsRMb').each((i, e) => {
        dados.push({
          nome: $(e).find('.DdYX5:first').text().trim(),
          imagem: (($(e).find('img:first').attr('srcset') ? (linkfy.find($(e).find('img:first').attr('srcset'))?.pop()?.href || $(e).find('img:first').attr('src')) : $(e).find('img:first').attr('srcset')) || $(e).find('img:last').attr('srcset') ? (linkfy.find($(e).find('img:last').attr('srcset'))?.pop()?.href || $(e).find('img:last').attr('src')) : $(e).find('img:last').attr('srcset')).trim(),
          desenvolvedor: $(e).find('.wMUdtb:first').text().trim(),
          estrelas: $(e).find('.w2kbF:first').text().trim(),
          link: 'https://play.google.com' + $(e).find('a:first').attr('href')
        });
      });
      resolve({
        status: res.status,
        criador: default_criador,
        resultado: dados
      });
    })
    .catch((e) => {
      reject(e)
    });
});


//=============> Mercado Livre <==============\\

const MercadoLivreSearch = (q) => new Promise((resolve, reject) => {
  axios.get(`https://lista.mercadolivre.com.br/${removerAcentos(q)}`, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('div[class="andes-card andes-card--flat andes-card--default andes-card--padding-default"]').each((i, e) => {
        const json = {
          produto: $(e).find('h2:first').text()?.trim(),
          imagem: $(e).find('img:first').attr('data-src') || $(e).find('img:first').attr('src'),
          valor: $(e).find('div[class="ui-row-price ui-row-price--size-medium"] > div > span > .price-tag-amount').text()?.replace('R$', 'R$ ')?.trim(),
          link: $(e).find('a:first').attr('href')
        }
        if (json.valor && json.imagem && json.link && json.produto) dados.push(json);
      });
      resolve({
        status: res.status,
        criador: default_criador,
        resultado: dados
      });
    })
    .catch((e) => {
      reject(e)
    });
});

//=============> Xvideos <==============\\

const XvideosSearch = (q) => new Promise((resolve, reject) => {
  axios.get(`https://www.xvideos.com/?k=${removerAcentos(q).replaceAll(' ', '+')}`, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('div[class="thumb-block  "]').each((i, e) => {
        dados.push({
          titulo: $(e).find('.thumb-under > p > a').attr('title'),
          duracao: $(e).find('.thumb-under > p > a > span').text(),
          imagem: $(e).find('img').attr('data-src'),
          link: 'https://www.xvideos.com' + $(e).find('.thumb-under > p > a').attr('href')
        });
      });
      resolve({
        status: res.status,
        criador: default_criador,
        resultado: dados
      });
    })
    .catch((e) => {
      reject(e)
    });
});

//=============> Samba Porno <==============\\

const SambaPornoSearch = (q) => new Promise((resolve, reject) => {
  axios.get(`https://www.sambaporno.com/search/${removerAcentos(q)}`, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('div[class="card-container sub "]').each((i, e) => {
        dados.push({
          nome: $(e).find('.title:first').text().trim(),
          imagem: $(e).find('img:first').attr('src').trim(),
          likes: $(e).find('span[class="badge rating-procent text-success"]').text().trim(),
          duracao: $(e).find('span[class="duration badge bg-dark"]').text(),
          link: 'https://www.sambaporno.com' + $(e).find('a:first').attr('href')
        });
      });
      resolve({
        status: res.status,
        criador: default_criador,
        resultado: dados
      });
    })
    .catch((e) => {
      reject(e)
    });
});

//=============> Hentai Tube <==============\\

const HentaisTubeSearch = (q) => new Promise((resolve, reject) => {
  axios.get(`https://www.hentaistube.com/buscar/?s=${removerAcentos(q)}`, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data)
      const dados = []
      $('.epiItem').each((i, e) => {
        dados.push({
          nome: $(e).find('a').attr('title'),
          imagem: $(e).find('img').attr('src'),
          link: $(e).find('a').attr('href')
        });
      });
      resolve({
        status: res.status,
        criador: default_criador,
        resultado: dados
      });
    })
    .catch((e) => {
      reject(e)
    });
});

//=============> Loja do Mecânico <==============\\

const LojaDoMecanicoSearch = (q) => new Promise((resolve, reject) => {
  axios.get(`https://busca.lojadomecanico.com.br/busca?q=${removerAcentos(q)}`, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const dados = [];
      const $ = cheerio.load(res.data);
      $(`li[class="nm-product-item col-xs-6 col-sm-3 product-box"]`).each((i, e) => {
        dados.push({
          nome: $(e).attr('data-name'),
          preco: "R$ " + $(e).attr('data-price'),
          marca: $(e).attr('data-brand'),
          categoria: $(e).attr('data-category'),
          imagem: "https:" + $(e).find('div > div > a > img').attr('src'),
          link: "https:" + $(e).find('div > div > a').attr('href'),
        });
      });
      resolve({
        status: res.status,
        criador: default_criador,
        resultado: dados
      });
    })
    .catch((e) => {
      reject(e)
    });
});

//=============> Loja Americanas <==============\\

const AmericanasSearch = (nome) => new Promise((resolve, reject) => {
console.log(nome); axios.get(`https://www.americanas.com.br/busca/${removerAcentos(nome)}`, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('div[class="col__StyledCol-sc-1snw5v3-0 fSocOq src__Card-sc-1c6bco3-2 geHCaf"]').each((i, e) => {
        dados.push({
          produto: $(e).find('h3:first').text(),
          imagem: $(e).find('div > picture > source').attr('srcset') || $(e).find('img:first').attr('src'),
          valor: $(e).find('span[class="src__Text-sc-154pg0p-0 price__PromotionalPrice-sc-1tree3h-1 kPoyca"]').text() || $(e).find('span[class="src__Text-sc-154pg0p-0 price__Price-sc-1tree3h-0 jVOqbP"]').text(),
          link: 'https://www.americanas.com.br' + $(e).find('a:first').attr('href')
        });
      });
      resolve({
        status: res.status,
        criador: default_criador,
        ajuda: `@Tobi`,
        resultado: dados
      });
    })
    .catch((e) => {
      reject(e)
    });
});

//=============> Submarino <==============\\

const SubmarinoSearch = (q) => new Promise((resolve, reject) => {
  axios.get(`https://www.submarino.com.br/busca/${removerAcentos(q)}`, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('div[class="col__StyledCol-sc-1snw5v3-0 fSocOq src__Card-sc-1aktmdp-2 clCGoY"]').each((i, e) => {
        dados.push({
          produto: $(e).find('h3:first').text(),
          imagem: $(e).find('div > picture > source').attr('srcset') || $(e).find('img:first').attr('src'),
          valor: $(e).find('span[class="src__Text-sc-154pg0p-0 price__PromotionalPrice-sc-dkjci0-1 bYpEZF"]').text() || $(e).find('span[class="src__Text-sc-154pg0p-0 price__Price-sc-dkjci0-0 evgOfk"]').text(),
          link: 'https://www.submarino.com.br' + $(e).find('a:first').attr('href')
        });
      });
      resolve({
        status: res.status,
        criador: default_criador,
        resultado: dados
      });
    })
    .catch((e) => {
      reject(e)
    });
});

//========== Horoscopo ===========\\

const Horoscopo = (signo) => new Promise((resolve, reject) => {
  axios.get(`https://www.somostodosum.com.br/horoscopo/signo/${removerAcentos(signo)}.html`, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const dados = []
                    dados.push({ 
               previsao: $('body > div > div > div.container > div.col-lg-9 > article > article').text().split(/Dica de oráculo para hoje/gi)[0]?.trim()
                      });
      resolve({
        status: res.status,
        criador: default_criador,
        infoDoSigno: signo,
        resultado: dados
      });
    })
    .catch((e) => {
      reject(e)
    });
});

//========== Dicionário ===========\\

const Dicionario = (q) => new Promise((resolve, reject) => {
  axios.get(`https://www.dicio.com.br/${q}/`, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('#content > div.col-xs-12.col-sm-7.col-md-8.p0.mb20 > div.card.card-main.mb10 > p > span').map((i, e) => dados.push($(e).text().trim() + '\n'))
      resolve({
        status: res.status,
        criador: default_criador,
        imagem: $('#content > div.col-xs-12.col-sm-7.col-md-8.p0.mb20 > div.card.card-main.mb10 > picture > img').attr('src'),
        significado: dados.join('\n').trim()
      });
    })
    .catch((e) => {
      reject(e)
    });
});

module.exports = {}
module.exports.PlayStoreSearch = PlayStoreSearch
module.exports.AmazonSearch = AmazonSearch
module.exports.MercadoLivreSearch = MercadoLivreSearch
module.exports.XvideosSearch = XvideosSearch
module.exports.SambaPornoSearch = SambaPornoSearch
module.exports.HentaisTubeSearch = HentaisTubeSearch
module.exports.LojaDoMecanicoSearch = LojaDoMecanicoSearch
module.exports.AmericanasSearch = AmericanasSearch
module.exports.SubmarinoSearch = SubmarinoSearch
module.exports.Horoscopo = Horoscopo
module.exports.Dicionario = Dicionario