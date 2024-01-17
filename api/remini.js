module.exports = {
	run: async function({ port, app, OpenAI, bodyParser, express, crypto, fs, axios }) {




		const API_KEY = "oiKOpDmsQCfJ82eMmJWvD-7yeFsBObexTuEdzygp9CttMdnO";
		const CONTENT_TYPE = "image/jpeg";
		const OUTPUT_CONTENT_TYPE = "image/jpeg";

		const BASE_URL = "https://developer.remini.ai/api";




		async function processImageByUrl(imgUrl) {
			const response = await axios.get(imgUrl, { responseType: "arraybuffer" });
			const content = Buffer.from(response.data, "binary");
			const md5Hash = crypto.createHash("md5").update(content).digest("base64");
			return { md5Hash, content };
		}

		app.get("/api/remini", async (req, res) => {
			try {
				const imgUrl = req.query.imgurl;

				if (!imgUrl) {
					return res.status(400).json({ error: "Missing 'imgurl' query parameter" });
				}

				const { md5Hash, content } = await processImageByUrl(imgUrl);
				const client = axios.create({
					baseURL: BASE_URL,
					headers: { Authorization: `Bearer ${API_KEY}` },
				});

				console.log("Submitting image ...");
				const submitTaskResponse = await client.post("/tasks", {
					tools: [
						{ type: "face_enhance", mode: "beautify" },
						{ type: "background_enhance", mode: "base" },
					],
					image_md5: md5Hash,
					image_content_type: CONTENT_TYPE,
					output_content_type: OUTPUT_CONTENT_TYPE,
				});

				const taskID = submitTaskResponse.data.task_id;
				const uploadURL = submitTaskResponse.data.upload_url;
				const uploadHeaders = submitTaskResponse.data.upload_headers;

				console.log("Uploading image to Google Cloud Storage ...");
				await axios.put(uploadURL, content, { headers: uploadHeaders });

				console.log(`Processing task: ${taskID} ...`);
				await client.post(`/tasks/${taskID}/process`);

				console.log(`Polling result for task: ${taskID} ...`);
				for (let i = 0; i < 50; i++) {
					const getTaskResponse = await client.get(`/tasks/${taskID}`);

					if (getTaskResponse.data.status === "completed") {
						console.log("Processing completed.");
						console.log("Output url: " + getTaskResponse.data.result.output_url);
						return res.status(200).json({
							message: "Processing completed",
							outputUrl: getTaskResponse.data.result.output_url,
						});
					} else {
						if (getTaskResponse.data.status !== "processing") {
							console.error("Found illegal status: " + getTaskResponse.data.status);
							return res.status(500).json({
								error: "Illegal status: " + getTaskResponse.data.status,
							});
						}
						console.log("Processing, sleeping 2 seconds ...");
						await new Promise((resolve) => setTimeout(resolve, 2000));
					}
				}

				console.error("Timeout reached! :( ");
				return res.status(500).json({ error: "Timeout reached" });
			} catch (error) {
				console.error(error);
				return res.status(500).json({ error: "An error occurred" });
			}
		});



	},
};
