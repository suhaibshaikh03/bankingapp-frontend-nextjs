# Dockerizing the Next.js Frontend for Development and Production

## Overview
This document explains how to build and deploy the Next.js frontend application for both development and production environments.

## Prerequisites
- Google Cloud SDK installed and configured (for production deployment)
- Docker installed locally
- A Google Cloud Project with Cloud Run API enabled (for production deployment)

## Docker Build Stages

The Dockerfile contains multiple build stages:
- `dev`: For development with hot-reloading using `npm run dev`
- `runner`: For production deployment

## Development Setup

### 1. Navigate to the frontend directory:
```bash
cd bankingapp-frontend-nextjs
```

### 2. Build the development Docker image:
```bash
# Build with default backend URL pointing to localhost
docker build --target dev -t banking-frontend-dev .

# Or specify a custom backend URL
docker build --target dev \
  --build-arg NEXT_PUBLIC_API_URL=http://host.docker.internal:8080 \
  -t banking-frontend-dev .
```

### 3. Run the development container:
```bash
# Expose port 3000 and mount current directory for live reload
# The dev container runs as non-root user for security
docker run -p 3000:3000 -v $(pwd):/app -w /app banking-frontend-dev
```

Note: On Windows, you might need to use `%cd%` instead of `$(pwd)` for volume mounting.

### 4. Alternative: Run with different backend URL:
```bash
# Run with a different backend URL without rebuilding the image
docker run -p 3000:3000 -v $(pwd):/app -w /app -e NEXT_PUBLIC_API_URL=http://host.docker.internal:8080 banking-frontend-dev
```

## Production Deployment

### 1. Build the production Docker image:
```bash
# Replace YOUR_PROJECT_ID with your actual Google Cloud Project ID
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://bankingapp-backend-580700595487.europe-west1.run.app \
  -t gcr.io/YOUR_PROJECT_ID/banking-frontend .
```

Example:
```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://bankingapp-backend-580700595487.europe-west1.run.app \
  -t gcr.io/my-banking-project/banking-frontend .
```

### 2. Configure Docker to use gcloud as a credential helper:
```bash
gcloud auth configure-docker
```

### 3. Push the image to Google Container Registry:
```bash
docker push gcr.io/YOUR_PROJECT_ID/banking-frontend
```

### 4. Deploy to Google Cloud Run:
```bash
gcloud run deploy banking-frontend \
  --image gcr.io/YOUR_PROJECT_ID/banking-frontend \
  --platform managed \
  --region YOUR_REGION \
  --allow-unauthenticated \
  --set-env-vars="NEXT_PUBLIC_API_URL=https://bankingapp-backend-580700595487.europe-west1.run.app" \
  --port 3000
```

Example:
```bash
gcloud run deploy banking-frontend \
  --image gcr.io/my-banking-project/banking-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="NEXT_PUBLIC_API_URL=https://bankingapp-backend-580700595487.europe-west1.run.app" \
  --port 3000
```

### 5. Alternative: Deploy with a custom domain (optional):
```bash
gcloud run deploy banking-frontend \
  --image gcr.io/YOUR_PROJECT_ID/banking-frontend \
  --platform managed \
  --region YOUR_REGION \
  --allow-unauthenticated \
  --set-env-vars="NEXT_PUBLIC_API_URL=https://bankingapp-backend-580700595487.europe-west1.run.app" \
  --domain YOUR_CUSTOM_DOMAIN
```

## Environment Variables

The Docker image supports the following build-time and runtime environment variables:

- `NEXT_PUBLIC_API_URL`: The URL of the backend API service (defaults to `http://host.docker.internal:8080` for development, `https://bankingapp-backend-580700595487.europe-west1.run.app` for production)
- `PORT`: The port on which the Next.js app will listen (defaults to `3000`)
- `NODE_ENV`: The environment mode (defaults to `development` for dev stage, `production` for runner stage)

## Important Notes

1. **Development Environment**: The `dev` build stage allows for live reloading and development with `npm run dev`. Use this for active development.

2. **Backend Connection**: During development, if connecting to a backend running on the host machine, use `http://host.docker.internal:8080` as the backend URL.

3. **Environment Configuration**: The `NEXT_PUBLIC_API_URL` environment variable should point to your deployed backend service on Google Cloud Run for production.

4. **Security**: The default deployment allows unauthenticated requests. Adjust the `--allow-unauthenticated` flag based on your security requirements.

5. **CORS Configuration**: Ensure your backend service allows requests from the frontend origin.

6. **Health Checks**: The Next.js application will respond to health checks on the root path (`/`).

7. **Scaling**: By default, Cloud Run will scale your service from 0 to the maximum instances allowed by your project quotas.

## Troubleshooting

### Common Issues:

1. **Build Failures**: If the Docker build fails, ensure all dependencies are correctly listed in `package.json`.

2. **Runtime Errors**: Check the Cloud Run logs in the Google Cloud Console for detailed error messages.

3. **API Connection Issues**: Verify that the `NEXT_PUBLIC_API_URL` environment variable is correctly set and accessible from the deployed service.

4. **Development Connection Issues**: When running the dev container, ensure the backend service is accessible at the specified URL. On Windows, use `host.docker.internal` to reach services on the host machine.

### Useful Commands:

- View service logs: `gcloud run services logs read banking-frontend --platform managed --region YOUR_REGION`
- Get service URL: `gcloud run services describe banking-frontend --platform managed --region YOUR_REGION --format 'value(status.url)'`
- Update environment variables: `gcloud run services update banking-frontend --platform managed --region YOUR_REGION --set-env-vars="NEXT_PUBLIC_API_URL=https://new-backend-url"`

## Updating the Service

To update your deployed service with a new version:

1. Build and push the new image with a new tag or latest
2. Redeploy using the same `gcloud run deploy` command, which will update the service with the new image