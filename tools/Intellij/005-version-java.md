# Choisir la version de Java dans IntelliJ

## Régler le Java du projet

- `File > Project Structure`
- onglet `Project`
- `Project SDK` : choisir le JDK voulu
- `Project language level` : mettre le niveau correspondant ou `SDK default`

Exemple :

- projet Java 21 → `Project SDK = 21`
- projet Java 25 → `Project SDK = 25`

## Régler le Java du module

- `File > Project Structure`
- onglet `Modules`
- sélectionner le module
- `Dependencies`
- `Module SDK` : choisir `Inherit project SDK` ou le JDK voulu

## Régler le Java de Maven

- `File > Settings`
- `Build, Execution, Deployment`
- `Build Tools`
- `Maven`

Choisir le JDK Maven voulu selon la version du projet.

## Recharger le projet

Après modification :

- panneau Maven
- `Reload All Maven Projects`

## Vérifier

Dans le terminal IntelliJ :

```bash
java -version
mvn -version
```

Le plus important pour un projet Maven est que :

- `Project SDK`
- `Module SDK`
- `Maven JDK`

soient cohérents avec la version Java du `pom.xml`.