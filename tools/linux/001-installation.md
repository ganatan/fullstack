# 004-installation-wsl2-ubuntu-java8.md

# Installation de Linux (WSL2 Ubuntu) sous Windows 11

## Objectif

Installer un véritable environnement Linux directement dans Windows afin de pouvoir exécuter :

```text
Java
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
```

Puis :

```bash
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
```

Lister :

```bash
ls
```

---

# 9. Installer Java

Java 21 :

```bash
sudo apt install openjdk-21-jdk -y
```

Vérifier :

```bash
java -version
```

Résultat :

```text
openjdk version "21"
```

---

# 10. Installer Maven

```bash
sudo apt install maven -y
```

Vérifier :

```bash
mvn -version
```

---

# 11. Exécuter un JAR créé sous Windows

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

# 12. Arrêter Linux

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

Cause :

```text
Le raccourci Ubuntu n'est pas présent dans le PATH Windows.
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
Vous êtes dans une autre distribution WSL.
```

Vérifier :

```powershell
wsl --list --verbose
```

Puis lancer :

```powershell
wsl -d Ubuntu
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

Version Linux :

```bash
uname -a
```

Mettre à jour :

```bash
sudo apt update
sudo apt upgrade -y
```

Installer Java :

```bash
sudo apt install openjdk-21-jdk -y
```

Exécuter un JAR :

```bash
java -jar hello.jar
```

Vous disposez maintenant d'un véritable Linux Ubuntu dans Windows, capable d'exécuter les mêmes applications Java qu'un serveur Linux.
