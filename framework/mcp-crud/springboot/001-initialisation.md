# Initialisation du projet Spring Boot

## 🎯 Génération du projet avec Spring Initializr

Se rendre sur **Spring Initializr** :

👉 https://start.spring.io

---

## 🏗️ Configuration du projet

Configurer le projet avec les paramètres suivants.

### Projet

```text
Project     : Maven
Language    : Java
Spring Boot : 4.0.1
Java        : 25
Packaging   : JAR
```

### Coordonnées

```text
Group        : com.ganatan
Artifact     : springboot-starter
Name         : springboot-starter
Description  : Demo project for Spring Boot
Package Name : com.ganatan.starter
```

### Dépendances

Ajouter :

```text
Spring Web
```

---

## 📥 Génération

Cliquer sur :

```text
Generate
```

Une archive ZIP est téléchargée.

Décompresser l'archive puis ouvrir le dossier :

```text
springboot-starter
```

Le projet peut être ouvert avec :

* IntelliJ IDEA ;
* Eclipse ;
* Visual Studio Code.

---

## 📁 Structure minimale

```text
springboot-starter/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── ganatan/
│   │   │           └── starter/
│   │   │               └── StarterApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── mvnw
├── mvnw.cmd
└── pom.xml
```

---

## ▶️ Lancement depuis un terminal

Se placer dans le dossier contenant :

```text
pom.xml
```

### Avec Maven

```bash
mvn spring-boot:run
```

### Windows avec Maven Wrapper

```powershell
.\mvnw.cmd spring-boot:run
```

### Linux avec Maven Wrapper

```bash
./mvnw spring-boot:run
```

La différence est simple :

```text
mvn   → utilise Maven installé sur la machine
mvnw  → utilise le Maven Wrapper fourni avec le projet
```

Pour arrêter l'application :

```text
Ctrl + C
```

---

## 🌐 Tester l'application

Par défaut, Spring Boot démarre sur le port :

```text
8080
```

URL :

```text
http://localhost:8080
```

Une route doit être implémentée pour obtenir une réponse HTTP.

---

## ▶️ Lancement avec IntelliJ IDEA

Ouvrir la classe principale :

```text
src/main/java/com/ganatan/starter/StarterApplication.java
```

Exemple :

```java
package com.ganatan.starter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StarterApplication {

  public static void main(
      String[] args
  ) {
    SpringApplication.run(
        StarterApplication.class,
        args
    );
  }

}
```

IntelliJ affiche une icône `▶` à côté de la classe ou de la méthode `main`.

Cliquer dessus puis sélectionner :

```text
Run 'StarterApplication'
```

L'application démarre alors directement depuis IntelliJ.

---

## 🐞 Debug avec IntelliJ IDEA

Placer un breakpoint dans le code.

Ouvrir :

```text
StarterApplication.java
```

Cliquer sur l'icône `▶` à côté de la méthode `main`, puis sélectionner :

```text
Debug 'StarterApplication'
```

Il est également possible d'utiliser la configuration située dans la barre supérieure d'IntelliJ puis de cliquer sur :

```text
Debug 🐞
```

Les breakpoints sont alors actifs.

---

## 🐞 Debug avec Maven

Spring Boot peut également être lancé avec le debugger Java activé.

Utiliser le port :

```text
5005
```

Commande :

```bash
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=*:5005"
```

Avec Maven Wrapper sous Windows :

```powershell
.\mvnw.cmd spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=*:5005"
```

Avec Maven Wrapper sous Linux :

```bash
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=*:5005"
```

Signification :

```text
transport=dt_socket  → communication du debugger par socket
server=y             → la JVM attend une connexion du debugger
suspend=y            → l'application attend avant de démarrer
address=*:5005       → port de debug
```

---

## 🐞 Connexion au debug Maven avec IntelliJ

Dans IntelliJ, ouvrir :

```text
Run
Edit Configurations
```

Ajouter :

```text
+
Remote JVM Debug
```

Configurer :

```text
Name : Spring Boot Remote Debug
Host : localhost
Port : 5005
```

Cliquer sur :

```text
Apply
OK
```

Lancer d'abord Spring Boot avec Maven :

```bash
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=*:5005"
```

Puis dans IntelliJ sélectionner :

```text
Spring Boot Remote Debug
```

et cliquer sur :

```text
Debug 🐞
```

L'application poursuit alors son démarrage et les breakpoints sont actifs.

---

## 🔄 Rechargement pendant le développement

La commande :

```bash
mvn spring-boot:run
```

lance l'application en mode développement classique.

Contrairement au mode développement de Quarkus, Spring Boot ne fournit pas automatiquement le même mécanisme de Live Coding.

Pour obtenir un redémarrage automatique lors des modifications, il est possible d'ajouter :

```text
Spring Boot DevTools
```

---

## 📦 Compilation

### Avec Maven

```bash
mvn clean package
```

### Windows avec Maven Wrapper

```powershell
.\mvnw.cmd clean package
```

### Linux avec Maven Wrapper

```bash
./mvnw clean package
```

Le fichier JAR est généré dans :

```text
target/
```

Exemple :

```text
target/springboot-starter-1.0.0.jar
```

---

## ▶️ Exécution de la version compilée

```bash
java -jar target/springboot-starter-1.0.0.jar
```

L'application démarre sans utiliser directement Maven.

---

## 🧪 Tests

### Maven

```bash
mvn test
```

### Windows

```powershell
.\mvnw.cmd test
```

### Linux

```bash
./mvnw test
```

---

## 🏗️ Build complet

Compiler, tester et générer le JAR :

```bash
mvn clean package
```

Vérifier complètement le projet :

```bash
mvn clean verify
```

Installer également l'artefact dans le repository Maven local :

```bash
mvn clean install
```

---

## 📦 Commandes Maven usuelles

```bash
mvn clean
mvn compile
mvn test
mvn package
mvn verify
mvn install
mvn dependency:tree
mvn spring-boot:run
```

Avec Maven Wrapper sous Windows :

```powershell
.\mvnw.cmd clean
.\mvnw.cmd compile
.\mvnw.cmd test
.\mvnw.cmd package
.\mvnw.cmd verify
.\mvnw.cmd install
.\mvnw.cmd dependency:tree
.\mvnw.cmd spring-boot:run
```

---

## ✅ Configuration retenue

```text
Group        : com.ganatan
Artifact     : springboot-starter
Name         : springboot-starter
Package      : com.ganatan.starter
Build Tool   : Maven
Packaging    : JAR
Java         : 25
Spring Boot  : 4.0.1
Dependency   : Spring Web
Port         : 8080
```

Commandes principales :

```text
mvn spring-boot:run
mvn test
mvn clean package
java -jar target/springboot-starter-1.0.0.jar
```

Pour le développement quotidien avec IntelliJ :

```text
Run   → StarterApplication
Debug → StarterApplication
```

Pour un debug distant avec Maven :

```text
Maven
   ↓
JVM Debug 5005
   ↓
IntelliJ Remote JVM Debug
```
