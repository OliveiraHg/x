const cheerio = require('cheerio');

module.exports = {
	run: async function ({ port, app, OpenAI, bodyParser, express, axios }) {

		app.get('/v2/wallpaper', async (req, res) => {
			try {
				const args = req.query.s;
				const s = Array.isArray(args) ? args.join("+") : args;
				const url = `https://www.wallpaperflare.com/search?wallpaper=${s}`;

				const response = await axios.get(url);
				const $ = cheerio.load(response.data);

				const gallery = $('ul.gallery li[itemprop="associatedMedia"]');

				const imageDetails = gallery.map((index, element) => {
					const imageUrl = $(element).find('img').attr('data-src');
					const resolution = $(element).find('.res').text();
					const description = $(element).find('meta[itemprop="description"]').attr('content');

					return imageUrl;
				}).get();

				const total = imageDetails.length;
				console.log('Total images:', total);
				console.log('Image details:', imageDetails);

				res.json({
					status: 200,
					total,
					data: imageDetails,
				});

			} catch (error) {
				console.error('Error:', error);
				res.status(500).json({ error: 'Internal Server Error' });
			}
		});
	},
};
