# Skyr

Skyr is an Icelandic cultured dairy product originating in Scandinavia. It has the consistency of strained yogurt, but a milder flavor. Skyr can be classified as a fresh sour milk cheese, similar to curd cheese consumed like a yogurt in the Baltic states, Germany and Russia. It has been a part of Icelandic cuisine for centuries.

## Requirements

- Node.js

## Preparation

Place your SSL certificate (`certificate.pem`) and private key (`key.pem`) in the [ssl](./backend/src/ssl) directory.

For development purposes you can [generate a self-signed certificate](https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTPS-server/).

## Development

From the root directory of this project execute the following commands:

1. `npm run frontend-dev`
2. `npm run backend-dev`

Application should now be available locally with live reloading feature.

## Production

From the root directory of this project execute command: `npm run start`.
