# Thumbnail API

## Description

This is a simple API that allows you to upload an image and get a thumbnail of it.
Uses Nestjs, Typescript, Docker, Kubernetes, Bull (for queueing) and Sharp (for image rpocessing).

You can check out the API documentation at http://localhost:3000/api using Swagger or check out the following table:

| Endpoint | Method | Description |
| --- | --- | --- |
| `/thumbnail` | `POST` | Generates a thumbnail from an uploaded image file |
| `/thumbnail/:jobId` | `GET` | Retrieves the thumbnail with the specified job ID |
| `/job/list` | `GET` | Returns a list of all jobs |
| `/job/:id` | `GET` | Returns the job with the specified ID |

**Assumptions:**

- The image will be uploaded as a multipart form data
- The image will be uploaded as a file with the key `image`
- The image won't be bigger than 2MB
- The image will be a valid image format (png, jpg, jpeg, webp, tiff, gif, svg)
    
**Why Nestjs?**

For the backend I decided to use Nestjs. it is a great choice for building scalable and maintainable server-side applications. It is built on top of Node.js and provides a modular architecture that allows you to easily organize your code into reusable modules. NestJS also provides a powerful dependency injection system. Additionally, NestJS has built-in support for TypeScript.

**Why Bull?**

I decided to use Bull for queueing because it's a simple and easy to use library that allows us to use Redis as a queueing system. It has a simple API and it's easy to integrate with Nestjs.

## Requirements

- Node.js
- Docker
- Kubernetes (optional)
    
### Environment variables (optional)

You need to have a `.env` file in the root of the project with the following variables:

```bash
export REDIS_HOST=<redis-host>
export REDIS_PORT=<redis-port>
```

This is only required if you want to run the app locally without docker or k8s.

## Installation

```bash
$ npm install
```

## Running the app locally

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Running the app in docker

Make sure you have docker installed and running. Then run the following command:

```bash
$ docker-compose up
```

## Running the app in k8s

This assumes you have a k8s cluster running and kubectl configured to point to it.
The helm charts asume that ypu have the `thumbnail-api` image build with the name `thumbnail-api_api` (default name from docker-compose).
  
```bash
$ helm install thumbnail-api ./k8s/thumbnail-api
```

That will create a deployment and a service for the app with 5 replicas. Aside from that, it will create redis instances without any authentication. This is only for testing purposes.

Get the port from the service in order to access the app:

```bash
$ kubectl get services
```

## Test

```bash
# unit tests
$ npm run test
```

## Next Steps
### Monitoring

- Add Prometheus and Grafana to monitor the app and the queue
- Add a liveness probe to the app
- Add a readiness probe to the app
- Add a liveness probe to the queue
- Add a readiness probe to the queue

For the monitoring of the app, we can use Prometheus and Grafana. We assume we have a Grafana instance running and we have a Prometheus datasource configured.

The app will expose a `/metrics` endpoint for prometheus to scrape.

At the same time we will have a `/health-check` endpoint that will be used by the k8s liveness probe.

### Storage

- Add a storage service to store the images and thumbnails

For the storage of the images and thumbnails, we can use a service like S3 or Minio. We can use the `@nestjs/aws-s3` package to integrate with S3.
As of now I din't have time to set up volumes in k8s, so the images and thumbnails are stored in the container. This is not ideal because if the container dies, we lose the images and thumbnails.
Also since we have multiple replicas of the app in k8s, we can't guarantee that the image will be in the same container when we try to retrieve the thumbnail.