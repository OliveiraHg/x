const request = require('request');

exports.run = async function ({ port, app, funapi }) {
  app.get('/api/figure', (req, res) => {
    const name = req.query.name;
    const apiKey = funapi;

    if (!name) {
      return res.status(400).json({ error: 'Name parameter is required' });
    }

    request.get({
      url: `https://api.api-ninjas.com/v1/historicalfigures?name=${name}`,
      headers: {
        'X-Api-Key': apiKey,
      },
    }, (error, response, body) => {
      if (error) {
        console.error('Request failed:', error);
        res.status(500).json({ error: 'Request failed' });
      } else if (response.statusCode !== 200) {
        console.error('Error:', response.statusCode, body.toString('utf8'));
        res.status(response.statusCode).json({ error: 'Error from API' });
      } else {
        const figureData = JSON.parse(body);
        res.json(figureData);
      }
    });
  });
};
