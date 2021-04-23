# Operating modes

A single fiber can be configured to operate in one of these two modes:

## Bus Mode

Bus mode is for messages that only require a simple message bus, to which anyone can publish messages that are
forwarded to everyone who is subscribed to the bus. A client subscribes to a bus-mode fiber using the WebSocket
endpoint.

Messages can be published either by sending it to the WebSocket or by POSTing it to the HTTP endpoint.

## Relay Mode

The relay mode is for messages that each require a response from one of the subscribers. When you publish a message to a
relay-mode fiber, the server broadcasts it to all subscribers. It then waits for any one of the subscribers to return a
response with the same message ID.

The first subscriber that responds gets its response message returned back to the publisher. Messages that are not
answered by any subscriber after a configurable timeout are dropped and the publisher receives a `504 Gateway Timeout`
response.

Note that relay mode does not support publishing by WebSocket. Only the POST-endpoint can be used for publishing
messages.