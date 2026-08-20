# Database – Person

Intégration de l’accès à la base de données dans le CRUD `Person`.

L’architecture reste :

```text
PersonController
    ↓
PersonService
    ↓
PersonRepository
    ↓
Database
```

Le stockage en mémoire disparaît complètement.

---

# Architecture

```text
HTTP
  ↓
PersonInputDto
  ↓
PersonController
  ↓
PersonService
  ↓
PersonRepository
  ↓
Database
  ↓
PersonRepository
  ↓
PersonService
  ↓
PersonController
  ↓
PersonOutputDto
  ↓
HTTP
```

---

# Structure

```text
src/
├── api/
│   ├── person/
│   │   ├── person.rs
│   │   ├── person_input_dto.rs
│   │   ├── person_output_dto.rs
│   │   ├── repository.rs
│   │   ├── service.rs
│   │   ├── controller.rs
│   │   └── mod.rs
│   ├── root/
│   │   ├── controller.rs
│   │   └── mod.rs
│   └── mod.rs
├── config.rs
└── main.rs
```

---

# Dépendances

## Cargo.toml

```toml
[package]
name = "rust-starter"
version = "1.0.0"
edition = "2024"
description = "Demo project for Rust"

[dependencies]
axum = "0.8"
dotenvy = "0.15"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
sqlx = { version = "0.9", default-features = false, features = [
  "runtime-tokio",
  "postgres",
  "derive"
] }
tokio = { version = "1", features = [
  "macros",
  "rt-multi-thread",
  "net"
] }

[dev-dependencies]
tower = { version = "0.5", features = ["util"] }
```

SQLx `0.9` fournit le support Tokio, le driver utilisé ici et `FromRow`. :contentReference[oaicite:1]{index=1}

---

# Configuration

Créer :

```text
.env
```

Exemple :

```text
DATABASE_URL=postgres://postgres:password@localhost:5432/rust_starter
```

Ajouter dans :

```text
.gitignore
```

```text
.env
/target
```

Le format d’URL utilisé par `PgPool` est celui accepté par le driver SQLx correspondant. :contentReference[oaicite:2]{index=2}

---

# Table utilisée

Le code suppose simplement l’existence d’une table :

```text
persons
```

avec les colonnes :

```text
id
first_name
last_name
city_id
```

Dans cette version :

```text
id      → INTEGER → i32
city_id → INTEGER → i32
```

---

# Person

## Chemin

```text
src/api/person/person.rs
```

## Code

```rust
#[derive(
    Clone,
    Debug,
    Eq,
    PartialEq,
)]
pub struct Person {
    pub id: i32,
    pub first_name: String,
    pub last_name: String,
    pub city_id: i32,
}
```

`Person` reste le modèle interne.

---

# PersonInputDto

## Chemin

```text
src/api/person/person_input_dto.rs
```

## Code

```rust
use serde::Deserialize;

#[derive(
    Debug,
    Deserialize,
)]
#[serde(rename_all = "camelCase")]
pub struct PersonInputDto {
    pub first_name: String,
    pub last_name: String,
    pub city_id: i32,
}

impl PersonInputDto {
    pub fn validate_and_normalize(
        self,
    ) -> Result<Self, ()> {
        let first_name =
            self.first_name
                .trim()
                .to_string();

        let last_name =
            self.last_name
                .trim()
                .to_string();

        if first_name.is_empty()
            || first_name.chars().count() > 50
            || last_name.is_empty()
            || last_name.chars().count() > 50
            || self.city_id <= 0
        {
            return Err(());
        }

        Ok(Self {
            first_name,
            last_name,
            city_id: self.city_id,
        })
    }
}
```

---

# PersonOutputDto

## Chemin

```text
src/api/person/person_output_dto.rs
```

## Code

```rust
use serde::Serialize;

use super::person::Person;

#[derive(
    Debug,
    Serialize,
)]
#[serde(rename_all = "camelCase")]
pub struct PersonOutputDto {
    pub id: i32,
    pub first_name: String,
    pub last_name: String,
    pub city_id: i32,
}

impl From<&Person> for PersonOutputDto {
    fn from(
        person: &Person,
    ) -> Self {
        Self {
            id: person.id,
            first_name:
                person.first_name.clone(),
            last_name:
                person.last_name.clone(),
            city_id: person.city_id,
        }
    }
}
```

---

# PersonRepository

Le repository contient maintenant le pool de connexions.

```text
PersonRepository
    ↓
PgPool
    ↓
Database
```

Il ne contient plus :

```text
Vec<Person>
RwLock
Arc
AtomicU32
```

## Chemin

```text
src/api/person/repository.rs
```

