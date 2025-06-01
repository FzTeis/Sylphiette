import axios from "axios";
import * as cheerio from "cheerio";
import { JSDOM } from 'jsdom';

async function getScript(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const { document } = new JSDOM(html).window;
    const scripts = document.querySelectorAll('script');
    return Array.from(scripts).map(script => script.innerHTML).join(' ');  
  } catch (error) {
    console.error('Error:', error);
  }
}
function get(texto) {
  const regex = /"PDrain",url:"(https:\/\/pixeldrain\.com\/u\/[^"?"]+)/g;
  let match;
  const linkss = {
    sub: null,
    dub: null
  };
  const index = texto.indexOf('downloads:{');
  if (index === -1) {
    return linkss;
  }
  const dltxt = texto.substring(index);
  while ((match = regex.exec(dltxt)) !== null) {
    const url = match[1];
    const beforeText = dltxt.substring(Math.max(0, match.index - 500), match.index).toUpperCase();

    if (beforeText.includes("SUB") && !linkss.sub) {
      let id = url.split('/u/')[1]
      linkss.sub = `https://pixeldrain.com/api/file/${id}`;
    } else if (beforeText.includes("DUB") && !linkss.dub) {
      let id = url.split('/u/')[1]
      linkss.dub =  `https://pixeldrain.com/api/file/${id}`;
    }
  }

  return linkss;
}

async function download(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    let title = $('title').text().trim();
    const match = title.match(/^(.+?Sub Español)/i);
    if (match) title = match[1];
    let sc = await getScript(url);
    const links = get(sc)
    const result = { title, dl: links };
    return result;
  } catch (err) {
    return { error: 'Failed to fetch or parse page', details: err.message };
  }
}

async function detail(url) {
const base = "https://animeav1.com";
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    const $ = cheerio.load(html);

    const title = $('h1').first().text().trim();
    const altTitle = $('h2').first().text().trim();
    const description = $('.entry p').text().trim();
    const rating = $('.ic-star-solid .text-2xl').first().text().trim();
    const votes = $('.ic-star-solid .text-xs span').first().text().trim();
    const cover = $('figure img[alt$="Poster"]').attr('src');
    const backdrop = $('figure img[alt$="Backdrop"]').attr('src');

    const genres = [];
    $('a.btn[href*="catalogo?genre="]').each((_, el) => {
      genres.push($(el).text().trim());
    });

    const episodes = [];
    $('article.group\\/item').each((_, el) => {
      const epNum = $(el).find('.text-lead').first().text().trim();
      const img = $(el).find('img').attr('src');
      const link = base + $(el).find('a').attr('href');
      episodes.push({ ep: epNum, img, link });
    });
let total = episodes.length;
    return {
      title,
      altTitle,
      description,
      rating,
      votes,
      cover,
      backdrop,
      genres,
      episodes,
      total
    };
  } catch (err) {
    return { error: err.message };
  }
}

async function search(query) {
let base = "https://animeav1.com"
  const res = await fetch(`https://animeav1.com/catalogo?search=${encodeURIComponent(query)}`, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const html = await res.text();
  const $ = cheerio.load(html);

  const results = [];

  $("article").each((i, el) => {
    const title = $(el).find("h3").text().trim();
    const link = base + $(el).find("a").attr("href");
    const img = $(el).find("img").attr("src");
    const desc = $(el).find("p").text().trim();

    results.push({ title, link, img });
  });

  return results;
}
export { download, detail, search }