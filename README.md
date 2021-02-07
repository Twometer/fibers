# Fibers
Fibers is a fast and simple message queue and relay server for JSON messages.

## Usage
With fibers, you send a JSON message to the `publish` endpoint of a single fiber (a message queue or channel),
 and it will automatically be broadcast to all connected subscribers of that fiber.

Each fiber is completely independent from the others, and each can have multiple publishers and subscribers.
 Fibers and their access keys are configured in `fibers.json`.

## Endpoints
- `/{fiber}/subscribe`: WebSocket endpoint for subscribing to messages in that fiber.
- `/{fiber}/publish`: POST endpoint for publishing messages to that fiber.

All requests require an Authorization header with the `X-FiberAuth` scheme, which supplies
the key for that fiber.

Fibers that do not exist will yield a 404 error.
Invalid keys will return 403 and a missing key 401.

## Docker
Fibers is compatible with docker. You will want to mount the `/app/config` directory
to change and persist the config files.

It is recommended to run fibers behind nginx with TLS for security.