# Messages

The system is designed to work with JSON messages, binary data does not work directly and must be encoded to Base64
before sending the message.

## Publishing

You can always publish messages to a fiber by sending a `POST` request to its endpoint. The body can directly contain
your message's content. If the `POST` request was made to a fiber operating in relay mode, the response payload of the
subscriber is directly returned in the HTTP response.

To publish a message, just send a POST request to the fiber's `publish` endpoint with the POST body containing your
message payload. Simplex Fibers will return a `200` response on success, duplex fibers will return the subscriber's
reply in the HTTP response.

When connected to the WebSocket endpoint of a fiber operating in queue mode (This does **not** work with relay-mode
fibers), you can directly publish messages using the WebSocket, by sending the message in the following format:

```json
{
  "id": "<random uuid>",
  "type": "publish",
  "payload": {}
}
```

The payload can be any JSON object you want to send.

## Subscribing

Subscribing to a fiber can be a little more complex, depending on the fiber type:

### Message format

Subscribers receive messages from publishers in the following format:

```json
{
  "id": "<random uuid>",
  "type": "publish",
  "payload": {}
}
```

### Replying on relay fibers

When subscribing to a relay fiber, such a message should be replied to on the WebSocket with a message in the following
format:

```json
{
  "id": "<request uuid>",
  "type": "response",
  "payload": {}
}
```

The payload object will be returned to the publisher.

### Handling keepalives

The fiber server will regularly check in on the fiber subscribers in order to detect broken connections and keeping
working connections alive. The server will send requests in the following format:

```json
{
  "id": "<random uuid>",
  "type": "ping"
}
```

Note the missing payload. A compliant subscriber should reply with type `pong` and the same message id as the request.