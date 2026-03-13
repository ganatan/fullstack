# Onboarding entreprise — MongoDB, Vault, JFrog

## Idée simple

Dans mon onboarding, il y a 3 sujets différents :

- **MongoDB + certificat** : accès sécurisé à la base de données
- **Vault** : stockage et récupération des secrets
- **JFrog + Maven** : téléchargement et publication des dépendances et artefacts Java

---

## 1. MongoDB + certificat

MongoDB est la **base de données**.

Le certificat (`.crt`) sert à :
- sécuriser la connexion avec **TLS**
- vérifier le serveur
- parfois authentifier le client

Important :
- **aucun lien direct avec `settings.xml`**
- **aucun lien direct avec le `pom.xml`**
- c’est de la **configuration runtime** de l’application Spring Boot

On configure cela côté application :
- `application.yml`
- variables d’environnement
- certificat fourni par l’entreprise

---

## 2. Vault

Vault sert à gérer les **secrets** :
- mots de passe
- tokens
- clés API
- certificats
- credentials techniques

Les secrets Vault sont utilisés :
- par l’application Spring Boot
- par un script de démarrage
- par l’infra ou le CI/CD

Exemple :
- l’application récupère depuis Vault un mot de passe MongoDB
- puis elle se connecte à MongoDB avec ce secret

Important :
- Vault a un lien avec **Spring Boot au runtime**
- pas avec Maven directement pour le build applicatif classique

---

## 3. JFrog + Maven

JFrog Artifactory sert à gérer les **artefacts logiciels** :
- dépendances Maven
- `jar`
- `war`
- artefacts publiés par les builds

Avec Maven :
- `pom.xml` dit **quoi** utiliser
- `settings.xml` dit **où** aller et **avec quels identifiants**
- JFrog est le dépôt Maven de l’entreprise

Exemple :
- `mvn clean install` télécharge les dépendances via JFrog
- `mvn clean deploy` publie l’artefact dans JFrog

Important :
- JFrog est lié au **build**
- donc lien avec **`pom.xml`** et **`settings.xml`**

---

## Résumé final

- **MongoDB** = base de données
- **certificat MongoDB** = connexion sécurisée à la base
- **Vault** = coffre-fort des secrets
- **JFrog** = dépôt Maven de l’entreprise

---

## Vue simple build / runtime

### Build
- `pom.xml`
- `settings.xml`
- Maven
- JFrog

### Runtime
- `application.yml`
- variables d’environnement
- Vault
- MongoDB
- certificats