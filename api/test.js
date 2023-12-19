module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express, axios }) {


    app.get("/api/a", async (req, res) => {
      try {
        axios
          .get("https://datasets-server.huggingface.co/rows", {
            params: {
              dataset: "wanng/midjourney-v5-202304-clean",
              config: "default",
              split: "train",
              offset: 0,
              length: 100,
            },
          })
          .then((response) => {
            console.log(response.data);
            res.json(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        res.status(500).json({ error: "example error" });
      }
    });
  },
};
