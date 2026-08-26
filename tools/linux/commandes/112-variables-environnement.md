# Variables d'environnement

Commandes essentielles pour consulter et définir les variables d'environnement.

## Afficher les variables

```bash
env
printenv
```

## Afficher une variable

```bash
echo $JAVA_HOME
printenv JAVA_HOME
```

## Afficher le PATH

```bash
echo $PATH
```

## Définir une variable temporaire

```bash
export APP_ENV=dev
```

## Définir JAVA_HOME

```bash
export JAVA_HOME=/usr/lib/jvm/java-25-openjdk-amd64
```

## Ajouter au PATH

```bash
export PATH=$JAVA_HOME/bin:$PATH
```

## Supprimer une variable

```bash
unset APP_ENV
```
