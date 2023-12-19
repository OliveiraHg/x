const cheerio = require('cheerio');

module.exports = {
	run: async function ({ port, app, OpenAI, bodyParser, express, axios }) {

		app.get('/api/wallpaper', async (req, res) => {
			try {
				let q = req.query.s;
				if (!q) {
					res.json({ error: "Invalid Request blank 's'" });
					return; // Added return statement to exit the function if 'q' is blank
				}
				const url = `https://wallpapers.com/${q}`;

				axios.get(url)
					.then(response => {
						const $ = cheerio.load(response.data);

						const wallpaperList = $('ul.kw-contents li.content-card.horizontal');

						const imageUrls = wallpaperList.map((index, element) => {
							const imageUrl = $(element).find('picture img.promote').attr('data-src');
							return "https://wallpapers.com/" + imageUrl;
						}).get();

						const total = imageUrls.length;
						res.json({
							status: 200,
							total,
							data: imageUrls
						});
					})
					.catch(error => {
						console.error('Error fetching the page:', error);
						res.status(500).json({ error: 'Error fetching the page' }); // Added response for error
					});
			} catch (error) {
				console.error('Server error:', error);
				res.status(500).json({ error: 'Server error' });
			}
		});

	},
};
