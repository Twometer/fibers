const FiberStream = require('../lib/fiber-stream');

const stream = new FiberStream('ws://localhost:8090/test-fiber-s/subscribe', 'cvhYgf4yhCWRL59z639x', 'simplex');

stream.on('open', () => {
    console.log("Connected");
});

stream.on('error', e => {
    console.log("Connection failed", e);
});

stream.on('close', () => {
    console.log("Connection lost");
});

stream.on('message', data => {
    console.log("Received ", data);
});

stream.open();