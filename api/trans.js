const { Translate } = require('@google-cloud/translate').v2;
const axios = require('axios');

module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express }) {
    app.post('/v1/translate', async (req, res) => {
      const { text } = req.body;

      try {
        const options = {
          method: 'POST',
          url: 'https://api.edenai.run/v2/translation/automatic_translation',
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTgwNjY1OGEtNjUwYi00MTFhLThjYzctMWJmZTJmZmY4NzQzIiwidHlwZSI6ImFwaV90b2tlbiJ9.8RTWccZk9nP7lchCgvr6fv_zc8svoQQdQdJoWQoz_cY',
          },
          data: {
            providers: 'microsoft',
            text: text,
            target_language: 'en',
            fallback_providers: '',
          },
        };

        const response = await axios(options);
        const data = response.data.microsoft.text;
         
        console.log(response.data);

        // Add logic to handle the response or send it back to the client if needed
        res.status(200).json({
            status:200,
            success:true,
            model:"EASY AI TRANSLATE",
            text:data
        });
      } catch (error) {
        console.error(error);
        const stats = `
{
 "status":200,
 "message":${error.message},
 "success":false
}    
    
        `;
        res.status(500).json(status);
      }
    });
  },
};
