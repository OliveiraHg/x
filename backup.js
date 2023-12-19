const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs').promises;
const crypto = require('crypto');
const axios = require('axios').default;
const colors = require('colors');
const logger = console.log;
app.use(express.json());
const cors = require('cors');

const funapi = process.env['isoyapikey'];
const chatgptapi = process.env.chatgptapikey;


const port = process.env.PORT || 80;
const allowedOrigins = ['https://blackboxai.bugfxd.repl.co', 'https://yt-search.bucky-26.repl.co', 'https://easy-api.bucky-26.repl.co', 'https://easyapi.bucky-26.repl.co'];

app.use(cors({
	origin: function(origin, callback) {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
}));
try{




const apiModules = [
	"pixel-v2",
	"pixel",
	"tiktokv2",
	"globalgp",
	"test",
	"palmai",
	"llama2",
	'sdxl-niji-se',
	"luosiallen",
	'qr',
	"lpost",
	"lget",
	'ytLyrics',
	'Zephyr',
	'webss',
	'tiktok',
	'imagesearch',
	'pnayflex',
	'sum',
	'random',
	'claudehxhx',
	'ytmusic',
	`Llama`,
	'blackai',
	'ytsearch',
	'anime',
	'chatgpt',
	'spamngl',
	'bard',
	'remini',
	'advice',
	'funfact',
	'historyfigure',
	'yt',
	'edit',
	'grammarly',
	'waifu',
	'hentai',
	'ai',
	'logoapi',
	'bard',
	"mil",
	'quote',
];

apiModules.forEach((moduleName) => {
	try {
		const modulePath = `${__dirname}/api/${moduleName}.js`;
		const apiModule = require(modulePath);
		app.use(`/${moduleName}`, (req, res, next) => {
			res.locals.Title = apiModule.pageTitle || 'EASY API';
			next();
		});
		
		console.log(`[ EASY API ]`.blue, ` = > `.red, `${moduleName} API initialized successfully`.green);
	} catch (error) {
		console.log(`[ EASY API ]`.red, `= >`.green, `Error occur while initializing ${moduleName} API`.green);
		console.error(`[ ERROR ] = >`.blue, `${error.message}`.red);
	}
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

const allRoutes= app._router.stack.filter((middleware) => middleware.route).map((middleware) => middleware.route.path);

console.log('All Endpoints:', + allRoutes);
app.listen(port, () => {
	app.get('', (req, res) => res.sendFile(__dirname + '/index.html'));

	app.use((req, res, next) => {

		res.status(404).sendFile(__dirname + '/404.html');

	});

	printTextArt('REST API');
	printTextArt('EASY API');
	printTextArt(`DEVELOP BY \n\n\nADONIS\n\n DEV`);
});
const figlet = require('figlet');

function printTextArt(message) {
	figlet(message, function(err, data) {
		if (err) {
			console.log('Error:', err);
			return;
		}
		console.log(data);
	});
}
const http = require('http');

function selfPing() {
	http.get('http://localhost:80', (res) => {
		if (res.statusCode === 200) {
			console.log('Self-ping successful');
		} else {
			console.log('Self-ping failed');
		}

		setTimeout(selfPing, 2 * 60 * 1000);
	}).on('error', (error) => {
		console.error('Self-ping failed:', error.message);

		setTimeout(selfPing, 2 * 60 * 1000);
	});
}

selfPing();
}catch(error){
	app.use((err, req, res, next) => {
			console.error(err.stack);

			// Render the custom error page
			res.status(500).sendFile(__dirname + '/error500.html');
	});

}