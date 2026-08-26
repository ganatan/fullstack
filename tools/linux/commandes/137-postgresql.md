# PostgreSQL

Commandes essentielles pour utiliser PostgreSQL sous Linux.

## Version

```bash
psql --version
```

## Connexion locale

```bash
psql -U postgres
```

## Connexion à une base

```bash
psql -U postgres -d database
```

## Connexion complète

```bash
psql -h localhost -p 5432 -U postgres -d database
```

## Lister les bases

```text
\l
```

## Changer de base

```text
\c database
```

## Lister les tables

```text
\dt
```

## Structure et sortie

```text
\d person
\q
```
