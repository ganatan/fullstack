# 001 - Principes SQL (MVP PostgreSQL)

## Objectif
Définir un schéma SQL simple, cohérent et réutilisable.
La base garantit la cohérence, le code applicatif gère le métier.

---

## Clé primaire (PRIMARY KEY)
Identifie une ligne de manière unique.
Index automatique.

```sql
id BIGSERIAL PRIMARY KEY
```

---

## Clé étrangère (FOREIGN KEY)
Lien explicite entre tables.
Empêche les références invalides.
Aucune logique de suppression implicite.

```sql
city_id BIGINT NOT NULL
FOREIGN KEY (city_id) REFERENCES city(id)
```

---

## Index
Améliore les performances des SELECT et JOIN.
À créer sur :
- clés étrangères
- colonnes filtrées ou triées

```sql
CREATE INDEX idx_person_city_id ON person(city_id);
```

---

## Contrainte UNIQUE
Empêche les doublons fonctionnels.
Exprime une règle métier simple côté base.

```sql
UNIQUE (country_id, name)
```

---

## Contrainte NOT NULL
Champ obligatoire.

```sql
name VARCHAR(255) NOT NULL
```

---

## Table de jointure (N-N)
Modélise une relation plusieurs-à-plusieurs.
Clé primaire composée.
Pas d’identifiant artificiel.

```sql
PRIMARY KEY (media_id, person_id)
```

---

## Principes MVP
- Une table = un concept
- PK sur chaque table
- FK explicites
- Index sur FK
- Pas de cascade implicite
- Métier complexe dans le code, pas en SQL
