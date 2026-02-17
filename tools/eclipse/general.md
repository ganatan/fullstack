# Eclipse — Installation et configuration (Windows)

## Afficher les fichiers cachés

Dans **Project Explorer** :
1. Cliquer sur la **3ᵉ icône** (View Menu)
2. **Preset Filters**
3. Décocher **.resources**

---

## Installation d’Eclipse

### Liens officiels
- https://www.eclipse.org/downloads/
- https://www.eclipse.org/downloads/packages/

### Version recommandée
- **2025-09 R**
- **2025-06 R** ⚠️ *Utilise JDK 21*

### Téléchargement
- **Windows : x86_64**
- **Eclipse IDE for Enterprise Java and Web Developers**
- Fichier :
  ```
  eclipse-jee-2025-09-R-win32-x86_64.zip
  ```

### Installation
- Décompresser l’archive
- Lancer **eclipse.exe**
- Choisir le workspace :
  ```
  D:\chendra\10-eclipse\workspace
  ```

### Terminal
- Window → Show View → Other...
- Cherche Terminal
- Ouvre Terminal (ou Terminal View)
- Dans la vue Terminal : icône Open a Terminal (prise/+)
 → choisis le shell (cmd / PowerShell / Git Bash / WSL)

### Options au premier lancement
- **Exclude Eclipse IDE**
- Sélection du **Settings**
- Modifier les préférences (JBoss)
- Configurer Tomcat

### Lancer l’application
```
http://localhost:8089/backend-java-spring-starter/
```

### Vérifier les dépendances Maven
- https://mvnrepository.com/

---

## Configuration de Tomcat dans Eclipse

### Tester Tomcat
```
http://127.0.0.1:8080/
```

### Ajouter un serveur Tomcat
1. Onglet **Servers**
2. **Create a new server**
3. **Apache / Tomcat 11 / Next**
4. **Browse** :
   ```
   D:\hal\Tomcat 11.0
   ```
5. Double-cliquer sur le serveur :
   - **Tomcat admin port** : 8088
   - **HTTP/1.1** : 8089
6. Clic droit sur le serveur :
   - **Clean**
   - **Start**

---

## Modifier les préférences Eclipse (JBoss)

Aller dans :
```
Window → Preferences → Install/Update → Available Software Sites
```

- Chercher :
  ```
  https://download.jboss.org/jbosstools/photon/stable/updates/
  ```
- Désactiver ou supprimer l’entrée
- Cocher la case demandée

---

## Changer le workspace Eclipse

Menu :
```
File → Switch Workspace → Other
```

Exemple :
```
D:\chendra\10-eclipse\workspace
```

---

## Configurer Maven dans Eclipse

### Emplacement du settings.xml

Menu :
```
Window → Preferences → Maven → User Settings
```

- **User Settings** → Browse
- Sélectionner un `settings.xml` personnalisé

### Exemple de fichier `settings.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>

<settings xmlns="http://maven.apache.org/SETTINGS/1.2.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.2.0 https://maven.apache.org/xsd/settings-1.2.0.xsd">

  <localRepository>D:/chendra/10-eclipse/maven/</localRepository>

  <mirrors>
    <mirror>
      <id>maven-default-http-blocker</id>
      <mirrorOf>external:http:*</mirrorOf>
      <name>Pseudo repository to mirror external repositories initially using HTTP.</name>
      <url>http://0.0.0.0/</url>
      <blocked>true</blocked>
    </mirror>
  </mirrors>

</settings>
```

---

## Formatage du code

### Formater le code
```
Ctrl + Shift + F
Ctrl + Maj + F
```

---

## Commenter / Décommenter

```
Ctrl + Shift + /   (commenter)
Ctrl + Shift + \  (décommenter)

Ctrl + Maj + /     (commenter)
Ctrl + Maj + \    (décommenter)
```

---

## Tabulation à 2 espaces

Menu :
```
Window → Preferences → Java → Code Style → Formatter
```

1. Cliquer sur **New…**
2. Nom du profil : **Tabulation 2 espaces**
3. Onglet **Indentation**
   - **Tab Size** : 2
