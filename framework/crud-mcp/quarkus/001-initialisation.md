# Initialisation du projet Quarkus

## 🎯 Génération du projet avec Quarkus Code

Se rendre sur le générateur officiel Quarkus :

👉 https://code.quarkus.io

---

## 🏗️ Configuration du projet

Configurer le projet avec les paramètres suivants :

### Group

```text
com.ganatan.starter
```

### Artifact

```text
quarkus-starter
```

### Build Tool

```text
Maven
```

Conserver les autres valeurs proposées par défaut.

---

## 📦 Sélection du preset

Sélectionner le preset :

```text
REST service
```

Ce preset permet de créer :

- des contrôleurs REST ;
- des routes HTTP ;
- des réponses JSON ;
- des données stockées en dur ;
- une application sans base de données.

Ne pas sélectionner :

```text
REST service with database
```

La base de données sera ajoutée plus tard.

---

## 📦 Extension REST

Vérifier que l’extension suivante est sélectionnée :

```text
REST Jackson
```

Identifiant Maven :

```text
io.quarkus:quarkus-rest-jackson
```

Cette extension permet :

- de créer des routes REST ;
- de recevoir des payloads JSON ;
- de retourner des objets Java en JSON ;
- de sérialiser et désérialiser les données avec Jackson.

---

## 🚫 Extensions non nécessaires

Ne pas ajouter pour l’instant :

```text
Hibernate ORM with Panache
JDBC Driver - PostgreSQL
```

Ces extensions seront ajoutées lorsque la base de données et les repositories seront mis en place.

---

## 📥 Génération

Cliquer sur :

```text
Generate your application
```

Une archive ZIP est téléchargée.

Décompresser l’archive puis ouvrir le dossier :

```text
quarkus-starter
```

Le projet peut être ouvert avec :

- IntelliJ IDEA ;
- Eclipse ;
- Visual Studio Code.

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

## ▶️ Lancement du projet

Se placer dans le dossier du projet :

```bash
cd quarkus-starter
```

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

## 🔍 Dev UI

L’interface de développement Quarkus est disponible à l’adresse suivante :

```text
http://localhost:8080/q/dev-ui
```

---

## 📦 Compilation

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
target/quarkus-app/
```

---

## ▶️ Exécution de la version compilée

```bash
java -jar target/quarkus-app/quarkus-run.jar
```

---

## ✅ Configuration retenue

```text
Group      : com.ganatan.starter
Artifact   : quarkus-starter
Build Tool : Maven
Preset     : REST service
Extension  : REST Jackson
Database   : aucune
```

La première étape consistera à créer un `RootController` avec des données en dur.