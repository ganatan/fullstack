# Initialisation du projet Quarkus

## 🎯 Génération du projet avec Quarkus Code

Se rendre sur le générateur officiel Quarkus :

https://code.quarkus.io

---

## 🏗️ Configuration du projet

Configurer le projet avec les paramètres suivants.

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

* IntelliJ IDEA ;
* Eclipse ;
* Visual Studio Code.

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

### Windows avec Maven Wrapper

```powershell
.\mvnw.cmd quarkus:dev
```

### Linux avec Maven Wrapper

```bash
./mvnw quarkus:dev
```

Le Maven Wrapper permet d'exécuter Maven sans nécessiter une installation globale de Maven.

---

## ▶️ Lancement avec Maven installé

Si Maven est installé et disponible dans le `PATH`, il est également possible d'utiliser directement :

```bash
mvn quarkus:dev
```

La différence est simple :

```text
mvnw → utilise le Maven Wrapper fourni avec le projet
mvn  → utilise Maven installé sur la machine
```

Les deux commandes permettent de lancer Quarkus en mode développement.

La console doit afficher notamment :

```text
Profile dev activated. Live Coding activated.
```

et une ligne indiquant que l'application écoute sur :

```text
http://localhost:8080
```

Pour arrêter l'application :

```text
Ctrl + C
```

---

## 🌐 Tester l'application

Une ressource d'exemple est générée avec le projet Quarkus.

Une fois l'application démarrée, ouvrir dans le navigateur :

```text
http://localhost:8080/hello
```

La réponse attendue est généralement :

```text
Hello from Quarkus REST
```

L'URL peut également être testée avec `curl` :

```bash
curl http://localhost:8080/hello
```

Le fonctionnement est donc :

```text
Navigateur / curl
        ↓
http://localhost:8080/hello
        ↓
Quarkus
        ↓
GreetingResource
        ↓
Réponse HTTP
```

Si cette URL répond correctement, le projet Quarkus fonctionne.

---

## ▶️ Lancement depuis IntelliJ IDEA

Ouvrir :

```text
Run
Edit Configurations
```

Ajouter une nouvelle configuration de type :

```text
Maven
```

Configurer la configuration comme suit :

```text
Name              : Quarkus starter
Working directory : $ProjectFileDir$
```

### ⚠️ IMPORTANT — Champ `Run`

Dans le champ **Run**, saisir exactement :

```text
quarkus:dev
```

La configuration doit donc être :

```text
Name              : Quarkus starter

Run
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
quarkus:dev
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

Working directory : $ProjectFileDir$
```

> ⚠️ Ne pas saisir `Quarkus Dev` dans le champ **Run**.

La valeur :

```text
Quarkus Dev
```

est interprétée par Maven comme une commande et provoque l'erreur :

```text
Unknown lifecycle phase "Quarkus"
```

La valeur correcte est :

```text
quarkus:dev
```

Cliquer ensuite sur :

```text
Apply
OK
```

Dans la barre supérieure d'IntelliJ IDEA, sélectionner :

```text
Quarkus starter
```

puis cliquer sur :

```text
Run ▶
```

IntelliJ lance alors l'équivalent de :

```bash
mvn quarkus:dev
```

ou avec le Maven Wrapper :

```powershell
.\mvnw.cmd quarkus:dev
```

L'application Quarkus démarre en mode développement avec le **Live Coding** activé.

Tester ensuite :

```text
http://localhost:8080/hello
```

---

## 🐞 Lancement en mode Debug avec IntelliJ IDEA

Avec Quarkus, le fonctionnement du debug est légèrement différent de Spring Boot.

On utilise deux configurations IntelliJ :

```text
Quarkus starter
    ↓
configuration Maven
    ↓
lance Quarkus

Quarkus debug
    ↓
configuration Remote JVM Debug
    ↓
connecte IntelliJ à la JVM Quarkus
```

### 1. Configuration Maven

La première configuration existe déjà :

```text
Type : Maven

Name : Quarkus starter

Run  : quarkus:dev
```

Cette configuration sert à lancer l'application Quarkus.

---

### 2. Créer la configuration de Debug

Ouvrir :

```text
Run
Edit Configurations
```

Cliquer sur :

```text
+
```

Puis sélectionner :

```text
Remote JVM Debug
```

Configurer :

```text
Name : Quarkus debug

Debugger mode : Attach to remote JVM

Transport : Socket

Host : localhost

Port : 5005
```

