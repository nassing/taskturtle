On a besoin de 3 CLI pour faire tourner l'app :

`sudo ./start-network` pour lancer la blockchain locale. 
Il faut ensuite écrire la commande :  `migrate --network development` une fois truffle lancé.

`./start-api` pour lancer l'API

`./start-app` pour lancer le front-end


Il est possible que vous rencontriez des problèmes lors du lancement de la blockchain locale : nous en avons également fait l'expérience.


Étant donné sa nature capricieuse, nous n'avons pas réellement pu tester la version 2 de notre application ni nos contrats Solidity. Néanmoins, les contrats sont écrits et devraient a priori fonctionner s'ils sont liés à l'application React.

Cette version est une fonction simple fonctionnant avec un réseau blockchain, mais nous avons une version un peu plus avancée qui n'est pas reliée à la blockchain disponible sur le commit "Page transaction quasi terminé" 1da3c20c7e432c38319c0f6b11d72f93a28e727d. Il y a notamment une page de transaction qui n'est pas tout à fait aboutie car une partie du code a été faite plus tard sur le commit "Ajout contrat V2". Cette version n'est pas fonctionnelle car entre temps il y a eu le passage à la version simplifiée sur le réseau blockchain.

En effet, la gestion de la connexion à la blockchain a été entièrement intégrée à notre application, avec l'ensemble des transactions qui y sont stockées.

Cela pose un petit problème, car les transactions (et appels aux fonctions des contrats) ne dépendent plus de notre backend, mais de la blockchain. Nous avons du mal à utiliser les fonctionnalités de base du site qui étaient incluses dans la version 1. Cependant, tout a d'abord été implémenté pour fonctionner avec le backend, puis dans la version actuelle pour effectuer des appels à la blockchain.

Ainsi, dans cette version, le site n'est pas totalement fonctionnel, mais le code backend (et les anciens commits) prouvent que la version 1 était bien implémentée. De plus, les contrats utilisés actuellement pour faire fonctionner la pseudo version 2 se trouvent dans le dossier "network", tandis que les contrats théoriques pour la version 3 ont déjà été codés et se trouvent à la racine du projet (notamment le fichier "contrat.sol").

Nous rencontrons des problèmes liés à la blockchain qui nous empêchent de mettre en place toute la version 2 :

    Il est impossible d'ajouter des utilisateurs à la blockchain sans passer par le terminal Truffle (et donc impossible depuis l'application web).
    Certaines transactions échouent en raison du manque de gas. Nous n'avons pas réussi à en ajouter depuis l'application à nos utilisateurs, ce qui nous empêche d'utiliser certaines transactions de nos contrats et donc de les tester pour corriger d'éventuels bugs.
    Truffle est capricieux et refuse de se lancer de manière aléatoire, une fois sur deux. Or, la blockchain est réinitialisée à chaque démarrage, ce qui rend impossible d'avoir des données de test cohérentes.

Les fonctionnalités de la version 2 qui fonctionnent (contrat "TaskTurtle") :

    Stockage des tâches sur la blockchain : nous pouvons les récupérer depuis la blockchain, en ajouter de nouvelles (AskForHelp) et finaliser une tâche préalablement acceptée via le profil.

Les fonctionnalités de la version 2 qui ne fonctionnent pas :

    Accepter une tâche depuis la page "Help" entraîne une erreur "Pas assez de gas" ou une transaction revertée sans raison. Cela bloque toute l'application en conséquence

Les fonctionnalités sur lesquelles nous avons travaillé mais qui n'ont pas abouties:

    L'authentification via Auth0, qui ne marche pas tout à fait. Seule l'authentification invité fonctionne.
