
module.exports = {
  run: async function ({port ,app ,OpenAI ,bodyParser,express ,axios}) {

		app.get('/api/advice', async (req, res) => {
  try {
    const response = await axios.get('https://api.adviceslip.com/advice');
    
    const advice = response.data.slip.advice;

    res.json({ advice });
  } catch (error) {
    console.error('Error fetching advice:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching advice' });
  }
});
  },
};
