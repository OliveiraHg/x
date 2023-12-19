exports.run = async function({ port, app, funapi, axios }) {
	app.get('/api/logo', async (req, res) => {
		const name = req.query.name;
		const apiKey = funapi;

		if (!name) {
			return res.status(400).json({ error: 'Name parameter is required' });
		}

		try {
			const response = await axios.get(`https://api.api-ninjas.com/v1/logo?name=${name}`, {
				headers: {
					'X-Api-Key': apiKey,
				},
			});

			if (response.status !== 200) {
				console.error('Error:', response.status, response.data.toString('utf8'));
				res.status(response.status).json({ error: 'Error from API' });
			} else {
				const responseData = response.data[0]; // get the 1st image on arry hahahahaha
				res.json(responseData);
			}
		} catch (error) {
			console.error('Request failed:', error);
			res.status(500).json({ error: 'Request failed' });
		}
	});
};
