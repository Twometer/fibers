'use strict';

const appInfo = require("../package.json");
const fiberDefs = require("../config/fibers.json");

const express = require('express');
const logger = require('xa');
const Config = require("./config");
const Webapp = require('./webapp')
const FiberManager = require('./manager');
const Fiber = require('./fiber');

async function main() {
    logger.info(`Starting ${appInfo.name} v${appInfo.version}...`);
    overwriteLogger()
    Config.load();
    await Webapp.listen(Config.HTTP_PORT);
    deployFibers();
}

function overwriteLogger() {
    logger.success = (text) => {
        logger.custom('OKAY', text, {backgroundColor: 'green'});
    }
}

function deployFibers() {
    logger.info("Deploying fibers...");
    for (let fiberDef of fiberDefs) {
        if (FiberManager.hasFiber(fiberDef.name)) {
            throw Error(`Fiber '${fiberDef.name}' defined twice.`);
        }

        if (fiberDef.mode !== 'relay' && fiberDef.mode !== 'queue') {
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
    logger.success("Deployed fiber '" + fiberDef.name + "'.");
}

main().then(() => logger.success("Startup complete."))
    .catch(e => logger.error(`Startup failed: ${e}.`))