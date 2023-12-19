module.exports = {
	run: async function ({port ,app ,OpenAI ,bodyParser,express,axios }) {



app.get('/api/gpt', async (req, res) => {
	try {
  let q = req.query.q;
		if(!q){
			res.json({error:'Invalid request blank "q"'});
			return false;
		}
		var options = {
			method: 'POST',
			url: 'https://chatgpt-api-proxy.weloobe.com/v1/chat/completions',
			headers: {'Content-Type': 'application/json', 'User-Agent': 'insomnia/8.4.5'},
			data: {
				messages: [
					{
						role: 'user',
						content: 'Generate a title in less than 6 words for the following message (language: en-US):\n"""\nUser: Hi\nAssistant: Hello! How can I assist you today?\n"""'
					}
				],
				model: 'gpt-4',
				max_tokens: 800,
				temperature: 0.75,
				presence_penalty: 0,
				top_p: 1,
				frequency_penalty: 0
			}
		};

		axios.request(options).then(function (response) {
			console.log(response.data);
		}).catch(function (error) {
			console.error(error);
		});
	} catch (error) {

		res.status(500).json({ error: 'example error' });
	}
});



	},
};
