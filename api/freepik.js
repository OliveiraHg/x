const cheerio = require("cheerio");

module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express, axios }) {
    app.get("/v1/freepik", async (req, res) => {
      let s = req.query.s;
      if (!s) {
        return res.status(400).json({ status: 400, message: "s query empty" });
      }

      const url =
        "https://www.freepik.com/search?format=search&query="+ s;

      try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const figureElements = $("figure.showcase__item");

        const imageDataArray = [];

        figureElements.each((index, element) => {
          const figure = $(element);
          const imageData = {
            title: figure.data("title"),
            imageUrl: figure.data("image"),
            likes: figure.data("likes"),
            downloads: figure.data("downloads"),
            author: {
              name: figure.find(".name").text(),
              avatarUrl: figure.find(".avatar-img").attr("src"),
            },
          };

					 const data = figure.data("image");

          imageDataArray.push(data);
        });

        const beautifiedResponse = JSON.stringify(
          { status: 200, data:imageDataArray },
          null,
          2
        );

        res.status(200).json(JSON.parse(beautifiedResponse));
      } catch (error) {
        console.error("Error fetching the page:", error.message);
        res.status(500).json({ status: 500, message: "Internal server error" });
      }
    });
  },
};
