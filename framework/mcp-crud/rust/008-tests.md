# Tests – Person

Tests du CRUD `Person` avec l’architecture complète :

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Les tests utilisent la vraie base de données.

La table `person` doit donc exister et la connexion définie dans :

```text
.env
```

---

# Architecture des tests

Trois niveaux sont testés :

```text
controller_tests.rs
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

```text
service_tests.rs
    ↓
Service
    ↓
Repository
    ↓
Database
```

```text
repository_tests.rs
    ↓
Repository
    ↓
Database
```

---

# Structure

```text
src/
├── api/
│   ├── person/
│   │   ├── controller.rs
│   │   ├── controller_tests.rs
│   │   ├── person.rs
│   │   ├── person_input_dto.rs
│   │   ├── person_output_dto.rs
│   │   ├── repository.rs
│   │   ├── repository_tests.rs
│   │   ├── service.rs
│   │   ├── service_tests.rs
│   │   └── mod.rs
│   ├── root/
│   │   ├── controller.rs
│   │   └── mod.rs
│   └── mod.rs
├── config.rs
└── main.rs
```

---

# Module Person

Les fichiers de tests doivent être déclarés dans le module.

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

#[cfg(test)]
mod controller_tests;

#[cfg(test)]
mod repository_tests;

#[cfg(test)]
mod service_tests;
```

`#[cfg(test)]` indique que les modules sont compilés uniquement pendant :

```bash
cargo test
```

---

# Configuration

Les tests utilisent la même variable :

```text
DATABASE_URL
```

définie dans :

```text
.env
```

Exemple :

```text
DATABASE_URL=postgres://postgres:password@localhost:5432/rust_starter
```

La base doit être accessible avant de lancer les tests.

---

# Principe des données de test

Les tests ne doivent pas modifier directement les réalisateurs présents dans la table.

Il faut éviter par exemple :

```text
UPDATE person WHERE id = 1
DELETE person WHERE id = 1
```

Chaque test qui doit modifier des données crée sa propre personne :

```text
Test / GetAll
Test / GetById
Test / BeforeUpdate
Test / Delete
```

puis la supprime.

Cela permet de conserver intactes les données initiales.

---

# Tests Repository

Les tests du repository vérifient directement :

```text
PersonRepository
    ↓
SQL
    ↓
Table person
```

## Chemin

```text
src/api/person/repository_tests.rs
```

## Code

