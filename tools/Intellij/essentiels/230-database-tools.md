# Database Tools

IntelliJ IDEA Ultimate fournit des outils pour se connecter directement aux bases de données.
Ils permettent de naviguer dans les tables et exécuter des requêtes SQL.

## Ouvrir

```text
View
→ Tool Windows
→ Database
```

## Ajouter une connexion

```text
+
→ Data Source
→ PostgreSQL
```

## Paramètres

```text
Host
Port
Database
User
Password
```

## Exemple

```text
localhost
5432
springboot_starter
postgres
```

## Console SQL

```sql
SELECT *
FROM person;
```

Ne jamais enregistrer des secrets sensibles dans un projet partagé.
