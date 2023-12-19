module.exports = {
	run: async function ({ port, app, OpenAI, bodyParser, express, axios }) {
		app.get('/api/result', async (req, res) => {
			try {
				const id1 = req.query.id;
				var options = {
					method: 'GET',
					url: `https://replicate.com/api/predictions/${id1}`,
					headers: {
						cookie: 'replicate_anonymous_id=60886355-62a1-4601-b477-d23b1a3c4727',
						'User-Agent': 'insomnia/8.4.1'
					}
				};

				const response = await axios.request(options);
				const result = response.data.output[0];

				res.json({result});
			} catch (error) {
				console.error(error);
				res.status(500).json({ error: 'example error' });
			}
		});
	},
};
