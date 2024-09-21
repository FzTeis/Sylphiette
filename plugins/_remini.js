import chalk from 'chalk'
import { watchFile, unwatchFile } from 'fs'
import { fileURLToPath } from 'url'
import fs from 'fs'
import axios from 'axios'
import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import qs from 'qs'
import got from 'got'
import { fileTypeFromBuffer } from 'file-type'
import FormData from "form-data"
import { Blob } from "formdata-node"
import Jimp from 'jimp'

export async function remini(urlPath, method) {
	return new Promise(async (resolve, reject) => {
		let Methods = ["enhance", "recolor", "dehaze"];
		Methods.includes(method) ? (method = method) : (method = Methods[0]);
		let buffer,
			Form = new FormData(),
			scheme = "https" + "://" + "inferenceengine" + ".vyro" + ".ai/" + method;
		    Form.append("model_version", 1, { "Content-Transfer-Encoding": "binary",
			contentType: "multipart/form-data; charset=uttf-8",
		});
		Form.append("image", Buffer.from(urlPath), {
			filename: "enhance_image_body.jpg",
			contentType: "image/jpeg",
		});
		Form.submit({
				url: scheme,
				host: "inferenceengine" + ".vyro" + ".ai",
				path: "/" + method,
				protocol: "https:",
				headers: {
					"User-Agent": "okhttp/4.9.3",
					Connection: "Keep-Alive",
					"Accept-Encoding": "gzip",
				},
			},
			function (err, res) {
				if (err) reject();
				let data = [];
				res.on("data", function (chunk, resp) {
				  data.push(chunk);
				}).on("end", () => {
				  resolve(Buffer.concat(data));
				});
				res.on("error", (e) => {
					reject();
				});
			}
		);
	});
}