# CRUD REST – PersonController

Implémentation simple :

- un seul fichier pour le CRUD ;
- aucun Service ;
- aucun Repository ;
- stockage en mémoire.

---

## Structure

```text
src/
├── api/
│   ├── person/
│   │   ├── controller.rs
│   │   ├── controller_tests.rs
│   │   └── mod.rs
│   ├── root/
│   │   ├── controller.rs
│   │   └── mod.rs
│   └── mod.rs
├── config.rs
└── main.rs
```

---

## Endpoints exposés

| Méthode | URL           | Description                | Statut succès  |
|---------|---------------|----------------------------|----------------|
| GET     | /persons      | Liste les personnes        | 200 OK         |
| GET     | /persons/{id} | Trouve par identifiant     | 200 OK         |
| POST    | /persons      | Crée une personne          | 201 CREATED    |
| PUT     | /persons/{id} | Modifie une personne       | 200 OK         |
| DELETE  | /persons/{id} | Supprime une personne      | 204 NO CONTENT |

Base URL :

```text
http://localhost:3000/persons
```

---

## Modèle Person

Une personne contient les propriétés suivantes :

```json
{
  "id": 1,
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 1
}
```

- `id` : identifiant généré automatiquement ;
- `firstName` : prénom de la personne ;
- `lastName` : nom de la personne ;
- `cityId` : identifiant de la ville associée.

---

## Principe

- Le controller expose les endpoints REST.
- Les données sont stockées dans un `Vec<Person>`.
- Le `Vec<Person>` est protégé par un `RwLock`.
- L’état est partagé avec `Arc`.
- Un identifiant est généré automatiquement avec `AtomicU32`.
- Le modèle `Person` est une structure Rust.
- Sept réalisateurs américains sont chargés au démarrage.
- Aucun accès à une base de données.
- Les données sont perdues au redémarrage de l’application.

---

## Dépendances

Ajouter les dépendances :

```bash
cargo add axum
cargo add tokio --features macros,rt-multi-thread,net,sync
cargo add serde --features derive
cargo add serde_json
cargo add tower --dev --features util
```

---

## Cargo.toml

```toml
[package]
name = "rust-starter"
version = "1.0.0"
edition = "2024"
description = "Demo project for Rust"

[dependencies]
axum = "0.8"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tokio = { version = "1", features = [
  "macros",
  "rt-multi-thread",
  "net",
  "sync"
] }

[dev-dependencies]
tower = { version = "0.5", features = ["util"] }
```

---

## Données initiales

```json
[
  {
    "id": 1,
    "firstName": "Steven",
    "lastName": "Spielberg",
    "cityId": 1
  },
  {
    "id": 2,
    "firstName": "Martin",
    "lastName": "Scorsese",
    "cityId": 2
  },
  {
    "id": 3,
    "firstName": "Francis",
    "lastName": "Ford Coppola",
    "cityId": 3
  },
  {
    "id": 4,
    "firstName": "George",
    "lastName": "Lucas",
    "cityId": 4
  },
  {
    "id": 5,
    "firstName": "Quentin",
    "lastName": "Tarantino",
    "cityId": 5
  },
  {
    "id": 6,
    "firstName": "David",
    "lastName": "Fincher",
    "cityId": 6
  },
  {
    "id": 7,
    "firstName": "Spike",
    "lastName": "Lee",
    "cityId": 7
  }
]
```

---

## Code – controller.rs

Chemin :

```text
src/api/person/controller.rs
```

