On a besoin de 3 CLI pour faire tourner l'app :

`sudo ./start-network` pour lancer la blockchain locale. 
Il faut ensuite écrire la commande :  `migrate --network developmment` une fois truffle lancé.

`./start-api` pour lancer l'API

`./start-app` pour lancer le front-end


Il est possible que vous rencontriez des problèmes au lancement de la blockchaine locale : nous en avons aussi.
Puisque capricieuse, nous n'avons pas réellement pu tester la v2 de notre application, ainsi que nos contrats solidity.
Sachez néanmoins que les contrats sont écrits, et devraient à priori fonctionner si mit en lien avec l'application react.
En effet, la gestion de la connection à la blochchaine a été entièrement intégrée à notre application, avec l'ensemble des transactions qui y est stockée.

Cela pose un petit problème, puisque les transactions (et appels aux fonctions de contrats) ne dépendent plus de notre backend, 
mais de la blockchain, on peine à pouvoir utiliser les fonctionnalités de base du site (compris dans la v1). Ceci dit, tout a été implémenté 
dans un premier temps pour fonctionner avec le backend, puis dans un second temps (version actuelle) pour faire des appels à la blockchain.

Ainsi, dans sa version, le site n'est pas totallement fonctionnel, mais il reste encore l'ensemble du code dans le backend (et les anciens commits) pour prouver que la V1 était bien implémentée.
Enfin, les contrats que l'on utilise actuellement pour faire tourner la pseudo v2 se trouvent dans le dossier network, tandis que les contrats théoriques pour la v3 ont déjà été codés et se trouvent à la racine du projet


Problèmes liés à la blockchaine qui nous empêche de mettre en place toute la v2 :
    - Impossible d'ajouter des users à la blockchaine sans passer par le terminal truffle (et donc impossible depuis la webapp)
    - Des transactions qui échouent faute de gas (on a pas réussi à en ajouter depuis l'app à nos utilisateurs, ce qui nous empêchent d'utiliser certaines transactions de nos contrats, et donc de les tester pour fix d'éventuels bugs)
    - Truffle capricieux qui refuse de se lancer, de manière aléatoire, une fois sur 2. Or la blochaine est réinitialisée à chaque démarrage -> impossible d'avoir des données de tests consistantes

Fonctionnalités de la v2 qui fonctionnent :
    - Stockage des tasks sur la blockchaine :
        On est capabable de les récupérer depuis la blockchaine;
        On est capabable d'en ajouter (AskForHelp);
        On peut finaliser une tâche préalablement acceptée via son profile

Fonctionnalités de la v2 qui ne fonctionnent pas :
    - Accepter une task depuis la page Help
     (error Pas assez de gas /// Transaction reverted 'withoutReasonError') 
     --> Bloque toute l'application ducoup...