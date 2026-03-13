# Explication du fichier `settings.xml` Maven

Ce fichier `settings.xml` est un fichier global Maven utilisé sur le poste du développeur.

Il ne décrit pas le code métier du backend.  
Il décrit comment Maven doit fonctionner dans l’environnement de l’entreprise.

Pour un projet backend Java ou Spring Boot :
- le `pom.xml` décrit le projet
- le `settings.xml` décrit l’environnement Maven

---

## Rôle général

Ce fichier sert à :
- définir le dépôt local Maven
- configurer l’authentification vers Artifactory
- déclarer les repositories Maven privés
- déclarer les plugin repositories
- exposer des propriétés globales
- activer automatiquement des profils Maven

---

## 1. Dépôt local Maven

~~~xml
<localRepository>D:\REVOPARTI</localRepository>
~~~

Cette ligne définit le cache Maven local.

C’est dans ce dossier que Maven stocke :
- les dépendances téléchargées
- les plugins Maven
- les métadonnées des artefacts

---

## 2. Authentification vers Artifactory

~~~xml
<servers>
~~~

Ce bloc contient les identifiants d’accès aux repositories distants.

Dans ce fichier, Maven utilise :
- `mvp-maven-virtual`
- `mvp-maven-staging`
- `mvp-maven-stable`

Les identifiants ne sont pas écrits en dur.  
Ils sont récupérés depuis les variables d’environnement :
- `MAVEN_ARTIFACTORY_USERNAME`
- `MAVEN_ARTIFACTORY_PASSWORD`

Cela permet à Maven de s’authentifier sur Artifactory sans mettre directement le login et le mot de passe dans le fichier.

---

## 3. Mirrors

~~~xml
<mirrors>
~~~

Ce bloc indique à Maven de passer par Artifactory au lieu d’aller directement sur certains repositories externes.

Dans ce fichier, les repositories suivants sont redirigés :
- `central`
- `apache.snapshots`
- `nexus-generique-librairies`

vers le repository miroir :
- `mvp-maven-virtual`

L’idée est de centraliser les téléchargements Maven via Artifactory.

---

## 4. Profil `artifactory`

~~~xml
<profile>
  <id>artifactory</id>
~~~

Ce profil configure les repositories Maven de l’entreprise.

Il contient deux parties :
- `repositories`
- `pluginRepositories`

---

## 5. Repositories

~~~xml
<repositories>
~~~

Cette partie définit où Maven doit chercher les dépendances du backend.

Exemples :
- dépendances Spring Boot
- bibliothèques Java
- dépendances internes d’entreprise
- dépendances snapshot ou release

Les repositories déclarés sont :
- `mvp-maven-staging`
- `mvp-maven-stable`
- `mvp-maven-virtual`

Chaque repository contient :
- une configuration pour les `releases`
- une configuration pour les `snapshots`
- une URL Artifactory

---

## 6. Plugin repositories

~~~xml
<pluginRepositories>
~~~

Cette partie définit où Maven doit chercher les plugins Maven.

Exemples de plugins :
- `maven-compiler-plugin`
- `maven-surefire-plugin`
- `spring-boot-maven-plugin`

La logique est la même que pour les repositories classiques, mais ici elle s’applique aux plugins de build.

---

## 7. Profil `jdks`

~~~xml
<profile>
  <id>jdks</id>
~~~

Ce profil expose des propriétés globales Maven contenant des chemins vers plusieurs JDK installés sur le poste.

Exemples :
- `JAVA_1_6_HOME`
- `JAVA_1_7_HOME`
- `JAVA_1_8_HOME`
- `JAVA_11_HOME`

Cela permet de gérer plusieurs versions de Java dans un même environnement d’entreprise.

---

## 8. Profil `docker`

~~~xml
<profile>
  <id>docker</id>
~~~

Ce profil contient des propriétés Maven liées aux registries Docker.

Exemples :
- URL de registry
- utilisateur
- mot de passe
- email technique

Ces propriétés peuvent être utilisées par des plugins Maven ou des scripts de build pour construire ou publier des images Docker.

---

## 9. Profils actifs

~~~xml
<activeProfiles>
~~~

Ce bloc active automatiquement les profils :
- `artifactory`
- `jdks`
- `docker`

Donc Maven applique automatiquement ces configurations à chaque exécution.

---

## 10. Lien avec un projet backend Spring Boot

Pour un backend Spring Boot :
- le `pom.xml` décrit les dépendances et plugins du projet
- le `settings.xml` décrit comment Maven doit résoudre ces dépendances dans l’environnement entreprise

Concrètement :
- Maven lit le `pom.xml`
- Maven lit le `settings.xml`
- Maven télécharge les dépendances via Artifactory
- Maven télécharge les plugins via Artifactory
- Maven utilise éventuellement les propriétés JDK et Docker

---

## 11. Ce que ce fichier ne fait pas

Ce fichier ne configure pas le runtime de l’application Spring Boot.

Il ne configure pas :
- `application.yml`
- MongoDB runtime
- Vault runtime
- ports HTTP
- profils Spring
- configuration métier

Donc :
- build Maven = oui
- Artifactory = oui
- plugins Maven = oui
- Docker build = potentiellement oui
- MongoDB applicatif = non
- Vault applicatif = non

---

## Résumé simple

Ce fichier `settings.xml` sert à préparer Maven pour des projets backend d’entreprise.

Il dit à Maven :
- où stocker son cache local
- comment se connecter à Artifactory
- quels repositories utiliser
- quels plugin repositories utiliser
- quels profils techniques activer
- quelles propriétés globales exposer

En résumé :
- `pom.xml` = description du projet backend
- `settings.xml` = environnement Maven de l’entreprise