```rust
use std::env;

use sqlx::{
    PgPool,
    postgres::PgPoolOptions,
};

use super::repository::PersonRepository;

async fn create_pool() -> PgPool {
    dotenvy::dotenv().ok();

    let database_url =
        env::var(
            "DATABASE_URL",
        )
        .expect(
            "DATABASE_URL absent",
        );

    PgPoolOptions::new()
        .max_connections(5)
        .connect(
            &database_url,
        )
        .await
        .expect(
            "Connexion database impossible",
        )
}

async fn create_repository() -> PersonRepository {
    let pool =
        create_pool().await;

    PersonRepository::new(
        pool,
    )
}

#[tokio::test]
async fn find_all_should_return_persons() {
    let repository =
        create_repository().await;

    let person = repository
        .create(
            "Test".to_string(),
            "FindAll".to_string(),
            101,
        )
        .await
        .unwrap();

    let persons = repository
        .find_all()
        .await
        .unwrap();

    assert!(
        persons
            .iter()
            .any(
                |item| {
                    item.id == person.id
                },
            ),
    );

    repository
        .delete(
            person.id,
        )
        .await
        .unwrap();
}

#[tokio::test]
async fn find_by_id_should_return_person() {
    let repository =
        create_repository().await;

    let created = repository
        .create(
            "Test".to_string(),
            "FindById".to_string(),
            102,
        )
        .await
        .unwrap();

    let person = repository
        .find_by_id(
            created.id,
        )
        .await
        .unwrap()
        .unwrap();

    assert_eq!(
        person.id,
        created.id,
    );

    assert_eq!(
        person.first_name,
        "Test",
    );

    assert_eq!(
        person.last_name,
        "FindById",
    );

    assert_eq!(
        person.city_id,
        102,
    );

    repository
        .delete(
            created.id,
        )
        .await
        .unwrap();
}

#[tokio::test]
async fn find_by_id_should_return_none() {
    let repository =
        create_repository().await;

    let person = repository
        .find_by_id(
            i32::MAX,
        )
        .await
        .unwrap();

    assert_eq!(
        person,
        None,
    );
}

#[tokio::test]
async fn create_should_add_person() {
    let repository =
        create_repository().await;

    let person = repository
        .create(
            "Clint".to_string(),
            "Eastwood".to_string(),
            103,
        )
        .await
        .unwrap();

    assert!(
        person.id > 0,
    );

    assert_eq!(
        person.first_name,
        "Clint",
    );

    assert_eq!(
        person.last_name,
        "Eastwood",
    );

    assert_eq!(
        person.city_id,
        103,
    );

    let stored_person = repository
        .find_by_id(
            person.id,
        )
        .await
        .unwrap()
        .unwrap();

    assert_eq!(
        stored_person,
        person,
    );

    repository
        .delete(
            person.id,
        )
        .await
        .unwrap();
}

#[tokio::test]
async fn update_should_modify_person() {
    let repository =
        create_repository().await;

    let created = repository
        .create(
            "Test".to_string(),
            "BeforeUpdate".to_string(),
            104,
        )
        .await
        .unwrap();

    let person = repository
        .update(
            created.id,
            "Test".to_string(),
            "AfterUpdate".to_string(),
            105,
        )
        .await
        .unwrap()
        .unwrap();

    assert_eq!(
        person.id,
        created.id,
    );

    assert_eq!(
        person.first_name,
        "Test",
    );

    assert_eq!(
        person.last_name,
        "AfterUpdate",
    );

    assert_eq!(
        person.city_id,
        105,
    );

    let stored_person = repository
        .find_by_id(
            created.id,
        )
        .await
        .unwrap()
        .unwrap();

    assert_eq!(
        stored_person.last_name,
        "AfterUpdate",
    );

    assert_eq!(
        stored_person.city_id,
        105,
    );

    repository
        .delete(
            created.id,
        )
        .await
        .unwrap();
}

#[tokio::test]
async fn update_should_return_none() {
    let repository =
        create_repository().await;

    let person = repository
        .update(
            i32::MAX,
            "Unknown".to_string(),
            "Person".to_string(),
            106,
        )
        .await
        .unwrap();

    assert_eq!(
        person,
        None,
    );
}

#[tokio::test]
async fn delete_should_remove_person() {
    let repository =
        create_repository().await;

    let created = repository
        .create(
            "Test".to_string(),
            "Delete".to_string(),
            107,
        )
        .await
        .unwrap();

    let deleted = repository
        .delete(
            created.id,
        )
        .await
        .unwrap();

    assert!(
        deleted,
    );

    let person = repository
        .find_by_id(
            created.id,
        )
        .await
        .unwrap();

    assert_eq!(
        person,
        None,
    );
}

#[tokio::test]
async fn delete_should_return_false() {
    let repository =
        create_repository().await;

    let deleted = repository
        .delete(
            i32::MAX,
        )
        .await
        .unwrap();

    assert!(
        !deleted,
    );
}
```

---

# Tests Service

Les tests du service vérifient :

```text
PersonService
    ↓
PersonRepository
    ↓
Database
```

Le service utilise donc un vrai repository.

## Chemin

```text
src/api/person/service_tests.rs
```

## Code

