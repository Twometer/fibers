# Fibers
Fibers is a fast and simple message queue and relay server for JSON messages.

## Usage
With fibers, you send a JSON message to the `publish` endpoint of a single fiber (which is basically a message queue),
 and it will automatically be broadcast to all connected subscribers of that fiber. Depending on the mode, a subscriber
 can also return a value to the publisher.

Each fiber is completely independent from the others, and each one can have multiple publishers and subscribers. Along with
 their mode and access keys, they are configured in the config file located at `config/fibers.json`.

There are two modes for fibers: `simplex` and `duplex`. Simplex fibers just broadcast all published messages to all connected
 subscribers. Duplex fibers on the other hand wait for a response to be sent by a subscriber and return it in the HTTP response
 to the publisher.

## Endpoints
- `/{fiber}/subscribe`: WebSocket endpoint for subscribing to messages in that fiber.
- `/{fiber}/publish`: POST endpoint for publishing messages to that fiber.

All requests require an Authorization header with the `X-FiberAuth` scheme, which supplies
the key for that fiber.

Fibers that do not exist will yield a 404 error. Invalid keys will return 403 and a missing key 401.

If a duplex fiber subscriber does not reply within 30 seconds, the message is treated as lost and will return error `504` to the
 publisher.

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

## Docker
Fibers is compatible with docker. You will want to mount the `/app/config` directory
 to change and persist the config files.

For security reasons, it is recommended to run the fibers server behind a nginx reverse proxy
 with TLS encryption enabled.