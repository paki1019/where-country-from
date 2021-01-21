const express = require("express");
const csv = require("csvtojson");

const app = express();
const port = 3000;

app.get("/ipv4", (request, response) => {
	const key = request?.query?.key;
	const query = request?.query?.query;

	if (key !== "keytest") {
		response.send("invalid key access");
		return;
	}
	response.send(`key=${key}, query=${query}`);

	// csv()
	// 	.fromFile("../tmp/ipv4.csv")
	// 	.then((json) => {
	// 		response.send(JSON.parse(JSON.stringify(json)));
	// 	})
	// 	.catch((error) => {
	// 		console.log(error);
	// 		response.send("ip list not found");
	// 	});
});

app.listen(port, () => {
	console.log(`application is listening on port ${port}...`);
});
