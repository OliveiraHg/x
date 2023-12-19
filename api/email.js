const nodemailer = require("nodemailer");
const { google } = require("googleapis");

module.exports = {
	run: async function ({ port, app, OpenAI, bodyParser, express, axios }) {
		
		app.use(bodyParser.urlencoded({ extended: true }));
	
		app.use(bodyParser.json());

		app.post("/v1/email-send", async (req, res) => {
		
			const { receiver, text } = req.body;

		
			const CLIENT_ID =
				"519650423729-gce736m1ib2o0u9sfchqln1pt9tbld4b.apps.googleusercontent.com";
			const CLIENT_SECRET = "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";
			const REDIRECT_URI = "https://developers.google.com/oauthplayground";
			const REFRESH_TOKEN =
				"1//041H7iccobVjiCgYIARAAGAQSNwF-L9IrlsZ8DtWriQuc5RL9mSY-sjpppMeQUKsh8BQoUbW5ZnswI4uGjpyMPCeuZrN7kNtENm0";

			
			const oAuth2Client = new google.auth.OAuth2(
				CLIENT_ID,
				CLIENT_SECRET,
				REDIRECT_URI
			);
			oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

		
			async function sendMail() {
				try {
					const accessToken = await oAuth2Client.getAccessToken();

					const transport = nodemailer.createTransport({
						service: "gmail",
						auth: {
							type: "OAuth2",
							user: "easyapi0@gmail.com",
							clientId: CLIENT_ID,
							clientSecret: CLIENT_SECRET,
							refreshToken: REFRESH_TOKEN,
							accessToken: accessToken,
						},
					});

					const mailOptions = {
						from: "EASY API <easyapi0@gmail.com>",
						to: receiver,
						subject: "SEND using EASY API",
						text: text
						
					};

					const result = await transport.sendMail(mailOptions);
					return result;
				} catch (error) {
					return error;
				}
			}

			// Send email and respond with the result
			try {
				const result = await sendMail();
				console.log("Email sent...", result);
				res.status(200).json({ success: true, message: "Email sent successfully" });
			} catch (error) {
				console.error(error.message);
				res.status(500).json({ success: false, message: "Error sending email" });
			}
		});
	},
};
