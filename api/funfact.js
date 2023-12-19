const axios = require('axios');

exports.run = async function({ port, app }) {
	app.get('/api/funfact', async (req, res) => {
		const limit = 1;
		const apiKey = 'nO7Fp6VG5JN6KLwnl3awnA==yenC9hoFQPFrec05';

		try {
			const response = await axios.get(`https://api.api-ninjas.com/v1/facts?limit=${limit}`, {
				headers: {
					'X-Api-Key': apiKey,
				},
			});

			const fact = response.data[0];

			res.json(fact);
		} catch (error) {
			console.error('Error fetching fun facts:', error.message);
			res.status(500).json({ error: 'An error occurred while fetching fun facts' });
		}
	});
};