```rust
use std::{
    sync::{
        Arc,
        atomic::{
            AtomicU32,
            Ordering,
        },
    },
};

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
use serde::{
    Deserialize,
    Serialize,
};
use tokio::sync::RwLock;

#[derive(Clone)]
pub struct PersonController {
    id_counter: Arc<AtomicU32>,
    person_list: Arc<RwLock<Vec<Person>>>,
}

#[derive(
    Clone,
    Debug,
    Deserialize,
    Eq,
    PartialEq,
    Serialize,
)]
#[serde(rename_all = "camelCase")]
pub struct Person {
    pub id: u32,
    pub first_name: String,
    pub last_name: String,
    pub city_id: u32,
}

#[derive(
    Debug,
    Deserialize,
)]
#[serde(rename_all = "camelCase")]
pub struct PersonPayload {
    pub first_name: String,
    pub last_name: String,
    pub city_id: u32,
}

impl PersonController {
    pub fn new() -> Self {
        let person_list = vec![
            Person {
                id: 1,
                first_name: "Steven".to_string(),
                last_name: "Spielberg".to_string(),
                city_id: 1,
            },
            Person {
                id: 2,
                first_name: "Martin".to_string(),
                last_name: "Scorsese".to_string(),
                city_id: 2,
            },
            Person {
                id: 3,
                first_name: "Francis".to_string(),
                last_name: "Ford Coppola".to_string(),
                city_id: 3,
            },
            Person {
                id: 4,
                first_name: "George".to_string(),
                last_name: "Lucas".to_string(),
                city_id: 4,
            },
            Person {
                id: 5,
                first_name: "Quentin".to_string(),
                last_name: "Tarantino".to_string(),
                city_id: 5,
            },
            Person {
                id: 6,
                first_name: "David".to_string(),
                last_name: "Fincher".to_string(),
                city_id: 6,
            },
            Person {
                id: 7,
                first_name: "Spike".to_string(),
                last_name: "Lee".to_string(),
                city_id: 7,
            },
        ];

        Self {
            id_counter: Arc::new(
                AtomicU32::new(7),
            ),
            person_list: Arc::new(
                RwLock::new(person_list),
            ),
        }
    }
}

pub fn routes() -> Router {
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
        .with_state(PersonController::new())
}

async fn get_all_persons(
    State(controller): State<PersonController>,
) -> Json<Vec<Person>> {
    let person_list =
        controller.person_list.read().await;

    Json(person_list.clone())
}

async fn get_person_by_id(
    State(controller): State<PersonController>,
    Path(id): Path<u32>,
) -> Result<Json<Person>, StatusCode> {
    let person_list =
        controller.person_list.read().await;

    person_list
        .iter()
        .find(|person| person.id == id)
        .cloned()
        .map(Json)
        .ok_or(StatusCode::NOT_FOUND)
}

async fn create_person(
    State(controller): State<PersonController>,
    Json(new_person): Json<PersonPayload>,
) -> (StatusCode, Json<Person>) {
    let new_id = controller
        .id_counter
        .fetch_add(1, Ordering::SeqCst)
        + 1;

    let created = Person {
        id: new_id,
        first_name: new_person.first_name,
        last_name: new_person.last_name,
        city_id: new_person.city_id,
    };

    controller
        .person_list
        .write()
        .await
        .push(created.clone());

    (
        StatusCode::CREATED,
        Json(created),
    )
}

async fn update_person(
    State(controller): State<PersonController>,
    Path(id): Path<u32>,
    Json(modified): Json<PersonPayload>,
) -> Result<Json<Person>, StatusCode> {
    let mut person_list =
        controller.person_list.write().await;

    let person = person_list
        .iter_mut()
        .find(|person| person.id == id)
        .ok_or(StatusCode::NOT_FOUND)?;

    let updated = Person {
        id,
        first_name: modified.first_name,
        last_name: modified.last_name,
        city_id: modified.city_id,
    };

    *person = updated.clone();

    Ok(Json(updated))
}

async fn delete_person(
    State(controller): State<PersonController>,
    Path(id): Path<u32>,
) -> Result<StatusCode, StatusCode> {
    let mut person_list =
        controller.person_list.write().await;

    let index = person_list
        .iter()
        .position(|person| person.id == id)
        .ok_or(StatusCode::NOT_FOUND)?;

    person_list.remove(index);

    Ok(StatusCode::NO_CONTENT)
}
```

---

## Module Person

Chemin :

```text
src/api/person/mod.rs
```

```rust
pub mod controller;

#[cfg(test)]
mod controller_tests;
```

---

## Module API

Chemin :

```text
src/api/mod.rs
```

```rust
pub mod person;
pub mod root;
```

---

## Application

Le `RootController` et le `PersonController` sont regroupés dans le routeur principal.

Chemin :

```text
src/main.rs
```

```rust
mod api;
mod config;

use api::{
    person,
    root,
};
use axum::Router;
use config::SERVER_ADDRESS;
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .merge(root::controller::routes())
        .merge(person::controller::routes());

    let listener = TcpListener::bind(
        SERVER_ADDRESS,
    )
    .await
    .expect(
        "Impossible de démarrer le serveur",
    );

    println!(
        "Application disponible sur http://localhost:3000"
    );

    axum::serve(listener, app)
        .await
        .expect(
            "Erreur pendant l'exécution du serveur",
        );
}
```

