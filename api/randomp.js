const cheerio = require("cheerio");
module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express, axios }) {
    async function gt(search) {
      const url = `https://hentaihaven.xxx/?s=New&post_type=wp-manga`;
      const res = await axios.get(url);
      const $ = cheerio.load(res.data);

      const data = [];

      $(
        ".container > div.archive-content clearfix-after > div.video-list-content > div"
      ).each((i, e) => {
        const tu = $(e).find("img");
        const ur = $(e).find("a");

        tu.each((rel, val) => {
          const al = $(val).attr("alt");
          const sr = "https:" + $(val).attr("src");
          if (ur[rel]) {
            const oi = $(ur[rel]).attr("href");
            data.push({ title: al, img: sr, link: oi });
          }
        });
      });

      return data;
    }

    async function rt(link) {
      const response = await axios.get(link);
      const $ = cheerio.load(response.data);
      const embedURL = $('meta[itemprop="embedURL"]').attr("content");
      return embedURL;
    }

    async function ul(search) {
      const data = await gt(search);

      const au = await Promise.all(
        data.map(async (item) => {
          const embedURL = await rt(item.link);
          return { ...item, embedURL };
        })
      );

      return au;
    }

    app.get("/v2/pnayflex", async (req, res) => {
      const search = req.query.s;

      try {
        const kl = await ul(search);
        const fk = JSON.stringify(kl, null, 2);
        res.status(200).set("Content-Type", "application/json").send(fk);
      } catch (error) {
				console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  },
};
