module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express, axios }) {

    app.get('/v1/gpt4', async (req, res) => {
      const { query } = req.body;
      var options = {
        method: 'POST',
        url: 'https://www.yuelink.cn/api/openai/v1/chat/completions',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'insomnia/8.6.1' },
        data: {
          messages: [
            {
              role: 'system',
              content: '\nYou are ChatGPT, a large language model trained by OpenAI.\nKnowledge cutoff: 2021-09\nCurrent model: gpt-4\nCurrent time: 2/20/2024, 12:21:23 AM\nLatex inline: $x^2$ \nLatex block: $$e=mc^2$$\n\n'
            },
            { role: 'user', content: query }
          ],
          stream: true,
          model: 'gpt-4',
          temperature: 0.5,
          presence_penalty: 0,
          frequency_penalty: 0,
          top_p: 1
        }
      };

      try {
        const response = await axios.request(options);
        const streamData = response.data;
        const cleanedData = [];

        streamData
          .split("\n")
          .filter((line) => line.startsWith("data: {"))
          .forEach((line) => {
            const jsonData = JSON.parse(line.substring(6));
            if (
              jsonData.choices &&
              jsonData.choices.length > 0 &&
              jsonData.choices[0].delta &&
              jsonData.choices[0].delta.content
            ) {
              cleanedData.push(jsonData.choices[0].delta.content);
            }
          });

        const joinedResponse = cleanedData.join("").trim();

        const gpt = {
          status: 200,
          model: "GPT-4",
          content: joinedResponse
        };

        console.log(gpt);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(gpt);
      } catch (error) {
        console.error(error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          res.status(error.response.status).json({ error: error.response.statusText });
        } else if (error.request) {
          // The request was made but no response was received
          res.status(500).json({ error: 'No response received from the server' });
        } else {
          // Something happened in setting up the request that triggered an Error
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }

    });

  },
};
