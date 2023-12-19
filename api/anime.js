const axios = require("axios");
const fs = require("fs").promises; // Use fs.promises for asynchronous file operations

exports.run = async function ({ app }) {
  app.get("/api/sfw/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const response = await axios.get(
        `https://api.waifu.pics/sfw/${category}`
      );
      const rndname = generateRandomName(7);

      if (response.data && response.data.url) {
        const imageUrl = response.data.url;
        const imageBuffer = await axios
          .get(imageUrl, { responseType: "arraybuffer" })
          .then((res) => res.data);

        const imagePath = __dirname + `/images/image.jpg`;
        await fs.writeFile(imagePath, Buffer.from(imageBuffer, "binary"));

        res.contentType("image/jpg").sendFile(imagePath);
      } else {
        res
          .status(500)
          .json({ error: "No SFW image URL found in the response" });
      }
    } catch (error) {
      console.error("Error fetching waifu image:", error.message);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the image" });
    }
  });
};

function generateRandomName(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomName = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomName += charset[randomIndex];
  }

  return randomName;
}
