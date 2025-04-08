import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

export const yupload = {
  async dl(url) {
    try {
        if (!fs.existsSync('./downloads')) {
            fs.mkdirSync('./downloads');
        }

        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://www.yourupload.com/'
            }
        });

        const $ = cheerio.load(data);
        const filename = $('h1').text().trim() || `file_${Date.now()}.mp4`;
        const cleanFilename = filename.replace(/[^\w.-]/g, '_');
        const filePath = `./downloads/${cleanFilename}`;
        
        const dlUrl = $('#download').attr('data-url') || $('#download').attr('href');
        const fullUrl = dlUrl.startsWith('http') ? dlUrl : `https://www.yourupload.com${dlUrl}`;

        const response = await axios({
            method: 'get',
            url: fullUrl,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': url
            }
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(filePath));
            writer.on('error', reject);
        });

    } catch (error) {
        return {
            status: false,
            error: error.message
        };
    }
  },

  async info(url) {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      const title = $('h1').text();
      const views = $('div.pull-right div').text().trim();
      const shareUrl = $('td code').eq(0).text().trim();
      const embedUrl = $('td code').eq(1).text().trim().replace('<iframe src="', '').replace('">', '');
      const type = $('td').filter((i, el) => $(el).text().includes('Type')).next().text().trim();
      const size = $('td').filter((i, el) => $(el).text().includes('Size')).next().text().trim();
      const uploaded = $('td').filter((i, el) => $(el).text().includes('Uploaded')).next().text().trim();
      const link = $('a.btn.btn-success').attr('href').trim();

      return {
        title,
        views,
        shareUrl,
        embedUrl,
        type,
        size,
        uploaded,
        dl: `https://www.yourupload.com${link}`
      };
    } catch (error) {
      console.error('Error scraping the page:', error);
      return error;
    }
  }
};

//export default yourupload;