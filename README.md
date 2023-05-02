# Ugram - An Instagram-like application

## Tech
* Framework pour le frontend: Vue.js + Quasar
* Langage pour le backend: Javascript
* Framework pour le backend: Express.js + Docker + Mongoose
* Base de données: MongoDB
* Outils : Docker + VuePress pour la documentation
* Déploiement : Peut être déployé sur n'importe quel serveur avec Docker

## How to run

Voici les étapes à suivre pour executer le projet.

Vous devez avoir Docker Engine (Docker desktop), docker-compose et le package manager `npm` sur votre ordinateur.


- Exécutez `run.ps1` dans la racine du projet.

Le projet tourne sur le port 3030.

## Screenshots

![Screenshot 1](./screenshots/login.png?raw=true "Login")
![Screenshot 2](./screenshots/home.png?raw=true "Home")
![Screenshot 3](./screenshots/post.png?raw=true "Post")
![Screenshot 4](./screenshots/messages.png?raw=true "Messages")
![Screenshot 5](./screenshots/docs.png?raw=true "Docs")

## Features (examples)

Aller sur la page `/login` ou `/register`, il est possible d'utiliser Google pour s'authentifier sur l'application.

###  Création d'un compte dans l'application.

Aller sur la page `/register`, l'utilisateur doit remplir un formulaire pour pouvoir se créer un compte. Ce nouveau compte ne peut pas avoir le même pseudo ou la même adresse email qu'un autre compte.

### Déconnection de l'application

Aller sur le profil de l'utiliateur, cliquer sur le bouton `Settings`. Une modale s'ouvre avec un bouton permmettant de se déconnecter de la session en cours.

### Suppression d'un compte

Aller sur le profil de l'utilisateur, cliquer sur le bouton `Settings`. Une modale s'ouvre avec un bouton permettant de supprimer le compte de l'utilisateur connecté.

### Recherche d'autres utilisateurs

Aller sur la page `/searchUsers`, une barre de recherche en haut de la page permet de rechercher les pseudos des utilisateurs inscrits sur l'application. Il est possible de cliquer sur un pseudo pour voir le profil d'un utilisateur.

### Recherche de posts contenant un mot clé ou une description précise

Aller sur la page `/search`, une barre de recherche en haut de la page permet de rechercher les posts contenant le hastag si un '#' est détécté ou la description si le '#' est absent.


## Hosted Documention

Une documentation est hostée sur le port 5173 du serveur.

Elle inclut toutes les informations sur les features.