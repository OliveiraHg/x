const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const axios = require('axios');
const { performance } = require('perf_hooks');

const BING_URL = "https://www.bing.com";

const createSession = (authCookie) => {
    const session = axios.create({
        headers: {
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6",
            "cache-control": "max-age=0",
            "content-type": "application/x-www-form-urlencoded",
            "Referrer-Policy": "origin-when-cross-origin",
            referrer: "https://www.bing.com/images/create/",
            origin: "https://www.bing.com",
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.54",
            cookie: `_U=${authCookie}`,
            "sec-ch-ua": `"Microsoft Edge";v="111", "Not(A:Brand";v="8", "Chromium";v="111"`,
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
        },
    });
    return session;
};

const getImages = async (session, prompt, onRedirect) => {
    console.log("Sending request...");
    const urlEncodedPrompt = querystring.escape(prompt);
    const url = `${BING_URL}/images/create?q=${urlEncodedPrompt}&rt=3&FORM=GENCRE`;
    console.log(url);
    const response = await session.post(url, {
        maxRedirects: 0,
        validateStatus: function (status) {
            return status >= 200 && status < 303;
        },
        timeout: 200000,
    });
    let redirectUrl;
    if (response.status == 200) {
        redirectUrl = response.request.res.responseUrl.replace("&nfy=1", "");
    }
    else if (response.status !== 302) {
        console.error(`ERROR: the status is ${response.status} instead of 302 or 200`);
        throw new Error("Redirect failed");
    }
    console.log("Redirected to", redirectUrl);
    const requestId = redirectUrl.split("id=")[1];
    if (onRedirect) {
        onRedirect(requestId, redirectUrl);
    }
    await session.get(redirectUrl);
    const pollingUrl = `${BING_URL}/images/create/async/results/${requestId}?q=${urlEncodedPrompt}`;
    console.log("Waiting for results...");
    const startWait = performance.now();
    let imagesResponse;
    while (true) {
        if (performance.now() - startWait > 300000) {
            throw new Error("Timeout error");
        }
        console.log(".", { end: "", flush: true });
        imagesResponse = await session.get(pollingUrl);
        if (imagesResponse.status !== 200) {
            throw new Error("Could not get results");
        }
        if (imagesResponse.data === "") {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            continue;
        }
        else {
            break;
        }
    }
    if (imagesResponse.data.errorMessage === "Pending") {
        throw new Error("This prompt has been blocked by Bing. Bing's system flagged this prompt because it may conflict with their content policy. More policy violations may lead to automatic suspension of your access.");
    }
    else if (imagesResponse.data.errorMessage) {
        throw new Error("Bing returned an error: " + imagesResponse.data.errorMessage);
    }
    const imageLinks = imagesResponse.data
        .match(/src="([^"]+)"/g)
        .map((src) => src.slice(5, -1));
    const normalImageLinks = Array.from(new Set(imageLinks.map((link) => link.split("?w=")[0])));
    const badImages = [
        "https://r.bing.com/rp/in-2zU3AJUdkgFe7ZKv19yPBHVs.png",
        "https://r.bing.com/rp/TX9QuO3WzcCJz1uaaSwQAz39Kb0.jpg",
    ];
    for (const im of normalImageLinks) {
        if (badImages.includes(im)) {
            throw new Error("Bad images");
        }
    }
    if (normalImageLinks.length === 0) {
        throw new Error("No images");
    }
    return normalImageLinks;
};

const saveImages = async (session, links, outputDir) => {
    console.log("\nDownloading images...");
    try {
        fs.mkdirSync(outputDir, { recursive: true });
    } catch (err) {
        if (err.code !== "EEXIST")
            throw err;
    }
    let imageNum = 0;
    for (const link of links) {
        try {
            const response = await session.get(link, { responseType: "stream" });
            const outputPath = path.join(outputDir, `${imageNum}.jpeg`);
            const writer = fs.createWriteStream(outputPath);
            response.data.pipe(writer);
            await new Promise((resolve, reject) => {
                writer.on("finish", resolve);
                writer.on("error", reject);
            });
            imageNum += 1;
        } catch (err) {
            if (err instanceof axios.AxiosError) {
                throw new Error("Inappropriate contents found in the generated images. Please try again or try another prompt.");
            } else {
                throw err.message;
            }
        }
    }
};

const generateImagesLinks = async (prompt, onRedirect, cookie) => {
    const session = createSession(cookie);
    const imageLinks = await getImages(session, prompt, onRedirect);
    return imageLinks;
};

const generateImageFiles = async (prompt, onRedirect, cookie) => {
    const session = createSession(cookie);
    const outputDir = `./temp/${prompt}`;
    const imageLinks = await getImages(session, prompt, onRedirect);
    await saveImages(session, imageLinks, outputDir);
    const imageFiles = fs.readdirSync(outputDir);
    const images = imageFiles.map((filename) => {
        const filePath = path.join(outputDir, filename);
        const fileData = fs.readFileSync(filePath);
        return {
            filename,
            data: fileData.toString("base64"),
        };
    });
    return images;
};


module.exports = {
  run: async function ({ port, app, OpenAI, bodyParser, express }) {
    try {
      app.get("/api/bing", async (req, res) => {
  try {
    const prompt = req.query.prompt;
    const cookie = req.query.cookie;

    if (!prompt) {
      return res.status(400).json({ error: 'Invalid request. Provide a prompt parameter.' });
    }

    if (!cookie) {
      return res.status(400).json({ error: 'Invalid request. Provide a cookie parameter.' });
    }

    const imageLinks = await generateImagesLinks(prompt, (requestId, redirectUrl) => {
      console.log(`Redirected to: ${redirectUrl} with requestId: ${requestId}`);
    }, cookie);

    /*const imageFiles = await generateImageFiles(prompt, (requestId, redirectUrl) => {
      console.log(`Redirected to: ${redirectUrl} with requestId: ${requestId}`);
    }, cookie);*/

    const img = imageLinks.slice(1, -1);
    res.json({ img });
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