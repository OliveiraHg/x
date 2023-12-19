const path = require("path");
const fs = require("fs");
const express = require("express");

exports.run = async function ({ port, app, funapi, axios }) {
	app.use("/img", express.static(path.join(__dirname, "images")));
	app.use("/cmd/mirai", express.static(path.join(__dirname, "cmds")));
	app.use("/cmd/newt-ai", express.static(path.join(__dirname, "cmds")));
	app.use("/replicate", express.static(path.join(__dirname, "images")));

	app.get("/api/random/:cat", async (req, res) => {
		const name = req.params.cat;
		const apiKey = funapi;
		const rndname = generateRandomName(7);

		if (!name) {
			return res.status(400).json({ error: "Name parameter is required" });
		}

		try {
			const apiUrl = `https://api.api-ninjas.com/v1/randomimage?category=${name}`;

			const response = await axios({
				method: "GET",
				url: apiUrl,
				headers: {
					"X-Api-Key": apiKey,
					Accept: "image/jpeg",
				},
				responseType: "arraybuffer", // Set response type to arraybuffer for binary data
			});

			if (response.status === 200) {
				const imageName = `random_${rndname}.jpg`; // Unique name for each image
				const imagePath = path.join(__dirname, "images", imageName);

				fs.writeFileSync(imagePath, response.data); // Save the image

				// Send the image as response
				res.contentType("image/jpeg").send(response.data);
				fs.unlinkSync(imagePath);

			} else {
				res.status(response.status).json(response.data);
			}
		} catch (error) {
			console.error("Request failed:", error);
			res.status(500).json({ error: "Request failed" });
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
