module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express, axios }) {
    const cors = require('cors');

    app.get('/api/blackbox', async (req, res) => {
      const q = req.query.query;

      if (!q) {
        return res.status(400).json({ error: 'Missing input' });
      }

      try {
        var options = {
          method: 'POST',
          url: 'https://www.blackbox.ai/api/chat',
          headers: {
            cookie: 'sessionId=073f7075-6b49-4330-8f72-5f295bdd8036',
            'Content-Type': 'application/json',
            'User-Agent': 'insomnia/8.6.1'
          },
          data: {
            messages: [{id: 'OKDTXlG', content: q, role: 'user'}],
            id: 'OKDTXlG',
            previewToken: null,
            userId: '4fcbeb66-45a6-4f01-9172-a8fc44786e57',
            codeModelMode: true,
            agentMode: {},
            trendingAgentMode: {},
            isMicMode: false,
            isChromeExt: false,
            githubToken: null
          }
        };

        const response = await axios.request(options);
        const data = response.data;
        const answer = data;
        const answerString = JSON.stringify(answer, null, 2);

        const jsonResponse = `{
          "status": 200,
          "model": "Blackbox AI",
          "developer": "ADONIS JR S:EASY TECH API",
          "response": ${answerString}  
        }`;

        res.setHeader('Content-Type', 'application/json');
        res.send(jsonResponse);
      } catch (error) {
        console.error('Error querying Blackbox AI:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  }
};
