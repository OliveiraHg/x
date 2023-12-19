module.exports = {
	run: async function ({ port, app, OpenAI, bodyParser, express, axios }) {
		app.get('/v1/pixel', async (req, res) => {
			
			try {
			
				const q = req.query.q;
				const api = req.query.api;
				if(!q){
					res.json({error: "Invalid Query required(p)"});
					return false;
				}
				if(api != "ISOYXD"){
				res.status(401).json({ error: "Unauthorized. Please provide valid credentials or authentication token." });
				return false
				}
				var options = {
					method: 'GET',
					url: 'https://pixabay.com/api/',
					params: {
						key: '40804177-ef6244a48502e07acf9633594',
						q,
						image_type: 'photo',
						pretty: 'true'
					},
					headers: {
						cookie: 'anonymous_user_id=None; csrftoken=f1FGQo4Nyo3XqXkPTYoMfaQ56g37u6LPqvL3F3XMrqfuwLNWuuwQgPYbrNT35ZaE'
					}
				};

				const response = await axios(options);
				if (response.data.hits.length > 0) {
					const results = response.data.hits.map(({ id, largeImageURL, tags, user }) => ({ id, tags, user, largeImageURL }));
					const count = results.length;
					res.json({
						status:"OK",
						total_results: count,
						result:results
					});
				} else {
					res.status(404).json({ error: 'No results found' });
				}
			} catch (error) {
				console.error(error);
				res.status(500).json({ error: 'Internal server error' });
			}
		});
	},
};
