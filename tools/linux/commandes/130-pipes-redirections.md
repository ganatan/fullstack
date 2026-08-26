# Pipes et redirections

Commandes essentielles pour chaîner les commandes Linux.

## Pipe

```bash
ps -ef | grep java
```

## Rediriger vers un fichier

```bash
commande > fichier.txt
```

## Ajouter à un fichier

```bash
commande >> fichier.txt
```

## Rediriger les erreurs

```bash
commande 2> erreur.txt
```

## Sortie et erreurs ensemble

```bash
commande > resultat.txt 2>&1
```

## Lire depuis un fichier

```bash
commande < fichier.txt
```

## Succès ou échec

```bash
commande1 && commande2
commande1 || commande2
```
