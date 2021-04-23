const FiberStream = require('../lib/fiber-stream');

const stream = new FiberStream('ws://localhost:8090/bus-test/stream', 'root', 'bus');

stream.on('open', () => {
    console.log("Connected");
});

stream.on('error', e => {
    console.log("Connection failed", e);
});

stream.on('close', e => {
    console.log("Connection lost", e);
});

stream.on('message', data => {
    console.log("Received ", data);
});

stream.open();