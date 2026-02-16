# Principes SQL (MVP)

## Exemple de schéma minimal

```sql
CREATE TABLE country (
  id   BIGSERIAL PRIMARY KEY,
  code CHAR(2) NOT NULL,
  name VARCHAR(255) NOT NULL,
  UNIQUE (code)
);

CREATE TABLE city (
  id         BIGSERIAL PRIMARY KEY,
  country_id BIGINT NOT NULL,
  name       VARCHAR(255) NOT NULL,
  FOREIGN KEY (country_id) REFERENCES country(id),
  UNIQUE (country_id, name)
);

CREATE INDEX idx_city_country_id ON city(country_id);

CREATE TABLE person (
  id      BIGSERIAL PRIMARY KEY,
  city_id BIGINT,
  name    VARCHAR(255) NOT NULL,
  FOREIGN KEY (city_id) REFERENCES city(id)
);

CREATE INDEX idx_person_city_id ON person(city_id);

CREATE TABLE media (
  id    BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL
);

CREATE TABLE media_person (
  media_id  BIGINT NOT NULL,
  person_id BIGINT NOT NULL,
  PRIMARY KEY (media_id, person_id),
  FOREIGN KEY (media_id)  REFERENCES media(id),
  FOREIGN KEY (person_id) REFERENCES person(id)
);

CREATE INDEX idx_media_person_person_id ON media_person(person_id);
```

---

## Clé primaire (PRIMARY KEY)

```sql
id BIGSERIAL PRIMARY KEY
```

Identifiant unique.
Index automatique.
Référencé par les clés étrangères.

---

## Clé étrangère (FOREIGN KEY)

```sql
FOREIGN KEY (city_id) REFERENCES city(id)
```

Garantit l’intégrité référentielle.
Empêche les références invalides.
Aucune logique de suppression implicite.

---

## Index

```sql
CREATE INDEX idx_person_city_id ON person(city_id);
```

Accélère les JOIN et les filtres.
Essentiel sur les clés étrangères.

---

## Contrainte UNIQUE

```sql
UNIQUE (country_id, name)
```

Empêche les doublons fonctionnels.
Règle métier simple côté base.

---

## Contrainte NOT NULL

```sql
name VARCHAR(255) NOT NULL
```

Champ obligatoire.

---

## Table de jointure (N-N)

```sql
PRIMARY KEY (media_id, person_id)
```

Relation plusieurs-à-plusieurs.
Clé primaire composée.
Pas d’identifiant artificiel.

---

## Règles MVP

- Une table = un concept
- PK sur chaque table
- FK explicites
- Index sur FK
- Pas de cascade implicite
- SQL = cohérence, code = métier
