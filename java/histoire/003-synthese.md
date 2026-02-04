# Synthèse Java Enterprise

## 1. Java SE (JSE)
**Java Standard Edition**  
Socle du langage Java : JVM, collections, threads, I/O, réseau.  
Créé par :contentReference[oaicite:0]{index=0} (1995), maintenu par :contentReference[oaicite:1]{index=1} depuis 2010.  
Tout repose dessus, y compris Spring.

## 2. J2EE puis Java EE (JEE)
**Java 2 Enterprise Edition** (1998), renommé **Java EE** en 2006.  
Objectif : standardiser le backend entreprise.  
Contient EJB, JPA, JTA, JNDI, Servlet, JSP, JAX-RS.  
Très normatif, très lourd historiquement.

## 3. javax
Espace de noms Java EE historique.  
Exemples : `javax.persistence`, `javax.servlet`, `javax.transaction`.  
Symbole de l’ère Java EE sous Sun puis Oracle.

## 4. Problème Java EE
Couplage fort au conteneur, XML massif, complexité excessive.  
Difficulté de test, lenteur de développement.  
C’est **le contexte direct de naissance de Spring**.

## 5. Spring
Framework créé en 2003 comme **réaction à Java EE**.  
Principe : POJO, IoC, DI, AOP.  
Implémente les besoins enterprise **sans imposer Java EE**.  
Utilise Java SE comme base, pas le conteneur Java EE.

## 6. Spring Boot
Créé en 2014.  
Accélérateur de Spring : auto-configuration, starters, serveur embarqué.  
Ne remplace pas Spring, il **l’industrialise**.

## 7. Oracle et la rupture
En 2010, Oracle rachète Sun.  
Java EE évolue lentement, perte de confiance de la communauté.

## 8. Jakarta EE
En 2017–2018, Java EE est transféré à Eclipse Foundation.  
Nouveau nom : **Jakarta EE**.  
Changement majeur : `javax.*` → `jakarta.*`.  
Spring reste indépendant mais compatible.

## 9. Situation actuelle
Java SE = socle universel.  
Jakarta EE = standards officiels enterprise.  
Spring / Spring Boot = implémentation dominante dans l’industrie.

## 10. Lecture simple
Java SE : le moteur  
Java EE / Jakarta EE : les standards  
Spring : la réponse pragmatique  
Spring Boot : la mise en production rapide
