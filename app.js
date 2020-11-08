const express = require("express");
const wget = require("node-wget");
const schedule = require("node-schedule");
const csv = require("csvtojson");

const app = express();
const port = 3000;

var j = schedule.scheduleJob("0 0 * * *", function () {
  const now = new Date();
  const nowDate = `${now.getFullYear()}_${now.getMonth()}_${now.getDay()}`;
  wget(
    {
      url:
        "https://xn--3e0bx5euxnjje69i70af08bea817g.xn--3e0b707e/destFile/ipv4.csv",
      dest: `./tmp/ipv4_${nowDate}.csv`,
    },
    (error, response) => {
      if (error) {
        console.log(error);
      } else {
        console.log(response);
      }
    }
  );
});

app.get("/ipv4", (req, res) => {
  csv()
    .fromFile("./tmp/ipv4.txt")
    .then((json) => {
      res.send(JSON.parse(JSON.stringify(json)));
    });
});

app.get("/ipv4/download", (req, res) => {
  wget(
    {
      url:
        "https://xn--3e0bx5euxnjje69i70af08bea817g.xn--3e0b707e/destFile/ipv4.csv",
      dest: "./tmp/ipv4.csv",
    },
    (error, response) => {
      if (error) {
        res.send(error);
      } else {
        res.send(response);
      }
    }
  );
});

app.listen(port, () => {
  console.log("application is listening on port ${port}...");
});
