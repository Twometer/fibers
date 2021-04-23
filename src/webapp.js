'use strict';

const express = require("express");
const expressWs = require("express-ws");
const logger = require('cutelog.js');

let app = express();
let server = null;

function listen(port) {
    app.set("trust proxy", 1);
    app.use(express.json());
    expressWs(app);

    return new Promise((resolve) => {
        server = app.listen(port, () => {
            logger.info(`Listener started on port ${port}`);
            resolve();
        });
    })
}

function use(endpoint, router) {
    app.use(endpoint, router);
}

function close() {
    if (server !== null) {
        server.close();
    }
}

module.exports = {listen, close, use}