const axios = require("axios");
const fs = require('fs');

module.exports = {
	config: {
		name: "llama",
		credits: "1SOY DEV",
		usePrefix: true,
		description: "Use Llama AI",
		usage: `-llama question|query`,
		permission: 0, // Set the required permission level (0 for normal users, 1 for admin)
		// Other configuration properties
	},
	run: async function ({ api, event, args, commandModules, prefix }) {
		const text = args.join(" ");

		try {
			if (!text) {
				return api.sendMessage(
					"Please Provide A Query",
					event.threadID,
					event.messageID
				);
			}

			let headers = {
				message: text,
			};

			if (event.type === "message_reply") {
				const attachment = event.messageReply.attachments[0];
				const filename = attachment.filename;

				const imageResponse = await axios.get(attachment.url, {
					responseType: "arraybuffer",
				});

				// Write the image data to a file
				fs.writeFileSync(`cache/${filename}.jpg`, Buffer.from(imageResponse.data, "binary"));
				if (attachment && attachment.type === "photo") {
					headers = {
						message: text,
					 image:attachment.url
				}
			}

			api.sendMessage(
				"Generating... Response! Please wait...",
				event.threadID,
				event.messageID
			);

			const response = await axios.get(
				`https://api.easy0.repl.co/api/Llama/completion`,
				{ headers }
			);

			const respond = response.data.response;
			api.sendMessage(respond, event.threadID);
			console.log(respond)
			}
		} catch (error) {
			console.error("An error occurred:", error);
			api.sendMessage("Oops! Something went wrong.", event.threadID, event.messageID);
		}
	},
};
