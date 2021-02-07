'use strict';

const events = require('events');
const { v4: uuidv4 } = require('uuid');

class Fiber {

    constructor(spec) {
        this.spec = spec;
        this.emitter = new events.EventEmitter();
        this.duplex = spec.mode === "duplex";
    }

    register(router) {
        router.use((req, res, next) => {
            if (this.authenticateRequest(req, res)) {
                return next();
            }
        });

        router.post("/publish", (req, res, next) => {
            let message = this.createMessageObject(req.body);
            this.emitter.emit('message', message);

            if (this.duplex) {
                const timeout = setTimeout(() => {
                    this.emitter.removeAllListeners(message.id);
                    res.sendStatus(504);
                }, 30000);

                this.emitter.on(message.id, response => {
                    this.emitter.removeAllListeners(message.id);
                    clearTimeout(timeout);
                    res.json(response);
                });
            }
            else {
                return res.sendStatus(200);
            }
        });

        router.ws("/subscribe", (ws, req) => {
            const eventHandler = message => {
                ws.send(JSON.stringify(message));
            };

            this.emitter.on('message', eventHandler);

            ws.on('close', () => {
                this.emitter.removeListener('message', eventHandler);
            });

            if (this.duplex) {
                ws.on('message', (data) => {
                    var json = JSON.parse(data);
                    if (!json.id || !json.payload)
                        return;

                    this.emitter.emit(json.id, json.payload);
                });
            }
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

    createMessageObject(payload) {
        return {
            id: uuidv4(),
            payload: payload
        };
    }

}

module.exports = { Fiber }