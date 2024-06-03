const axios = require('axios');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

module.exports = {
    run: async function ({ port, app }) {
        app.use(bodyParser.json());

        app.get('/api/mid', async (req, res) => {
            try {
                const prompt = req.query.prompt ? req.query.prompt.trim() : ''; // Trim any leading or trailing spaces

                if (!prompt) {
                    return res.status(400).json({ error: 'Prompt is required' });
                }

                const options = {
                    method: 'POST',
                    url: 'https://midjourney-imaginecraft-generative-ai-api.p.rapidapi.com/midjourney/imagine',
                    headers: {
                        'content-type': 'application/json',
                        'X-RapidAPI-Key': '61f48eaf67mshc5c1270172d3b46p16a839jsn755ce72559a4',
                        'X-RapidAPI-Host': 'midjourney-imaginecraft-generative-ai-api.p.rapidapi.com'
                    },
                    data: {
                        Prompt: prompt
                    }
                };

                const response = await axios(options);

                console.log('API Response:', response.data); // Log the entire response for debugging

                if (response.data && response.data.images) {
                    const images = response.data.images;
                    const savedImages = [];

                    for (let i = 0; i < images.length; i++) {
                        const imageUrl = images[i];
                        const imagePath = path.join(__dirname, 'api/images', '7sQr7In.jpg');

                        const writer = fs.createWriteStream(imagePath);
                        const imageResponse = await axios({
                            url: imageUrl,
                            method: 'GET',
                            responseType: 'stream'
                        });

                        imageResponse.data.pipe(writer);

                        await new Promise((resolve, reject) => {
                            writer.on('finish', resolve);
                            writer.on('error', reject);
                        });

                        savedImages.push(imagePath);
                    }

                    res.json({
                        status: "OK",
                        images: savedImages
                    });
                } else {
                    res.status(404).json({ error: 'No images found' });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        	},
};
