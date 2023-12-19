const axios = require("axios").default;
const { PassThrough } = require("stream");

module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express }) {
    app.get("/api/luosiallen", async (req, res) => {
      const query = req.query.q;
      if (!query) {
        return res.json({ error: "Invalid Request Blank 'q'" });
      }

      try {
        async function ID(prompt) {
          const options = {
            method: "POST",
            url: "https://replicate.com/api/predictions",
            headers: {
              // ... (headers configuration)
            },
            data: {
              version:
                "42fe626e41cc811eaf02c94b892774839268ce1994ea778eba97103fe1ef51b8",
              input: {
                width: 1024,
                height: 1024,
                prompt: prompt,
                scheduler: "K_EULER_ANCESTRAL",
                guidance_scale: 3,
                apply_watermark: false,
                negative_prompt: "",
                num_inference_steps: 50,
              },
              is_training: false,
              stream: false,
            },
          };

          try {
            const response = await axios.request(options);
            const id = response.data.id;
            await pollOutput(id, res);
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
                url: "https://replicate.com/api/predictions/" + id,
                headers: {},
              };

              const response = await axios.request(options);
              status = response.data.status;

              switch (status) {
                case "succeeded":
                  const image = response.data.output[0];
                  const imageOptions = {
                    method: "GET",
                    url: image,
                    responseType: "stream",
                  };
                  const imageResponse = await axios.request(imageOptions);

                  res.setHeader(
                    "Content-Type",
                    imageResponse.headers["content-type"],
                  );
                  res.setHeader("Cache-Control", "public, max-age=0"); // Adjust caching as needed

                  const stream = new PassThrough();
                  imageResponse.data.pipe(stream);
                  stream.pipe(res);
                  break;

                case "processing":
                  await new Promise((resolve) => setTimeout(resolve, 3000));
                  break;

                case "starting":
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
              // Handle errors if necessary
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
