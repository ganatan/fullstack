# Versions Java

Commandes essentielles pour gérer plusieurs versions de Java.

## Version active

```bash
java -version
```

## Compilateur actif

```bash
javac -version
```

## JVM installées

```bash
ls /usr/lib/jvm
```

## Java disponible

```bash
update-alternatives --list java
```

## Choisir Java

```bash
sudo update-alternatives --config java
```

## Choisir javac

```bash
sudo update-alternatives --config javac
```

## Chemin réel de Java

```bash
readlink -f $(which java)
```

## Vérifier JAVA_HOME

```bash
echo $JAVA_HOME
```
