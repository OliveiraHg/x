module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express, axios }) {
    const cors = require('cors');

    app.get('/api/blackbox', async (req, res) => {
      const q = req.query.query;

      if (!q) {
        return res.status(400).json({ error: 'Missing input' });
      }

      try {
        const url = 'https://useblackbox.io/chat-request-v4';
        const data = {
          textInput: q,
          allMessages: [{ user: q }],
          stream: '',
          clickedContinue: false,
        };

        const response = await axios.post(url, data);
        const answer = response.data.response[0][0];

        // Stringify the answer object
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
        res.status(500).json({ error: error.message });
      }
    });
  }
};
