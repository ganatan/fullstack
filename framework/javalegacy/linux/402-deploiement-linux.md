# Préparer le déploiement d'une application Java 8 sur un serveur Linux

## Objectif

Maîtriser toutes les notions nécessaires pour développer, déployer et exécuter une application Java 8 sur un serveur Linux accessible par adresse IP.

---

# 1. Java

Connaître les commandes de base :

```text
java
javac
jar
javadoc
```

Variables d'environnement :

```text
JAVA_HOME
CLASSPATH
PATH
```

---

# 2. JAR

Créer :

* un JAR simple
* un JAR avec bibliothèque interne
* un JAR avec bibliothèque externe
* un Fat JAR

Comprendre :

```text
MANIFEST.MF
Main-Class
Class-Path
```

---

# 3. Maven

Maîtriser :

```text
pom.xml
```

Commandes :

```bash
mvn clean

mvn compile

mvn package

mvn install

mvn test
```

---

# 4. Gradle

Maîtriser :

```text
build.gradle
```

Commandes :

```bash
gradle build

gradle clean

gradle test
```

---

# 5. Linux

Commandes essentielles :

```text
pwd
ls
cd
mkdir
cp
mv
rm
cat
less
head
tail
find
grep
chmod
chown
du
df
```

---

# 6. Processus

Lister les processus :

```bash
ps -ef
```

Arrêter un processus :

```bash
kill PID
```

Afficher les ressources :

```bash
top
```

---

# 7. Scripts Shell

Créer :

```text
start.sh

stop.sh

restart.sh
```

Exemple :

```bash
#!/bin/sh

java -jar application.jar
```

---

# 8. Exécution en arrière-plan

```bash
nohup java -jar application.jar &
```

---

# 9. Logs

Redirection :

```bash
java -jar application.jar > application.log
```

Afficher les dernières lignes :

```bash
tail -f application.log
```

---

# 10. Réseau

Adresse IP :

```bash
hostname -I
```

ou

```bash
ip addr
```

Ports ouverts :

```bash
ss -lnt
```

Tester un serveur :

```bash
ping
```

---

# 11. Déploiement

Copie des fichiers :

```bash
scp
```

Connexion distante :

```bash
ssh
```

---

# 12. Configuration

Lire des fichiers :

```text
.properties
json
xml
```

---

# 13. Gestion des fichiers

Lire :

```text
File
BufferedReader
```

Écrire :

```text
FileWriter
BufferedWriter
```

Copier :

```text
Files
```

Créer :

```text
mkdirs()
```

---

# 14. Threads

Maîtriser :

```text
Thread
Runnable
Timer
TimerTask
ExecutorService
```

---

# 15. Collections

Utiliser :

```text
ArrayList
HashMap
HashSet
TreeMap
LinkedList
```

---

# 16. Java 8

Connaître :

```text
Lambda

Stream

Optional
```

---

# 17. Librairies

Apache Commons

```text
commons-lang3

commons-io
```

Jackson

```text
jackson-core

jackson-databind

jackson-annotations
```

---

# 18. Journalisation

Connaître :

```text
java.util.logging

Log4j

SLF4J
```

---

# 19. Tests

JUnit 4

Assertions

Tests unitaires

---

# 20. Gestion de versions

SVN

Commandes :

```bash
svn checkout

svn update

svn commit

svn add

svn delete

svn status

svn diff

svn log
```

---

# 21. Applications à réaliser

Créer progressivement plusieurs applications :

```text
app-java-8-read-file

app-java-8-write-file

app-java-8-watch-directory

app-java-8-json

app-java-8-properties

app-java-8-timer

app-java-8-thread

app-java-8-logger

app-java-8-zip

app-java-8-command-line

app-java-8-batch

app-java-8-socket-client

app-java-8-socket-server

app-java-8-http-server
```

---

# 22. Arborescence d'une application complète

```text
application
│
├── application.jar
├── lib
├── config
├── input
├── output
├── logs
├── start.sh
├── stop.sh
└── restart.sh
```

---

# Objectif final

Être capable de :

* développer une application Java 8 ;
* créer un JAR simple ou un Fat JAR ;
* utiliser Maven et Gradle ;
* déployer l'application sur un serveur Linux ;
* lancer l'application en arrière-plan ;
* consulter les logs ;
* administrer l'application à distance via SSH ;
* rendre l'application accessible depuis une adresse IP.