---

## Payloads HTTP

### GET /persons

Aucun payload en entrée.

Réponse :

```json
[
  {
    "id": 1,
    "firstName": "Steven",
    "lastName": "Spielberg",
    "cityId": 1
  },
  {
    "id": 2,
    "firstName": "Martin",
    "lastName": "Scorsese",
    "cityId": 2
  }
]
```

---

### GET /persons/{id}

Exemple :

```text
GET /persons/1
```

Réponse :

```json
{
  "id": 1,
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 1
}
```

Personne inexistante :

```text
404 Not Found
```

---

### POST /persons

Payload en entrée :

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 8
}
```

Réponse :

```json
{
  "id": 8,
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 8
}
```

Statut HTTP :

```text
201 Created
```

L’identifiant éventuellement envoyé par le client est ignoré.

---

### PUT /persons/{id}

Exemple :

```text
PUT /persons/1
```

Payload en entrée :

```json
{
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 10
}
```

Réponse :

```json
{
  "id": 1,
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 10
}
```

L’identifiant présent dans l’URL est conservé.

---

### DELETE /persons/{id}

Exemple :

```text
DELETE /persons/1
```

Réponse :

```text
204 No Content
```

---

## Tests – controller_tests.rs

Chemin :

```text
src/api/person/controller_tests.rs
```

```rust
use axum::{
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
use serde::{
    de::DeserializeOwned,
};
use serde_json::{
    Value,
    json,
};
use tower::ServiceExt;

use super::controller::{
    Person,
    routes,
};

fn empty_request(
    method: Method,
    uri: &str,
) -> Request<Body> {
    Request::builder()
        .method(method)
        .uri(uri)
        .body(Body::empty())
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
            Body::from(payload.to_string()),
        )
        .unwrap()
}

async fn read_json<T>(
    response: Response<Body>,
) -> T
where
    T: DeserializeOwned,
{
    let bytes = to_bytes(
        response.into_body(),
        usize::MAX,
    )
    .await
    .unwrap();

    serde_json::from_slice(&bytes)
        .unwrap()
}

#[tokio::test]
async fn get_all_persons_should_return_seven_persons() {
    let response = routes()
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

    let persons: Vec<Person> =
        read_json(response).await;

    assert_eq!(persons.len(), 7);
}

#[tokio::test]
async fn get_all_persons_should_contain_steven_spielberg() {
    let response = routes()
        .oneshot(
            empty_request(
                Method::GET,
                "/persons",
            ),
        )
        .await
        .unwrap();

    let persons: Vec<Person> =
        read_json(response).await;

    assert!(
        persons.iter().any(
            |person| {
                person.first_name == "Steven"
                    && person.last_name
                        == "Spielberg"
            },
        ),
    );
}

#[tokio::test]
async fn get_all_persons_should_have_sequential_ids() {
    let response = routes()
        .oneshot(
            empty_request(
                Method::GET,
                "/persons",
            ),
        )
        .await
        .unwrap();

    let persons: Vec<Person> =
        read_json(response).await;

    for (
        index,
        person,
    ) in persons.iter().enumerate() {
        assert_eq!(
            person.id,
            index as u32 + 1,
        );
    }
}

#[tokio::test]
async fn get_person_by_id_should_return_person_when_id_exists() {
    let response = routes()
        .oneshot(
            empty_request(
                Method::GET,
                "/persons/1",
            ),
        )
        .await
        .unwrap();

    assert_eq!(
        response.status(),
        StatusCode::OK,
    );

    let person: Person =
        read_json(response).await;

    assert_eq!(person.id, 1);
    assert_eq!(
        person.first_name,
        "Steven",
    );
    assert_eq!(
        person.last_name,
        "Spielberg",
    );
    assert_eq!(person.city_id, 1);
}

#[tokio::test]
async fn get_person_by_id_should_return_not_found_when_id_does_not_exist() {
    let response = routes()
        .oneshot(
            empty_request(
                Method::GET,
                "/persons/999",
            ),
        )
        .await
        .unwrap();

    assert_eq!(
        response.status(),
        StatusCode::NOT_FOUND,
    );
}

