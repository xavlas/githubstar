# 🌟 GitHub Trends

Une application web moderne pour suivre les dépôts GitHub les plus populaires du jour, de la semaine, du mois ou de l'année.

## ✨ Fonctionnalités

- **Tendances en temps réel** : Utilise l'API GitHub Search pour afficher les dépôts les plus étoilés.
- **Filtrage intelligent** : Par période et par langage de programmation.
- **Mise à jour automatique** : Les données se rafraîchissent toutes les 10 minutes.
- **Design Premium** : Interface sombre, réactive et élégante avec TailwindCSS 4.
- **Prêt pour le déploiement** : Support Docker et scripts automatisés.

## 🚀 Installation Locale

1. Installez les dépendances :
   ```bash
   npm install
   ```
2. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

## 🐳 Déploiement Docker (Local)

Pour lancer l'application dans un conteneur Docker sur votre machine :
```bash
./deploy.sh
```
L'application sera accessible sur `http://localhost:8080`.

## 🍓 Déploiement sur Raspberry Pi

Le projet est optimisé pour tourner sur Raspberry Pi (recommandé : RPi 3, 4 ou 5 avec Docker installé).

1. Ouvrez `deploy-to-pi.sh` et vérifiez les variables `PI_USER` et `PI_HOST`.
2. Lancez le déploiement distant :
   ```bash
   ./deploy-to-pi.sh
   ```

Le script va :
- Synchroniser les fichiers source vers votre Pi via `rsync`.
- Lancer le build Docker directement sur le Pi (pour garantir la compatibilité architecture ARM).
- Démarrer le service en arrière-plan.

### Prérequis sur le Raspberry Pi :
- Docker et Docker Compose installés.
- Accès SSH activé.
