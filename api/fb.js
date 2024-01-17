const axios = require("axios").default;

module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express }) {
    app.get("/api/fbdl", async (req, res) => {
      const query = req.query.q;
      if (!query) {
        return res.json({ error: "Invalid Request Blank 'q'" });
      }

      try {
        async function ID(url) {
          try {
          var options = {
  method: 'POST',
  url: 'https://app.publer.io/hooks/media',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  },
  data: {url:url}
};


            const response = await axios.request(options);
            console.log(response.data);
            await pollOutput(response.data.job_id, res);
          } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
          }
        }

        async function pollOutput(id, res) {
          let status;
          do {
            try {
             
var options = {
  method: 'GET',
  url: 'https://app.publer.io/api/v1/job_status/' + id ,
  headers: {'User-Agent': 'insomnia/8.5.1'}
};


              const response = await axios.request(options);
              status = response.data.status;

              switch (status) {
                case "complete":
                  var content = response.data.payload[0].path;
                  res.json({ url:content });
                  break;

                case "working":
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
