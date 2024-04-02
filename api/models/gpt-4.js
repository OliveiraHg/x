const axios = require("axios");

async function gpt4(req, res) {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({
            status: 400,
            message: "Invalid request: 'message' body parameter required"
        });
    }

    const options = {
        method: 'POST',
        url: 'https://www.yuelink.cn/api/openai/v1/chat/completions',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'insomnia/8.6.1'
        },
        data: {
            messages: [
                {
                    role: 'system',
                    content: '\nYou are ChatGPT, a large language model trained by OpenAI.\nKnowledge cutoff: 2021-09\nCurrent model: gpt-4\nCurrent time: 2/20/2024, 12:21:23 AM\nLatex inline: $x^2$ \nLatex block: $$e=mc^2$$\n\n'
                },
                { role: 'user', content: message }
            ],
            stream: false,
            model: 'gpt-4',
            temperature: 0.5,
            presence_penalty: 0,
            frequency_penalty: 0,
            top_p: 1
        }
    };

    try {
        const response = await axios.request(options);
        const content = response.data.choices[0].message.content;
        const ai_response = {
            status: 200,
            content: content,
            finish_reason: "stop"
        };
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(ai_response);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
}

module.exports = { gpt4 };
