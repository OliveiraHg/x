const axios = require('axios');

exports.run = async function({ port, app }) {
	app.get('/api/grammar', async (req, res) => {
		const apiKey = 'R0COMI1E0DWEQ33H440UX2PITGQ68D9A';// api key
		const apiUrl = 'https://api.sapling.ai/api/v1/edits';
		const query = req.query.query;

		if (!query) {
			return res.status(400).json({ error: 'Query parameter is required' });
		}

		try {
			const response = await axios.post(apiUrl, {
				key: apiKey,
				session_id: 'test session',
				text: query,
			});

			const formattedResponse = {
				edits: response.data.edits.map(edit => ({
					end: edit.end,
					error_type: edit.error_type,
					general_error_type: edit.general_error_type,
					id: edit.id,
					replacement: edit.replacement,
					sentence: edit.sentence,
					sentence_start: edit.sentence_start,
					start: edit.start,
				})),
			};

			res.json(formattedResponse);
		} catch (error) {
			console.error('Error fetching data from the grammar checking API:', error.message);
			res.status(500).json({ error: 'Error fetching data from the grammar checking API' });
		}
	});
};
