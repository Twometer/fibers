'use strict';

const events = require('events');
const {v4: uuidv4} = require('uuid');

class Fiber {

    constructor(spec) {
        this.spec = spec;
        this.emitter = new events.EventEmitter();
        this.duplex = spec.mode === "duplex";
    }

    register(router) {
        router.use((req, res, next) => {
            if (this._authenticateRequest(req, res)) {
                return next();
            }
        });

        router.post("/publish", (req, res) => {
            let message = this._createMessageObject(req.body);
            this.emitter.emit('message', message);

            if (this.duplex) {
                const timeout = setTimeout(() => {
                    this.emitter.removeAllListeners(message.id);
                    res.sendStatus(504);
                }, 30000);

                this.emitter.once(message.id, response => {
                    clearTimeout(timeout);
                    res.json(response);
                });
            } else {
                return res.sendStatus(200);
            }
        });

        router.ws("/subscribe", (ws) => {
            const eventHandler = message => {
                ws.send(JSON.stringify(message));
            };

            this.emitter.on('message', eventHandler);

            ws.on('close', () => {
                this.emitter.removeListener('message', eventHandler);
            });

            if (this.duplex) {
                ws.on('message', (data) => {
                    let json = JSON.parse(data);
                    if (!json.id || !json.payload)
                        return;

                    this.emitter.emit(json.id, json.payload);
                });
            }
        });
    }

    _authenticateRequest(req, res) {
        let header = req.headers.authorization;
        if (header == null) {
            res.sendStatus(401);
            return false;
        }

        let auth = header.split(' ');
        let scheme = auth[0];
        let key = auth[1];

        if (scheme !== 'X-FiberAuth') {
            res.sendStatus(403);
            return false;
        }

        if (key !== this.spec.key) {
            res.sendStatus(403);
            return false;
        }

        return true;
    }

    _createMessageObject(payload) {
        return {
            id: uuidv4(),
            payload: payload
        };
    }

}

module.exports = {Fiber}