## Code

```rust
use sqlx::PgPool;

use super::person::Person;

#[derive(
    sqlx::FromRow,
)]
struct PersonRow {
    id: i32,
    first_name: String,
    last_name: String,
    city_id: i32,
}

impl From<PersonRow> for Person {
    fn from(
        row: PersonRow,
    ) -> Self {
        Self {
            id: row.id,
            first_name: row.first_name,
            last_name: row.last_name,
            city_id: row.city_id,
        }
    }
}

#[derive(Clone)]
pub struct PersonRepository {
    pool: PgPool,
}

impl PersonRepository {
    pub fn new(
        pool: PgPool,
    ) -> Self {
        Self {
            pool,
        }
    }

    pub async fn find_all(
        &self,
    ) -> Result<
        Vec<Person>,
        sqlx::Error,
    > {
        let rows =
            sqlx::query_as::<
                _,
                PersonRow,
            >(
                r#"
                SELECT
                    id,
                    first_name,
                    last_name,
                    city_id
                FROM person
                ORDER BY id
                "#,
            )
            .fetch_all(
                &self.pool,
            )
            .await?;

        Ok(
            rows
                .into_iter()
                .map(Person::from)
                .collect(),
        )
    }

    pub async fn find_by_id(
        &self,
        id: i32,
    ) -> Result<
        Option<Person>,
        sqlx::Error,
    > {
        let row =
            sqlx::query_as::<
                _,
                PersonRow,
            >(
                r#"
                SELECT
                    id,
                    first_name,
                    last_name,
                    city_id
                FROM person
                WHERE id = $1
                "#,
            )
            .bind(id)
            .fetch_optional(
                &self.pool,
            )
            .await?;

        Ok(
            row.map(Person::from),
        )
    }

    pub async fn create(
        &self,
        first_name: String,
        last_name: String,
        city_id: i32,
    ) -> Result<
        Person,
        sqlx::Error,
    > {
        let row =
            sqlx::query_as::<
                _,
                PersonRow,
            >(
                r#"
                INSERT INTO person (
                    first_name,
                    last_name,
                    city_id
                )
                VALUES (
                    $1,
                    $2,
                    $3
                )
                RETURNING
                    id,
                    first_name,
                    last_name,
                    city_id
                "#,
            )
            .bind(first_name)
            .bind(last_name)
            .bind(city_id)
            .fetch_one(
                &self.pool,
            )
            .await?;

        Ok(
            Person::from(row),
        )
    }

    pub async fn update(
        &self,
        id: i32,
        first_name: String,
        last_name: String,
        city_id: i32,
    ) -> Result<
        Option<Person>,
        sqlx::Error,
    > {
        let row =
            sqlx::query_as::<
                _,
                PersonRow,
            >(
                r#"
                UPDATE person
                SET
                    first_name = $1,
                    last_name = $2,
                    city_id = $3
                WHERE id = $4
                RETURNING
                    id,
                    first_name,
                    last_name,
                    city_id
                "#,
            )
            .bind(first_name)
            .bind(last_name)
            .bind(city_id)
            .bind(id)
            .fetch_optional(
                &self.pool,
            )
            .await?;

        Ok(
            row.map(Person::from),
        )
    }

    pub async fn delete(
        &self,
        id: i32,
    ) -> Result<
        bool,
        sqlx::Error,
    > {
        let result =
            sqlx::query(
                r#"
                DELETE FROM person
                WHERE id = $1
                "#,
            )
            .bind(id)
            .execute(
                &self.pool,
            )
            .await?;

        Ok(
            result.rows_affected() > 0,
        )
    }
}
```

`query_as` construit ici des `PersonRow` grâce à `FromRow`, tandis que `fetch_optional` permet naturellement de représenter une ligne inexistante avec `Option`. :contentReference[oaicite:3]{index=3}

---

# PersonService

Le service ne connaît pas la base directement.

Il dépend uniquement du repository.

## Chemin

```text
src/api/person/service.rs
```

## Code

