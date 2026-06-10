# Linux

# Installation de Linux (WSL2) sous Windows 11

## Objectif

Installer un véritable environnement Linux sous Windows afin de pouvoir exécuter :

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

# 1. Vérifier la version de Windows

Ouvrir PowerShell :

```powershell
winver
```

Vérifier :

```text
Windows 11
```

ou

```text
Windows 10 version 2004 minimum
```

---

# 2. Vérifier si WSL est déjà installé

Ouvrir PowerShell en administrateur :

```powershell
wsl --version
```

Si la commande répond :

```text
WSL version: 2.x.x
Kernel version: x.x.x
```

WSL est déjà installé.

---

# 3. Installer WSL2

Dans PowerShell administrateur :

```powershell
wsl --install
```

Attendre la fin de l'installation.

Redémarrer Windows.

---

# 4. Vérifier l'installation

Après redémarrage :

```powershell
wsl --version
```

Résultat attendu :

```text
WSL version: 2.x.x
Kernel version: x.x.x
WSLg version: x.x.x
```

---

# 5. Installer Ubuntu

Lister les distributions disponibles :

```powershell
wsl --list --online
```

Exemple :

```text
Ubuntu
Ubuntu-22.04
Ubuntu-24.04
Debian
openSUSE
```

Installer Ubuntu :

```powershell
wsl --install -d Ubuntu
```

---

# 6. Premier démarrage Linux

Lancer :

```powershell
ubuntu
```

ou :

```powershell
wsl
```

Créer :

```text
Nom utilisateur
Mot de passe
```

Exemple :

```text
Username : mulder
Password : ********
```

---

# 7. Vérifier Linux

Dans le terminal Linux :

```bash
uname -a
```

Résultat attendu :

```text
Linux ...
```

---

# 8. Mettre Ubuntu à jour

```bash
sudo apt update
sudo apt upgrade -y
```

---

# 9. Vérifier l'accès aux disques Windows

Sous Linux :

```bash
ls /mnt
```

Résultat :

```text
c
d
```

Le disque :

```text
D:\hal
```

devient :

```text
/mnt/d/hal
```

---

# 10. Accéder au workspace Java

Exemple :

```bash
cd /mnt/d/hal/workspace-java8
```

Lister :

```bash
ls
```

Résultat :

```text
java8-training
```

---

# 11. Installer Java 8

Rechercher les versions disponibles :

```bash
sudo apt search openjdk
```

Installer Java 8 :

```bash
sudo apt install openjdk-8-jdk
```

Vérifier :

```bash
java -version
```

Résultat attendu :

```text
openjdk version "1.8"
```

---

# 12. Vérifier le compilateur

```bash
javac -version
```

Résultat :

```text
javac 1.8.x
```

---

# 13. Exécuter un programme Java

Créer :

```bash
nano HelloWorld.java
```

Code :

```java
public class HelloWorld {

    public static void main(String[] args) {
        System.out.println("Bonjour Linux");
    }
}
```

Compiler :

```bash
javac HelloWorld.java
```

Exécuter :

```bash
java HelloWorld
```

Résultat :

```text
Bonjour Linux
```

---

# 14. Exécuter un JAR créé sous Windows

Se placer dans le projet :

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
Bonjour mulder
```

---

# 15. Vérifier les distributions installées

Depuis PowerShell :

```powershell
wsl -l -v
```

Exemple :

```text
NAME      STATE     VERSION
Ubuntu    Running   2
```

---

# 16. Arrêter Linux

Depuis PowerShell :

```powershell
wsl --shutdown
```

---

# 17. Architecture finale

```text
Windows 11
|
+-- IntelliJ
|
+-- Java 8
|
+-- WSL2
    |
    +-- Ubuntu
        |
        +-- Java 8
        +-- Maven
        +-- Git
        +-- Tomcat
        +-- Docker
```

---

# Résumé

Installation :

```powershell
wsl --install
```

Lancement :

```powershell
wsl
```

Mise à jour :

```bash
sudo apt update
sudo apt upgrade -y
```

Accès disque D :

```bash
cd /mnt/d
```

Version Linux :

```bash
uname -a
```

Version Java :

```bash
java -version
```

Exécution d'un JAR :

```bash
java -jar hello.jar
```

Vous disposez maintenant d'un véritable environnement Linux directement dans Windows.
