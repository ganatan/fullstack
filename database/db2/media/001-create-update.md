```sql
CREATE TABLE country (
  id   BIGSERIAL PRIMARY KEY,
  code CHAR(2) NOT NULL,
  name VARCHAR(255) NOT NULL,
  UNIQUE (code),
  UNIQUE (name)
);

ALTER SEQUENCE country_id_seq RESTART WITH 1000;

CREATE TABLE city (
  id         BIGSERIAL PRIMARY KEY,
  country_id BIGINT NOT NULL,
  name       VARCHAR(255) NOT NULL,
  FOREIGN KEY (country_id) REFERENCES country(id),
  UNIQUE (country_id, name)
);

ALTER SEQUENCE city_id_seq RESTART WITH 1000;

CREATE TABLE person (
  id      BIGSERIAL PRIMARY KEY,
  city_id BIGINT,
  name    VARCHAR(255) NOT NULL,
  FOREIGN KEY (city_id) REFERENCES city(id)
);

ALTER SEQUENCE person_id_seq RESTART WITH 1000;

CREATE TABLE media (
  id    BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  release_date  INTEGER      NOT NULL,
  UNIQUE (name, release_date)
);

ALTER SEQUENCE media_id_seq RESTART WITH 1000;

CREATE TABLE media_person (
  media_id  BIGINT NOT NULL,
  person_id BIGINT NOT NULL,
  role      VARCHAR(50),
  PRIMARY KEY (media_id, person_id),
  FOREIGN KEY (media_id)  REFERENCES media(id),
  FOREIGN KEY (person_id) REFERENCES person(id)
);
```

```sql
INSERT INTO country (code, name)
VALUES ('US', 'United States');

INSERT INTO city (country_id, name)
VALUES
  ((SELECT id FROM country WHERE code = 'US'), 'Los Angeles'),
  ((SELECT id FROM country WHERE code = 'US'), 'New York');

INSERT INTO person (city_id, name)
VALUES
  ((SELECT id FROM city WHERE name = 'Los Angeles'), 'Keanu Reeves'),
  ((SELECT id FROM city WHERE name = 'Los Angeles'), 'Laurence Fishburne'),
  ((SELECT id FROM city WHERE name = 'Los Angeles'), 'Carrie-Anne Moss'),
  ((SELECT id FROM city WHERE name = 'Los Angeles'), 'Harrison Ford'),
  ((SELECT id FROM city WHERE name = 'New York'), 'Sigourney Weaver'),
  ((SELECT id FROM city WHERE name = 'Los Angeles'), 'Arnold Schwarzenegger'),
  ((SELECT id FROM city WHERE name = 'Los Angeles'), 'Michael J. Fox'),
  ((SELECT id FROM city WHERE name = 'Los Angeles'), 'Christopher Lloyd'),
  ((SELECT id FROM city WHERE name = 'Los Angeles'), 'Matthew McConaughey'),
  ((SELECT id FROM city WHERE name = 'Los Angeles'), 'Leonardo DiCaprio'),
  ((SELECT id FROM city WHERE name = 'Los Angeles'), 'Ryan Gosling');

INSERT INTO media (name, release_date)
VALUES
  ('The Matrix', 1999),
  ('Blade Runner', 1982),
  ('Alien', 1979),
  ('Terminator 2: Judgment Day', 1991),
  ('Back to the Future', 1985),
  ('Interstellar', 2014),
  ('Inception', 2010),
  ('Blade Runner 2049', 2017);

INSERT INTO media_person (media_id, person_id, role)
VALUES
  ((SELECT id FROM media WHERE name = 'The Matrix'),
   (SELECT id FROM person WHERE name = 'Keanu Reeves'), 'Neo'),
  ((SELECT id FROM media WHERE name = 'The Matrix'),
   (SELECT id FROM person WHERE name = 'Laurence Fishburne'), 'Morpheus'),
  ((SELECT id FROM media WHERE name = 'Blade Runner'),
   (SELECT id FROM person WHERE name = 'Harrison Ford'), 'Rick Deckard'),
  ((SELECT id FROM media WHERE name = 'Alien'),
   (SELECT id FROM person WHERE name = 'Sigourney Weaver'), 'Ellen Ripley'),
  ((SELECT id FROM media WHERE name = 'Terminator 2: Judgment Day'),
   (SELECT id FROM person WHERE name = 'Arnold Schwarzenegger'), 'T-800'),
  ((SELECT id FROM media WHERE name = 'Back to the Future'),
   (SELECT id FROM person WHERE name = 'Michael J. Fox'), 'Marty McFly'),
  ((SELECT id FROM media WHERE name = 'Interstellar'),
   (SELECT id FROM person WHERE name = 'Matthew McConaughey'), 'Cooper'),
  ((SELECT id FROM media WHERE name = 'Inception'),
   (SELECT id FROM person WHERE name = 'Leonardo DiCaprio'), 'Cobb'),
  ((SELECT id FROM media WHERE name = 'Blade Runner 2049'),
   (SELECT id FROM person WHERE name = 'Ryan Gosling'), 'K');
```

-- Design:
-- IDs auto >= 1000
-- Pas d’ID en dur dans les INSERT
-- Relations exprimées par FK
-- Table N-N explicite