```rust
use super::{
    person::Person,
    repository::PersonRepository,
};

#[derive(Clone)]
pub struct PersonService {
    person_repository: PersonRepository,
}

impl PersonService {
    pub fn new(
        person_repository: PersonRepository,
    ) -> Self {
        Self {
            person_repository,
        }
    }

    pub async fn get_all(
        &self,
    ) -> Result<
        Vec<Person>,
        sqlx::Error,
    > {
        self.person_repository
            .find_all()
            .await
    }

    pub async fn get_by_id(
        &self,
        id: i32,
    ) -> Result<
        Option<Person>,
        sqlx::Error,
    > {
        self.person_repository
            .find_by_id(id)
            .await
    }

    pub async fn create(
        &self,
        first_name: String,
        last_name: String,
        city_id: i32,
    ) -> Result<
        Person,
        sqlx::Error,
    > {
        self.person_repository
            .create(
                first_name,
                last_name,
                city_id,
            )
            .await
    }

    pub async fn update(
        &self,
        id: i32,
        first_name: String,
        last_name: String,
        city_id: i32,
    ) -> Result<
        Option<Person>,
        sqlx::Error,
    > {
        self.person_repository
            .update(
                id,
                first_name,
                last_name,
                city_id,
            )
            .await
    }

    pub async fn delete(
        &self,
        id: i32,
    ) -> Result<
        bool,
        sqlx::Error,
    > {
        self.person_repository
            .delete(id)
            .await
    }
}
```

---

# PersonController

Le controller continue à dépendre uniquement du service.

```text
Controller
    ↓
Service
    ↓
Repository
```

Les erreurs d’accès aux données retournent :

```text
500 Internal Server Error
```

## Chemin

```text
src/api/person/controller.rs
```

## Code

```rust
use axum::{
    Json,
    Router,
    extract::{
        Path,
        State,
    },
    http::StatusCode,
    routing::get,
};
use sqlx::PgPool;

use super::{
    person_input_dto::PersonInputDto,
    person_output_dto::PersonOutputDto,
    repository::PersonRepository,
    service::PersonService,
};

#[derive(Clone)]
pub struct PersonController {
    person_service: PersonService,
}

impl PersonController {
    pub fn new(
        person_service: PersonService,
    ) -> Self {
        Self {
            person_service,
        }
    }
}

pub fn routes(
    pool: PgPool,
) -> Router {
    let repository =
        PersonRepository::new(
            pool,
        );

    let service =
        PersonService::new(
            repository,
        );

    let controller =
        PersonController::new(
            service,
        );

    Router::new()
        .route(
            "/persons",
            get(get_all_persons)
                .post(create_person),
        )
        .route(
            "/persons/{id}",
            get(get_person_by_id)
                .put(update_person)
                .delete(delete_person),
        )
        .with_state(
            controller,
        )
}

async fn get_all_persons(
    State(controller):
        State<PersonController>,
) -> Result<
    Json<Vec<PersonOutputDto>>,
    StatusCode,
> {
    let persons = controller
        .person_service
        .get_all()
        .await
        .map_err(
            |_| {
                StatusCode::
                    INTERNAL_SERVER_ERROR
            },
        )?;

    let output = persons
        .iter()
        .map(
            PersonOutputDto::from,
        )
        .collect();

    Ok(
        Json(output),
    )
}

async fn get_person_by_id(
    State(controller):
        State<PersonController>,
    Path(id): Path<i32>,
) -> Result<
    Json<PersonOutputDto>,
    StatusCode,
> {
    let person = controller
        .person_service
        .get_by_id(id)
        .await
        .map_err(
            |_| {
                StatusCode::
                    INTERNAL_SERVER_ERROR
            },
        )?
        .ok_or(
            StatusCode::NOT_FOUND,
        )?;

    Ok(
        Json(
            PersonOutputDto::from(
                &person,
            ),
        ),
    )
}

async fn create_person(
    State(controller):
        State<PersonController>,
    Json(input):
        Json<PersonInputDto>,
) -> Result<
    (
        StatusCode,
        Json<PersonOutputDto>,
    ),
    StatusCode,
> {
    let input = input
        .validate_and_normalize()
        .map_err(
            |_| StatusCode::BAD_REQUEST,
        )?;

    let person = controller
        .person_service
        .create(
            input.first_name,
            input.last_name,
            input.city_id,
        )
        .await
        .map_err(
            |_| {
                StatusCode::
                    INTERNAL_SERVER_ERROR
            },
        )?;

    Ok((
        StatusCode::CREATED,
        Json(
            PersonOutputDto::from(
                &person,
            ),
        ),
    ))
}

async fn update_person(
    State(controller):
        State<PersonController>,
    Path(id): Path<i32>,
    Json(input):
        Json<PersonInputDto>,
) -> Result<
    Json<PersonOutputDto>,
    StatusCode,
> {
    let input = input
        .validate_and_normalize()
        .map_err(
            |_| StatusCode::BAD_REQUEST,
        )?;

    let person = controller
        .person_service
        .update(
            id,
            input.first_name,
            input.last_name,
            input.city_id,
        )
        .await
        .map_err(
            |_| {
                StatusCode::
                    INTERNAL_SERVER_ERROR
            },
        )?
        .ok_or(
            StatusCode::NOT_FOUND,
        )?;

    Ok(
        Json(
            PersonOutputDto::from(
                &person,
            ),
        ),
    )
}

async fn delete_person(
    State(controller):
        State<PersonController>,
    Path(id): Path<i32>,
) -> Result<
    StatusCode,
    StatusCode,
> {
    let deleted = controller
        .person_service
        .delete(id)
        .await
        .map_err(
            |_| {
                StatusCode::
                    INTERNAL_SERVER_ERROR
            },
        )?;

    if !deleted {
        return Err(
            StatusCode::NOT_FOUND,
        );
    }

    Ok(
        StatusCode::NO_CONTENT,
    )
}
```

