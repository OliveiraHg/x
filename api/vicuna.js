const axios = require("axios").default;

module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express }) {
    app.get("/api/vicuna", async (req, res) => {
      const query = req.query.q;
      if (!query) {
        return res.json({ error: "Invalid Request Blank 'q'" });
      }

      try {
        async function ID(prompt) {
          try {
            const options = {
              method: "POST",
              url: "https://replicate.com/api/predictions",
              headers: {},
              data: {
                input: {
                  seed: -1,
                  debug: false,
                  top_p: 1,
                  prompt: prompt,
                  max_length: 500,
                  temperature: 0.75,
                  repetition_penalty: 1,
                },
                is_training: false,
                stream: true,
                version:
                  "6282abe6a492de4145d7bb601023762212f9ddbbe78278bd6771c8b3b2f2a13b",
              },
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
                  content = content.join("");
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
