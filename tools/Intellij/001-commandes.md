# IntelliJ IDEA — Installation et configuration (Windows)

## Installation

Téléchargement officiel :

https://www.jetbrains.com/idea/download/?section=windows

Fichier utilisé :

ideaIU-2025.3.3.exe

---

## Éditions IntelliJ IDEA

- IntelliJ IDEA Ultimate Edition 🟢  
  Support complet des serveurs applicatifs  
  Tomcat, GlassFish, Jetty, Jakarta EE  
  Fonctionnalité « Run on Server » disponible

- IntelliJ IDEA Community Edition 🔴  
  Pas de support Tomcat  
  Pas de « Run on Server »

---

## Activation de la licence (Ultimate)

File → Settings → Plugins

---

## Ouvrir un projet

- Open Project
- Sélectionner un projet Maven

---

## Configuration du JDK

### Vérification Java système

```
where java
```

---

### Définir le JDK du projet

File → Project Structure (Ctrl + Alt + Shift + S)

- Project SDK → Add SDK → JDK
- Sélectionner le dossier JDK local

Exemple :

```
C:\Program Files\Java\jdk-21
```

Apply → OK

---

### Changer la version de JDK

File → Project Structure (Ctrl + Alt + Shift + S)

- Project SDK → jdk-25

---

### Updater les dépendances Maven

Reload All Maven Projects

---

## Commentaires

Chemin :

```text
File > Settings > Keymap
Main Menu > Code > 
Taper en recherche Comment 
```

Ensuite :

```text
Remove les keys existants
```

```text
Clic droit sur Comment  > Add Keyboard Shortcut
```
Puis appuyer sur :

```text
Ctrl + :
```

Valider avec :

```text
OK
```

---

## Lancement du Terminal

Raccourci :

```
Alt + F12
```

View → Tool Windows → Terminal

## Formatage du code dans IntelliJ

Chemin :

```text
File > Settings > Keymap
Main Menu > Code > 
Taper en recherche Reformat Code
```

Ensuite :

```text
Remove les keys existants
```

```text
Clic droit sur Reformat Code > Add Keyboard Shortcut
```
Puis appuyer sur :

```text
Alt + Maj + F
```

Valider avec :

```text
OK
```

Si IntelliJ signale un conflit :
- choisir `Remove` pour affecter ce raccourci au formatage
- ou choisir `Leave` pour conserver les deux raccourcis

Nom exact de l’action :

```text
Reformat Code
```

## Indentation

### Java

Editor → Code Style → Java → Tabs and Indents  

- Indent : 2
- Tab size : 2

### XML

Editor → Code Style → XML  

Indentation identique

---

## Apparence

Theme :

Light with Light Header

Police :

- Consolas
- 12
- Line height 1.0

---

## Raccourcis utiles

- Ctrl + F4 : fermer l’onglet

---

## Lancement navigateur

Run → Edit Configurations  

Before Launch → Launch Web Browser  

URL :

```
http://localhost:3003/
```

---

## Tomcat

Run → Edit Configurations  
Tomcat Server → Deployment WAR

---

## Microsoft Defender

Exclude Folders  
Ajouter le dossier des projets Java

---

## Exécution backend

### backend-java

- WAR
- Pas de main()
- Tomcat externe

### backend-spring

- Spring MVC
- WAR
- Tomcat externe

### backend-springboot

- Spring Boot
- main()
- Tomcat embarqué

---

## UTF-8 Eclipse

Properties → Resource → Text file encoding → UTF-8

---

## Lombok

File → Settings  

Build, Execution, Deployment → Compiler → Annotation Processors  

- Enable annotation processing
- Obtain processors from project classpath


## Version de IntelliJ

```
Help About
```

