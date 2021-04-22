## Endpoints

- `/{fiber}/subscribe`: WebSocket endpoint for subscribing to messages in that fiber.
- `/{fiber}/publish`: POST endpoint for publishing messages to that fiber.

All requests require an Authorization header with the `X-FiberAuth` scheme, which supplies
the key for that fiber.

Fibers that do not exist will yield a 404 error. Invalid keys will return 403 and a missing key 401.

If a duplex fiber subscriber does not reply within 30 seconds, the message is treated as lost and will return error `504` to the
 publisher.