```rust
use std::env;

use sqlx::postgres::PgPoolOptions;

use super::{
    repository::PersonRepository,
    service::PersonService,
};

async fn create_service() -> PersonService {
    dotenvy::dotenv().ok();

    let database_url =
        env::var(
            "DATABASE_URL",
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
                "Connexion database impossible",
            );

    let repository =
        PersonRepository::new(
            pool,
        );

    PersonService::new(
        repository,
    )
}

#[tokio::test]
async fn get_all_should_return_persons() {
    let service =
        create_service().await;

    let created = service
        .create(
            "Test".to_string(),
            "GetAll".to_string(),
            101,
        )
        .await
        .unwrap();

    let persons = service
        .get_all()
        .await
        .unwrap();

    assert!(
        persons
            .iter()
            .any(
                |person| {
                    person.id == created.id
                },
            ),
    );

    service
        .delete(
            created.id,
        )
        .await
        .unwrap();
}

#[tokio::test]
async fn get_by_id_should_return_person() {
    let service =
        create_service().await;

    let created = service
        .create(
            "Test".to_string(),
            "GetById".to_string(),
            102,
        )
        .await
        .unwrap();

    let person = service
        .get_by_id(
            created.id,
        )
        .await
        .unwrap()
        .unwrap();

    assert_eq!(
        person.id,
        created.id,
    );

    assert_eq!(
        person.first_name,
        "Test",
    );

    assert_eq!(
        person.last_name,
        "GetById",
    );

    assert_eq!(
        person.city_id,
        102,
    );

    service
        .delete(
            created.id,
        )
        .await
        .unwrap();
}

#[tokio::test]
async fn get_by_id_should_return_none() {
    let service =
        create_service().await;

    let person = service
        .get_by_id(
            i32::MAX,
        )
        .await
        .unwrap();

    assert_eq!(
        person,
        None,
    );
}

#[tokio::test]
async fn create_should_add_person() {
    let service =
        create_service().await;

    let person = service
        .create(
            "Clint".to_string(),
            "Eastwood".to_string(),
            103,
        )
        .await
        .unwrap();

    assert!(
        person.id > 0,
    );

    assert_eq!(
        person.first_name,
        "Clint",
    );

    assert_eq!(
        person.last_name,
        "Eastwood",
    );

    assert_eq!(
        person.city_id,
        103,
    );

    let stored_person = service
        .get_by_id(
            person.id,
        )
        .await
        .unwrap()
        .unwrap();

    assert_eq!(
        stored_person,
        person,
    );

    service
        .delete(
            person.id,
        )
        .await
        .unwrap();
}

#[tokio::test]
async fn update_should_modify_person() {
    let service =
        create_service().await;

    let created = service
        .create(
            "Test".to_string(),
            "BeforeUpdate".to_string(),
            104,
        )
        .await
        .unwrap();

    let person = service
        .update(
            created.id,
            "Test".to_string(),
            "AfterUpdate".to_string(),
            105,
        )
        .await
        .unwrap()
        .unwrap();

    assert_eq!(
        person.id,
        created.id,
    );

    assert_eq!(
        person.first_name,
        "Test",
    );

    assert_eq!(
        person.last_name,
        "AfterUpdate",
    );

    assert_eq!(
        person.city_id,
        105,
    );

    let stored_person = service
        .get_by_id(
            created.id,
        )
        .await
        .unwrap()
        .unwrap();

    assert_eq!(
        stored_person.last_name,
        "AfterUpdate",
    );

    assert_eq!(
        stored_person.city_id,
        105,
    );

    service
        .delete(
            created.id,
        )
        .await
        .unwrap();
}

#[tokio::test]
async fn update_should_return_none() {
    let service =
        create_service().await;

    let person = service
        .update(
            i32::MAX,
            "Unknown".to_string(),
            "Person".to_string(),
            106,
        )
        .await
        .unwrap();

    assert_eq!(
        person,
        None,
    );
}

#[tokio::test]
async fn delete_should_remove_person() {
    let service =
        create_service().await;

    let created = service
        .create(
            "Test".to_string(),
            "Delete".to_string(),
            107,
        )
        .await
        .unwrap();

    let deleted = service
        .delete(
            created.id,
        )
        .await
        .unwrap();

    assert!(
        deleted,
    );

    let person = service
        .get_by_id(
            created.id,
        )
        .await
        .unwrap();

    assert_eq!(
        person,
        None,
    );
}

#[tokio::test]
async fn delete_should_return_false() {
    let service =
        create_service().await;

    let deleted = service
        .delete(
            i32::MAX,
        )
        .await
        .unwrap();

    assert!(
        !deleted,
    );
}
```

