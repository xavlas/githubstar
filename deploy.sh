#!/bin/bash
echo "Deploying GitHub Trending App via Docker..."
if command -v docker-compose &> /dev/null; then
    docker-compose up -d --build
else
    docker compose up -d --build
fi
echo "Deployment complete! Application is running at http://localhost:8080"
