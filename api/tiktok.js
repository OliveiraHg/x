const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
	run: async function ({ express, app }) {
		app.get("/api/tiktok", async (req, res) => {
			const tiktok = req.query.url;

			try {

				var options = {
					method: 'POST',
					url: 'https://contentstudio.io/.netlify/functions/tiktokdownloaderapi',
					headers: {'Content-Type': 'application/json', 'User-Agent': 'insomnia/8.4.1'},
					data: {
						url:tiktok
					}
				};

				axios.request(options).then(function (response) {
					console.log(response.data);
					res.json(response.data)
				}).catch(function (error) {
					console.error(error);
				});
			} catch (error) {
				console.error("Error scraping LoveTik:", error);
				res.status(500).json({ error: "An error occurred while scraping LoveTik." });
			}
		});
	},
};
