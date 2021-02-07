const WebSocket = require('ws');

var socket = new WebSocket('ws://localhost:8090/test-fiber-d/subscribe', {
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
    var json = JSON.parse(data);
    console.log("Replying to ", json);
    socket.send(JSON.stringify({id: json.id, payload: 'test'}))
});