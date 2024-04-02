const axios = require('axios'); // Import Axios if not already imported

module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express, axios }) {

    app.get('/v1/completion/claude', async (req, res) => {
      try {
        // Get the 'content' query parameter from the request, defaulting to "Hi" if not provided
        const content = req.query.content || "Hi";

        const options = {
          method: 'POST',
          url: 'https://www.pinoygpt.com/wp-json/mwai-ui/v1/chats/submit',
          headers: {
            cookie: 'mwai_session_id=66016d8e2db09',
            'Content-Type': 'application/json',
            'User-Agent': 'insomnia/8.6.1',
            'X-Wp-Nonce': '49eddde4ec',
            Referer: 'https://www.pinoygpt.com/claude-ai/',
            'Sec-Ch-Ua': '"Brave";v="123", "Not:A-Brand";v="8", "Chromium";v="123"'
          },
          data: {
            botId: 'default',
            customId: '9974bf00df66bd9b9b96f28d983b80bf',
            session: '66016d0bd0887',
            chatId: 'xh2nlwyj0yd',
            contextId: 108,
            messages: [
              {
                id: '8vir1v7kpgs',
                role: 'assistant',
                content: 'Hi! How can I help you?',
                who: 'AI: ',
                timestamp: 1711369561900
              }
            ],
            newMessage: content,
            newFileId: null,
            stream: false
          }
        };

        const response = await axios.request(options);
        const data = response.data;
        const replyContent = data.reply; // Assuming 'reply' contains the response content

        res.status(200).json({ status: 200, content: replyContent });
      } catch (error) {
        console.error('Error:', error); // Log the error for debugging
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  },
};