---

# Tests Controller

Les tests du controller vérifient toute la chaîne applicative :

```text
HTTP
    ↓
PersonController
    ↓
PersonService
    ↓
PersonRepository
    ↓
Database
```

Les requêtes sont envoyées directement au `Router` Axum.

Aucun serveur HTTP réel n’est nécessaire.

## Chemin

```text
src/api/person/controller_tests.rs
```

## Code

```rust
use std::env;

use axum::{
    Router,
    body::{
        Body,
        to_bytes,
    },
    http::{
        Method,
        Request,
        Response,
        StatusCode,
        header::CONTENT_TYPE,
    },
};
use serde_json::{
    Value,
    json,
};
use sqlx::{
    PgPool,
    postgres::PgPoolOptions,
};
use tower::ServiceExt;

use super::controller::routes;

async fn create_pool() -> PgPool {
    dotenvy::dotenv().ok();

    let database_url =
        env::var(
            "DATABASE_URL",
        )
        .expect(
            "DATABASE_URL absent",
        );

    PgPoolOptions::new()
        .max_connections(5)
        .connect(
            &database_url,
        )
        .await
        .expect(
            "Connexion database impossible",
        )
}

async fn create_app() -> (
    Router,
    PgPool,
) {
    let pool =
        create_pool().await;

    let app =
        routes(
            pool.clone(),
        );

    (
        app,
        pool,
    )
}

async fn insert_person(
    pool: &PgPool,
    first_name: &str,
    last_name: &str,
    city_id: i32,
) -> i32 {
    sqlx::query_scalar::<
        _,
        i32,
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
        RETURNING id
        "#,
    )
    .bind(first_name)
    .bind(last_name)
    .bind(city_id)
    .fetch_one(pool)
    .await
    .unwrap()
}

async fn delete_person(
    pool: &PgPool,
    id: i32,
) {
    sqlx::query(
        r#"
        DELETE FROM person
        WHERE id = $1
        "#,
    )
    .bind(id)
    .execute(pool)
    .await
    .unwrap();
}

fn empty_request(
    method: Method,
    uri: &str,
) -> Request<Body> {
    Request::builder()
        .method(method)
        .uri(uri)
        .body(
            Body::empty(),
        )
        .unwrap()
}

fn json_request(
    method: Method,
    uri: &str,
    payload: Value,
) -> Request<Body> {
    Request::builder()
        .method(method)
        .uri(uri)
        .header(
            CONTENT_TYPE,
            "application/json",
        )
        .body(
            Body::from(
                payload.to_string(),
            ),
        )
        .unwrap()
}

async fn read_json(
    response: Response<Body>,
) -> Value {
    let body =
        to_bytes(
            response.into_body(),
            usize::MAX,
        )
        .await
        .unwrap();

    serde_json::from_slice(
        &body,
    )
    .unwrap()
}

#[tokio::test]
async fn get_all_persons_should_return_persons() {
    let (
        app,
        pool,
    ) = create_app().await;

    let id =
        insert_person(
            &pool,
            "Test",
            "GetAll",
            100,
        )
        .await;

    let response = app
        .oneshot(
            empty_request(
                Method::GET,
                "/persons",
            ),
        )
        .await
        .unwrap();

    assert_eq!(
        response.status(),
        StatusCode::OK,
    );

    let body =
        read_json(response).await;

    let persons =
        body.as_array()
            .unwrap();

    assert!(
        persons
            .iter()
            .any(
                |person| {
                    person["id"]
                        == id
                },
            ),
    );

    delete_person(
        &pool,
        id,
    )
    .await;
}

#[tokio::test]
async fn get_person_by_id_should_return_person_output() {
    let (
        app,
        pool,
    ) = create_app().await;

    let id =
        insert_person(
            &pool,
            "Test",
            "GetById",
            101,
        )
        .await;

    let uri =
        format!(
            "/persons/{id}"
        );

    let response = app
        .oneshot(
            empty_request(
                Method::GET,
                &uri,
            ),
        )
        .await
        .unwrap();

    assert_eq!(
        response.status(),
        StatusCode::OK,
    );

    let body =
        read_json(response).await;

    assert_eq!(
        body["id"],
        id,
    );

    assert_eq!(
        body["firstName"],
        "Test",
    );

    assert_eq!(
        body["lastName"],
        "GetById",
    );

    assert_eq!(
        body["cityId"],
        101,
    );

    delete_person(
        &pool,
        id,
    )
    .await;
}

#[tokio::test]
async fn create_person_should_return_created_person() {
    let (
        app,
        pool,
    ) = create_app().await;

    let response = app
        .oneshot(
            json_request(
                Method::POST,
                "/persons",
                json!({
                    "firstName": "Clint",
                    "lastName": "Eastwood",
                    "cityId": 102
                }),
            ),
        )
        .await
        .unwrap();

    assert_eq!(
        response.status(),
        StatusCode::CREATED,
    );

    let body =
        read_json(response).await;

    let id =
        body["id"]
            .as_i64()
            .unwrap()
            as i32;

    assert!(
        id > 0,
    );

    assert_eq!(
        body["firstName"],
        "Clint",
    );

    assert_eq!(
        body["lastName"],
        "Eastwood",
    );

    assert_eq!(
        body["cityId"],
        102,
    );

    delete_person(
        &pool,
        id,
    )
    .await;
}

#[tokio::test]
async fn create_person_should_reject_invalid_payload() {
    let (
        app,
        _,
    ) = create_app().await;

    let response = app
        .oneshot(
            json_request(
                Method::POST,
                "/persons",
                json!({
                    "firstName": "",
                    "lastName": "Eastwood",
                    "cityId": 0
                }),
            ),
        )
        .await
        .unwrap();

    assert_eq!(
        response.status(),
        StatusCode::BAD_REQUEST,
    );
}

#[tokio::test]
async fn update_person_should_return_updated_person() {
    let (
        app,
        pool,
    ) = create_app().await;

    let id =
        insert_person(
            &pool,
            "Test",
            "BeforeUpdate",
            103,
        )
        .await;

    let uri =
        format!(
            "/persons/{id}"
        );

    let response = app
        .oneshot(
            json_request(
                Method::PUT,
                &uri,
                json!({
                    "firstName": "Test",
                    "lastName": "AfterUpdate",
                    "cityId": 104
                }),
            ),
        )
        .await
        .unwrap();

    assert_eq!(
        response.status(),
        StatusCode::OK,
    );

    let body =
        read_json(response).await;

    assert_eq!(
        body["id"],
        id,
    );

    assert_eq!(
        body["firstName"],
        "Test",
    );

    assert_eq!(
        body["lastName"],
        "AfterUpdate",
    );

    assert_eq!(
        body["cityId"],
        104,
    );

    delete_person(
        &pool,
        id,
    )
    .await;
}

#[tokio::test]
async fn delete_person_should_return_no_content() {
    let (
        app,
        pool,
    ) = create_app().await;

    let id =
        insert_person(
            &pool,
            "Test",
            "Delete",
            105,
        )
        .await;

    let uri =
        format!(
            "/persons/{id}"
        );

    let response = app
        .oneshot(
            empty_request(
                Method::DELETE,
                &uri,
            ),
        )
        .await
        .unwrap();

    assert_eq!(
        response.status(),
        StatusCode::NO_CONTENT,
    );

    let count =
        sqlx::query_scalar::<
            _,
            i64,
        >(
            r#"
            SELECT COUNT(*)
            FROM person
            WHERE id = $1
            "#,
        )
        .bind(id)
        .fetch_one(
            &pool,
        )
        .await
        .unwrap();

    assert_eq!(
        count,
        0,
    );
}

#[tokio::test]
async fn get_person_by_id_should_return_not_found() {
    let (
        app,
        _,
    ) = create_app().await;

    let response = app
        .oneshot(
            empty_request(
                Method::GET,
                "/persons/2147483647",
            ),
        )
        .await
        .unwrap();

    assert_eq!(
        response.status(),
        StatusCode::NOT_FOUND,
    );
}
```

