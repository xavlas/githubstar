#!/bin/bash
echo "🚀 Déploiement de GitHub Trending App..."

# Détecter la commande docker compose
if command -v docker-compose &> /dev/null; then
    DOCKER_CMD="docker-compose"
else
    DOCKER_CMD="docker compose"
fi

# Nettoyer et recréer pour être sûr que tout est à jour
echo "🧹 Nettoyage des anciens conteneurs..."
$DOCKER_CMD down

echo "🏗️ Reconstruction et lancement..."
$DOCKER_CMD up -d --build --force-recreate

echo "✨ Déploiement terminé ! L'application tourne sur http://localhost:8080"
