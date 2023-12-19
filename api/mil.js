module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express, axios }) {
    const { PassThrough } = require("stream");

    app.get("/api/random-military-video", async (req, res) => {
      try {
        const response = await axios({
          method: "get",
          url: "https://cdn.easy0.repl.co/military.mp4",
          responseType: "stream",
        });

        const clientIP = req.ip;
        console.log("Client IP:", clientIP);

        res.setHeader("Content-Type", response.headers["content-type"]);
        res.setHeader("Cache-Control", "public, max-age=0"); // Adjust caching as needed

        const stream = new PassThrough();
        response.data.pipe(stream);
        stream.pipe(res);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  },
};
