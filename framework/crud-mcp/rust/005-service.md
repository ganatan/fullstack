# Service – Person

Refactor du CRUD `PersonController` avec ajout d’un `PersonService`.

Le `PersonService` devient responsable :

- du stockage des personnes ;
- de la lecture des personnes ;
- de la création ;
- de la modification ;
- de la suppression ;
- de la génération des identifiants.

Le controller reste responsable :

- des routes HTTP ;
- de la lecture des paramètres HTTP ;
- de la validation du `PersonInputDto` ;
- de l’appel au service ;
- du mapping vers `PersonOutputDto` ;
- des codes HTTP retournés.

Il n’y a toujours :

- aucun Repository ;
- aucune base de données.

Les données restent stockées en mémoire.

---

## Architecture

```text
Payload JSON
    ↓
PersonInputDto
    ↓
PersonController
    ↓
PersonService
    ↓
Vec<Person>
    ↓
PersonService
    ↓
PersonController
    ↓
PersonOutputDto
    ↓
Réponse JSON
```

---

## Responsabilités

```text
PersonInputDto
    ↓
Validation des données entrantes

PersonController
    ↓
Gestion HTTP

PersonService
    ↓
Logique métier
Stockage en mémoire

Person
    ↓
Modèle interne

PersonOutputDto
    ↓
Format de sortie JSON
```

---

# Structure

Tous les fichiers liés à `Person` sont placés dans :

```text
api::person
```

## Code applicatif

```text
src/api/person/
├── person.rs
├── person_input_dto.rs
├── person_output_dto.rs
├── service.rs
├── controller.rs
└── mod.rs
```

## Tests

```text
src/api/person/
├── controller_tests.rs
└── service_tests.rs
```

Structure complète :

```text
src/
├── api/
│   ├── person/
│   │   ├── person.rs
│   │   ├── person_input_dto.rs
│   │   ├── person_output_dto.rs
│   │   ├── service.rs
│   │   ├── service_tests.rs
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

# Dépendances

Aucune nouvelle dépendance n’est nécessaire.

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

# Person

Le modèle `Person` ne change pas.

Il représente toujours l’objet interne manipulé par l’application.

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
    pub id: u32,
    pub first_name: String,
    pub last_name: String,
    pub city_id: u32,
}
```

Le modèle reste indépendant :

- d’Axum ;
- de Serde ;
- du protocole HTTP.

---

# PersonInputDto

Le DTO d’entrée ne change pas.

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
    pub city_id: u32,
}

