const axios = require("axios");
const path = require("path");
const fs = require("fs");
const express = require("express");
const { PassThrough } = require("stream");

exports.run = async function ({ port, app, funapi, axios }) {
  app.get("/api/qr", async (req, res) => {
    const name = req.query.data;
    const apiKey = funapi;

    if (!name) {
      return res.status(400).json({ error: "Name parameter is required" });
    }
    const rndname = generateRandomName(7);
    try {
      const apiUrl = `https://api.api-ninjas.com/v1/qrcode?format=png&data=${name}`;

      const response = await axios({
        method: "GET",
        url: apiUrl,
        headers: {
          "X-Api-Key": apiKey,
          Accept: "image/jpeg",
        },
        responseType: "stream",
      });

      if (response.status === 200) {
        const imageUrl = response.config.url;
        const imageName = path.basename(imageUrl);

        const imagePath = path.join(__dirname, "images", `${rndname}.jpg`);
				res.setHeader("Cache-Control", "public, max-age=0"); // Adjust caching as needed

				const stream = new PassThrough();
				response.data.pipe(stream);
				stream.pipe(res);
      } else {
        res.status(response.status).json(response.data);
      }
    } catch (error) {
      console.error("Request failed:", error);
      res.status(500).json({ error: "Request failed" });
    }
  });

  app.get("/api/qrread", async (req, res) => {
    const name = req.query.url;
    try {
      const { readQRCode } = require("qr-code-utils-1"); // Import only the readQRCode function

      readQRCode(name)
        .then((result) => {
          console.log("QR Code Data:", result);
          return res.json({ qrdata: result }); // Send the QR code data as a JSON response
        })
        .catch((error) => {
          console.error("Error:", error);
          res.status(500).json({ error: "QR code reading failed" }); // Send an error response
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" }); // Send an error response for any other errors
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
