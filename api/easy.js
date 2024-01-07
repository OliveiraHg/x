const axios = require("axios").default;

module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express }) {
    app.get("/v1/enhance", async (req, res) => {
      const query = req.query.q;
      if (!query) {
        return res.json({ error: "Invalid Request Blank 'q'" });
      }

      try {
        async function ID(prompt) {
          try {
        
var options = {
  method: 'POST',
  url: 'https://replicate.com/api/predictions',
  headers: {
    cookie: 'replicate_anonymous_id=50411aac-ab3e-4ffd-9608-d6489130f694',
    'Content-Type': 'application/json',
    'User-Agent': 'insomnia/8.5.1'
  },
  data: {
    input: {task: 'real_sr', image:query},
    is_training: false,
    stream: false,
    version: 'a01b0512004918ca55d02e554914a9eca63909fa83a29ff0f115c78a7045574f'
  }
};


            const response = await axios.request(options);
            console.log(response.data);
            await pollOutput(response.data.id, res);
          } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
          }
        }

        async function pollOutput(id, res) {
          let status;
          do {
            try {
              const options = {
                method: "GET",
                url: `https://replicate.com/api/predictions/${id}`,
                headers: {},
              };

              const response = await axios.request(options);
              status = response.data.status;

              switch (status) {
                case "succeeded":
                  var content = response.data.output;
                  res.json({ content });
                  break;

                case "processing":
                case "starting":
                  var content = response.data.status;
                  console.log(content);
                  await new Promise((resolve) => setTimeout(resolve, 3000));
                  break;

                default:
                  console.error("Unexpected status:", status);
                  return res
                    .status(500)
                    .json({ error: "Internal Server Error" });
              }
            } catch (error) {
              console.error(error);
              return res.status(500).json({ error: "Internal Server Error" });
            }
          } while (status !== "succeeded");
        }

        await ID(query);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  },
};
