# Initialisation du projet Spring Boot

## 🎯 Génération du projet avec Spring Initializr

Se rendre sur :
https://start.spring.io

---

## 🏗️ Configuration du projet

- Project : Maven
- Language : Java
- Spring Boot : 4.0.2
- Java : 25
- Packaging : JAR

---

## 🧩 Coordonnées

- Group : com.ganatan
- Artifact : springboot-starter
- Name : springboot-starter
- Description : Demo project for Spring Boot
- Package Name : com.ganatan.starter

---

## 📦 Dépendances

- Spring Web

---

## 📥 Génération du projet

Cliquer sur Generate pour télécharger l’archive ZIP.
Importer le projet dans Eclipse ou IntelliJ.

---

## ⚙️ Paramétrage Maven

### pom.xml

Ajouter ou vérifier :

```xml
<artifactId>springboot-starter</artifactId>
<version>1.0.0</version>
<name>springboot-starter</name>
<description>Demo project for Spring Boot</description>
<url/>
```
---

## ⚙️ Configuration Spring Boot

### application.properties

```text
spring.application.name=springboot-starter
server.port=3000
```

---

## 🔄 Refactor effectué

Renommage de :

- `SpringbootStarterApplication`

en :

- `StarterApplication`

---

## 📂 Fichiers impactés

- `src/main/java/com/ganatan/starter/StarterApplication.java`
- `src/test/java/com/ganatan/starter/StarterApplicationTests.java`

---

## ▶️ Lancement

mvn spring-boot:run

---

