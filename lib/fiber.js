'use strict';

const WebSocket = require('ws');

const EventType = {
    open: 'open',
    close: 'close',
    message: 'message',
    error: 'error'
}

function Fiber(url, key, mode) {
    if (!mode) mode = 'simplex';

    if (this.mode !== 'simplex' && this.mode !== 'duplex')
        throw Error(`Unsupported fiber mode ${this.mode}`);

    this.url = url;
    this.key = key;
    this.handlers = {};
}

Fiber.prototype._raiseEvent = function (event, value) {
    let handler = this.handlers[event];
    if (handler)
        return handler(value);
    return null;
}

Fiber.prototype.open = function () {
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

        this.webSocket.on('message', msg => {
            let msg = this._raiseEvent(EventType.message, JSON.parse(msg));
            if (this.mode === 'duplex' && msg)
                this.send(msg);
        });

    });
}

Fiber.prototype.send = function (message) {
    this.webSocket.send(JSON.stringify(message));
}

Fiber.prototype.close = function () {
    this.webSocket.close();
}

Fiber.prototype.on = function (event, handler) {
    if (typeof handler !== 'function')
        throw Error(`Cannot register '${typeof handler}' as a message handler`);

    this.handlers[event] = handler;
}

module.exports = { EventType, Fiber };