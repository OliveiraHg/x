module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express, axios }) {
    app.get('/api/palm', async (req, res) => {
      try {
        const q = req.query.q;
        const apiKey = 'AIzaSyDXraI13BG2fn7UE5iPO2zOCmSHRvXNQKo' ;
				const apiUrl = 'https://generativelanguage.googleapis.com/v1beta3/models/text-bison-001:generateText';
if(!q){
  res.json({error:`Query parameter "q" is required.`});
}
        const requestData = {
          prompt: {
            text: q
          }
        };

        const headers = {
          'Content-Type': 'application/json'
        };

        const response = await axios.post(`${apiUrl}?key=${apiKey}`, requestData, { headers });

        const content = response.data.candidates[0].output;
        const safetyRatings = response.data.candidates[0].safetyRatings;
        res.locals.pageTitle = 'EASY API';

     
          const data = {'status':200,
                        "content":content,
                        };
        res.json(data);
      } catch (error) {
        res.status(500).json({ error:"Internal Server Error.." });
        console.log(error);
      }
    });
  },
};
