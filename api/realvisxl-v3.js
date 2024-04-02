const axios = require("axios").default;

module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express }) {
    app.get("/v1/image/realvisxl-v3", async (req, res) => {
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
    cookie: 'replicate_anonymous_id=e3005f9e-1e79-468c-98e7-d91688ff3360',
    'Content-Type': 'application/json',
    'User-Agent': 'insomnia/8.6.0'
  },
  data: {
    input: {
      width: 768,
      height: 768,
      prompt: prompt,
      refine: 'no_refiner',
      scheduler: 'K_EULER',
      lora_scale: 0.6,
      num_outputs: 1,
      guidance_scale: 7.5,
      apply_watermark: false,
      high_noise_frac: 0.8,
      negative_prompt: 'worst quality, low quality, illustration, 3d, 2d, painting, cartoons, sketch',
      prompt_strength: 0.8,
      num_inference_steps: 25
    },
    is_training: false,
    create_model: '0',
    stream: false,
    version: '33279060bbbb8858700eb2146350a98d96ef334fcf817f37eb05915e1534aa1c'
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
