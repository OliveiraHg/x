const axios = require("axios");
const fs = require("fs");
const { Leopard } = require("@picovoice/leopard-node");

module.exports = {
	config: {
		name: "bard",
		credits: "1SOY DEV",
		prefix: true,
		description: "use google bard ai",
		usage: `bard <question here> \n\nNote: To Send Image to bard ai just reply to the image you want to send`,
		permission: 0,
	},
	run: async function ({ api, event, args }) {
		const userId = event.senderID;
		let question = encodeURIComponent(args.join(" "));
		try {
			if (!question) {
				api.sendMessage(
					"Please Provide A question or query",
					event.threadID,
					event.messageID
				);
				return;
			}

			api.sendMessage(
				"Generating Response, Please Wait!!!! ",
				event.threadID,
				event.messageID
			);

			let res;

			if (event.type === "message_reply") {
				const replyMessage = event.body;
				const originalMessage = event.messageReply.body;

				if (
					event.messageReply.attachments &&
					event.messageReply.attachments.length > 0
				) {
					for (const attachment of event.messageReply.attachments) {
						if (attachment.type === "photo") {
							const att = encodeURIComponent(attachment.url);
							const filename = attachment.filename;
							var options = {
								method:"Get",
								url:"https://api-bard.easy0.repl.co/api/bard",
								params:{messege: question,
												url: att,
												userID:userId,
												api:"ISOYXD"
											 }
							};
						
						} else if (attachment.type === "audio") {
							const audio = attachment.url;
							const filename = attachment.filename;
							const aud = await axios.get(audio, {
								responseType: "arraybuffer",
							});

							fs.writeFileSync(
								`cache/${filename}`,
								Buffer.from(aud.data, "binary")
							);
							const handle = new Leopard(
								"0iFpdxmhvJKzPZ7M/gmGqXpLYm9WyHIZ4xVNUQAZvLKuN4YC/IeAiQ=="
							);
							const result = handle.processFile(`cache/${filename}`);
							const t = question + result.transcript;
							var options = {
								method:"Get",
								url:"https://api-bard.easy0.repl.co/api/bard",
								params:{messege: t,
												userID:userId,
												api:"ISOYXD"
											 }
							};

							
						}
					}
				}
			} else {
				var options = {
					method:"Get",
					url:"https://api-bard.easy0.repl.co/api/bard",
					params:{messege: question,
									url: att,
									userID:userId,
									api:"ISOYXD"
								 }
				};
			}


  axios.request(options).then(function (res){
		
	
			
			const respond = res.data.content;
			const imageUrls = res.data.images;

			if (Array.isArray(imageUrls) && imageUrls.length > 0) {
				const attachments = [];

				for (let i = 0; i < imageUrls.length; i++) {
					const url = imageUrls[i];
					const imagePath = `cache/image${i + 1}.png`;

					try {
						const imageResponse = await axios.get(url, {
							responseType: "arraybuffer",
						});
						fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));
						attachments.push(fs.createReadStream(imagePath));
					} catch (error) {
						api.sendMessage(
							"Error While Saving Image",
							event.threadID,
							event.messageID
						);
					}
				}

				api.sendMessage(
					{
						body: `${respond}`,
						attachment: attachments,
					},
					event.threadID,
					event.messageID
				);
			} else {
				api.sendMessage(respond, event.threadID, event.messageID);
			}
		}).catch(function (error){
		api.sendMessage(
			"An error occurred while processing your request",
			event.threadID,
			event.messageID
		);
		console.error(error);
		});
		} catch (error) {
			api.sendMessage(
				"An error occurred while processing your request",
				event.threadID,
				event.messageID
			);
			console.error(error);
		}
	},
};
