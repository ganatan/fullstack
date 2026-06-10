# 005-commandes-linux-essentielles.md

# Commandes Linux essentielles pour un développeur Java

## Informations système

Version Linux :

```bash
uname -a
```

Distribution :

```bash
cat /etc/os-release
```

Utilisateur connecté :

```bash
whoami
```

Répertoire courant :

```bash
pwd
```

---

# Navigation

Lister le contenu :

```bash
ls
```

Lister avec détails :

```bash
ls -la
```

Changer de dossier :

```bash
cd mon-dossier
```

Remonter d'un niveau :

```bash
cd ..
```

Retour au répertoire personnel :

```bash
cd ~
```

Aller sur le disque D Windows :

```bash
cd /mnt/d
```

Aller dans le workspace :

```bash
cd /mnt/d/hal
```

---

# Répertoires

Créer un dossier :

```bash
mkdir test
```

Créer plusieurs niveaux :

```bash
mkdir -p projects/java
```

Supprimer un dossier vide :

```bash
rmdir test
```

Supprimer un dossier et son contenu :

```bash
rm -rf test
```

---

# Fichiers

Créer un fichier :

```bash
touch test.txt
```

Afficher le contenu :

```bash
cat test.txt
```

Afficher les premières lignes :

```bash
head test.txt
```

Afficher les dernières lignes :

```bash
tail test.txt
```

Supprimer un fichier :

```bash
rm test.txt
```

---

# Copie

Copie d'un fichier :

```bash
cp fichier.txt copie.txt
```

Copie d'un dossier :

```bash
cp -r projet projet-backup
```

Copier depuis Windows vers Linux :

```bash
cp -r /mnt/d/hal/workspace-java8 ~/projects/
```

Copier vers Windows :

```bash
cp hello.jar /mnt/d/hal/
```

---

# Déplacement

Déplacer un fichier :

```bash
mv fichier.txt archive.txt
```

Déplacer un dossier :

```bash
mv projet ~/projects
```

---

# Recherche

Rechercher un fichier :

```bash
find . -name "*.java"
```

Rechercher un JAR :

```bash
find . -name "*.jar"
```

Rechercher un texte :

```bash
grep "Hello" HelloWorld.java
```

---

# Permissions

Afficher les permissions :

```bash
ls -la
```

Rendre exécutable :

```bash
chmod +x script.sh
```

---

# Réseau

Adresse IP :

```bash
ip addr
```

Tester Internet :

```bash
ping google.com
```

---

# Processus

Afficher les processus :

```bash
ps -ef
```

Processus Java :

```bash
ps -ef | grep java
```

Tuer un processus :

```bash
kill PID
```

Forcer l'arrêt :

```bash
kill -9 PID
```

---

# Espace disque

Disques montés :

```bash
df -h
```

Taille d'un dossier :

```bash
du -sh .
```

---

# Installation de logiciels

Mise à jour :

```bash
sudo apt update
```

Mise à jour complète :

```bash
sudo apt upgrade -y
```

Installer un logiciel :

```bash
sudo apt install nom-du-paquet -y
```

---

# Java

Version Java :

```bash
java -version
```

Version compilateur :

```bash
javac -version
```

Lister les JVM :

```bash
ls /usr/lib/jvm
```

Changer de version :

```bash
sudo update-alternatives --config java
```

Changer le compilateur :

```bash
sudo update-alternatives --config javac
```

Compiler :

```bash
javac HelloWorld.java
```

Exécuter :

```bash
java HelloWorld
```

Exécuter un JAR :

```bash
java -jar hello.jar
```

---

# Maven

Version :

```bash
mvn -version
```

Compiler :

```bash
mvn compile
```

Tests :

```bash
mvn test
```

Package :

```bash
mvn package
```

Nettoyer :

```bash
mvn clean
```

---

# Git

Version :

```bash
git --version
```

Cloner :

```bash
git clone https://github.com/ganatan/mon-projet.git
```

Statut :

```bash
git status
```

Ajouter :

```bash
git add .
```

Commit :

```bash
git commit -m "premier commit"
```

Push :

```bash
git push
```

Pull :

```bash
git pull
```

---

# WSL

Lister les distributions :

```powershell
wsl --list --verbose
```

Lancer Ubuntu :

```powershell
wsl -d Ubuntu
```

Arrêter WSL :

```powershell
wsl --shutdown
```

---

# Les 20 commandes à connaître absolument

```bash
pwd
ls
ls -la
cd
cd ..
cd ~
mkdir
rm
rm -rf
cp
cp -r
mv
cat
find
grep
sudo apt update
sudo apt install
java -version
javac -version
java -jar
```
