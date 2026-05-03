#!/bin/bash
echo "Deploying GitHub Trending App via Docker..."
docker-compose up -d --build
echo "Deployment complete! Application is running at http://localhost:8080"
