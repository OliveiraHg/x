module.exports = {
	run: async function ({port ,app ,OpenAI ,bodyParser,express,axios }) {



app.get('/v1/globalgpt', async (req, res) => {
	try {
const query = req.query.q;
		var options = {
			method: 'POST',
			url: 'https://swiftmodel.azurewebsites.net/api/ChatTrigger',
			headers: {'Content-Type': 'application/json', 'User-Agent': 'insomnia/8.4.2'},
			data: {name: [{role: 'user', content:query}]}
		};

		axios.request(options).then(function (response) {
			console.log(response.data);
			const content = response.data.message.content;
			res.json({content});
		}).catch(function (error) {
			console.error(error);
		});
	} catch (error) {

		res.status(500).json({ error: 'example error' });
	}
});



	},
};
