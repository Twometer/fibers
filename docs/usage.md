# Usage

The Fibers server is designed to be run using docker. It runs on the official `node` base image.

## Setup

No external dependencies are required to run it. However, you will want to mount the `/app/config` directory to change
and persist the configuration files.

For security reasons, it is also strongly recommended running the server behind a NGINX reverse proxy with TLS
encryption enabled on the WebSocket and HTTP endpoints.

## Configuration

There are two configurations for the Fibers server:

### Fiber definition

Fibers are defined in the `/app/config/fibers.json` file that you mounted previously, which has the following structure:

```json
[
  {
    "mode": "queue|relay",
    "name": "fiber-name",
    "key": "choose a secure key"
  }
]
```

### Server config

The server is configured using environment variables that you can pass to your Docker container:

Key | Description
------------ | -------------
FIBER_WEB_PORT | The port on which the HTTP and WebSocket server should listen
FIBER_MSG_TIMEOUT | Timeout after which relay messages are dropped. See [here](../operating_modes) for more info.

<br>