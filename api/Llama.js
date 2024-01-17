
module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express,axios }) {


app.get('/api/llama', async (req, res) => {
  try {
    const prompt = req.query.p;
    let image = req.query.img || null;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt parameter is required.' });
    }
    if (image == null) {
      image = null
    }
    var options = {
  method: 'POST',
  url: 'https://www.llama2.ai/api',
  data: {
    prompt:`<s>[INST] <<SYS>>\n${prompt}\n<</SYS>>\n\nhi [/INST]\n`,
    model:"meta/llama-2-70b-chat",
    systemPrompt: '<s>[INST] <<SYS>>\nYou are a helpful assistant.\n<</SYS>>\n\nhi [/INST]\n',
    temperature: 0.75,
    topP: 0.9,
    maxTokens: 800,
    image,
    audio: null
  }
};

    axios.request(options).then(function (response) {
      const data = response.data;
      res.json({content:data});
    }).catch(function (error) {
      console.error(error);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

    
  },
};
