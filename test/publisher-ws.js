const FiberStream = require('../lib/fiber-stream');

const stream = new FiberStream('ws://localhost:8090/test-queue/stream', 'root', 'queue');

let num = 0;
setTimeout(() => {
    stream.publish({num: num++})
}, 1000);

stream.on('open', () => {
    console.log("Connected");
});

stream.on('error', e => {
    console.log("Connection failed", e);
});

stream.on('close', () => {
    console.log("Connection lost");
});

stream.open();