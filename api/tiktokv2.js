module.exports = {
	run: async function ({ port, app, OpenAI, bodyParser, express, axios }) {

		app.get('/v2/tiktok', async (req, res) => {
			try {
				const url = req.query.url;
				var options = {
					method: 'GET',
					url: 'https://dl1.tikmate.cc/listFormats',
					params: {
						url: url,
						sender_device: 'pc',
						web_id: '7262417412413867522'
					},
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'User-Agent': 'insomnia/8.4.2'
					},
					data: { 'url:': '', 'update:': '1' }
				};

				axios.request(options).then(function (response) {
					const data = response.data;
					const videoFormats = data.formats.video;

					// Sort video formats based on quality
					videoFormats.sort((a, b) => {
						const qualityA = parseInt(a.quality.replace(/\D/g, ''), 10);
						const qualityB = parseInt(b.quality.replace(/\D/g, ''), 10);
						return qualityB - qualityA;
					});

					// Select the highest quality video format
					const highestQualityVideo = videoFormats[0];

					// Extract title, creator, and quality
					const title = data.formats.title;
					const creator = data.formats.creator;
					const videoQuality = highestQualityVideo.quality;

					// Return the relevant information in the response
					res.json({
						status: "ok",
						title: title,
						creator: creator,
						videoQuality: videoQuality,
						videoUrl: highestQualityVideo.url
					});

				}).catch(function (error) {
					console.error(error);
					res.status(500).json({ error: 'Error fetching video formats' });
				});
			} catch (error) {
				console.error(error);
				res.status(500).json({ error: 'Example error' });
			}
		});
	},
};
