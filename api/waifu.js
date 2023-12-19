const AnimeImagesAPI = require('anime-images-api');

exports.run = async function ({ port, app }) {
  app.get('/api/sfw/hug', async (req, res) => {
    try {
      const API = new AnimeImagesAPI();

      const { image } = await API.nsfw.hentai();
      res.redirect(image);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while fetching the image' });
    }
  });
	app.get('/movie/:random', async (req, res) => {
		try {
			const type = req.query.t;
			const query = req.query.q;
			const random = req.param.random;
 if(type =='s'){
	 var url = `https://ww2.123moviesfree.net/season/${query}`;

 }else{
		var url = `https://ww2.123moviesfree.net/movie/${query}`;

 }
			res.redirect(url);
		} catch (error) {
			console.error('Error:', error);
			res.status(500).json({ error: 'An error occurred while fetching the image' });
		}
});
	app.get('/123', async (req,res) => {
	const link = req.query.link;
	const url =`https://adonisapi.easyapi0.repl.co/movie?url=${link}`;
	res.redirect(url);
	
});
};
