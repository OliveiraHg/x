const axios = require("axios").default;

const REPLICATE_API_URL = "https://replicate.com/api/predictions";
const REPLICATE_ANONYMOUS_ID = "4103391c-c3de-4e2f-97a5-fe13fc3af815";

module.exports = {
  run: async ({ port, app, OpenAI, bodyParser, express }) => {
    app.get("/api/vicuna", async (req, res) => {
      const query = req.query.q;

      if (!query) {
        return res.json({ error: "Invalid Request Blank 'q'" });
      }

      try {
        const ID = async (prompt) => {
          try {
            const options = {
              method: "POST",
              url: REPLICATE_API_URL,
              headers: {
                cookie: `replicate_anonymous_id=${REPLICATE_ANONYMOUS_ID}`,
                "Content-Type": "application/json",
                "User-Agent": "insomnia/8.4.5",
              },
              data: {
                input: {
                  top_p: 0.9,
                  prompt: prompt,
                  temperature: 0.6,
                  max_new_tokens: 1024,
                  presence_penalty: 0,
                  frequency_penalty: 0,
                },
                is_training: false,
                create_model: '0',
                stream: false,
                model: 'mistralai/mixtral-8x7b-instruct-v0.1',
              },
            };

            const response = await axios.request(options);
            console.log(response.data);
            await pollOutput(response.data.id, res);
          } catch (error) {
            console.error(error);
            handleServerError(res);
          }
        };

        const pollOutput = async (id, res) => {
          let status;

          do {
            try {
              const options = {
                method: "GET",
                url: `${REPLICATE_API_URL}/${id}`,
                headers: {},
              };

              const response = await axios.request(options);
              status = response.data.status;

              switch (status) {
                case "succeeded":
                  const content = response.data.output;
                  res.json({ content: content.join("") });
                  break;

                case "processing":
                case "starting":
                  console.log(status);
                  await new Promise((resolve) => setTimeout(resolve, 3000));
                  break;

                default:
                  console.error("Unexpected status:", status);
                  handleServerError(res);
              }
            } catch (error) {
              console.error(error);
              handleServerError(res);
            }
          } while (status !== "succeeded");
        };

        await ID(query);
      } catch (error) {
        console.error(error);
        handleServerError(res);
      }
    });
  },
};

function handleServerError(res) {
  res.status(500).json({ error: "Internal Server Error" });
}
