# Déployer une application Java 8 sur un serveur Linux

## Objectif

Déployer la première application Java 8 sur un serveur Linux et l'exécuter en ligne de commande.

L'application utilisée est :

```text
app-java-8-read-file
```

---

# 1. Compiler l'application

Se placer dans le répertoire :

```bash
cd D:\demo\app-java-8-read-file\src
```

Compiler :

```bash
javac *.java
```

---

# 2. Créer le JAR

Créer un JAR exécutable :

```bash
jar cfe app.jar Main *.class
```

Vérifier son contenu :

```bash
jar tf app.jar
```

Résultat :

```text
META-INF/
META-INF/MANIFEST.MF
Main.class
FileTxtLib.class
```

---

# 3. Préparer l'application

Créer l'arborescence suivante :

```text
app-java-8-read-file
│
├── app.jar
├── input
│   └── files.txt
├── output
└── logs
```

---

# 4. Copier l'application sur Linux

Par exemple :

```text
/opt/demo
```

On obtient :

```text
/opt/demo
│
├── app.jar
├── input
├── output
└── logs
```

---

# 5. Se connecter au serveur

Connexion SSH :

```bash
ssh utilisateur@192.168.1.100
```

---

# 6. Vérifier Java

Afficher la version :

```bash
java -version
```

Afficher le compilateur :

```bash
javac -version
```

---

# 7. Se placer dans le répertoire

```bash
cd /opt/demo
```

Lister les fichiers :

```bash
ls -l
```

---

# 8. Exécuter l'application

```bash
java -jar app.jar
```

Résultat :

```text
Main:
FileTxtLib:constructor
Created : hello.txt
Created : java.txt
Created : spring.txt
Created : angular.txt
```

---

# 9. Vérifier les fichiers générés

Lister le répertoire :

```bash
ls output
```

Résultat :

```text
angular.txt
hello.txt
java.txt
spring.txt
```

Afficher un fichier :

```bash
cat output/hello.txt
```

Résultat :

```text
Hello World
```

---

# 10. Consulter les journaux

Rediriger la sortie :

```bash
java -jar app.jar > logs/application.log
```

Afficher le journal :

```bash
cat logs/application.log
```

Ou suivre le journal en temps réel :

```bash
tail -f logs/application.log
```

---

# 11. Exécuter en arrière-plan

```bash
nohup java -jar app.jar > logs/application.log 2>&1 &
```

Lister les processus Java :

```bash
ps -ef | grep java
```

Arrêter l'application :

```bash
kill PID
```

---

# 12. Vérifier l'adresse IP du serveur

```bash
hostname -I
```

ou

```bash
ip addr
```

---

# 13. Arborescence finale

```text
/opt/demo
│
├── app.jar
├── input
│   └── files.txt
├── output
│   ├── hello.txt
│   ├── java.txt
│   ├── spring.txt
│   └── angular.txt
└── logs
    └── application.log
```

---

# Résumé

Compilation :

```bash
javac *.java
```

Création du JAR :

```bash
jar cfe app.jar Main *.class
```

Exécution :

```bash
java -jar app.jar
```

Journalisation :

```bash
java -jar app.jar > logs/application.log
```

Exécution en arrière-plan :

```bash
nohup java -jar app.jar > logs/application.log 2>&1 &
```

Arrêt :

```bash
kill PID
```

---

# Objectif

À l'issue de ce tutoriel, l'application est capable de :

* être compilée ;
* être distribuée sous forme d'un JAR exécutable ;
* être copiée sur un serveur Linux ;
* être exécutée en ligne de commande ;
* générer des fichiers ;
* produire des journaux ;
* fonctionner en arrière-plan.

Cette base servira ensuite aux applications plus avancées (Timer, JSON, HTTP Server, Socket, etc.).
