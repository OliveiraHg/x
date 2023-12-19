# Easy Tech API

Welcome to the Easy Tech API, a cutting-edge startup API provider specializing in a diverse range of services. Explore the world of technology with our APIs, designed to deliver innovative solutions and enhance your applications.

Learn more about Swagger at [http://swagger.io](http://swagger.io) or connect with us on [irc.freenode.net, #swagger](http://swagger.io/irc/).

## API Version

- Version: 1.0.0
- License: [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html)

## Contact Information

- Email: easyapi0@gmail.com

## Servers

- [Easy API](https://api.easy0.repl.co)

## Tags

- SFW: Safe For Work
- AI: Artificial Intelligence
- FUN: Fun and Entertainment
- SEARCH: Search Operations
- NSFW: Not Safe For Work
- EDUC: Educational Content

## Paths

### `/api/sfw/{category}`

- **Method**: `GET`
- **Tags**: SFW
- **Summary**: Random Anime
- **Description**: Anime API note: change the {category} choices neko, waifu, kiss, hug
- **Parameters**:
	- `category` (path) - Provide Category neko, waifu, kiss, hug
- **Responses**:
	- `200`: Successful operation
	- `500`: Internal Server Error

### `/api/blackbox`

- **Method**: `GET`
- **Tags**: AI
- **Summary**: Blackbox AI API
- **Description**: Black AI API based on Google Lambda AI
- **Parameters**:
	- `query` (query) - Provide a query to send a question to Blackbox AI
- **Responses**:
	- `200`: OK
	- `500`: Internal Server Error

# Add more paths based on your OpenAPI definition