Dans :

```text
Use module classpath
```

sélectionner :

```text
quarkus-starter
```

La configuration doit donc contenir principalement :

```text
Name                 : Quarkus debug
Debugger mode        : Attach to remote JVM
Transport            : Socket
Host                 : localhost
Port                 : 5005
Use module classpath : quarkus-starter
```

Cliquer ensuite sur :

```text
Apply
OK
```

---

## ⚠️ Ordre de lancement du Debug

L'ordre est important.

### Étape 1

Sélectionner :

```text
Quarkus starter
```

Puis cliquer sur :

```text
Run ▶
```

Quarkus démarre en mode développement.

L'application écoute sur :

```text
http://localhost:8080
```

Le port utilisé pour la connexion du debugger est :

```text
5005
```

### Étape 2

Laisser Quarkus fonctionner.

Ne pas arrêter la configuration :

```text
Quarkus starter
```

### Étape 3

Placer un breakpoint dans le code Java.

Par exemple :

```java
@GET
@Path("status")
public Map<String, Object> rootWithHashMap() {
```

### Étape 4

Sélectionner ensuite :

```text
Quarkus debug
```

Puis cliquer sur :

```text
Debug 🐞
```

IntelliJ se connecte alors à la JVM Quarkus sur :

```text
localhost:5005
```

Le fonctionnement est donc :

```text
Quarkus starter
      ↓
Run ▶
      ↓
Quarkus démarre
      ↓
Port HTTP 8080
Port Debug 5005
      ↓
Quarkus debug
      ↓
Debug 🐞
      ↓
IntelliJ se connecte à la JVM
      ↓
Breakpoints actifs
```

---

## ⚠️ Erreur possible : Connection refused

Si la configuration :

```text
Quarkus debug
```

est lancée avant Quarkus, IntelliJ peut afficher :

```text
Unable to open debugger port (localhost:5005)
Connection refused
```

Cela signifie simplement que rien n'écoute encore sur le port :

```text
5005
```

Il faut d'abord lancer :

```text
Quarkus starter
→ Run ▶
```

puis seulement :

```text
Quarkus debug
→ Debug 🐞
```

---

## ✅ Résumé IntelliJ

Deux configurations sont utilisées :

```text
Maven
└── Quarkus starter
    └── Run : quarkus:dev

Remote JVM Debug
└── Quarkus debug
    ├── Host : localhost
    ├── Port : 5005
    └── Module : quarkus-starter
```

Utilisation quotidienne :

```text
1. Quarkus starter → Run ▶

2. Quarkus debug   → Debug 🐞
```

---

## 🔄 Rechargement automatique

La commande :

```bash
mvn quarkus:dev
```

ou :

```bash
./mvnw quarkus:dev
```

lance Quarkus en mode développement.

Les modifications du code sont automatiquement détectées et recompilées.

Ce mécanisme est appelé :

```text
Live Coding
```

Après une modification, il suffit généralement de rappeler :

```text
http://localhost:8080/hello
```

pour constater le changement.

---

## 📦 Compilation

### Windows

```powershell
.\mvnw.cmd clean package
```

ou avec Maven installé :

```powershell
mvn clean package
```

### Linux

```bash
./mvnw clean package
```

ou :

```bash
mvn clean package
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

Après le démarrage, tester :

```text
http://localhost:8080/hello
```

---

## ✅ Configuration retenue

```text
Group      : com.ganatan.starter
Artifact   : quarkus-starter
Build Tool : Maven
Extension  : aucune supplémentaire
Database   : aucune
Port HTTP  : 8080
Port Debug : 5005
```

Commandes possibles pour lancer le projet :

```text
.\mvnw.cmd quarkus:dev
./mvnw quarkus:dev
mvn quarkus:dev
```

URL de vérification :

```text
http://localhost:8080/hello
```

Configuration IntelliJ pour l'exécution :

```text
Quarkus starter
Type : Maven
Run  : quarkus:dev
```

Configuration IntelliJ pour le debug :

```text
Quarkus debug
Type   : Remote JVM Debug
Host   : localhost
Port   : 5005
Module : quarkus-starter
```

Ordre de lancement :

```text
Quarkus starter → Run ▶
        ↓
Quarkus debug → Debug 🐞
```

Cette première étape consiste uniquement à générer, lancer, tester, déboguer et compiler une application Quarkus simple.
