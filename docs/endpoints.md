# Endpoints

This page describes which endpoints and protocols the Fibers server exposes

## Format

For each fiber, the server generates an endpoint that supports POST requests and WebSocket connections, in the following
format:

```
http://fiber-server:port/fiber-name/
  ws://fiber-server:port/fiber-name/
```

All requests made to such endpoints require an Authorization header with the `X-FiberAuth` scheme, supplying the access
key for that fiber, like this:

```
Authorization: X-FiberAuth key
```

## Errors

The following HTTP errors can occur when connecting to any such endpoint:

Error Code   | Description
------------ | -------------
404 Not Found | The requested fiber does not exist
403 Access Denied | The supplied access key is not valid for this fiber
401 Unauthorized | The request is missing an access key
504 Gateway Timeout | No subscriber replied to the relay before the timeout