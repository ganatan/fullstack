# Créer un Fat JAR en Java 8

Le JAR précédent ne contient que les classes de l'application.

Pour créer un **Fat JAR**, il faut également y ajouter les classes des librairies externes.

---

# 1. Compiler l'application

Depuis le répertoire `src` :

```bash
javac -cp ".\lib\*" *.java
```

---

# 2. Décompresser la librairie

```bash
jar xf .\lib\commons-lang3-3.12.0.jar
```

Le contenu du JAR est extrait dans le répertoire courant.

---

# 3. Créer le Fat JAR

```bash
jar cfe filetxtlib-fat.jar Main *.class org
```

---

# 4. Vérifier son contenu

```bash
jar tf filetxtlib-fat.jar
```

On retrouve notamment :

```text
META-INF/
META-INF/MANIFEST.MF
Main.class
FileTxtLib.class
org/apache/commons/lang3/StringUtils.class
```

---

# 5. Exécuter le Fat JAR

```bash
java -jar filetxtlib-fat.jar
```

Résultat :

```text
Main:
FileTxtLib:constructor
FileTxtLib:show
StringUtils.isBlank = true
```

---

# Résumé

Compilation :

```bash
javac -cp ".\lib\*" *.java
```

Extraction de la librairie :

```bash
jar xf .\lib\commons-lang3-3.12.0.jar
```

Création du Fat JAR :

```bash
jar cfe filetxtlib-fat.jar Main *.class org
```

Exécution :

```bash
java -jar filetxtlib-fat.jar
```