#[tokio::test]
async fn create_person_should_add_person_and_return_generated_id() {
    let response = routes()
        .oneshot(
            json_request(
                Method::POST,
                "/persons",
                json!({
                    "firstName": "Clint",
                    "lastName": "Eastwood",
                    "cityId": 8
                }),
            ),
        )
        .await
        .unwrap();

    assert_eq!(
        response.status(),
        StatusCode::CREATED,
    );

    let person: Person =
        read_json(response).await;

    assert_eq!(person.id, 8);
    assert_eq!(
        person.first_name,
        "Clint",
    );
    assert_eq!(
        person.last_name,
        "Eastwood",
    );
    assert_eq!(person.city_id, 8);
}

#[tokio::test]
async fn create_person_should_increase_size_by_one() {
    let app = routes();

    app.clone()
        .oneshot(
            json_request(
                Method::POST,
                "/persons",
                json!({
                    "firstName": "Clint",
                    "lastName": "Eastwood",
                    "cityId": 8
                }),
            ),
        )
        .await
        .unwrap();

    let response = app
        .oneshot(
            empty_request(
                Method::GET,
                "/persons",
            ),
        )
        .await
        .unwrap();

    let persons: Vec<Person> =
        read_json(response).await;

    assert_eq!(persons.len(), 8);
}

#[tokio::test]
async fn create_person_should_ignore_input_id() {
    let response = routes()
        .oneshot(
            json_request(
                Method::POST,
                "/persons",
                json!({
                    "id": 999,
                    "firstName": "Clint",
                    "lastName": "Eastwood",
                    "cityId": 8
                }),
            ),
        )
        .await
        .unwrap();

    let person: Person =
        read_json(response).await;

    assert_ne!(person.id, 999);
    assert_eq!(person.id, 8);
}

#[tokio::test]
async fn update_person_should_modify_person_when_id_exists() {
    let response = routes()
        .oneshot(
            json_request(
                Method::PUT,
                "/persons/1",
                json!({
                    "firstName": "Steven",
                    "lastName": "Spielberg",
                    "cityId": 10
                }),
            ),
        )
        .await
        .unwrap();

    assert_eq!(
        response.status(),
        StatusCode::OK,
    );

    let person: Person =
        read_json(response).await;

    assert_eq!(person.id, 1);
    assert_eq!(
        person.first_name,
        "Steven",
    );
    assert_eq!(
        person.last_name,
        "Spielberg",
    );
    assert_eq!(person.city_id, 10);
}

#[tokio::test]
async fn update_person_should_preserve_id() {
    let response = routes()
        .oneshot(
            json_request(
                Method::PUT,
                "/persons/1",
                json!({
                    "id": 999,
                    "firstName": "Steven",
                    "lastName": "Spielberg",
                    "cityId": 10
                }),
            ),
        )
        .await
        .unwrap();

    let person: Person =
        read_json(response).await;

    assert_eq!(person.id, 1);
}

#[tokio::test]
async fn update_person_should_reflect_change_in_get() {
    let app = routes();

    app.clone()
        .oneshot(
            json_request(
                Method::PUT,
                "/persons/1",
                json!({
                    "firstName": "Steven",
                    "lastName": "Spielberg",
                    "cityId": 10
                }),
            ),
        )
        .await
        .unwrap();

    let response = app
        .oneshot(
            empty_request(
                Method::GET,
                "/persons/1",
            ),
        )
        .await
        .unwrap();

    let person: Person =
        read_json(response).await;

    assert_eq!(person.city_id, 10);
}

#[tokio::test]
async fn update_person_should_return_not_found_when_id_does_not_exist() {
    let response = routes()
        .oneshot(
            json_request(
                Method::PUT,
                "/persons/999",
                json!({
                    "firstName": "Unknown",
                    "lastName": "Person",
                    "cityId": 1
                }),
            ),
        )
        .await
        .unwrap();

    assert_eq!(
        response.status(),
        StatusCode::NOT_FOUND,
    );
}

