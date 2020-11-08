const schedule = require("node-schedule");
const request = require("request");
const fs = require("fs");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test", { useNewUrlParser: true });

const dir = "../tmp";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

// schedule.scheduleJob("* * * * *", () => {
// 	if (!fs.existsSync(dir)) {
// 		fs.mkdirSync(dir);
// 	}

// });
const url = "mongodb:localhost/test";

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
	console.log("we're connected!");

	const ipv4Schema = new mongoose.Schema({ date: Date, country_code: String, ip_begin: String, ip_end: String, prefix: String });
	ipv4Schema.methods.speak = () => {
		console.log("success");
	};
	const Ipv4 = mongoose.model("Ipv4", ipv4Schema);
	requestIpv4(Ipv4);
});

const requestIpv4 = (Ipv4) => {
	request({ method: "GET", uri: "https://xn--3e0bx5euxnjje69i70af08bea817g.xn--3e0b707e/destFile/ipv4.csv" }, (error, response, body) => {
		if (error) {
			console.error(error);
		} else {
			const date = new Date();
			const ipv4List = body
				.split("\n")
				.slice(1)
				.map((ipv4Str) => {
					const ipv4StrList = ipv4Str.split(",");
					return { date, country_code: ipv4StrList[1], ip_begin: ipv4StrList[2], ip_end: ipv4StrList[3], prefix: ipv4StrList[4] };
				});

			Ipv4.insertMany(ipv4List, (error, ipv4) => {
				if (error) {
					console.error(error);
				} else {
					ipv4.speak();
				}
			});
		}
	});
};
