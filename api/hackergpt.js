module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express, axios }) {

    async function token() {
      const options = {
        method: "POST",
        url: "https://securetoken.googleapis.com/v1/token",
        params: { key: "AIzaSyCQ8QlvMtQvpnj_7sfEIE8-YorcFOGlHCo" },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "insomnia/8.5.1",
          Referer: "https://www.hackergpt.co/",
        },
        data: {
          grant_type: "refresh_token",
          refresh_token:
            "AMf-vByoxp1FeqmDXZnBFg2Y_qnwC6UzHRjhrrxWHlJ8Oty5YXl7kwIL5KaqOyJi6M_wP0cySDzgMgk6gvYOVH_veI5Adv_oNaPkxq4YJBANF6y0sSy7-7ll54E-GoIa3i-Q27IHtUxllRIoHluyugbJoeLDSgZ5QfAaFcvcDKRCAfFrPxXD-weIZTBPeE8NJOi0hwoJY4GnLS3vAqdRFbVZS_YGaCyihXA4kVBrIoazqChoWfW1HljCDFDGYtDtkrWqPNG1H-16uysNNvwU1gNPh4rKUzIUZdgDBPD32HTMxnu05KNQeqEOn4qujx2acTnYtMymWFItpjw5nJAAo7D4luKEzcX6sJDTXGgSeBCFHMo56CIrQT1OprSHzuI5GSwv2t4ib4-Y2K9ld-aXErprPMKGxbgdIUBowoYw7JCKBXDF2g3_KLhEEYtrv1u_CHOLK76tx2OB-sx692Qyg2Vca6KxDO_sPA",
        },
      };

      try {
        const response = await axios.request(options);
        const token = response.data.access_token;
        return token;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async function hackergpt(query, token) {
      const options = {
        method: 'POST',
        url: 'https://www.hackergpt.co/api/chat',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'insomnia/8.5.1',
          Authorization: 'Bearer ' + token,
        },
        data: {
          model: 'gpt-3.5-turbo-instruct',
          messages: [{ role: 'user', content: query }],
          toolId: 'enhancedsearch',
        },
      };

      try {
        const response = await axios.request(options);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    app.get('/v1/hackergpt', async (req, res) => {
      try {
          const q  = req.query.q ;
        const t = await token();
        if(!q){
            res.status(400).json({error:"Invalid Request q parameter required"});
            return false
        }
        const result = await hackergpt(q, t);
        res.json({content: result});
      } catch (error) {
        console.error("Failed to get token:", error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  },
};
