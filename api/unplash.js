module.exports = {
	run: async function ({port ,app ,OpenAI ,bodyParser,express,axios }) {

		app.get('/v1/unsplash', async (req, res) => {
			try {
				const s = req.query.s;
				if (!s) {
					res.json({ error: "Invalid request: 's' parameter is blank" });
					return;
				}

				const options = {
					method: 'GET',
					url: 'https://unsplash.com/napi/search/photos',
					params: { per_page:500 , query: s },
					headers: {
						cookie: 'require_cookie_consent=false',
						'Content-Type': 'application/json',
						'User-Agent': 'insomnia/8.4.2',
					},
				};

				const response = await axios(options);
				const data = response.data.results.map(({ alt_description, urls }) => ({
					alt_description,
					urls: {
						raw: urls.raw,
						full: urls.full,
						regular: urls.regular,
					},
				}));

				res.json(data);
			} catch (error) {
				res.json({ error: error.message || 'An error occurred' });
			}
		});



	},
};
