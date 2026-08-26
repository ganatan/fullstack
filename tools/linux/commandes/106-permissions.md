# Permissions

Commandes essentielles pour consulter et modifier les permissions sous Linux.

## Afficher les permissions

```bash
ls -l
```

Avec les fichiers cachés :

```bash
ls -la
```

## Rendre un fichier exécutable

```bash
chmod +x script.sh
```

Retirer le droit d'exécution :

```bash
chmod -x script.sh
```

## Permissions numériques

```bash
chmod 644 fichier.txt
chmod 755 script.sh
```

- `644` : propriétaire lecture/écriture, autres lecture
- `755` : propriétaire lecture/écriture/exécution, autres lecture/exécution

## Changer le propriétaire

```bash
sudo chown utilisateur fichier.txt
```

Avec le groupe :

```bash
sudo chown utilisateur:groupe fichier.txt
```

Récursivement sur un dossier :

```bash
sudo chown -R utilisateur:groupe dossier
```

## Changer le groupe

```bash
sudo chgrp groupe fichier.txt
```