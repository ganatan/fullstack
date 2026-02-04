# table-requete-complexe.md

```sql
-- Création des tables
DROP TABLE IF EXISTS person CASCADE;
DROP TABLE IF EXISTS city CASCADE;
DROP TABLE IF EXISTS country CASCADE;

CREATE TABLE country (
  id   BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE city (
  id         BIGSERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  country_id BIGINT NOT NULL REFERENCES country(id)
);

CREATE TABLE person (
  id      BIGSERIAL PRIMARY KEY,
  name    VARCHAR(255) NOT NULL,
  city_id BIGINT REFERENCES city(id)
);

-- Données de test
INSERT INTO country (name) VALUES
  ('France'),
  ('Italie'),
  ('Espagne');

INSERT INTO city (name, country_id) VALUES
  ('Paris', 1),
  ('Lyon', 1),
  ('Rome', 2),
  ('Milan', 2),
  ('Madrid', 3);

INSERT INTO person (name, city_id) VALUES
  ('Alice', 1),
  ('Bob', 1),
  ('Charlie', 2),
  ('Diana', 3),
  ('Eve', NULL);

-- SELECT basiques
SELECT * FROM country;
SELECT * FROM city;
SELECT * FROM person;

-- WHERE / ORDER BY / LIMIT-OFFSET
SELECT * FROM person WHERE name LIKE 'A%';
SELECT * FROM person ORDER BY name ASC;
SELECT * FROM person ORDER BY id DESC LIMIT 3 OFFSET 0;

-- DISTINCT
SELECT DISTINCT name FROM city;

-- INNER JOIN (person -> city -> country)
SELECT p.id, p.name, c.name AS city_name, co.name AS country_name
FROM person p
JOIN city c ON c.id = p.city_id
JOIN country co ON co.id = c.country_id;

-- LEFT JOIN (garder les personnes sans ville)
SELECT p.id, p.name, c.name AS city_name, co.name AS country_name
FROM person p
LEFT JOIN city c ON c.id = p.city_id
LEFT JOIN country co ON co.id = c.country_id
ORDER BY p.id;

-- Filtrer sur une table jointe
SELECT p.*
FROM person p
JOIN city c ON c.id = p.city_id
JOIN country co ON co.id = c.country_id
WHERE co.name = 'France';

-- GROUP BY / COUNT
SELECT co.name AS country_name, COUNT(*) AS person_count
FROM person p
JOIN city c ON c.id = p.city_id
JOIN country co ON co.id = c.country_id
GROUP BY co.name
ORDER BY person_count DESC;

-- GROUP BY / HAVING
SELECT c.name AS city_name, COUNT(*) AS person_count
FROM person p
JOIN city c ON c.id = p.city_id
GROUP BY c.name
HAVING COUNT(*) >= 2
ORDER BY person_count DESC;

-- Sous-requête IN
SELECT p.*
FROM person p
WHERE p.city_id IN (
  SELECT c.id
  FROM city c
  JOIN country co ON co.id = c.country_id
  WHERE co.name = 'Italie'
);

-- EXISTS
SELECT co.*
FROM country co
WHERE EXISTS (
  SELECT 1
  FROM city c
  JOIN person p ON p.city_id = c.id
  WHERE c.country_id = co.id
);

-- NOT EXISTS (pays sans personne)
SELECT co.*
FROM country co
WHERE NOT EXISTS (
  SELECT 1
  FROM city c
  JOIN person p ON p.city_id = c.id
  WHERE c.country_id = co.id
);

-- CTE (WITH) : personnes en France
WITH france_cities AS (
  SELECT c.id
  FROM city c
  JOIN country co ON co.id = c.country_id
  WHERE co.name = 'France'
)
SELECT p.*
FROM person p
WHERE p.city_id IN (SELECT id FROM france_cities);

-- Fenêtre (window) : classement des villes par nombre de personnes
SELECT
  c.name AS city_name,
  COUNT(p.id) AS person_count,
  DENSE_RANK() OVER (ORDER BY COUNT(p.id) DESC) AS rank_by_people
FROM city c
LEFT JOIN person p ON p.city_id = c.id
GROUP BY c.id, c.name
ORDER BY person_count DESC, c.name ASC;

-- UPDATE simple
UPDATE person SET name = 'Alice Cooper' WHERE name = 'Alice';

-- UPDATE avec jointure (USING) : mettre city_id à Paris pour une personne
UPDATE person p
SET city_id = c.id
FROM city c
WHERE c.name = 'Paris' AND p.name = 'Eve';

-- DELETE simple
DELETE FROM person WHERE name = 'Bob';

-- DELETE avec jointure (USING) : supprimer les personnes d'une ville
DELETE FROM person p
USING city c
WHERE p.city_id = c.id AND c.name = 'Rome';

-- INSERT ... SELECT : dupliquer des villes dans un autre pays (exemple)
INSERT INTO city (name, country_id)
SELECT c.name || ' (copy)', co.id
FROM city c
JOIN country co ON co.name = 'Espagne'
WHERE c.name = 'Madrid';

-- Requêtes de contrôle
SELECT * FROM person ORDER BY id;
SELECT * FROM city ORDER BY id;
SELECT * FROM country ORDER BY id;
```
