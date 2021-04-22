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
 to the publisher. Note that duplex fibers broadcast the messages to all subscribers, but only the response of the first responding
 subscriber is returned to the publisher.

There also exists a JavaScript library for easier development of fiber clients. It is located in the `lib` folder and 
 requires the `ws` npm package as a dependency.