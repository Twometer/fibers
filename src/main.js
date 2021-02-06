'use strict';

const appInfo = require("../package.json");
const config = require("../config/config.json");
const express = require("express");
const bodyParser = require("body-parser");
const xa = require("xa");

const app = express();
app.set("trust proxy", 1);
app.use(bodyParser.json());

xa.info(appInfo.name + " v" + appInfo.version + " starting up...");

app.listen(config.port, () => {
	xa.success("HTTP Listener started on port " + config.port);
	
});