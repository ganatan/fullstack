# Initialisation du projet Quarkus

## 🎯 Génération du projet Quarkus avec **Quarkus Code**

Se rendre sur le générateur officiel Quarkus :

👉 https://code.quarkus.io

Configurer le projet avec les paramètres suivants :

### 🏗️ Projet

* **Build Tool** : Maven
* **Language** : Java
* **Quarkus** : 3.38.1
* **Java** : 25
* **Packaging** : JAR

### 🧩 Coordonnées

* **Group** : `com.ganatan`
* **Artifact** : `quarkus-starter`
* **Version** : `1.0.0-SNAPSHOT`
* **Package Name** : `com.ganatan.starter`

### 📦 Dépendances à ajouter

* **REST Jackson**

Cette extension permet de créer des routes HTTP REST et de gérer les payloads JSON.

### 📥 Génération

Cliquer sur **Generate your application** pour télécharger l’archive du projet.

Décompresser ensuite l’archive.

Le projet peut être importé dans un IDE :

* IntelliJ IDEA
* Eclipse
* Visual Studio Code

---

## ▶️ Lancement du projet

### Windows

```powershell
.\mvnw.cmd quarkus:dev
```

### Linux

```bash
./mvnw quarkus:dev
```

L’application est disponible à l’adresse suivante :

```text
http://localhost:8080
```

---

## 📦 Compilation du projet

### Windows

```powershell
.\mvnw.cmd clean package
```

### Linux

```bash
./mvnw clean package
```

Le projet compilé est généré dans :

```text
target/quarkus-app
```

---

## ▶️ Lancement du fichier JAR

```bash
java -jar target/quarkus-app/quarkus-run.jar
```

---

## 📁 Structure minimale

```text
quarkus-starter/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── ganatan/
│   │   │           └── starter/
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── mvnw
├── mvnw.cmd
└── pom.xml
```

---

## 🔍 Vérification

Ouvrir dans le navigateur :

```text
http://localhost:8080
```

Le mode développement Quarkus fournit :

* le rechargement automatique du code
* la compilation automatique
* l’exécution des tests
* l’interface Quarkus Dev UI

La Dev UI est disponible à l’adresse suivante :

```text
http://localhost:8080/q/dev-ui
```
