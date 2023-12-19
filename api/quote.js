const fs = require('fs');

module.exports = {
	run: async function ({ port, app, bodyParser, express }) {
		// Middleware for parsing JSON in request bodies
		app.use(bodyParser.json());

		// Define a function to read quotes from the JSON file
		function readQuotes() {
			try {
				const quotesData = fs.readFileSync(__dirname + '/quote.json');
				return JSON.parse(quotesData);
			} catch (error) {
				console.error('Error reading quotes from JSON file:', error);
				return [];
			}
		}

		// Define your route for getting a quote
		app.get('/api/quote', async (req, res) => {
			try {
				const quotes = readQuotes();

				if (quotes.length === 0) {
					res.status(404).json({ error: 'No quotes found' });
				} else {
					// Select a random quote from the loaded quotes
					const randomIndex = Math.floor(Math.random() * quotes.length);
					const randomQuote = quotes[randomIndex];
					res.json(randomQuote);
				}
			} catch (error) {
				console.error('Error fetching quote:', error);
				res.status(500).json({ error: 'Error fetching quote' });
			}
		});

		// Start the server
	
	},
};
