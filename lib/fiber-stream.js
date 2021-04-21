'use strict';

const WebSocket = require('ws');

const EventType = {
    open: 'open',
    close: 'close',
    message: 'message',
    error: 'error'
}

class FiberStream {

    constructor(url, key, mode) {
        if (!mode) mode = 'simplex';

        if (mode !== 'simplex' && mode !== 'duplex')
            throw Error(`Unsupported fiber mode ${mode}`);

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

            this.webSocket.on('close', () => {
                this._raiseEvent(EventType.close);
            });

            this.webSocket.on('message', messageString => {
                let message = JSON.parse(messageString);
                let response = this._raiseEvent(EventType.message, message.payload);
                if (this.mode === 'duplex' && response)
                    this.send({id: message.id, payload: response});
            });

        });
    }

    send(message) {
        this.webSocket.send(JSON.stringify(message));
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