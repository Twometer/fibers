const FiberStream = require('../lib/fiber-stream');

const stream = new FiberStream('ws://localhost:8090/test-relay/stream', 'root', 'relay');

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
    console.log("Replying to ", data);
    return {test: 'value'};
});

stream.open();