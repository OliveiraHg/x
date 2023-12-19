module.exports = {
	run: async function ({port ,app ,OpenAI ,bodyParser,express,axios }) {



app.get('/api/llamav2', async (req, res) => {
	try {
		const q = req.query.q;
	/*	var options = {
			method: 'GET',
			url: 'https://post.easy0.repl.co/api/post',
			params: {p: q},
			headers: {'User-Agent': 'insomnia/8.4.2'}
		};

		axios.request(options).then(function (response) {
		const id = response.data.id;
			var optionss = {
				method: 'GET',
				url: 'https://get.easy0.repl.co/api/result',
				params: {id: id},
				headers: {'User-Agent': 'insomnia/8.4.2'}
			};

			axios.request(optionss).then(function (responsse) {
				console.log(responsse.data);
				const content = responsse.data.content;
				res.json({content});
			}).catch(function (error) {
				console.error(error);
			});

		
		}).catch(function (error) {
			console.error(error);
		});
*/
	res.json({content: "Llama 7b temporary on Maintenance "});
		


	} catch (error) {
console.log(error);
		res.status(500).json({ error: 'example error' });
	}
});



	},
};
