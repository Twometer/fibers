# Fibers
Fibers is a fast and simple message queue and relay server.

## Endpoints
- `/{fiber}/subscribe`: WebSocket endpoint for subscribing to messages in that fiber.
- `/{fiber}/publish`: POST endpoint for publishing messages to that fiber.

All requests require an Authorization header with the `X-FiberAuth` scheme, which supplies
the key for that fiber.

Fibers that do not exist will yield a 404 error. Invalid keys will return 403 and a missing key 401.

## Usage
[WIP]

In `fibers.json`, multiple separate fibers (channels) can be defined.

## Docker
[WIP]

You will want to mount the `/app/config` directory