const WebSocket = require('ws');

let stream = new WebSocket('ws://localhost:8090/relay-test/stream', {
    headers: {
        Authorization: `X-FiberAuth root`
    }
});
stream.on('open', () => {
    console.log("Connected");
});

stream.on('error', e => {
    console.log("Connection failed", e);
});

stream.on('close', e => {
    console.log("Connection lost", e);
});