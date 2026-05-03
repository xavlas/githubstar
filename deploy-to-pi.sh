#!/bin/bash

# Configuration - Modifiez ces valeurs selon votre setup
PI_USER="xavier"
PI_HOST="10.0.0.228" # Ou l'adresse IP de votre Pi
PI_PATH="~/githubstar"

echo "🚀 Préparation du déploiement sur Raspberry Pi ($PI_HOST)..."

# Vérification de rsync
if ! command -v rsync &> /dev/null; then
    echo "❌ Erreur: rsync n'est pas installé sur votre machine."
    exit 1
fi

echo "📦 Synchronisation des fichiers vers le Pi..."
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'dist' ./ $PI_USER@$PI_HOST:$PI_PATH

echo "🐳 Lancement de Docker sur le Raspberry Pi..."
ssh $PI_USER@$PI_HOST "cd $PI_PATH && chmod +x deploy.sh && ./deploy.sh"

echo "✨ Déploiement terminé !"
echo "🌐 L'application est disponible sur http://$PI_HOST:8080"
