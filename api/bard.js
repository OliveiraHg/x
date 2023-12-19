module.exports = {
	run: async function ({ port, app, OpenAI, bodyParser, express, axios }) {
		const { bardAI, bardAsk } = require('isoy_bard');

		app.get('/api/bard', async (req, res) => {
			var cookies = `bwhJFMOf7mYQ75IAr5zih3JPpoTOH5c4zt8SWkzM3RRbLMWn4FAcYaFs11QkMwKm7dUSeA.`;

			try {
				await new bardAI(cookies).login();

				const response = await bardAsk(req.query.query);
				const content = response.replace(/\\"response\\":/g, 'response:');
          const text = content.data.response.replace(/(\[|\])/g, '');
				const image = content.data.image.replace(/(\[|\])/g, '')
				res.json(JSON.parse(content));
			} catch (error) {
				res.status(500).json({ error: error.message });
			}
		});
	},
};