#[tokio::test]
async fn delete_person_should_remove_person_when_id_exists() {
    let app = routes();

    let response = app
        .clone()
        .oneshot(
            empty_request(
                Method::DELETE,
                "/persons/1",
            ),
        )
        .await
        .unwrap();

    assert_eq!(
        response.status(),
        StatusCode::NO_CONTENT,
    );

    let response = app
        .oneshot(
            empty_request(
                Method::GET,
                "/persons",
            ),
        )
        .await
        .unwrap();

    let persons: Vec<Person> =
        read_json(response).await;

    assert_eq!(persons.len(), 6);
}

#[tokio::test]
async fn delete_person_should_make_id_unavailable() {
    let app = routes();

    app.clone()
        .oneshot(
            empty_request(
                Method::DELETE,
                "/persons/1",
            ),
        )
        .await
        .unwrap();

    let response = app
        .oneshot(
            empty_request(
                Method::GET,
                "/persons/1",
            ),
        )
        .await
        .unwrap();

    assert_eq!(
        response.status(),
        StatusCode::NOT_FOUND,
    );
}

#[tokio::test]
async fn delete_person_should_return_not_found_when_id_does_not_exist() {
    let response = routes()
        .oneshot(
            empty_request(
                Method::DELETE,
                "/persons/999",
            ),
        )
        .await
        .unwrap();

    assert_eq!(
        response.status(),
        StatusCode::NOT_FOUND,
    );
}

#[test]
fn person_struct_should_expose_properties() {
    let person = Person {
        id: 42,
        first_name: "John".to_string(),
        last_name: "Doe".to_string(),
        city_id: 5,
    };

    assert_eq!(person.id, 42);
    assert_eq!(
        person.first_name,
        "John",
    );
    assert_eq!(
        person.last_name,
        "Doe",
    );
    assert_eq!(person.city_id, 5);
}

#[test]
fn person_struct_should_implement_equality() {
    let person_1 = Person {
        id: 1,
        first_name: "Steven".to_string(),
        last_name: "Spielberg".to_string(),
        city_id: 1,
    };

    let person_2 = Person {
        id: 1,
        first_name: "Steven".to_string(),
        last_name: "Spielberg".to_string(),
        city_id: 1,
    };

    assert_eq!(
        person_1,
        person_2,
    );
}
```

---

## Exécution des tests

```bash
cargo test
```

Afficher le détail des tests :

```bash
cargo test -- --nocapture
```

---

## Lancement de l’application

```bash
cargo run
```

Accès :

```text
http://localhost:3000/persons
```

---

## Test manuel avec curl

### Liste des personnes

```bash
curl http://localhost:3000/persons
```

---

### Personne par identifiant

```bash
curl http://localhost:3000/persons/1
```

---

### Création

```bash
curl -X POST http://localhost:3000/persons \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"Clint\",\"lastName\":\"Eastwood\",\"cityId\":8}"
```

---

### Modification

```bash
curl -X PUT http://localhost:3000/persons/1 \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"Steven\",\"lastName\":\"Spielberg\",\"cityId\":10}"
```

---

### Suppression

```bash
curl -X DELETE http://localhost:3000/persons/1
```

---

## Principes clés

- `Router` définit les routes HTTP.
- `route()` associe une URL à plusieurs verbes HTTP.
- `get()` expose une route HTTP `GET`.
- `post()` expose une route HTTP `POST`.
- `put()` expose une route HTTP `PUT`.
- `delete()` expose une route HTTP `DELETE`.
- `Path<u32>` récupère l’identifiant présent dans l’URL.
- `Json<PersonPayload>` désérialise le payload JSON.
- `Json<Person>` sérialise une personne en JSON.
- `State<PersonController>` récupère l’état partagé.
- `StatusCode::CREATED` retourne le statut HTTP `201`.
- `StatusCode::NO_CONTENT` retourne le statut HTTP `204`.
- `StatusCode::NOT_FOUND` retourne le statut HTTP `404`.
- `Arc` partage les données entre les requêtes.
- `RwLock` sécurise les lectures et écritures concurrentes.
- `AtomicU32` génère les identifiants.
- `Vec<Person>` stocke les personnes en mémoire.
- `#[serde(rename_all = "camelCase")]` transforme les propriétés Rust en propriétés JSON camelCase.
- `Clone` permet de retourner une copie d’une personne.
- `PartialEq` et `Eq` permettent de comparer deux personnes.
- `tower::ServiceExt::oneshot()` permet de tester les routes sans démarrer un serveur HTTP.
- Le stockage en mémoire est réinitialisé à chaque redémarrage.