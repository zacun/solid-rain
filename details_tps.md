# TPs M1IF13 Web Avancé

# Binôme
- Paulin Bat
- Léo Henini

# TP1 - Framework côté serveur
La totalité du TP a été réalisée.

Les fonctions login(), logout() et authenticate() ont été implémentées.

## Partie REST
Pour la partie REST, un CRUD classique a été réalisé pour faire des opérations sur un et un seul utilisateur. (Il n'y a pas de getAllUsers() par exemple).
Pour la mise à jour d'un utilisateur (requêtes PUT), si le login et le password ne sont pas renseignés (chaîne vide -> ""), aucune erreur n'est renvoyée mais aucune modification n'est effectuée (comme si l'utilisateur n'avait rien mis à jour...).

## Partie négociation de contenus
Pour la négociation de contenus, tout est fonctionnel (HTML, XML, JSON, urlencoded).

## Partie gestion des erreurs
Pour la gestion des erreurs, nous avons choisi de directement les gérer dans les méthodes des controllers avec des `throw new ResponseStatusException()`

## Déploiement
Déploiement sur la VM à l'adresse : http://******:8080/spring-boot/

# TP2 - Spring Boot plugins

## Partie documentation
Nous avons fait la partie documentation. Les choses essentielles à la bonne compréhension de l'API ont été ajoutées, afin d'avoir un comportement et une utilisation les plus faciles possible.

## Partie tests
Des tests ont été effectués sur les deux controlleurs.
Pour le controlleur OperationController, les tests se trouvent dans le fichier OperationControllerTests. On y trouve le scénario suivant :
- Connexion d'un utilisateur présent initialement (créé dans la classe UserDAO).
- Verification de son token à l'aide de la requête authenticate .
- Déconnexion de cet utilisateur.

Pour le controlleur UserController, les tests se trouvent dans le fichier UsersControllerTests. On y trouve le scénario suivant :
- Création d'un user avec le format de données URL-encoded et vérificatino de la réponse.
- Création d'un deuxième user avec le format de données JSON et vérificatino de la réponse.
- Récupération des informations de l'utilisateur "paulin" en JSON et vérification de la réponse.
- Récupération des informations de l'utilisateur "Bob" en XML et vérification de la réponse.
- Modification des informations de l'utilisateur "paulin" avec le format de données JSON et vérification de la réponse.
- Récupération des informations de l'utilisateur "paulin" avec le format de données HTML et vérification de la réponse.

## Partie CORS
CORS a été ajouté au projet. Il est fonctionnel (tests sur Postman et sur le fichier client html fourni). 

## Liens
- Lien vers le fichier .yaml du dépôt [ici](users-api.yaml)
- Lien vers le Swagger généré par Spring et déployé sur votre VM [ici](http://******:8080/spring-boot/swagger-ui.html)

# TP3 - JavaScript côté serveur
Le projet a été initialisé correctement.
La partie identification/authentification du token avec axios a été commentée car nous attendons l'interface client pour réaliser/tester celle-ci.

## Partie serveur
### Fichiers statiques
Un dossier public a été créé dans lequel on peut y placer des fichiers qui sont ensuite servis correctement sur `/static`.
Le middleware de gestion des erreurs 404 a été ajouté.

### Contenus dynamiques
- Un dossier `models` a été créé, il contient des fichiers pour chaque resource du jeu (météorite, user (player/admin), zrr et resources (sera très probablement supprimé prochainement)).
- Un fichier `game.js` à la racine, il contient la classe `Game`. Comme son nom l'indique, cette classe contient toutes les informations du jeu (ZRR, TTL par défaut, joueurs, météorites, ... ainsi que les fonctions nécessaires au bon fonctionnement des requêtes).
Une variable globale `global._GAME` a été créée pour contenir l'objet Game créé avec la route `/admin/start` afin de partager l'instanciation de la partie avec tous les fichiers du serveur.
- Un dossier `routes` contenant deux fichiers :
    - `resources.js` qui contient les routes principales demandées pour obtenir les resources du jeu et mettre à jour l'image et la position d'un joueur.
    - `admin.js` contenant les routes admin pour démarrer une partie, ajouter une météorite avoir des informations sur un joueur ou une météorite.
Les routes ont été créées avec l'interface router d'express puis les routers ont été importés dans `index.js` (point d'entrée du serveur express).

# TP4 - prise en main de la stack JS (suite)

## Fonctionnement du client
Toutes les fonctionnalités ont été implémentées et fonctionnent. 

## Tests
Les tests ont été réalisées dans le dossier `api`. Nous avons utilisé `jasmine` ainsi qu'`axios` pour effectuer les requêtes au serveur Express. Pour les requêtes qui utilisent le serveur Spring, nous avons démarré "à la main" le serveur Spring en local pour pouvoir effectuer les tests.
Ces tests portent sur l'ensemble des routes exposées par le serveur Express.

## Packaging de votre application et chaîne de build
Nous avons réussi à packager notre application à l'aide de Webpack. Nous avons également mis en place une chaîne de build qui regroupe une validation d'ESLint, un ensemble de tests effectués sous Jasmine, ainsi que le packaging de l'application. Pour lancer cette chaîne de build, on peut utiliser `npm run build` lorsque l'on travaille en local. Lors du déploiement, on utilise `npm run buildprod` afin d'utiliser un fichier de configuration de Webpack différent.

## Déploiement
L'application a été déployée à l'adresse suivante : `https://******/game/admin`.
- Amélioration : 
    Actuellement, nous rencontrons un problème concernant (nous pensons) le déploiement. En effet, lors du déploiement, Webpack va utiliser le bon fichier de configuration (`webpack.config.prod.js`) et va donc prendre le bon fichier JS en entry_point (`index_prod.js`). Cependant, lors des tests sur la VM, le client d'administration va requêter l'adresse `localhost:3376`, pour une raison qui nous échappe.

# TP5 & 6 - Framework côté client

## Mise en place de Vue.js
Le projet Vue.js a été correctement initialisé. Comme attendu nous utilisons aussi Vue Router et Vuex pour le store.
L'arborescence du projet est simple, les fichiers se trouvent dans un dossiers `src`, ce dernier comprend les dossiers :
- `api-client` comprenant les requêtes `axios` vers le serveur express
- `assets` avec l'icône des météorites
- `components` comprenant `Map.vue` & `User.vue`
- `views` avec `Home.vue, Login.vue et UserInterface.vue`
- `router` avec la configuration de Vue Router
- `store` avec les fichiers de configuration de Vuex

### Arborescence des routes 
- Une page `Home` (`/`) avec les règles du jeu
- Une page `Login` (`/login`) avec un formulaire de connexion
- Une page UserInterface (`/ui`) qui comprend les composants `Map.vue` (gère la map leaflet) et `User.vue` (gère les informations utilisateurs)

### Vuex (Store)
L'état (state) comprend :
- une variable `isConnected`
- un objet `zrr`
- un objet `player` avec les infos du joueur (id, login, image, ...)
- un objet `meteorites` comprenant toutes les météorites du jeu en cours avec leur `id` et leur `impact` (position)
- un objet `otherPlayers` avec les informations des autres joueurs...

L'état est mis à jour soit via des actions soit directement dans des composants `.vue` vie des `commit()`.

Les mutations : nos mutations permettent donc de modifier les différents objets du store. Mais nous n'utilisons pas de fonction pour chaque valeur. Par exemple, nous avons une mutation `setPlayer()` qui permet de mettre à jour le player. Il faut donc envoyer un `player` entier (id, image, position, ...) à la mutation. On peut aussi envoyer des objets incomplets  si on ne possède pas encore toutes les informations (par exemple `{ login: lelogin }` en tant que paramètre `player` lors de la connexion avant de récupérer les autres informations).

Les actions : nos actions font appel aux routes `axios` puis `commit()` les valeurs via une fonction de callback.

Pas de getters utilisés pour le moment.

Le store est "synchronisé" avec le `localStorage` (à chaque appel vers l'api du jeu, nous mettons à jour le `localStorage`).

## Mis de côté
Toutes les fonctionnalités ont normalement été implémentées sauf :
- Détection d'une météorite à moins de 2m de l'utilisateur
- Décrémentation & synchronisation du TTL côté serveur et client

## Déploiement
Des problèmes de déploiement que nous n'arrivons pas à résoudre sont survenus. Il s'agit notamment des tests quui échouent avec des erreurs `Async function timed out after 5000ms` car les tests n'arrivent pas à requêter le serveur spring.
Nous avons décider de mettre de côté le déploiement et de continuer le projet en local où tout fonctionne pour le moment.

# TP7 - Web Mobile
TP réalisé bien après la date de rendu de base, notamment par manque de temps (projet POM...).
Tout a été implémenté sauf la partie "En bonus".

## Capteurs et géolocalisation
La géolocalisation a été implémentée. Elle intervient à deux endroits :
- Dans le composant `UserInterface.vue` avec la fonction `getCurrentPosition()` afin de récupérer la position une première fois.
- Dans le composant `Map.vue` avec la fonction `watchPosition()` pour mettre à jour la position du joueur et mettre à jour les infos sur la carte.

## Vibreur
Une fenêtre modale a été mise en place. Celle-ci se déclenche :
- Lorsqu'on meurt (sortir de la zrr, prendre une météorite Bêta-X, ttl à 0).
- Lorsqu'on gagne (ttl à -1 -> une météorite Astra-X a été ramassée).
- Lorsqu'on récupère une météorite Astra-Z.

Le téléphone vibre lorsqu'on meurt ou qu'on gagne.

## Fonctionnalités des TPs précédents
Des fonctionnalités avaient été mises de côté dans les TP5 & 6. Nous les avons implémentées ici.
- Détection d'une météorite à moins de 2m de l'utilisateur
- Détection si le joueur sort de la zrr
- Décrémentation du TTL côté client seulement. Par manque de temps, nous avons décidé de décrémenter le TTL côté client seulement, il n'y pas de synchronisation avec serveur.

Toutes ces fonctionnalités fonctionnent en local.

# TP8 - Progressive Web Apps

## Web App Manifest
Le `manifest.json` est généré via la propriété `pwa` dans `vue.config.js`.
L'application est bien reconnue comme une PWA, nous pouvons "l'installer" (créer un raccourcis) sur mobile via les navigateurs.

## Notifications
Des notifications sont générées via un `watch()` sur le TTL dans le composant `User.vue` lors de la fin d'une partie (perdue ou gagnée).

## Mise en cache
Les services workers ont été mis en place avec les fichiers mis à notre disposition dans l'énoncé du TP8. Nous n'avons pas plus touché que ça à cette feature. Nous avons implémenté le strict minimum afin de tester.

A savoir : vu que les services worker ne fonctionnes qu'en HTTPS, il faut "supprimer" cette partie pour lancer en local et éviter d'avoir des erreurs javascript qui pourraient bloquer d'autres scripts.

## Déploiement
Des fichiers `.env.production` et `.env.development` ont été créés afin de faciliter les builds.
Le déploiement a été réparé :
- https://******/ pour le client Vue
- https://******/game/admin pour le client admin
- https://******/game/api pour les requêtes vers l'API Express
- http://******/spring-boot pour les requêtes vers spring (depuis express)
- https://******/spring-boot pour les requêtes spring (depuis le client Vue)