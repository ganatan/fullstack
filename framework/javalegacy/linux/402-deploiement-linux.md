# Déployer un JAR exécutable Java 8 sur un serveur Linux

## Objectif

Déployer une application Java 8 sous la forme d'un JAR exécutable sur un serveur Linux et l'exécuter en ligne de commande.

---

# 1. Vérifier les droits

Afficher l'utilisateur courant :

```bash
whoami
```

Vérifier les droits :

```bash
sudo -l
```

Si la commande échoue, contacter l'administrateur système.

---

# 2. Vérifier Java

Afficher la version :

```bash
java -version
```

Si Java est installé :

```text
openjdk version "1.8.0_xxx"
```

ou

```text
java version "1.8.0_xxx"
```

Passer directement à l'étape suivante.

---

# 3. Installer Java 8

## Ubuntu / Debian

Mettre à jour les paquets :

```bash
sudo apt update
```

Installer Java 8 :

```bash
sudo apt install openjdk-8-jdk
```

Vérifier :

```bash
java -version
```

---

## RedHat / CentOS

Installer Java :

```bash
sudo yum install java-1.8.0-openjdk-devel
```

Vérifier :

```bash
java -version
```

---

# 4. Vérifier le compilateur

```bash
javac -version
```

Résultat :

```text
javac 1.8.0_xxx
```

---

# 5. Créer le répertoire de déploiement

Créer le répertoire :

```bash
sudo mkdir -p /opt/demo
```

Donner les droits à l'utilisateur :

```bash
sudo chown $USER:$USER /opt/demo
```

Se placer dans le répertoire :

```bash
cd /opt/demo
```

---

# 6. Copier le JAR

Depuis Windows :

```bash
scp filetxtlib.jar utilisateur@192.168.1.100:/opt/demo
```

Ou copier le fichier avec WinSCP.

---

# 7. Vérifier le contenu

```bash
ls -l
```

Résultat :

```text
filetxtlib.jar
```

---

# 8. Exécuter le JAR

```bash
java -jar filetxtlib.jar
```

Résultat :

```text
Main:
FileTxtLib:constructor
FileTxtLib:show
```

---

# 9. Créer un répertoire de logs

```bash
mkdir logs
```

---

# 10. Rediriger les sorties

```bash
java -jar filetxtlib.jar > logs/application.log
```

Afficher le journal :

```bash
cat logs/application.log
```

---

# 11. Exécuter en arrière-plan

```bash
nohup java -jar filetxtlib.jar > logs/application.log 2>&1 &
```

---

# 12. Vérifier le processus

```bash
ps -ef | grep java
```

Exemple :

```text
java -jar filetxtlib.jar
```

---

# 13. Arrêter l'application

```bash
kill PID
```

ou

```bash
pkill -f filetxtlib.jar
```

---

# 14. Vérifier les journaux

Afficher les dernières lignes :

```bash
tail -20 logs/application.log
```

Suivre le journal :

```bash
tail -f logs/application.log
```

---

# 15. Vérifier l'adresse IP

```bash
hostname -I
```

ou

```bash
ip addr
```

---

# 16. Vérifier les variables Java

Afficher :

```bash
echo $JAVA_HOME
```

```bash
echo $PATH
```

Trouver Java :

```bash
which java
```

---

# 17. Arborescence finale

```text
/opt/demo
│
├── filetxtlib.jar
└── logs
    └── application.log
```

---

# Résumé

Installer Java :

```bash
sudo apt update
sudo apt install openjdk-8-jdk
```

Vérifier Java :

```bash
java -version
javac -version
```

Créer le répertoire :

```bash
sudo mkdir -p /opt/demo
sudo chown $USER:$USER /opt/demo
```

Copie :

```bash
scp filetxtlib.jar utilisateur@192.168.1.100:/opt/demo
```

Exécution :

```bash
java -jar filetxtlib.jar
```

Journalisation :

```bash
java -jar filetxtlib.jar > logs/application.log
```

Arrière-plan :

```bash
nohup java -jar filetxtlib.jar > logs/application.log 2>&1 &
```

Surveillance :

```bash
ps -ef | grep java
tail -f logs/application.log
```

Arrêt :

```bash
kill PID
```

---

# À retenir

Avant de déployer une application Java sur un serveur Linux, il faut toujours vérifier :

* les droits de l'utilisateur ;
* la présence de Java 8 (`java` et `javac`) ;
* la création du répertoire de déploiement ;
* la copie du JAR ;
* le lancement de l'application ;
* la gestion des journaux ;
* le fonctionnement en arrière-plan ;
* l'arrêt propre du processus.

Ces étapes constituent la base du déploiement d'une application Java 8 sur un serveur Linux.
Ensuite, il sera possible d'automatiser le démarrage avec un script `start.sh`, un script `stop.sh`, puis un service `systemd`.
