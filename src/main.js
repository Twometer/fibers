'use strict';

const appInfo = require("../package.json");
const config = require("../config/config.json");
const fiberDefs = require("../config/fibers.json");

const express = require("express");
const bodyParser = require("body-parser");
const expressWs = require("express-ws");
const xa = require("xa");

const { FiberManager } = require('./fiber-manager');
const { Fiber } = require('./fiber');
const manager = new FiberManager();

const app = express();
app.set("trust proxy", 1);
app.use(bodyParser.json());

xa.info(appInfo.name + " v" + appInfo.version + " starting up...");

expressWs(app);
xa.info("Registered WebSocket handler");

var server = app.listen(config.port, () => {
	xa.info("HTTP Listener started on port " + config.port);

	initialize();
});

function initialize() {
	xa.info("Deploying fibers...");
	if (!deployFibers()) {
		server.close();
	} else {
		xa.success("Startup complete.");
	}
}

function deployFibers() {
	for (let fiberDef of fiberDefs) {
		if (manager.hasFiber(fiberDef.name)) {
			xa.error("Fiber '" + fiberDef.name + "' defined twice.");
			return false;
		}

		deploy(fiberDef);
	}
	return true;
}

function deploy(fiberDef) {
	let router = express.Router();

	let fiber = new Fiber(fiberDef);
	fiber.register(router)

	manager.add(fiber);
	app.use('/' + fiberDef.name, router);
	xa.success("Deployed fiber '" + fiberDef.name + "'.");
}