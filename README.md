# BIKAIR-CLIENT APP

Application destinée au client de Bik'Air.

## Installation du projet

Pour installer votre environnement de travail il est conseillé de suivre les instructions de cette page :
https://reactnative.dev/docs/environment-setup

## Lancement du projet en local

Assurez-vous d'avoir un appareil physique branché et disponible pour le développement. Il est déconseillé d'utiliser une
machine virtuelle pour émuler un téléphone, car beaucoup de fonctionnalité seront manquante pour assurer des tests de
qualité.

- `npm start`
- `npx run android`
- `npx run ios`

## Mise en production

### Global

1. Mettre à jour le numéro de version du projet dans le fichier `package.json`
2. Bien mettre à jour le fichier `.env` avec les bonnes valeurs d'environnement (notamment les API-KEYs)
3. `npm start` pour reset le cache npm.
4. Faire les étapes spécifiques en fonction du bundle à créer pour iOS ou Android.

### Android

Dans le fichier `/android/app/build.gradle` :

- mettre à jour android.defaultConfig.versionCode
- mettre à jour android.defaultConfig.versionName

Puis créer le pacquet en fonction de l'environnement cible :

- Pour la production : `cd android && ./gradlew :app:bundleProductionRelease`
- Pour staging : `cd android && ./gradlew :app:assembleStagingRelease`

Le résultat du build se trouve dans `/android/app/build/output`

- `apk/staging/release` pour staging
- `bundle/productionRelease` pour la prod

Une fois le packet créer, il peut être mis sur Firebase pour distribuer au autre personne de Bik'Air.  
Pour le bundle de production, il peut également être mis sur le play store pour préparer la mise en production.

### iOS

Tout se fait sur XCode. Ouvrez avec XCode le `/ios/bikairClient.xcworkspace`

En fonction de l'environnement, on va modifier les "targets" suivants :

- Pour la production : `bikairClient`
- Pour staging : `bikairClient-Staging`

Il faut modifier les informations de "Build" et "Version".
En suite pour générer le ".ipa" il faut :

1. Dans la barre en haut sélectionner la bonne target
2. À côté sélectionner "Any iOS device (arm64)"
3. Lancer le build dans les menus tout en haut avec "Product" > "Archive"

Une fois le build terminé il y a la fenêtre d'archive qui s'ouvre.  
De là, on peut soit faire un build "Ad Hoc" pour le mettre sur Firebase (prod et staging), soit téléverser vers
l'app store connect pour préparer la mise en production.

## Architecture du projet

Decription des différents dossier et ce qu'il contiennent comme fichier pour le projet.

### assets

Dossier contenant les images, les fonts et autre élément qui compose l'application et que ne soit pas du code.

### components

Dossier comprenant les composant unitaire et réutilisable de l'application.
On retrouve par exemple des implémentations de bouton, de menu, des label ou autre élément d'affichage simple et réutilisable.

### containers

Dossier comprenant les groupe de composant générique et réutilisable comme la carte, le détail des marqueur ou autre.

### contexts

Dossier des context react pour exposer une interface pour un provider.

### hooks

Hooks react de l'application. On retrouve ici la définition des différents hook crée pour l'application.

### models

Dossier contenant les classe et interface décrivant les différents type et modèles de l'application.
Ce qui se trouve ici sont les modèles spécifique à l'application qui n'ont pas d'utilité ailleurs.
Le cas échéant le modèle sera à définir au niveau de la librairie @bikairprojet/shared.

### native-modules

Déclaration et interface avec les modules natifs développée avec iOS et Android.

### offers

Interfaces pour la popup qui s'ouvre à l'ouverture de l'application.

### permissions

Ensemble des fonction pour vérifier et demander l'accès au différentes permission pour le fonctionnement de l'application (Ble, GPS, ...)

### provider

Définition des provider react pour l'application.

### redux

Ensemble des reducers et fichier de configuration pour redux.

### screens

Dossier contenant les class décrivant les différents écrans utilisé par le router.
Chaque classe doit de ce dossier doit correspondre à un seul écran et avoir ses propriété au type de RouterProps correspondant
définit dans `/src/stacks/types.ts`

### services

Ce dossier comporte les fonctions utilisé par les différents composant de l'application.

### stacks

Dossier contenant la definition et la configuration des différentes routes de l'application.

### translation

Ce dossier regroupe les fichiers de translation locale à l'application et la configuration de la traduction.

### trip-steps

Dosser comportant les différents écran qui compose les étapes d'un trajet au commencement et à la fin de celui-ci.

## Build IOS assets

- `npx react-native bundle --dev false --entry-file index.js --assets-dest='./ios/' --bundle-output ios/main.jsbundle --platform ios`