---

# Tests Repository couverts

```text
find_all_should_return_persons
```

Vérifie que :

```text
find_all()
```

retourne bien une personne présente dans la base.

---

```text
find_by_id_should_return_person
```

Vérifie la récupération d’une personne existante.

---

```text
find_by_id_should_return_none
```

Vérifie le comportement lorsqu’un identifiant n’existe pas.

---

```text
create_should_add_person
```

Vérifie :

```text
INSERT
```

puis :

```text
SELECT
```

de la personne créée.

---

```text
update_should_modify_person
```

Vérifie :

```text
UPDATE
```

puis la persistance des nouvelles valeurs.

---

```text
update_should_return_none
```

Vérifie la modification d’une personne inexistante.

---

```text
delete_should_remove_person
```

Vérifie :

```text
DELETE
```

puis l’absence de la personne.

---

```text
delete_should_return_false
```

Vérifie la suppression d’un identifiant inexistant.

---

# Tests Service couverts

Les mêmes opérations CRUD sont vérifiées au niveau du service :

```text
get_all
get_by_id
create
update
delete
```

Le but est de vérifier que :

```text
PersonService
```

transmet correctement les opérations au :

```text
PersonRepository
```

---

# Tests Controller couverts

Les tests Controller utilisent de vraies requêtes HTTP Axum.