---

# Module Person

## Chemin

```text
src/api/person/mod.rs
```

## Code

```rust
pub mod controller;
pub mod person;
pub mod person_input_dto;
pub mod person_output_dto;
pub mod repository;
pub mod service;
```

---

# Module API

## Chemin

```text
src/api/mod.rs
```

## Code

```rust
pub mod person;
pub mod root;
```

---

# Configuration

## Chemin

```text
src/config.rs
```

## Code

```rust
pub const SERVER_ADDRESS: &str =
    "127.0.0.1:3000";

pub const DATABASE_URL_KEY: &str =
    "DATABASE_URL";
```

---

# Application

Le pool de connexions est créé au démarrage de l’application.

Il est ensuite transmis au module `Person`.

## Chemin

```text
src/main.rs
```

## Code

```rust
mod api;
mod config;

use std::env;

use api::{
    person,
    root,
};
use axum::Router;
use config::{
    DATABASE_URL_KEY,
    SERVER_ADDRESS,
};
use sqlx::postgres::PgPoolOptions;
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    let database_url =
        env::var(
            DATABASE_URL_KEY,
        )
        .expect(
            "DATABASE_URL absent",
        );

    let pool =
        PgPoolOptions::new()
            .max_connections(5)
            .connect(
                &database_url,
            )
            .await
            .expect(
                "Connexion à la database impossible",
            );

    println!(
        "Connexion à la database réussie"
    );

    let persons =
        sqlx::query_as::<
            _,
            (
                i32,
                String,
                String,
                i32,
            ),
        >(
            "SELECT * FROM person ORDER BY id",
        )
        .fetch_all(
            &pool,
        )
        .await
        .expect(
            "Lecture de la table person impossible",
        );

    println!(
        "Persons trouvées : {}",
        persons.len()
    );

    for person in persons {
        println!(
            "{} - {} {} - city_id: {}",
            person.0,
            person.1,
            person.2,
            person.3
        );
    }

    let app =
        Router::new()
            .merge(
                root::controller::routes(),
            )
            .merge(
                person::controller::routes(
                    pool,
                ),
            );

    let listener =
        TcpListener::bind(
            SERVER_ADDRESS,
        )
        .await
        .expect(
            "Impossible de démarrer le serveur",
        );

    println!(
        "Application disponible sur http://localhost:3000"
    );

    axum::serve(
        listener,
        app,
    )
    .await
    .expect(
        "Erreur pendant l'exécution du serveur",
    );
}
```

`PgPoolOptions` permet de configurer puis d’établir le pool de connexions partagé par l’application. :contentReference[oaicite:4]{index=4}

---

# Flux GET

```text
GET /persons/1
        ↓
PersonController
        ↓
PersonService.get_by_id()
        ↓
PersonRepository.find_by_id()
        ↓
SELECT
        ↓
PersonRow
        ↓
Person
        ↓
PersonOutputDto
        ↓
JSON
```

---

# Flux POST

```text
POST /persons
        ↓
PersonInputDto
        ↓
validation
        ↓
PersonController
        ↓
PersonService.create()
        ↓
PersonRepository.create()
        ↓
INSERT
        ↓
Person
        ↓
PersonOutputDto
        ↓
JSON
```

---

# Architecture finale

```text
HTTP
    ↓
DTO
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
SQLx
    ↓
Database
```

Chaque couche a maintenant une responsabilité claire :

```text
Controller  → HTTP
Service     → logique applicative
Repository  → requêtes SQL
SQLx        → accès base
```

Le changement principal par rapport à l’étape précédente est donc simplement :

```text
Avant

PersonRepository
    ↓
Vec<Person>


Maintenant

PersonRepository
    ↓
PgPool
    ↓
Database
```

---

# Vérification

Compiler :

```bash
cargo build
```

Lancer :

```bash
cargo run
```

Tester :

```text
GET    /persons
GET    /persons/1
POST   /persons
PUT    /persons/1
DELETE /persons/1
```