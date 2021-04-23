'use strict';

const appInfo = require("../package.json");
const fiberDefs = require("../config/fibers.json");

const express = require('express');
const logger = require('cutelog.js');
const Config = require("./config");
const Webapp = require('./webapp')
const FiberManager = require('./manager');
const Fiber = require('./fiber');

async function main() {
    logger.info(`Starting ${appInfo.name} v${appInfo.version}...`);
    Config.load();
    await Webapp.listen(Config.WEB_PORT);
    deployFibers();
}

function deployFibers() {
    logger.info("Deploying fibers...");
    for (let fiberDef of fiberDefs) {
        if (FiberManager.hasFiber(fiberDef.name)) {
            throw Error(`Fiber '${fiberDef.name}' defined twice.`);
        }

        if (fiberDef.mode !== 'relay' && fiberDef.mode !== 'bus') {
            throw Error(`${fiberDef.name}: Unknown fiber mode '${fiberDef.mode}'.`);
        }

        deployFiber(fiberDef);
    }
}

function deployFiber(fiberDef) {
    let router = express.Router();

    let fiber = new Fiber(fiberDef);
    fiber.register(router)

    FiberManager.add(fiber);
    Webapp.use('/' + fiberDef.name, router);
    logger.okay("Deployed fiber '" + fiberDef.name + "'.");
}

main().then(() => logger.okay("Startup complete."))
    .catch(e => logger.error(`Startup failed: ${e}.`))