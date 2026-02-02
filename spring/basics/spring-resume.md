# Résumé Spring (vue rapide)

Java est le langage utilisé pour écrire le code.
Java SE 8 (Java 1.8) est une version du langage encore très utilisée en entreprise.

Une Servlet est une classe Java capable de recevoir une requête HTTP et de renvoyer une réponse.
Tomcat est un serveur web Java qui exécute les Servlets.

Spring est un framework qui crée et gère les objets de l’application.
Ces objets sont stockés dans l’ApplicationContext, qui est le cœur de Spring.

Spring MVC est le module Spring dédié aux applications web.
Il permet de relier les URLs HTTP à des méthodes Java.

Le DispatcherServlet est une Servlet spéciale fournie par Spring MVC.
Il reçoit toutes les requêtes HTTP et les redirige vers le bon controller.

Flux général :
Navigateur → Tomcat → DispatcherServlet → Controller → Réponse JSON

Spring MVC repose sur Tomcat et les Servlets, mais simplifie fortement leur utilisation.
