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

Aucune extension supplémentaire n’est nécessaire pour cette première étape.

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

## ▶️ Lancement depuis un terminal

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

La console affiche le démarrage de l’application Quarkus.

Pour arrêter l’application :

```text
Ctrl + C
```

---

## ▶️ Lancement depuis IntelliJ IDEA

### 1. Ouvrir le projet

Dans IntelliJ IDEA, ouvrir le dossier :

```text
quarkus-starter
```

IntelliJ doit détecter automatiquement le fichier :

```text
pom.xml
```

Si Maven n’est pas détecté :

```text
Clic droit sur pom.xml
Add as Maven Project
```

---

### 2. Créer une configuration Maven

Ouvrir :

```text
Run
Edit Configurations
```

Cliquer sur :

```text
+
Maven
```

Configurer la nouvelle configuration :

```text
Name              : Quarkus Dev
Command line      : quarkus:dev
Working directory : D:\demo\quarkus-starter
Profiles          :
```

Le champ `Profiles` reste vide.

Le dossier de travail doit être le dossier contenant le fichier :

```text
pom.xml
```

Il est également possible d’utiliser :

```text
$ProjectFileDir$
```

comme `Working directory`.

---

### 3. Enregistrer la configuration

Cliquer sur :

```text
Apply
OK
```

---

### 4. Lancer l’application

Dans la barre supérieure d’IntelliJ, sélectionner :

```text
Quarkus Dev
```

Puis cliquer sur :

```text
Run ▶
```

Cette configuration exécute l’équivalent de :

```powershell
.\mvnw.cmd quarkus:dev
```

---

## 🐞 Lancement en mode Debug

Sélectionner la configuration :

```text
Quarkus Dev
```

Puis cliquer sur :

```text
Debug 🐞
```

Il est alors possible d’utiliser des points d’arrêt dans IntelliJ.

---

## 🔄 Rechargement automatique

La commande suivante lance Quarkus en mode développement :

```text
quarkus:dev
```

Les modifications du code sont automatiquement détectées et recompilées.

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

Le dossier complet suivant doit être conservé :

```text
target/quarkus-app/
```

---

## ✅ Configuration retenue

```text
Group      : com.ganatan.starter
Artifact   : quarkus-starter
Build Tool : Maven
Extension  : aucune
Database   : aucune
```

Cette première étape consiste uniquement à générer, lancer et compiler une application Quarkus simple.