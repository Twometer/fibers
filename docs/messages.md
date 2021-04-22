## Messages

The system is designed to work with JSON messages, binary data does not work directly and should be encoded (e.g. Base64)
 before sending.

To publish a message, just send a POST request to the fiber's `publish` endpoint with the POST body containing your message
 payload. Simplex fibers will return a `200` response on success, duplex fibers will return the subscriber's reply in the
 HTTP response.

The subscriber receives messages in the following form:

```json
{
    "id": "<unique message uuid>",
    "payload": {}
}
```

Duplex subscribers must reply with the same message format and a matching ID. Reply messages that don't reference an existing
 message will be dropped.