impl PersonInputDto {
    pub fn validate_and_normalize(
        self,
    ) -> Result<Self, ()> {
        let first_name =
            self.first_name.trim().to_string();

        let last_name =
            self.last_name.trim().to_string();

        if first_name.is_empty()
            || first_name.chars().count() > 50
            || last_name.is_empty()
            || last_name.chars().count() > 50
            || self.city_id == 0
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

Le `PersonInputDto` reste responsable de la validation du payload HTTP.

---

# PersonOutputDto

Le DTO de sortie ne change pas.

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
    pub id: u32,
    pub first_name: String,
    pub last_name: String,
    pub city_id: u32,
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

Le mapping reste :

```text
Person
    ↓
PersonOutputDto
```

avec :

```rust
PersonOutputDto::from(&person)
```

---

# PersonService

Le `PersonService` contient maintenant les données en mémoire.

Le stockage qui se trouvait auparavant dans le controller est déplacé dans le service.

## Chemin

```text
src/api/person/service.rs
```

## Code

```rust
use std::sync::{
    Arc,
    atomic::{
        AtomicU32,
        Ordering,
    },
};

use tokio::sync::RwLock;

use super::person::Person;

#[derive(Clone)]
pub struct PersonService {
    id_counter: Arc<AtomicU32>,
    person_list: Arc<RwLock<Vec<Person>>>,
}

impl PersonService {
    pub fn new() -> Self {
        let person_list = vec![
            Person {
                id: 1,
                first_name:
                    "Steven".to_string(),
                last_name:
                    "Spielberg".to_string(),
                city_id: 1,
            },
            Person {
                id: 2,
                first_name:
                    "Martin".to_string(),
                last_name:
                    "Scorsese".to_string(),
                city_id: 2,
            },
            Person {
                id: 3,
                first_name:
                    "Francis".to_string(),
                last_name:
                    "Ford Coppola"
                        .to_string(),
                city_id: 3,
            },
            Person {
                id: 4,
                first_name:
                    "George".to_string(),
                last_name:
                    "Lucas".to_string(),
                city_id: 4,
            },
            Person {
                id: 5,
                first_name:
                    "Quentin".to_string(),
                last_name:
                    "Tarantino".to_string(),
                city_id: 5,
            },
            Person {
                id: 6,
                first_name:
                    "David".to_string(),
                last_name:
                    "Fincher".to_string(),
                city_id: 6,
            },
            Person {
                id: 7,
                first_name:
                    "Spike".to_string(),
                last_name:
                    "Lee".to_string(),
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

    pub async fn get_all(
        &self,
    ) -> Vec<Person> {
        self.person_list
            .read()
            .await
            .clone()
    }

    pub async fn get_by_id(
        &self,
        id: u32,
    ) -> Option<Person> {
        self.person_list
            .read()
            .await
            .iter()
            .find(
                |person| person.id == id,
            )
            .cloned()
    }

    pub async fn create(
        &self,
        first_name: String,
        last_name: String,
        city_id: u32,
    ) -> Person {
        let id = self
            .id_counter
            .fetch_add(
                1,
                Ordering::SeqCst,
            )
            + 1;

        let person = Person {
            id,
            first_name,
            last_name,
            city_id,
        };

        self.person_list
            .write()
            .await
            .push(person.clone());

        person
    }

    pub async fn update(
        &self,
        id: u32,
        first_name: String,
        last_name: String,
        city_id: u32,
    ) -> Option<Person> {
        let mut person_list =
            self.person_list
                .write()
                .await;

        let person = person_list
            .iter_mut()
            .find(
                |person| person.id == id,
            )?;

        person.first_name = first_name;
        person.last_name = last_name;
        person.city_id = city_id;

        Some(person.clone())
    }

    pub async fn delete(
        &self,
        id: u32,
    ) -> bool {
        let mut person_list =
            self.person_list
                .write()
                .await;

        let Some(index) = person_list
            .iter()
            .position(
                |person| person.id == id,
            )
        else {
            return false;
        };

        person_list.remove(index);

        true
    }
}
```

---

# Stockage partagé

Le service contient :

```rust
Arc<RwLock<Vec<Person>>>
```

La structure :

```text
Vec<Person>
```

contient les données.

Le :

```text
RwLock
```

protège les accès concurrents.

Le :

```text
Arc
```

permet de partager le même stockage entre plusieurs requêtes HTTP.

Architecture :

```text
PersonService
    ↓
Arc
    ↓
RwLock
    ↓
Vec<Person>
```

---

# Génération des identifiants

Le service contient également :

```rust
Arc<AtomicU32>
```

La valeur initiale est :

```rust
AtomicU32::new(7)
```

car les personnes initiales utilisent les identifiants :

```text
1
2
3
4
5
6
7
```

Lors de la création :

```rust
let id = self
    .id_counter
    .fetch_add(
        1,
        Ordering::SeqCst,
    )
    + 1;
```

Le premier nouvel identifiant sera donc :

```text
8
```

---

# Lecture de toutes les personnes

La méthode :

```rust
pub async fn get_all(
    &self,
) -> Vec<Person>
```

retourne la liste des personnes.

Le service retourne des modèles :

```text
Vec<Person>
```

et non des DTO.

Le service ne connaît pas :

```text
PersonOutputDto
```

---

# Lecture d’une personne

La méthode :

```rust
pub async fn get_by_id(
    &self,
    id: u32,
) -> Option<Person>
```

retourne :

```text
Some(Person)
```

si la personne existe.

Sinon :

```text
None
```

Le service ne retourne pas directement :

```text
404 NOT FOUND
```

Le code HTTP reste la responsabilité du controller.

---

# Création

La méthode :

```rust
pub async fn create(
    &self,
    first_name: String,
    last_name: String,
    city_id: u32,
) -> Person
```

reçoit les données déjà validées par le controller.

Elle :

```text
génère un identifiant
    ↓
crée un Person
    ↓
ajoute le Person au Vec<Person>
    ↓
retourne le Person créé
```

---

# Modification

La méthode :

```rust
pub async fn update(
    &self,
    id: u32,
    first_name: String,
    last_name: String,
    city_id: u32,
) -> Option<Person>
```

retourne :

```text
Some(Person)
```

si la personne a été modifiée.

Sinon :

```text
None
```

---

# Suppression

La méthode :

```rust
pub async fn delete(
    &self,
    id: u32,
) -> bool
```

retourne :

```text
true
```

si la personne a été supprimée.

Sinon :

```text
false
```

Le service ne connaît pas le code HTTP :

```text
204 NO CONTENT
```

ou :

```text
404 NOT FOUND
```

Cette traduction est effectuée par le controller.

---

# PersonController

Le controller ne contient maintenant plus les données.

Il contient uniquement une référence vers :

```text
PersonService
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

use super::{
    person_input_dto::PersonInputDto,
    person_output_dto::PersonOutputDto,
    service::PersonService,
};

#[derive(Clone)]
pub struct PersonController {
    person_service: PersonService,
}

impl PersonController {
    pub fn new() -> Self {
        Self {
            person_service:
                PersonService::new(),
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
        .with_state(
            PersonController::new(),
        )
}

async fn get_all_persons(
    State(controller):
        State<PersonController>,
) -> Json<Vec<PersonOutputDto>> {
    let person_list = controller
        .person_service
        .get_all()
        .await;

    let output = person_list
        .iter()
        .map(PersonOutputDto::from)
        .collect();

    Json(output)
}

async fn get_person_by_id(
    State(controller):
        State<PersonController>,
    Path(id): Path<u32>,
) -> Result<
    Json<PersonOutputDto>,
    StatusCode,
> {
    let person = controller
        .person_service
        .get_by_id(id)
        .await
        .ok_or(
            StatusCode::NOT_FOUND,
        )?;

    let output =
        PersonOutputDto::from(&person);

    Ok(Json(output))
}

async fn create_person(
    State(controller):
        State<PersonController>,
    Json(input): Json<PersonInputDto>,
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
        .await;

    let output =
        PersonOutputDto::from(&person);

    Ok((
        StatusCode::CREATED,
        Json(output),
    ))
}

async fn update_person(
    State(controller):
        State<PersonController>,
    Path(id): Path<u32>,
    Json(input): Json<PersonInputDto>,
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
        .ok_or(
            StatusCode::NOT_FOUND,
        )?;

    let output =
        PersonOutputDto::from(&person);

    Ok(Json(output))
}

async fn delete_person(
    State(controller):
        State<PersonController>,
    Path(id): Path<u32>,
) -> Result<
    StatusCode,
    StatusCode,
> {
    let deleted = controller
        .person_service
        .delete(id)
        .await;

    if !deleted {
        return Err(
            StatusCode::NOT_FOUND,
        );
    }

    Ok(StatusCode::NO_CONTENT)
}
```

---

# Évolution du controller

Avant l’ajout du service, le controller contenait :

```text
Arc<AtomicU32>
Arc<RwLock<Vec<Person>>>
```

Architecture :

```text
PersonController
├── id_counter
└── person_list
```

Maintenant :

```text
PersonController
└── PersonService
    ├── id_counter
    └── person_list
```

Le controller ne manipule plus directement :

```text
RwLock
AtomicU32
Vec<Person>
```

---

# Séparation des responsabilités

Le controller gère :

```text
HTTP
DTO
StatusCode
Path
State
Json
```

Le service gère :

```text
Person
Vec<Person>
création
lecture
modification
suppression
identifiants
```

Le service ne dépend pas d’Axum.

Il n’utilise aucun :

```rust
Json
```

aucun :

```rust
StatusCode
```

aucun :

```rust
Path
```

aucun :

```rust
State
```

---

# Module Person

Le module doit maintenant exposer le service.

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
pub mod service;

#[cfg(test)]
mod controller_tests;

#[cfg(test)]
mod service_tests;
```

---

# Module API

Le module principal de l’API ne change pas.

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

# Application

Le `main.rs` ne change pas.

Le controller continue d’exposer ses routes.

## Chemin

```text
src/main.rs
```

## Code

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
        .merge(
            root::controller::routes(),
        )
        .merge(
            person::controller::routes(),
        );

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

# Tests du service

Le service peut maintenant être testé indépendamment du protocole HTTP.

## Chemin

```text
src/api/person/service_tests.rs
```

## Code

```rust
use super::service::PersonService;

#[tokio::test]
async fn get_all_should_return_seven_persons() {
    let service =
        PersonService::new();

    let persons =
        service.get_all().await;

    assert_eq!(
        persons.len(),
        7,
    );
}

#[tokio::test]
async fn get_by_id_should_return_person() {
    let service =
        PersonService::new();

    let person = service
        .get_by_id(1)
        .await
        .unwrap();

    assert_eq!(
        person.id,
        1,
    );

    assert_eq!(
        person.first_name,
        "Steven",
    );

    assert_eq!(
        person.last_name,
        "Spielberg",
    );

    assert_eq!(
        person.city_id,
        1,
    );
}

#[tokio::test]
async fn get_by_id_should_return_none() {
    let service =
        PersonService::new();

    let person = service
        .get_by_id(999)
        .await;

    assert_eq!(
        person,
        None,
    );
}

#[tokio::test]
async fn create_should_add_person() {
    let service =
        PersonService::new();

    let person = service
        .create(
            "Clint".to_string(),
            "Eastwood".to_string(),
            8,
        )
        .await;

    assert_eq!(
        person.id,
        8,
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
        8,
    );

    let persons =
        service.get_all().await;

    assert_eq!(
        persons.len(),
        8,
    );
}

#[tokio::test]
async fn update_should_modify_person() {
    let service =
        PersonService::new();

    let person = service
        .update(
            1,
            "Steven".to_string(),
            "Spielberg Updated"
                .to_string(),
            10,
        )
        .await
        .unwrap();

    assert_eq!(
        person.id,
        1,
    );

    assert_eq!(
        person.first_name,
        "Steven",
    );

    assert_eq!(
        person.last_name,
        "Spielberg Updated",
    );

    assert_eq!(
        person.city_id,
        10,
    );
}

#[tokio::test]
async fn update_should_return_none() {
    let service =
        PersonService::new();

    let person = service
        .update(
            999,
            "Unknown".to_string(),
            "Person".to_string(),
            1,
        )
        .await;

    assert_eq!(
        person,
        None,
    );
}

#[tokio::test]
async fn delete_should_remove_person() {
    let service =
        PersonService::new();

    let deleted =
        service.delete(1).await;

    assert!(deleted);

    let person = service
        .get_by_id(1)
        .await;

    assert_eq!(
        person,
        None,
    );
}

#[tokio::test]
async fn delete_should_return_false() {
    let service =
        PersonService::new();

    let deleted =
        service.delete(999).await;

    assert!(!deleted);
}
```

---

# Tests du controller

Les tests HTTP restent pratiquement identiques.

Ils permettent maintenant de vérifier la chaîne complète :

```text
HTTP
    ↓
PersonController
    ↓
PersonService
    ↓
Person
    ↓
PersonOutputDto
    ↓
HTTP
```

## Chemin

```text
src/api/person/controller_tests.rs
```

## Code

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
use serde_json::{
    Value,
    json,
};
use tower::ServiceExt;

use super::controller::routes;

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
            Body::from(
                payload.to_string(),
            ),
        )
        .unwrap()
}

async fn read_json(
    response: Response<Body>,
) -> Value {
    let body = to_bytes(
        response.into_body(),
        usize::MAX,
    )
    .await
    .unwrap();

    serde_json::from_slice(&body)
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

    let body =
        read_json(response).await;

    assert_eq!(
        body.as_array()
            .unwrap()
            .len(),
        7,
    );
}

#[tokio::test]
async fn get_person_by_id_should_return_person_output() {
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

    let body =
        read_json(response).await;

    assert_eq!(
        body["id"],
        1,
    );

    assert_eq!(
        body["firstName"],
        "Steven",
    );

    assert_eq!(
        body["lastName"],
        "Spielberg",
    );

    assert_eq!(
        body["cityId"],
        1,
    );
}

#[tokio::test]
async fn create_person_should_return_created_person() {
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

    let body =
        read_json(response).await;

    assert_eq!(
        body["id"],
        8,
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
        8,
    );
}

#[tokio::test]
async fn create_person_should_reject_invalid_payload() {
    let response = routes()
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
    let response = routes()
        .oneshot(
            json_request(
                Method::PUT,
                "/persons/1",
                json!({
                    "firstName": "Steven",
                    "lastName": "Spielberg Updated",
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

    let body =
        read_json(response).await;

    assert_eq!(
        body["id"],
        1,
    );

    assert_eq!(
        body["lastName"],
        "Spielberg Updated",
    );

    assert_eq!(
        body["cityId"],
        10,
    );
}

#[tokio::test]
async fn delete_person_should_return_no_content() {
    let response = routes()
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
}

#[tokio::test]
async fn get_person_by_id_should_return_not_found() {
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
```

---

# Vérification

Compiler :

```bash
cargo build
```

Lancer tous les tests :

```bash
cargo test
```

Lancer uniquement les tests contenant `service` :

```bash
cargo test service
```

Lancer l’application :

```bash
cargo run
```

L’application reste disponible sur :

```text
http://localhost:3000
```

---

# Endpoints

## GET

```text
GET /persons
```

Retourne toutes les personnes.

---

## GET par identifiant

```text
GET /persons/1
```

Retourne :

```json
{
  "id": 1,
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 1
}
```

---

## POST

```text
POST /persons
```

Payload :

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 8
}
```

Réponse :

```text
201 CREATED
```

avec :

```json
{
  "id": 8,
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 8
}
```

---

## PUT

```text
PUT /persons/1
```

Payload :

```json
{
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 2
}
```

Réponse :

```text
200 OK
```

---

## DELETE

```text
DELETE /persons/1
```

Réponse :

```text
204 NO CONTENT
```

---

# Principes clés

- `PersonController` gère uniquement la couche HTTP.
- `PersonService` contient la logique applicative.
- `PersonService` contient temporairement les données en mémoire.
- `PersonService` manipule uniquement des `Person`.
- `PersonService` ne connaît pas `PersonInputDto`.
- `PersonService` ne connaît pas `PersonOutputDto`.
- `PersonService` ne connaît pas `StatusCode`.
- `PersonService` ne dépend pas d’Axum.
- `PersonInputDto` valide les données entrantes.
- `PersonOutputDto` contrôle les données retournées.
- `Person` reste le modèle interne.
- `Vec<Person>` représente temporairement le stockage.
- `RwLock` permet les lectures et écritures concurrentes.
- `Arc` partage le stockage.
- `AtomicU32` génère les identifiants.
- Le controller transforme les résultats du service en réponses HTTP.
- Le service peut être testé indépendamment du controller.
- Il n’existe toujours aucun Repository.
- Il n’existe toujours aucune base de données.

---

# Architecture actuelle

```text
HTTP
  ↓
PersonInputDto
  ↓
PersonController
  ↓
PersonService
  ↓
Vec<Person>
  ↓
PersonService
  ↓
PersonController
  ↓
PersonOutputDto
  ↓
HTTP
```

Le stockage est maintenant isolé du controller.

Le controller ne sait plus comment les données sont stockées.

Il sait uniquement qu’il peut appeler :

```text
PersonService
```

---

# Évolution

Avant :

```text
HTTP
  ↓
PersonController
  ↓
Vec<Person>
```

Après ajout des DTO :

```text
HTTP
  ↓
PersonInputDto
  ↓
PersonController
  ↓
Vec<Person>
  ↓
PersonOutputDto
  ↓
HTTP
```

Après ajout du service :

```text
HTTP
  ↓
PersonInputDto
  ↓
PersonController
  ↓
PersonService
  ↓
Vec<Person>
  ↓
PersonOutputDto
  ↓
HTTP
```

La prochaine étape sera l’ajout du `PersonRepository` :

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
Vec<Person>
  ↓
PersonService
  ↓
PersonOutputDto
  ↓
HTTP
```

À ce stade, le `Vec<Person>` pourra quitter le `PersonService` pour être déplacé dans le `PersonRepository`.