# Pointage sémantique dans un environnement 3D

Titouan Bizet et Julien Reig

## Introduction

Une version en ligne est disponible à l'adresse suivante : [https://capitrain.julien-reig.fr/](https://capitrain.julien-reig.fr/)

Le repository est disponible à l'adresse suivante : [https://github.com/pH0xe/IMT-semantic-pointing](https://github.com/pH0xe/IMT-semantic-pointing)

## Installation

### Prérequis

- NodeJS (version 14+), la version 18 ou 20 est recommandée.

### Installation

- Cloner le repository (ou télécharger le zip)
- Se placer à la racine du projet
- Installer les dépendances avec `npm install`
- Lancer le serveur avec `npm run dev`
- Ouvrir un navigateur à l'adresse `http://localhost:5173/`

### Compilation

Si vous souhaitez compiler le projet, il est possible de le faire avec la commande `npm run build`. Les fichiers compilés seront disponibles dans le dossier `dist`.

## Utilisation

### Contrôles

- La manipulation du pointeur 3D se fait de 2 manières :
  - Avec un gamepad (manette de jeu) : le joystick gauche permet de déplacer le pointeur dans le plan XY, le joystick droit permet de déplacer le pointeur sur l’axe Z.
  - Avec le clavier : les touches ZQSD permettent de déplacer le pointeur dans le plan XY, les touches A et E permettent de déplacer le pointeur sur l’axe Z.
    La manette de jeu est recommandée pour une meilleure expérience.
    Le prototype a été testé avec une manette de Xbox One, le fonctionnement n'est pas garanti avec d'autres manettes.

### Interface

L'interface est composée de 2 parties :

- Un encart en haut a gauche permettant plusieurs action :
  - <kbd>Régénérer les formes</kbd> : Regénéner des formes dans la scène (cela supprime les formes existantes).
  - <kbd>Inverser l'axe de profondeur</kbd> : Inverser l'axe du joystick pour la profondeur. Sous certains navigateurs (Firefox ESR), les gamepads ne sont pas gérés correctement. Si c'est le cas, il est nécéssaire d'inverser l'axe du joystick pour la profondeur.
  - <kbd>Pointage sémantique</kbd> : Activer ou désactiver le pointage sémantique.
- La scène 3D, composée de 3 plans (XY, XZ, YZ) et de formes géométriques (Croix). Les formes géométriques sont générées aléatoirement à chaque chargement de la page, ou avec le bouton "Régénérer les formes". Le nombre de formes générées est défini dans le fichier `src/scene.ts`. Il est possible de modifier ce nombre.