Ils vérifient :

```text
GET /persons
GET /persons/{id}
POST /persons
PUT /persons/{id}
DELETE /persons/{id}
```

Ils vérifient également les codes HTTP :

```text
200 OK
201 CREATED
204 NO CONTENT
400 BAD REQUEST
404 NOT FOUND
```

---

# Test GET

```text
GET /persons
```

Vérifie :

```text
HTTP
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Résultat attendu :

```text
200 OK
```

---

# Test GET par identifiant

```text
GET /persons/{id}
```

Résultat attendu :

```text
200 OK
```

Le JSON retourné doit contenir :

```json
{
  "id": 1,
  "firstName": "Test",
  "lastName": "GetById",
  "cityId": 101
}
```

L’identifiant réel dépend de la base.

---

# Test POST

```text
POST /persons
```

Payload :

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 102
}
```

Résultat attendu :

```text
201 CREATED
```

---

# Test de validation

Payload :

```json
{
  "firstName": "",
  "lastName": "Eastwood",
  "cityId": 0
}
```

Résultat attendu :

```text
400 BAD REQUEST
```

Cela valide également :

```text
PersonInputDto
    ↓
validate_and_normalize()
```

---

# Test PUT

```text
PUT /persons/{id}
```

Payload :

```json
{
  "firstName": "Test",
  "lastName": "AfterUpdate",
  "cityId": 104
}
```

Résultat attendu :

```text
200 OK
```

---

# Test DELETE

```text
DELETE /persons/{id}
```

Résultat attendu :

```text
204 NO CONTENT
```

Le test effectue ensuite :

```sql
SELECT COUNT(*)
FROM person
WHERE id = $1
```

Le résultat doit être :

```text
0
```

---

# Test 404

```text
GET /persons/2147483647
```

Résultat attendu :

```text
404 NOT FOUND
```

---

# Pourquoi ne plus tester un nombre fixe de personnes

Avec le stockage en mémoire, il était possible de tester :

```rust
assert_eq!(
    persons.len(),
    7,
);
```

La base de données peut évoluer.

Elle peut contenir :

```text
10
15
50
100
```

personnes.

Le test ne doit donc plus dépendre du nombre total de lignes.

On vérifie plutôt qu’une personne créée spécialement pour le test est présente :

