## Docker

Fibers is compatible with docker. You will want to mount the `/app/config` directory
 to change and persist the config files.

For security reasons, it is recommended to run the fibers server behind a nginx reverse proxy
 with TLS encryption enabled.