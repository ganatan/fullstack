# 004-installation-wsl2-ubuntu-java.md

# Installation de Linux (WSL2 Ubuntu) sous Windows 11

## Objectif

Installer un véritable environnement Linux directement dans Windows afin de pouvoir exécuter :

```text
Java 8
Java 21
Maven
Tomcat
Git
Docker
Spring Boot
PostgreSQL
```

comme sur un serveur Linux.

---

# 1. Vérifier que WSL est installé

Ouvrir PowerShell :

```powershell
wsl --version
```

Résultat attendu :

```text
WSL version: 2.x.x
```

---

# 2. Vérifier les distributions installées

```powershell
wsl --list --verbose
```

Exemple :

```text
NAME              STATE     VERSION
docker-desktop    Stopped   2
Ubuntu            Stopped   2
```

Dans notre cas :

```text
Ubuntu est déjà installée.
```

Il ne faut donc pas réinstaller Ubuntu.

---

# 3. Lancer Ubuntu

Commande recommandée :

```powershell
wsl -d Ubuntu
```

ou :

```powershell
wsl --distribution Ubuntu
```

---

# 4. Premier lancement

Si Ubuntu n'a jamais été démarrée :

```text
Installing...
Creating default Unix user account...
```

Créer :

```text
Nom utilisateur Linux
Mot de passe Linux
```

Exemple :

```text
Username : danny
Password : ********
```

---

# 5. Vérifier Ubuntu

Une fois connecté :

```text
danny@PC:~$
```

Vérifier :

```bash
uname -a
```

Résultat :

```text
Linux ...
```

---

# 6. Mettre Ubuntu à jour

```bash
sudo apt update
sudo apt upgrade -y
```

---

# 7. Vérifier l'accès aux disques Windows

Sous Linux :

```bash
ls /mnt
```

Résultat :

```text
c
d
```

---

# 8. Accéder au disque D

Sous Windows :

```text
D:\hal
```

Sous Linux :

```text
/mnt/d/hal
```

Exemple :

```bash
cd /mnt/d/hal
ls
```

---

# 9. Installer Java 21

Installer :

```bash
sudo apt install openjdk-21-jdk -y
```

Vérifier :

```bash
java -version
javac -version
```

Résultat attendu :

```text
openjdk version "21"
javac 21
```

---

# 10. Installer Java 8

Selon la version d'Ubuntu, Java 8 peut être disponible directement :

```bash
sudo apt install openjdk-8-jdk -y
```

Vérifier :

```bash
java -version
javac -version
```

Résultat attendu :

```text
openjdk version "1.8"
javac 1.8
```

---

# 11. Vérifier les versions installées

```bash
ls /usr/lib/jvm
```

Exemple :

```text
java-8-openjdk-amd64
java-21-openjdk-amd64
```

---

# 12. Choisir la version Java active

Afficher les versions disponibles :

```bash
sudo update-alternatives --config java
```

Exemple :

```text
Selection    Path
-----------------------------------------
0            java-21-openjdk-amd64
1            java-8-openjdk-amd64
2            java-21-openjdk-amd64
```

Choisir :

```text
1
```

pour Java 8.

ou :

```text
2
```

pour Java 21.

---

# 13. Choisir la version du compilateur

```bash
sudo update-alternatives --config javac
```

Sélectionner la même version que Java.

Vérifier :

```bash
java -version
javac -version
```

---

# 14. Installer Maven

Installer :

```bash
sudo apt install maven -y
```

Vérifier :

```bash
mvn -version
```

Exemple :

```text
Apache Maven 3.x
Java version: 21
```

ou :

```text
Apache Maven 3.x
Java version: 1.8
```

---

# 15. Exécuter un JAR créé sous Windows

Supposons :

```text
D:\hal\workspace-java8\java8-training\hello.jar
```

Sous Linux :

```bash
cd /mnt/d/hal/workspace-java8/java8-training
```

Vérifier :

```bash
ls
```

Résultat :

```text
hello.jar
```

Exécuter :

```bash
java -jar hello.jar
```

Résultat :

```text
Bonjour Danny
```

---

# 16. Copier un projet Windows vers Linux

Créer un répertoire Linux :

```bash
mkdir -p ~/projects
```

Copie :

```bash
cp -r /mnt/d/hal/workspace-java8/java8-training ~/projects/
```

Vérifier :

```bash
ls ~/projects
```

---

# 17. Connaître l'emplacement Linux

Afficher le répertoire courant :

```bash
pwd
```

Exemple :

```text
/home/danny
```

Le répertoire personnel Linux est :

```text
/home/danny
```

---

# 18. Arrêter Linux

Depuis PowerShell :

```powershell
wsl --shutdown
```

---

# Dépannage

## Erreur

```text
ubuntu : Le terme 'ubuntu' n'est pas reconnu
```

Solution :

```powershell
wsl -d Ubuntu
```

---

## Erreur

```text
sudo: not found
```

Cause :

```text
Vous n'êtes pas dans Ubuntu.
```

Vérifier :

```powershell
wsl --list --verbose
```

Puis :

```powershell
wsl -d Ubuntu
```

---

## Vérifier les distributions

```powershell
wsl --list --verbose
```

Exemple :

```text
NAME              STATE     VERSION
docker-desktop    Stopped   2
Ubuntu            Running   2
```

---

# Résumé

Lister les distributions :

```powershell
wsl --list --verbose
```

Lancer Ubuntu :

```powershell
wsl -d Ubuntu
```

Mettre à jour :

```bash
sudo apt update
sudo apt upgrade -y
```

Installer Java 8 :

```bash
sudo apt install openjdk-8-jdk -y
```

Installer Java 21 :

```bash
sudo apt install openjdk-21-jdk -y
```

Changer de version :

```bash
sudo update-alternatives --config java
sudo update-alternatives --config javac
```

Installer Maven :

```bash
sudo apt install maven -y
```

Exécuter un JAR :

```bash
java -jar hello.jar
```

Vous disposez maintenant d'un environnement Ubuntu complet capable d'exécuter des applications Java 8, Java 21, Maven, Spring Boot et Tomcat directement depuis Windows.
