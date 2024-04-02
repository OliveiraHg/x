module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express, axios }) {
    app.get("/ai/:ai", async (req, res) => {
      try {
        const ai = req.params.ai;
        const q = req.query.q;
        if (!q) {
          return res
            .stutus(400)
            .json({ error: "Bad request blank 'q' params" });
        } else if (!ai) {
          return res
            .stutus(400)
            .json({ error: "Bad request blank 'ai' params" });
        } else if (!q && !ai) {
          return res
            .stutus(400)
            .json({ error: "Bad request blank 'ap' & 'q' params" });
        }

      const options = {
        method: 'POST',
        url: 'https://ai.ea-sy.tech/v1/chat/completion',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Your-User-Agent', // Add a proper User-Agent header
        },
        data: {
          message: q,
          model: ai,
          apikey: 'zie-ai-v1-cde4fc58-0fae-47d2-9b6a-c0374c980067',
        },
      };

        axios
          .request(options)
          .then(function (response) {
            res.json(response.data);
            console.log(response.data)
          })
          .catch(function (error) {
            console.error(error);
          });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
        console.error(error)
      }
    });
  },
};
