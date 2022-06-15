const chromeLauncher = require("chrome-launcher");
const dotenv = require("dotenv");
const cors = require("cors");
const express = require("express");
const { getAudits } = require("./lighthouse");
const puppeteer = require('puppeteer');

const app = express();
dotenv.config();
app.use(cors());

const SERVER_PORT = process.env.SERVER_PORT || 8080;
const CHROME_PORT = process.env.CHROME_PORT || 12345;
let browser

app.get("/", async (req, res) => {
  // Get url, headers from request params
  let { url, headers, formFactor, waitTime } = req.query;
  headers = JSON.parse(headers);

  const audits = await getAudits(url, headers, formFactor, browser, waitTime);

  if (audits !== {}) res.send(audits);
  else res.status(500).send(audits);
});

app.listen(SERVER_PORT, async () => {
  console.log(`Server running on  http://localhost:${SERVER_PORT}`);

  browser = await puppeteer.launch({
    args: [`--remote-debugging-port=${CHROME_PORT}`],
    // Optional, if you want to see the tests in action.
    headless: false,
  });
});
