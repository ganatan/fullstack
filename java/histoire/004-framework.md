# Backend / Frontend / Desktop / Mobile

## 1. Java SE – le socle commun
**Java SE (Standard Edition)**  
Base technique : JVM, collections, threads, I/O, réseau, concurrence.  
Créé par Sun Microsystems (1995), maintenu par Oracle depuis 2010.  
Tous les usages Java reposent dessus.

---

## 2. Java côté Backend (serveur)

### 2.1 Java EE / Jakarta EE (approche standard)
Anciennement **J2EE**, puis **Java EE**, aujourd’hui **Jakarta EE**.  
Objectif : standardiser les applications backend enterprise.

Technos clés :
- **Servlet** : couche HTTP bas niveau
- **JSP** : génération HTML côté serveur
- **JSF** : framework MVC serveur (composants UI)
- **JPA** : persistance (ORM)
- **JTA** : transactions
- **JNDI** : lookup ressources
- **EJB** : composants métier (historiquement lourds)
- **JAX-RS** : REST
- **JAX-WS** : SOAP

Namespace historique : `javax.*`  
Namespace actuel : `jakarta.*`

Serveurs applicatifs :
- WildFly
- WebLogic
- WebSphere
- Payara
- GlassFish

---

### 2.2 Spring (approche pragmatique)
Framework né en réaction à Java EE.

Couches :
- **Spring Core** : IoC / DI
- **Spring MVC** : REST / MVC
- **Spring Data JPA** : persistance
- **Spring Security** : sécurité
- **Spring Transaction** : transactions

Principes :
- POJO
- testabilité
- découplage
- usage direct de Java SE

---

### 2.3 Spring Boot
Surcouche de productivité sur Spring.

Outils :
- Auto-configuration
- Starters
- Tomcat embarqué
- Packaging `jar`

Usage dominant actuel pour :
- microservices
- APIs REST
- systèmes distribués

---

## 3. Java côté Frontend Web (historique)

### 3.1 JSP
**Java Server Pages**  
HTML + Java côté serveur.  
Simple mais peu maintenable à grande échelle.

### 3.2 JSF
**JavaServer Faces**  
Framework MVC serveur basé sur composants UI.  
Très utilisé dans les SI bancaires historiques.

Problèmes :
- couplage fort serveur
- lourdeur
- faible séparation frontend/backend

👉 aujourd’hui en déclin face aux SPA.

---

## 4. Java et Frontend moderne

Java **n’est plus utilisé** pour le frontend navigateur moderne.

Frontend actuel :
- Angular
- React
- Vue

Java est cantonné au rôle :
- API REST
- backend métier
- orchestration

---

## 5. Java Desktop

Technos :
- **AWT** (ancien)
- **Swing** (années 2000)
- **JavaFX** (plus moderne)

Usages :
- outils internes
- applications riches legacy
- clients lourds métiers

Aujourd’hui : usage marginal mais encore présent.

---

## 6. Java Mobile

### 6.1 J2ME (historique)
Java Micro Edition pour téléphones anciens.  
Aujourd’hui abandonné.

### 6.2 Android
Langage initial : Java  
Aujourd’hui : Kotlin dominant, Java toujours supporté.

Java reste :
- présent dans l’écosystème
- mais plus stratégique côté Android.

---

## 7. Lecture synthétique

- Java SE : fondation technique
- Java EE / Jakarta EE : standards backend
- Spring : implémentation pragmatique du backend
- Spring Boot : industrialisation
- JSP / JSF : frontend serveur historique
- Angular / React : frontend moderne
- JavaFX / Swing : desktop
- Android : mobile

---

## 8. Position actuelle dans l’industrie

Java = backend critique  
Spring Boot = standard de facto  
Java EE / Jakarta EE = cadre normatif  
Java ≠ frontend moderne
