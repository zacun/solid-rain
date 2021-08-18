# Projet non fonctionnel
Le projet actuel ne fonctionnera pas car des URLs et des token d'API ont été enlevés par sécurité.
Ce repository est seulement là afin de donner accès au code source.

# M1IF13 Web Avancé
# Binôme
- Paulin Bat
- Léo Henini

# Détails des TPs
Pour accéder aux détails de la réalisation de chaque TP, vous pouvez lire ce fichier markdown : [details_tps.md](details_tps.md).

# Compte rendu
Dans l'ensemble, les TPs se sont bien déroulés. Nous avons réussi à implémenter toutes les fonctionnalités demandées (sauf bonus). Cependant, certaines possèdent quelques bugs.

Pensez à bien réaliser `les npm install` dans les dossiers `/admin`, `/api` & `/client`.
Ainsi qu'un `mvn package` dans `/users`.

## Les URLs
/!\ Depuis le TP8 ces URLs sont automatiquement chargées via des fichiers `.env.*`. Cependant, il faut tout de même changer "à la main" les variables sur les fichiers :
- `/api/index.js` (changer la variable `global.apiPath` avec l'url souhaitée pour requêter le serveur spring uniquement)
- `/api/spec/test.spec.js` (ligne 113, là aussi mettre la même URL que dans `global.apiPath`)

/!\ Il est possible que ce soit un peu plus problématique avec des tags antérieurs car nous n'utilisions pas de variables d'environnement et/ou globale...Il faudrait donc changer toutes les URLs à la main (notamment pour remplacer des URLs localhost vers des URLs de VM car le déploiement n'a pas fonctionné (et a donc été mis de côté) pendant un moment (depuis le début des TPs front-end environ)).

Sur la VM :
- https://******/ pour accéder au client Vue via un navigateur
- https://******/game/admin pour accéder au client admin via un navigateur
- https://******/game/api pour les requêtes vers l'API Express
- http://******/spring-boot pour les requêtes vers spring (depuis le serveur express)
- https://******/spring-boot pour les requêtes spring (depuis le client Vue)

En local :
- http://localhost:9000 pour le client Vue (lancez avec `npm run serve` depuis le dossier `/client`)
- http://localhost:3376 pour l'api express (lancez avec `node index.js` depuis le dossier `/api`)
- http://localhost:3376/static pour le client admin
- http://localhost:8080 pour l'api spring (lancez `mvn spring-boot:run` depuis le dossier `/users`)

## Les fonctionnalités
### Spring
Toutes les routes du serveur Spring sont normalement fonctionelles.
Swagger est disponible à cette URL : http://******/spring-boot/swagger-ui.html

### Express
Le fichier principal est `/api/index.js`
Les routes se trouvent dans deux fichiers différents :
- `/api/routes/admins.js`
- `/api/routes/resources.js`
Elles sont toutes fonctionelles, certaines utilisent le middleware `authentification` pour vérifier le token.
### Tests avec jasmine
Tous nos tests se trouvent dans le dossier `/api/spec/`.
Le serveur Spring doit être lancé.

### Client admin
Via le client admin il est possible de :
- placer la ZRR via 2 points ((re)créé une nouvelle instance de `global.GAME` qui contient toutes les données du jeu)
- set le TTL
- lancer une météorite (la première météorite lance le jeu en créant le joueur `prof`)
- Ajouter un joueur (seul le pseudo est à ajouter. Le mot de passe sera `test` (sauf pour prof qui a aussi `prof` en mdp))
- changer le pseudo et l'image d'un joueur
- la map se met à jour toutes les 5 secondes

### Client Vue
- consulter les règles du jeu via la page d'accueil
- se connecter via la page login
- changer son pseudo et son image
- voir la ZRR et les météorites sur la map
- se déplacer via la géolocalisation et récupérer des météorites
- suivre le niveau du TTL

## Les bugs connus (..., non implémentés, oublis, ...)
Bien que nous soyons fiers d'avoir implémenter la quasi totalités des fonctionnalités, certaines d'entre elles ne fonctionnent pas comme prévu (notamment sur la VM).

- Non suppression des utilisateurs dans Spring. Il faut donc redémarrer le serveur ou créer des joeurs avec des noms différents à chaque nouvelle partie.
- (VM) Connexion lente (il faut appuyer sur le bouton de connexion plusieurs fois de temps en temps)
- (accentué par la VM) Mort à la connexion car en dehors de la ZRR (les données du store contenant les coordonnée de la zrr ne semblent pas encore être initialisées par rapport à la position du joueur, il se retrouve donc pas dans la zone et est "tué").
- (accentué par la VM) TTL qui ne s'incrémente pas et/se décrémente pas et/ou ne change pas à la valeur souhaitée (0 pour mort via une météorite toxique ou -1 via une météorité salvatrice)
- Géolocalisation mauvaise : plusieurs mètres (15 à 20m) de différence entre l'endroit réel est celui sur la carte. Même avec la propriété `enableHighAccuracy` activée.
- TTL qui se décrémente seulement côté serveur via un `setInteval()` de 1s. Si on est pas sur la page, le TTL ne se décrémente plus (l'interval est `clear()` quand le composant est détruit) et nous n'utilisons pas de timestamp.
- Fenêtre modale expliquant la mort par ZRR et celle par TTL à 0 qui se superposent (l'une ou l'autre s'affiche) à cause du `watch()`.