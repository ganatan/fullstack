# 006-postgresql-model-media-v1.md

# Modèle PostgreSQL — Media (V1)

Objectif : définir le write model PostgreSQL pour l’entité `media` (vertical slice V1).

Domain model :
- id (bigint)
- name (string)
- release_date (date)

Base de données :
backend_media

---

## Script SQL minimal

```sql
create database backend_media;

\c backend_media

create table media (
  id bigserial primary key,
  name varchar(255) not null,
  release_date date not null,
  creation_date timestamptz not null default now(),
  update_date timestamptz not null default now()
);
```

---

## Test rapide

```sql
insert into media (name, release_date)
values ('Inception', date '2010-07-16')
returning id;

select id, name, release_date, creation_date, update_date
from media;
```

---

## Explication rapide

- backend_media : base applicative
- media : table write-model
- id : généré automatiquement (bigserial)
- creation_date : date de création automatique
- update_date : date de modification (non automatisée en V1)
- modèle volontairement simple pour la vertical slice
