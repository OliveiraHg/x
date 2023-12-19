const axios = require("axios");
const { PassThrough } = require("stream");

exports.run = async function ({ port, app }) {
  app.get("/api/nsfw/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const response = await axios.get(
        `https://api.waifu.pics/nsfw/${category}`,
      );
      const imageUrl = response.data.url;

      const options = {
        method: "GET",
        url: imageUrl,
        responseType: "stream",
      };
      const imageResponse = await axios.request(options);

      res.setHeader("Content-Type", imageResponse.headers["content-type"]);
      res.setHeader("Cache-Control", "public, max-age=0"); // Adjust caching as needed

      const stream = new PassThrough();
      imageResponse.data.pipe(stream);
      stream.pipe(res);
    } catch (error) {
      console.error("Error fetching waifu image:", error.message);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the image" });
    }
  });
};
