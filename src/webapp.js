'use strict';

const express = require("express");
const expressWs = require("express-ws");
const logger = require('xa');

let app = express();
let server;

function listen(port) {
    return new Promise((resolve) => {
        app.set("trust proxy", 1);
        app.use(express.json());
        expressWs(app);

        server = app.listen(port, () => {
            logger.info(`Listener started on port ${port}`);
            resolve();
        });
    })
}

function close() {
    server.close();
}

module.exports = {app, listen, close}