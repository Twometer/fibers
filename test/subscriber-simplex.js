const WebSocket = require('ws');

var socket = new WebSocket('ws://localhost:8090/test-fiber-s/subscribe', {
    headers: {
        Authorization: "X-FiberAuth cvhYgf4yhCWRL59z639x"
    }
});

socket.on('open', () => {
    console.log("Connected");
});

socket.on('close', (e) => {
    console.log("Connection lost", e);
});

socket.on('message', (data) => {
    console.log(data);
});