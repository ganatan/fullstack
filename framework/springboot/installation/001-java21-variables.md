# Changer la version Java avec les variables d’environnement Windows

## Ouvrir les variables d’environnement

- `Win + R`
- taper `sysdm.cpl`
- onglet `Avancé`
- cliquer `Variables d’environnement`

## Modifier `JAVA_HOME`

Dans `Variables utilisateur` ou `Variables système` :

- chercher `JAVA_HOME`
- mettre le chemin du JDK voulu

Exemple Java 21 :

```text
D:\hal\java\jdk-21
```

Exemple Java 25 :

```text
D:\hal\java\jdk-25
```

## Modifier `Path`

Dans `Path`, ajouter ou garder :

```text
%JAVA_HOME%\bin
```

Mettre cette ligne avant les autres chemins Java si besoin.

## Éviter

Ne pas laisser plusieurs chemins directs comme :

```text
C:\Program Files\Java\jdk-21\bin
C:\Program Files\Java\jdk-25\bin
```

Le plus propre :

- `JAVA_HOME`
- `%JAVA_HOME%\bin` dans `Path`

## Vérifier

Fermer puis rouvrir le terminal, puis tester :

```bash
echo %JAVA_HOME%
java -version
javac -version
mvn -version
where java
```