const schedule = require("node-schedule");
const request = require("request");
const fs = require("fs");
const path = require("path");
const dir = "../tmp";

schedule.scheduleJob("0 0 0 0 * *", () => {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
	requestIpv4();
});

const requestIpv4 = () => {
	request({ method: "GET", uri: "https://xn--3e0bx5euxnjje69i70af08bea817g.xn--3e0b707e/destFile/ipv4.csv" }, (error, response, body) => {
		if (error) {
			console.error(error);
		} else {
			const ipv4List = body
				.split("\n")
				.slice(1)
				.map((ipv4Str) => {
					const ipv4StrList = ipv4Str.split(",");
					return { country_code: ipv4StrList[1], ip_begin: ipv4StrList[2], ip_end: ipv4StrList[3], prefix: ipv4StrList[4] };
				})
				.sort((a, b) => {
					return a.prefix < b.prefix ? -1 : a.prefix > b.prefix ? 1 : 0;
				});
			let ipv4Table = [];
			for (let i = 1; i <= 32; i++) {
				const subnet = "/" + String(i);
				ipv4Table = [...ipv4Table, { subnet, ipv4List: ipv4List.filter((ipv4) => ipv4.prefix === subnet) }];
			}
			fs.writeFile("./tmp/ipv4Table.json", JSON.stringify(ipv4Table), "utf8", (error) => {
				// TODO DB인풋으로 수정
				if (error) {
					console.error("파일 저장 실패");
					return;
				}
				console.log("ipv4Table.json");
			});
		}
	});
};
requestIpv4();