```rust
assert!(
    persons
        .iter()
        .any(
            |person| {
                person.id == created.id
            },
        ),
);
```

---

# Pourquoi ne plus tester un identifiant fixe

Avec le stockage en mémoire :

```text
7 personnes
```

permettait de prévoir :

```text
prochain id = 8
```

Avec une base de données, la séquence continue à évoluer même après des suppressions.

On ne doit donc pas tester :

```rust
assert_eq!(
    person.id,
    8,
);
```

On teste :

```rust
assert!(
    person.id > 0,
);
```

---

# Nettoyage des données

Les tests qui créent une personne la suppriment à la fin.

Exemple :

```rust
let person = repository
    .create(
        "Test".to_string(),
        "FindAll".to_string(),
        101,
    )
    .await
    .unwrap();
```

Puis :

```rust
repository
    .delete(
        person.id,
    )
    .await
    .unwrap();
```

Cela évite de polluer progressivement la table avec les données de test.

---

# Données réelles conservées

Les tests ne doivent jamais effectuer directement :

```text
DELETE id = 1
UPDATE id = 1
```

Les réalisateurs présents initialement restent donc intacts.

Exemple :

```text
Steven Spielberg
Martin Scorsese
Francis Ford Coppola
George Lucas
Quentin Tarantino
David Fincher
Spike Lee
Christopher Nolan
James Cameron
Ridley Scott
```

---

# Lancer tous les tests

```bash
cargo test
```

---

# Lancer les tests Repository

```bash
cargo test repository_tests
```

---

# Lancer les tests Service

```bash
cargo test service_tests
```

---

# Lancer les tests Controller

```bash
cargo test controller_tests
```

---

# Afficher les sorties des tests

Par défaut, Rust masque les sorties standards des tests qui réussissent.

Pour les afficher :

```bash
cargo test -- --nocapture
```

---

# Résultat attendu

Le résultat doit ressembler à :

```text
running 22 tests

test api::person::repository_tests::find_all_should_return_persons ... ok
test api::person::repository_tests::find_by_id_should_return_person ... ok
test api::person::repository_tests::find_by_id_should_return_none ... ok
test api::person::repository_tests::create_should_add_person ... ok
test api::person::repository_tests::update_should_modify_person ... ok
test api::person::repository_tests::update_should_return_none ... ok
test api::person::repository_tests::delete_should_remove_person ... ok
test api::person::repository_tests::delete_should_return_false ... ok

test api::person::service_tests::get_all_should_return_persons ... ok
test api::person::service_tests::get_by_id_should_return_person ... ok
test api::person::service_tests::get_by_id_should_return_none ... ok
test api::person::service_tests::create_should_add_person ... ok
test api::person::service_tests::update_should_modify_person ... ok
test api::person::service_tests::update_should_return_none ... ok
test api::person::service_tests::delete_should_remove_person ... ok
test api::person::service_tests::delete_should_return_false ... ok

test api::person::controller_tests::get_all_persons_should_return_persons ... ok
test api::person::controller_tests::get_person_by_id_should_return_person_output ... ok
test api::person::controller_tests::create_person_should_return_created_person ... ok
test api::person::controller_tests::create_person_should_reject_invalid_payload ... ok
test api::person::controller_tests::update_person_should_return_updated_person ... ok
test api::person::controller_tests::delete_person_should_return_no_content ... ok
test api::person::controller_tests::get_person_by_id_should_return_not_found ... ok

test result: ok
```

Le nombre exact de tests dépend des tests présents dans le projet.

---

# Architecture testée

À la fin, les trois niveaux sont couverts :

```text
Repository
    ↓
Database
```

```text
Service
    ↓
Repository
    ↓
Database
```

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Le CRUD complet est testé :

```text
CREATE
READ
UPDATE
DELETE
```

ainsi que les principaux cas négatifs :

```text
ressource inexistante
payload invalide
update inexistant
delete inexistant
```

L’application possède maintenant des tests couvrant toute la chaîne :

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
Database
```