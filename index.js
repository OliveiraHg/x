const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs").promises;
const crypto = require("crypto");
const axios = require("axios").default;
const colors = require("colors");
const logger = console.log;
const cors = require("cors");
const path = require("path");
const requestIp = require("request-ip");
const apis = require(__dirname + '/api.json');
let token  = apis.ninja;
app.use(express.json());
app.use(cors());
app.use(requestIp.mw({ attributeName: "clientIp" }));

const funapi = "xnil";
const chatgptapi = "xnil";

const port = process.env.PORT || 4000;
app.use((req, res, next) => {
  const forwardedFor = req.headers['x-forwarded-for'];

  if (forwardedFor) {
    next();
  } else {
    // Block direct IP access
    res.status(403).json({ error: 'Forbidden - Direct IP access is not allowed' });
  }
});
const apiModules = [
    "claude",
    "gpt-4",
    "realvisxl-v3",
    "fbdl",
    "lyrics",
    'bgr',
    "fb",
    "easy",
  "trans",
  "mid",
  "gpt",
  "vicuna",
  "hentaigif",
  "freepik",
  "zedge",
  "wallpaper",
  "wallpaperv2",
  "email",
  "test1",
  "randomp",
  "hotpot",
  "poli",
  "hackergpt",
  "unplash",
  "pixel-v2",
  "pixel",
  "tiktokv2",
  "globalgp",
  "test",
  "palmai",
  "llama2",
  "sdxl-niji-se",
  "luosiallen",
  "qr",
  "lpost",
  "lget",
  "ytLyrics",
  "Zephyr",
  "webss",
  "tiktok",
  "imagesearch",
  "pnayflex",
  "sum",
  "random",
  "claudehxhx",
  "ytmusic",
  `Llama`,
  "blackai",
  "ytsearch",
  "anime",
  "chatgpt",
  "spamngl",
  "bard",
  "remini",
  "advice",
  "funfact",
  "historyfigure",
  "yt",
  "edit",
  "grammarly",
  "waifu",
  "hentai",
  "ai",
  "logoapi",
  "bard",
  "mil",
  "quote",
  "bing",
  "easyai",
];

apiModules.forEach((moduleName) => {
  try {
    const modulePath = `${__dirname}/api/${moduleName}.js`;
    const apiModule = require(modulePath);
    app.use(`/${moduleName}`, (req, res, next) => {
      res.locals.Title = apiModule.pageTitle || "EASY API";
      next();
    });
    apiModule.run({
      port,
      app,
      bodyParser,
      express,
      chatgptapi,
      crypto,
      fs,
      axios,
      funapi,
    });
    console.log(
      `[ XNIL API ]`.blue,
      ` = > `.red,
      `${moduleName} API initialized successfully`.green,
    );
  } catch (error) {
    console.log(
      `[ XNIL ]`.red,
      `= >`.green,
      `Error occur while initializing ${moduleName} API`.green,
    );
    console.error(`[ ERROR ] = >`.blue, `${error.message}`.red);
  }
});

const allRoutes = app._router.stack
  .filter((middleware) => middleware.route)
  .map((middleware) => middleware.route.path);

const jsonString = JSON.stringify(allRoutes, null, 2);

console.log("All Endpoints:", allRoutes);

app.listen(port, () => {
  app.use("/", express.static(path.join(__dirname, "page")));

  app.use((req, res, next) => {
    res.status(home).sendFile(__dirname + "/home.html");
  })
app.listen(port, () => {
  app.use("/docs", express.static(path.join(__dirname, "page")));

  app.use((req, res, next) => {
    res.status(404).sendFile(__dirname + "/404.html");
  });

  printTextArt("REST API");
  printTextArt("XNIL API");
  printTextArt(`DEVELOPED BY \n\n\nXNIL\n\n DEV`);
});

const figlet = require("figlet");

function printTextArt(message) {
  figlet(message, function (err, data) {
    if (err) {
      console.log("Error:", err);
      return;
    }
    console.log(data);
  });
}

const http = require("http");

function selfPing() {
  http
    .get(`http://localhost:${port}`, (res) => {
      if (res.statusCode === 200) {
      } else {
        console.log("Self-ping failed");
      }

      setTimeout(selfPing, 2 * 60 * 1000);
    })
    .on("error", (error) => {
      console.error("Self-ping failed:", error.message);
      setTimeout(selfPing, 2 * 60 * 1000);
    });
}

selfPing();
