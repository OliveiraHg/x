const fs = require('fs');

module.exports = {
	run: async function ({ port, app, OpenAI, bodyParser, express, axios }) {

		app.get('/api/imggen', async (req, res) => {
			try {
				const q = req.query.q;
				var options = {
					method: 'POST',
					url: 'https://api.hotpot.ai/art-maker-sdte-zmjbcrr',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'User-Agent': 'insomnia/8.4.5',
						Authorization: 'yMHw4UidZM1Hha82AZtMjI50bYCfC3sdX7vvB'
					},
					data: {
						seedValue: 'null',
							inputText: q,
							width: '512',
							height: '512',
							styleId: '178',
							styleLabel: 'Concept Art 7',
							isPrivate: 'false',
							price: '0',
							requestId: '8-hdbv0848lh5zior',
							resultUrl: 'https://hotpotmedia.s3.us-east-2.amazonaws.com/8-hdbv0848lh5zior.png'
					}
				};

				const response = await axios.request(options);
				const imageUrl = response.data;
					const img = (await axios.get(imageUrl,{ responseType: 'arraybuffer' }
						)).data;
				// Ensure the directory exists
				const directory = 'api/images/';
				if (!fs.existsSync(directory)){
						fs.mkdirSync(directory, { recursive: true });
				}

				fs.writeFileSync(__dirname + `/images/out-0.png`, Buffer.from(img, 'binary'));


				const  imgg = __dirname + "/images/out-0.png";
				res.sendFile(imgg);

			} catch (error) {
				console.error(error);
				res.status(500).json({ success: false, error: 'Internal server error' });
			}
		});

	},
};
