module.exports = {
	run: async function ({port ,app ,OpenAI ,bodyParser,express,axios }) {



		app.get('/api/test', async (req, res) => {
				const Jimp = require('jimp');
					const x = req.query.x;
					const y = req.query.y;
			try {
				const image = await Jimp.read(__dirname + '/images/download.jpeg');
				const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);

				image.print(font, 50, 40, `sana pina\n\n
		billnoard  mo`);

				// Send the image as the response
				res.set('Content-Type', Jimp.MIME_JPEG);
				res.send(await image.getBufferAsync(Jimp.MIME_JPEG));

				console.log('Text added to the image and displayed in the browser');
			} catch (error) {
				console.error('Error adding text to the image:', error);
				res.status(500).json({ error: 'Error adding text to the image' });
			}
		});



	},
};
