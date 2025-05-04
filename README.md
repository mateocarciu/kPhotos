# kPhotos

kPhotos est une alternative à Google Photos, développée avec Nuxt 3 et Vue.js. Cette application permet de gérer vos fichiers, photos et vidéos de manière intuitive et sécurisée

## Prérequis

- **Scopes nécéssaires du token :** user_info & drive

- [Node.js](https://nodejs.org/) (version 16 ou supérieure)
- [npm](https://www.npmjs.com/) ou un autre gestionnaire de paquets comme Yarn, pnpm ou Bun.

## Fonctionnalités

- **Accés aux drives**
- **Affichage des fichiers** : Visualisez vos fichiers avec des détails comme la taille, le type et la date de modification. Contrairement à l'application web de kDrive, cette application récupère tous les médias du drive (comme le fait l’application mobile) afin de les afficher dans leur intégralité.
- **Téléchargement :** Téléchargez vos images et vidéos de manière simple
- **Filtres avancés** : Filtrez vos fichiers par type, date, pertinence ou ordre.
- **Support multilingue** : Interface disponible en plusieurs langues (coming soon).
- **Mode sombre** : Basculer entre les thèmes clair et sombre.
- **Sécurité** : Le token est sotocké côté serveur en httpOnly.

## Installation

Clonez le dépôt et installez les dépendances :

```bash
git clone https://github.com/mateocarciu/kPhotos.git
```

```bash
cd kPhotos
```

```bash
yarn install
```

Démarrage du serveur de développement

```bash
yarn dev
```

Build pour la production :

```bash
yarn build
```

Prévisualisez localement la version de production :

```bash
yarn preview
```
