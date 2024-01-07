const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express, axios }) {

    app.get('/v1/removebg', async (req, res) => {
      try {
        const { image } = req.query;
        if (!image) {
          res.status(400).json({
            status: 400,
            message: "Invalid request blank image body",
            success: false
          });
          return false;
        }

        // Use __dirname + '/images/input.jpg' instead of a relative path
        const inputPath = path.join(__dirname, 'images', 'input.jpg');

        // Fetch image data using axios
        const img = (await axios.get(
          image,
          { responseType: 'arraybuffer' }
        )).data;

        // Write the image data to the specified input path
        fs.writeFileSync(inputPath, Buffer.from(img, 'binary'));

        // Create a FormData instance and append the image file
        const formData = new FormData();
        formData.append("size", "auto");
        formData.append(
          "image_file",
          fs.createReadStream(inputPath),
          path.basename(inputPath),
        );

        // Use path.join for consistent path joining
        const outputPath = path.join(__dirname, 'images', 'removebg.png');

        // Make the remove.bg API request
        axios({
          method: "post",
          url: "https://api.remove.bg/v1.0/removebg",
          data: formData,
          responseType: "arraybuffer",
          headers: {
            ...formData.getHeaders(),
            "X-Api-Key": "sRp4jkkmBdsWRaEy3BSXuXTQ",
          },
          encoding: null,
        })
          .then((response) => {
            if (response.status !== 200) {
              return console.error("Error:", response.status, response.statusText);
            }
            fs.writeFileSync(outputPath, response.data);

            // Use res.sendFile to send the image directly
            res.sendFile(outputPath);
          })
          .catch((error) => {
            return console.error("Request failed:", error);
          });

      } catch (error) {
        res.status(500).json({ error: 'example error' });
      }
    });
  },
};
