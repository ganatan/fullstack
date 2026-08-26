# Téléchargements

Commandes essentielles pour télécharger des fichiers.

## Télécharger avec wget

```bash
wget https://example.com/file.zip
```

## Choisir le nom du fichier

```bash
wget -O fichier.zip https://example.com/file.zip
```

## Télécharger avec curl

```bash
curl -O https://example.com/file.zip
```

## Suivre les redirections

```bash
curl -L https://example.com/file.zip
```

## Choisir le nom avec curl

```bash
curl -L -o fichier.zip https://example.com/file.zip
```

## Reprendre un téléchargement

```bash
wget -c https://example.com/file.zip
```
