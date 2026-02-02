# Fonctionnement de Spring MVC (explication détaillée)

## Java
Java est un langage de programmation.
Le code Java est compilé puis exécuté par la JVM.
Java ne gère pas le web par défaut.

## Java SE 8 (Java 1.8)
Java SE signifie Standard Edition.
Java 8 est une version majeure encore très présente dans les systèmes existants.
La version de Java détermine les APIs disponibles.

## Servlet
Une Servlet est la brique de base du web en Java.
Elle reçoit une requête HTTP et produit une réponse HTTP.
Sans Servlet, il n’existe pas d’application web Java.

## Tomcat
Tomcat est un serveur web Java.
Il écoute sur un port (ex : 8080).
Il reçoit les requêtes HTTP et exécute les Servlets.
Tomcat ne contient pas Spring.

## Spring
Spring est un framework applicatif.
Il gère la création des objets et leurs dépendances.
Il s’occupe du cycle de vie des composants de l’application.

## ApplicationContext
L’ApplicationContext est le conteneur Spring.
Il stocke tous les objets Spring appelés beans.
Spring utilise ce contexte pour injecter les dépendances.

## Spring MVC
Spring MVC est le module web de Spring.
Il relie les requêtes HTTP aux méthodes Java.
Il gère les routes, les paramètres et la sérialisation JSON.

## DispatcherServlet
Le DispatcherServlet est une Servlet fournie par Spring MVC.
Il agit comme un contrôleur central.
Il reçoit toutes les requêtes HTTP entrantes.
Il trouve le bon controller et appelle la bonne méthode.

## Controllers
Les controllers contiennent la logique web.
Ils sont annotés avec @Controller ou @RestController.
Ils renvoient des vues ou des données JSON.

## Cycle complet d’une requête
1. Le navigateur envoie une requête HTTP.
2. Tomcat reçoit la requête.
3. Tomcat appelle le DispatcherServlet.
4. Le DispatcherServlet identifie le controller.
5. Le controller traite la requête.
6. La réponse est renvoyée au client.

## Résumé
Tomcat fournit le serveur.
Les Servlets fournissent le socle web.
Spring gère les objets.
Spring MVC organise le web.
Le DispatcherServlet orchestre l’ensemble.
