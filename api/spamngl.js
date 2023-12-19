const bodyParser = require('body-parser');
const axios = require('axios');

exports.run = async function({ port, app, OpenAI, express }) {
	app.use(bodyParser.json()); // Parse JSON request bodies

	app.all('/api/proxy', async (req, res) => {
		const apiUrl = req.body.apiUrl || req.query.apiUrl; // Check both request body and query parameters
		const method = req.method;
		const data = req.body.data || req.query.data; // Check both request body and query parameters

		try {
			const axiosConfig = {
				method: method,
				url: apiUrl,
				headers: {
					'Content-Type': 'application/json',
				},
				data: data,
			};

			const axiosResponse = await axios(axiosConfig);
			const responseData = axiosResponse.data;

			res.json(responseData);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Internal server error' });
		}
	});
};
