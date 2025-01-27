const axios = require("axios").default;
const cheerio = require("cheerio");

module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express }) {
    try {
      app.get("/api/fbdl", async (req, res) => {
        try {
          const link = req.query.url;
          if (!link) {
            return res.status(400).json({ error: "URL is required" });
          }

          let config = { 'url': link };
          axios('https://www.getfvid.com/downloader', {
            method: 'POST',
            data: new URLSearchParams(Object.entries(config)),
            headers: {
              "content-type": "application/x-www-form-urlencoded",
              "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
              "cookie": "_ga=GA1.2.1310699039.1624884412; _pbjs_userid_consent_data=3524755945110770; cto_bidid=rQH5Tl9NNm5IWFZsem00SVVuZGpEd21sWnp0WmhUeTZpRXdkWlRUOSUyQkYlMkJQQnJRSHVPZ3Fhb1R2UUFiTWJuVGlhVkN1TGM2anhDT1M1Qk0ydHlBb21LJTJGNkdCOWtZalRtZFlxJTJGa3FVTG1TaHlzdDRvJTNE; cto_bundle=g1Ka319NaThuSmh6UklyWm5vV2pkb3NYaUZMeWlHVUtDbVBmeldhNm5qVGVwWnJzSUElMkJXVDdORmU5VElvV2pXUTJhQ3owVWI5enE1WjJ4ZHR5NDZqd1hCZnVHVGZmOEd0eURzcSUyQkNDcHZsR0xJcTZaRFZEMDkzUk1xSmhYMlY0TTdUY0hpZm9NTk5GYXVxWjBJZTR0dE9rQmZ3JTNEJTNE; _gid=GA1.2.908874955.1625126838; __gads=ID=5be9d413ff899546-22e04a9e18ca0046:T=1625126836:RT=1625126836:S=ALNI_Ma0axY94aSdwMIg95hxZVZ-JGNT2w; cookieconsent_status=dismiss"
            }
          })
            .then(async ({ data }) => {
              const $ = cheerio.load(data)
              const video_sd = $('body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(1) > a').attr('href');
              const video_hd = $('body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(1) > a').attr('href');
              const audio = $('body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(2) > a').attr('href');

              if (!video_sd || !video_hd || !audio) {
                return res.status(404).json({ error: "Video or audio not found" });
              }

              res.json({ video_sd, video_hd, audio });
            })
            .catch(error => {
              console.error("Axios error:", error);
              res.status(500).json({ error: "Internal server error" });
            });
        } catch (error) {
          console.error("Request error:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      });
    } catch (error) {
      console.error("Express error:", error);
    }
  },
};