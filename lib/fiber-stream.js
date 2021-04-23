'use strict';

const WebSocket = require('ws');
const {v4: uuidv4} = require('uuid');

const OperatingMode = {
    bus: 'bus',
    relay: 'relay'
}

const EventType = {
    open: 'open',
    close: 'close',
    message: 'message',
    error: 'error'
}

class FiberStream {

    constructor(url, key, mode) {
        if (!mode) {
            mode = OperatingMode.bus;
        }

        if (!Object.values(OperatingMode).includes(mode)) {
            throw Error(`Unsupported fiber mode ${mode}`);
        }

        this.url = url;
        this.key = key;
        this.mode = mode;
        this.handlers = {};
    }

    _raiseEvent(event, value) {
        let handler = this.handlers[event];
        if (handler)
            return handler(value);
        return null;
    }

    _send(message) {
        this.webSocket.send(JSON.stringify(message));
    }

    open() {
        return new Promise((resolve, reject) => {

            this.webSocket = new WebSocket(this.url, {
                headers: {
                    Authorization: `X-FiberAuth ${this.key}`
                }
            });

            this.webSocket.on('open', () => {
                resolve();
                this._raiseEvent(EventType.open);
            });

            this.webSocket.on('error', e => {
                reject(e);
                this._raiseEvent(EventType.error, e);
            });

            this.webSocket.on('close', e => {
                this._raiseEvent(EventType.close, e);
            });

            this.webSocket.on('message', messageString => {
                let message = JSON.parse(messageString);

                // Handle KeepAlive requests
                if (message.type === 'ping') {
                    this._send({id: message.id, type: 'pong'});
                    return;
                }

                let response = this._raiseEvent(EventType.message, message.payload);
                if (this.mode === OperatingMode.relay && response)
                    this._send({id: message.id, type: 'response', payload: response});
            });

        });
    }

    publish(payload) {
        if (this.mode !== OperatingMode.bus) {
            throw Error('Publishing from the stream only works in bus mode.')
        }

        this._send({id: uuidv4(), type: 'publish', payload})
    }

    close() {
        this.webSocket.close();
    }

    on(event, handler) {
        if (typeof handler !== 'function')
            throw Error(`Cannot register '${typeof handler}' as a message handler`);

        this.handlers[event] = handler;
    }

}

module.exports = FiberStream;