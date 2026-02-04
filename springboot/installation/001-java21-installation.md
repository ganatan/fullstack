# Installation de Java (Windows)

## Sources officielles

Téléchargement des JDK depuis le site officiel d’Oracle :

https://www.oracle.com/java/technologies/downloads/

Accès directs par version :

- Java 8  
  https://www.oracle.com/java/technologies/downloads/#java8-windows

- Java 11  
  https://www.oracle.com/java/technologies/downloads/#java11-windows

- Java 17  
  https://www.oracle.com/java/technologies/downloads/#java17-windows

- Java 21 (LTS recommandé)  
  https://www.oracle.com/java/technologies/downloads/#jdk21-windows

- Java 25  
  https://www.oracle.com/java/technologies/downloads/#jdk25-windows

---

## Téléchargement

Sélectionner le package suivant :

- jdk-25_windows-x64_bin.msi

---

## Installation

### Installation par défaut

Chemin proposé par l’installateur :

C:\Program Files\Java\latest\jre-1.8\bin

Non recommandé pour un environnement de développement maîtrisé.

---

### Installation personnalisée (recommandée)

Choisir un répertoire dédié :

D:\hal\Java\jdk-25\

Avantages :
- coexistence de plusieurs versions de Java
- contrôle explicite des mises à jour
- configuration propre des variables d’environnement
- aucun conflit avec des installations système

---

## Vérification de l’installation

Ouvrir un terminal (CMD ou PowerShell) et exécuter :

java -version

Affiche la version Java actuellement utilisée.

where java

Liste tous les exécutables java.exe trouvés dans le PATH et permet d’identifier :
- conflits de versions
- anciennes installations résiduelles
- ordre de priorité du PATH

---
