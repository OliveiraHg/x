const axios = require("axios");
const fs = require('fs');
const path = require('path');

module.exports.config = {
	name: "email",
	version: "1.0.0",
	hasPermssion: 1, //1 admin default note: you make it 0 
	credits: "ADONIS DEV (ISOY DEV)",
	description: "",
	usePrefix: false,
	commandCategory: "Email",
	cooldowns: 5,
};

module.exports.run = async function({ api, event, args, commandModules, prefix }) {
	if (args.length < 2) {
		api.sendMessage("Usage: -email <receiver_email> <email_text>", event.threadID, event.messageID);
		return;
	}

	const receiverEmail = args[0];
	const emailText = args.slice(1).join(" ");

	try {
		const response = await axios.post('https://api.easy0.repl.co/v1/email-send', {
			receiver: receiverEmail,
			text: emailText,
		});

		console.log('Email sent:', response.data);
		api.sendMessage('Email sent successfully!', event.threadID, event.messageID);
	} catch (error) {
		console.error('Error sending email:', error.message);
		api.sendMessage('Error sending email. Please try again later.', event.threadID, event.messageID);
	}
};