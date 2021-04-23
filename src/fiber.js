'use strict';

const Config = require('./config')
const events = require('events')
const logger = require('cutelog.js');
const {v4: uuidv4} = require('uuid')

class Fiber {

    constructor(spec) {
        this.spec = spec;
        this.eventBus = new events.EventEmitter();
        this.relayMode = spec.mode === 'relay';
    }

    register(router) {
        router.use((req, res, next) => {
            if (this._authenticateRequest(req, res)) {
                return next();
            }
        });

        router.post("/push", (req, res) => {
            let message = this._createMessage(uuidv4(), 'publish', 'http', req.body);
            this.eventBus.emit('message', message);

            if (this.relayMode) {
                // When in relay mode, wait for a subscriber to respond
                const timeout = setTimeout(() => {
                    this.eventBus.removeAllListeners(message.id);
                    res.sendStatus(504);
                }, Config.MSG_TIMEOUT);

                this.eventBus.once(message.id, response => {
                    clearTimeout(timeout);
                    res.json(response);
                });
            } else {
                // Else just acknowledge that we got the message
                return res.sendStatus(200);
            }
        });

        router.ws("/stream", ws => {
            const clientId = uuidv4();

            // Send messages from publishers to this socket
            const messageEventHandler = message => {
                if (message.sender !== clientId) {
                    ws.send(JSON.stringify({id: message.id, type: message.type, payload: message.payload}));
                }
            };
            this.eventBus.on('message', messageEventHandler);

            // Allow this socket to publish / respond to messages
            ws.on('message', (data) => {
                try {
                    let json = JSON.parse(data);
                    if (!json.id || !json.payload || !json.type)
                        return;

                    if (this.relayMode && json.type === 'response') {
                        this.eventBus.emit(json.id, json.payload);
                    } else if (!this.relayMode && json.type === 'publish') {
                        this.eventBus.emit('message', this._createMessage(json.id, json.type, clientId, json.payload));
                    }
                } catch (e) {
                    logger.error(e);
                }
            });

            // Handle disconnects
            ws.on('close', () => {
                this.eventBus.removeListener('message', messageEventHandler);
            });
        });


        setInterval(() => {
            this.eventBus.emit('message', this._createMessage(uuidv4(), 'ping', 'server'));
        }, Config.KEEPALIVE_INTERVAL);
    }

    _createMessage(id, type, sender, payload) {
        return {id, type, sender, payload}
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

}

module.exports = Fiber