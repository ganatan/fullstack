# Espace disque

Commandes essentielles pour surveiller l'espace disque.

## Espace disponible

```bash
df
```

## Format lisible

```bash
df -h
```

## Taille du répertoire courant

```bash
du -sh .
```

## Taille d'un répertoire

```bash
du -sh dossier
```

## Taille des sous-répertoires

```bash
du -h --max-depth=1
```

## Trier les tailles

```bash
du -sh * | sort -h
```

## Systèmes de fichiers

```bash
df -Th
```
