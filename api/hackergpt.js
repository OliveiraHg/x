module.exports = {
	run: async function ({port ,app ,OpenAI ,bodyParser,express,axios }) {



app.get('/v1/hackergpt', async (req, res) => {
	try {
		const q = req.query.q;

		if(!q){
			res.json({error:"Invalid Request blank 'q'"});
			return false;
		}
		var options = {
			method: 'POST',
			url: 'https://www.hackergpt.chat/api/chat',
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': 'insomnia/8.4.5',
				Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjBiYmQyOTllODU2MmU3MmYyZThkN2YwMTliYTdiZjAxMWFlZjU1Y2EiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQWRvbmlzIEpyLiBTYW4gSnVhbiBTYW5jaGV6IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0pWcDZvWEZCUkFnNUI4V1JpZEhpSVhibmVYeWRWY2VOSFFwcThiV2ZlbnpRVT1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9oYWNrZXJncHQtNmM3OWUiLCJhdWQiOiJoYWNrZXJncHQtNmM3OWUiLCJhdXRoX3RpbWUiOjE3MDEyNzU2NzUsInVzZXJfaWQiOiJCR0w4V0tOeEpFT2lpWWdTclNQdjNUVFQxQ0IyIiwic3ViIjoiQkdMOFdLTnhKRU9paVlnU3JTUHYzVFRUMUNCMiIsImlhdCI6MTcwMTM2NTMzMCwiZXhwIjoxNzAxMzY4OTMwLCJlbWFpbCI6ImFkb25pc2pyc2FuanVhbkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjEwODc3Njg0Mjk0ODI5OTkwMzYxNCJdLCJlbWFpbCI6WyJhZG9uaXNqcnNhbmp1YW5AZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.ItnJ8NimyoKJC9WzSS4i0gJr0cTx_VPdNVCGRAP8LFu9yD8gvYEwLYVWAan1tIuGUWKPUVdqaImyxOvFi6ScmXXVpvgHKdHg6iAWVy6TxVI4rETCwUuuL309sDtc5dbaGgf-QAp0ToZcrUEZWNT-4EFxsf2Ji54W7qSSgMaC1j3caR407JlCjfpEqp3VuVx4MI2t0KRLc-30ErWTjTijQxH_TC_ieNR8fVaj8dOAWWIzQc8VDn3kCSuxnfnex9QNabFH0FrDrsSEe8LEdbYJ4sa1Z_vw5rdfisPKKiD2CDLi-8Zn4nGFYnrbuSuWUieqCXGH8JSAIrduIPqMS9ZXlA'},
			data: {
				model: 'gpt-3.5-turbo-instruct',
				messages: [{role: 'user', content:q}]
			}
		};

		axios.request(options).then(function (response) {
			const data = response.data;
		res.json({Dev:"ADONIS",
						 content:data
						 });
		}).catch(function (error) {
			console.error(error);
		});
	} catch (error) {

		res.status(500).json({ error: 'example error' });
	}
});



	},
};
