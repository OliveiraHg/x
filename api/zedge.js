module.exports = {
	run: async function ({ port, app, OpenAI, bodyParser, express, axios }) {
		app.get('/api/zedge', async (req, res) => {
			try {
				const q = req.query.s;

				if (!q) {
					return res.status(400).json({ error: "Invalid request, 's' parameter is missing" });
				}

				const searchOptions = {
					method: 'POST',
					url: 'https://api-gateway.zedge.net/',
					headers: { 'Content-Type': 'application/json', 'User-Agent': 'insomnia/8.4.5' },
					data: {
						query: `
							query search($input: SearchAsUgcInput!) {
								searchAsUgc(input: $input) {
									...browseContentItemsResource
								}
							}

							fragment browseContentItemsResource on BrowseContentItems {
								page
								total
								items {
									... on BrowseWallpaper {
										id
										contentType
										title
										tags
										imageUrl
										placeholderUrl
										licensed
									}

									... on BrowseRingtone {
										id
										contentType
										title
										tags
										imageUrl
										placeholderUrl
										licensed
										meta {
											durationMs
											previewUrl
											gradientStart
											gradientEnd
										}
									}
								}
							}
						`,
						variables: { input: { contentType: 'WALLPAPER', keyword: q, size: 1000 } },
						operationName: 'search'
					}
				};

				const searchResponse = await axios.request(searchOptions);
				const items = searchResponse.data?.data?.searchAsUgc?.items || [];

				// Filter out licensed items
				const unlicensedItems = items.filter(item => !item.licensed);

				// Check if there are unlicensed items before responding
				if (unlicensedItems.length === 0) {
					return res.status(200).json({ status: 200, total: 0, data: [] });
				}

				// Use Promise.all to fetch content download URLs concurrently
				const downloadPromises = unlicensedItems.map(async (item) => {
					const downloadOptions = {
						method: 'POST',
						url: 'https://api-gateway.zedge.net/',
						headers: { 'Content-Type': 'application/json', 'User-Agent': 'insomnia/8.4.5' },
						data: {
							query: `
								query contentDownloadUrl($itemId: ID!) {
									contentDownloadUrlAsUgc(itemId: $itemId)
								}
							`,
							variables: { itemId: item.id },
							operationName: 'contentDownloadUrl'
						}
					};

					try {
						const downloadResponse = await axios.request(downloadOptions);
						const contentDownloadUrl = downloadResponse.data?.data?.contentDownloadUrlAsUgc;

						if (contentDownloadUrl) {
							return { id: item.id, contentDownloadUrl };
						} else {
							return { id: item.id, contentDownloadUrl: null, error: "Content download URL not available" };
						}
					} catch (downloadError) {
						console.error(downloadError);
						return { id: item.id, contentDownloadUrl: null, error: downloadError.message };
					}
				});

				const downloadResults = await Promise.all(downloadPromises);

				const filteredResults = downloadResults.filter(item => item.contentDownloadUrl !== null && item.error === undefined);

				const total = filteredResults.length;
				const data = filteredResults.map(item => item.contentDownloadUrl); // Fix here

				res.status(200).json({
					status: 200,
					total,
					data: data // Fix here
				});
			} catch (error) {
				console.error(error);
				res.status(500).json({ error: 'Internal Server Error' });
			}
		});
	},
};
