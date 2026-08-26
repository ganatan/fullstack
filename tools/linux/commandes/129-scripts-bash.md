# Scripts Bash

Commandes essentielles pour créer et exécuter des scripts Bash.

## Créer un script

```bash
vim script.sh
```

## Première ligne

```bash
#!/usr/bin/env bash
```

## Exécuter avec Bash

```bash
bash script.sh
```

## Rendre exécutable

```bash
chmod +x script.sh
```

## Exécuter directement

```bash
./script.sh
```

## Voir le code de retour

```bash
echo $?
```

## Arrêter en cas d'erreur

```bash
set -e
```

## Debug

```bash
bash -x script.sh
```
