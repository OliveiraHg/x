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

        var options = {
          method: "GET",
          url: "https://ai.easy-api.repl.co/api/" + ai,
          params: { query: q },
          headers: { "User-Agent": "insomnia/8.4.5" },
        };

        axios
          .request(options)
          .then(function (response) {
            res.json(response.data);
          })
          .catch(function (error) {
            console.error(error);
          });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  },
};
