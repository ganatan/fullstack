## Architecture du projet

1. Projet **Maven WAR** Spring MVC classique, déployé sur **Tomcat externe**.  
2. `.project`, `.classpath`, `.settings/*` : configuration **Eclipse WTP** (serveur, JSP).  
3. `pom.xml` : dépendances, versions, configuration du build et des tests.  
4. `AppInitializer.java` : point d’entrée web, remplace `web.xml`, initialise Spring MVC.  
5. `WebConfig.java` : configuration MVC (scan des controllers, résolution des vues JSP).  
6. `controllers/HomeController.java` : couche web, mappings HTTP vers les vues.  
7. `models/Person.java` : modèle métier simple (POJO).  
8. `webapp/WEB-INF/views` : vues JSP protégées (accès via contrôleurs uniquement).  
9. `test/controllers/HomeControllerTest.java` : tests unitaires Spring MVC.  
10. `target/` : artefacts générés (classes compilées, rapports, ressources WAR).
