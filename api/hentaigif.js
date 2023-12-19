const { PassThrough } = require("stream");
const cheerio = require("cheerio");

module.exports = {
	run: async function ({ port, app, OpenAI, bodyParser, express, axios }) {
		app.get("/v1/hentagif", async (req, res) => {
			try {
				const url = "https://www.sex.com/gifs/hentai/";

				const response = await axios.get(url);
				const $ = cheerio.load(response.data);

				const masonryBoxes = $(".masonry_box");
				const imageUrls = [];

				masonryBoxes.each((index, box) => {
					const imageUrl = $(box).find(".image_wrapper img").attr("data-src");
					imageUrls.push(imageUrl);
				});

				const randomImageUrl =
					imageUrls[Math.floor(Math.random() * imageUrls.length)];

				const options = {
					method: "GET",
					url: randomImageUrl,
					params: { width: "300" },
					headers: {
						"User-Agent": "insomnia/8.4.5",
						Referer: "https://www.sex.com/",
					},
					responseType: "stream",
				};

				const imageResponse = await axios.request(options);

				res.setHeader("Content-Type", imageResponse.headers["content-type"]);
				res.setHeader("Cache-Control", "public, max-age=0"); 

				const stream = new PassThrough();
				imageResponse.data.pipe(stream);
				stream.pipe(res);
			} catch (error) {
				console.error("Error:", error.message);
				res.status(500).json({ error: "Internal Server Error" });
			}
		});

		app.get("/v2/hentagif", async (req, res) => {
			try {
				const url = "https://xgroovy.com/gifs/categories/hentai/";

				const response = await axios.get(url);
				const $ = cheerio.load(response.data);

				const masonryBoxes = $(".item");
				const imageUrls = [];

				masonryBoxes.each((index, box) => {
					const imageUrl = $(box).find(".gif-wrap").attr("data-preview");
					imageUrls.push(imageUrl);
				});

				// Select a random image URL from the array
				const randomImageUrl =
					imageUrls[Math.floor(Math.random() * imageUrls.length)];

				const options = {
					method: "GET",
					url: randomImageUrl,
					params: { width: "300" },
					headers: {
						"User-Agent": "insomnia/8.4.5",
						Referer: "https://www.sex.com/",
					},
					responseType: "stream",
				};

				const imageResponse = await axios.request(options);

				res.setHeader("Content-Type", imageResponse.headers["content-type"]);
				res.setHeader("Cache-Control", "public, max-age=0"); // Adjust caching as needed

				const stream = new PassThrough();
				imageResponse.data.pipe(stream);
				stream.pipe(res);
			} catch (error) {
				console.error("Error:", error.message);
				res.status(500).json({ error: "Internal Server Error" });
			}
		});
	},
};
