# Processus

Commandes essentielles pour afficher et gérer les processus sous Linux.

## Afficher les processus

```bash
ps
```

Afficher tous les processus :

```bash
ps -ef
```

Autre vue détaillée :

```bash
ps aux
```

## Rechercher un processus

```bash
ps -ef | grep java
```

Avec `pgrep` :

```bash
pgrep java
```

Recherche par commande complète :

```bash
pgrep -f application.jar
```

## Surveillance en temps réel

```bash
top
```

Si installé :

```bash
htop
```

## Arrêter un processus

```bash
kill PID
```

Arrêt normal :

```bash
kill -15 PID
```

Arrêt forcé :

```bash
kill -9 PID
```