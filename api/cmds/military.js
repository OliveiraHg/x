const axios = require("axios");
const fs = require("fs");

module.exports = {
	 config: {
			name: "military-vids",
			usePrefix: true,
			description: "Image To Text",
			permission: 0,
			credits: "OPERATOR ISOY",
			commandCategory: "group",
			usages: "",
			cooldowns: 5,
	 },
	 run: async function ({
			api,
			event
	 }) {
			try {


				 const imageResponse = await axios.get('https://random-vid.adonis-jrsjrs.repl.co//random-military-video', {
						responseType: "arraybuffer",
				 });

				 fs.writeFileSync('cache/random-military.mp4', Buffer.from(imageResponse.data, "binary"));

				 api.sendMessage({
						body: 'Random Military Video',
						attachment: fs.createReadStream('cache/random-military.mp4'),
				 }, event.threadID, event.messageID);


			} catch (error) {
				 console.log(error);
			}
	 },
};