'use strict';

const events = require('events');

class Fiber {

    constructor(spec) {
        this.spec = spec;
        this.emitter = new events.EventEmitter();
    }

    register(router) {
        router.use((req, res, next) => {
            if (this.authenticateRequest(req, res)) {
                return next();
            }
        });

        router.post("/publish", (req, res, next) => {
            this.emitter.emit('message', req.body);
            return res.sendStatus(200);
        });

        router.ws("/subscribe", (ws, req) => {
            this.emitter.on('message', message => {
                ws.send(message);
            });
        });
    }

    authenticateRequest(req, res) {
        let header = req.headers.authorization;
        if (header == null) {
            res.sendStatus(401).send();
            return false;
        }

        let auth = header.split(' ');
        let scheme = auth[0];
        let key = auth[1];

        if (scheme !== 'X-FiberAuth') {
            res.sendStatus(403).send();
            return false;
        }

        if (key !== this.spec.key) {
            res.sendStatus(403).send();
            return false;
        }

        return true;
    }

}

module.exports = { Fiber }