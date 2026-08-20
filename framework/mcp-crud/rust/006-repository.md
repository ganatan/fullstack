# Repository – Person

Refactor du CRUD `Person` avec ajout d’un `PersonRepository`.

Le `PersonRepository` devient responsable :

- du stockage des personnes ;
- de l’accès aux données ;
- de la création ;
- de la modification ;
- de la suppression ;
- de la génération des identifiants.

Le `PersonService` devient responsable :

- de la logique applicative ;
- de l’appel au repository.

Le `PersonController` reste responsable :

- des routes HTTP ;
- de la lecture des paramètres HTTP ;
- de la validation du `PersonInputDto` ;
- de l’appel au service ;
- du mapping vers `PersonOutputDto` ;
- des codes HTTP retournés.

Il n’y a toujours aucune base de données.

Les données restent stockées en mémoire dans le repository.

---

# Architecture

```text
Payload JSON
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
PersonRepository
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

# Responsabilités

```text
PersonInputDto
    ↓
Validation des données entrantes

PersonController
    ↓
Gestion HTTP

PersonService
    ↓
Logique applicative

PersonRepository
    ↓
Accès aux données
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
├── repository.rs
├── service.rs
├── controller.rs
└── mod.rs
```

## Tests

```text
src/api/person/
├── repository_tests.rs
├── service_tests.rs
└── controller_tests.rs
```

Structure complète :

```text
src/
├── api/
│   ├── person/
│   │   ├── person.rs
│   │   ├── person_input_dto.rs
│   │   ├── person_output_dto.rs
│   │   ├── repository.rs
│   │   ├── repository_tests.rs
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

Le modèle interne reste indépendant :

```text
Axum
Serde
HTTP
Repository
Service
```

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

---

# PersonRepository

Le `PersonRepository` contient maintenant toutes les données.

Le stockage qui se trouvait auparavant dans le service est déplacé dans le repository.

## Chemin

```text
src/api/person/repository.rs
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
pub struct PersonRepository {
    id_counter: Arc<AtomicU32>,
    person_list: Arc<RwLock<Vec<Person>>>,
}

impl PersonRepository {
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
                    "Ford Coppola".to_string(),
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

    pub async fn find_all(
        &self,
    ) -> Vec<Person> {
        self.person_list
            .read()
            .await
            .clone()
    }

    pub async fn find_by_id(
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

        person.first_name =
            first_name;

        person.last_name =
            last_name;

        person.city_id =
            city_id;

        Some(
            person.clone(),
        )
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

# Rôle du Repository

Le repository représente la couche d’accès aux données.

Le reste de l’application ne doit plus savoir comment les personnes sont stockées.

Aujourd’hui :

```text
PersonRepository
    ↓
Vec<Person>
```

Plus tard :

```text
PersonRepository
    ↓
PostgreSQL
```

Le service pourra continuer à utiliser :

```text
PersonRepository
```

sans manipuler directement le mécanisme de stockage.

---

# Stockage partagé

Le repository contient :

```rust
Arc<RwLock<Vec<Person>>>
```

Architecture :

```text
PersonRepository
    ↓
Arc
    ↓
RwLock
    ↓
Vec<Person>
```

`Vec<Person>` contient les données.

`RwLock` protège les accès concurrents.

`Arc` permet de partager le même repository entre plusieurs appels.

---

# Génération des identifiants

La génération des identifiants appartient maintenant au repository.

```rust
Arc<AtomicU32>
```

La valeur initiale est :

```rust
AtomicU32::new(7)
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

Le premier nouvel identifiant est :

```text
8
```

---

# Lecture de toutes les personnes

La méthode :

```rust
pub async fn find_all(
    &self,
) -> Vec<Person>
```

retourne :

```text
Vec<Person>
```

Le repository travaille uniquement avec le modèle interne.

Il ne retourne jamais :

```text
PersonOutputDto
```

---

# Lecture par identifiant

La méthode :

```rust
pub async fn find_by_id(
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

Le repository ne connaît pas :

```text
404 NOT FOUND
```

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

effectue :

```text
génération de l'identifiant
    ↓
création du Person
    ↓
stockage
    ↓
retour du Person
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

si la personne existe.

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

si une personne a été supprimée.

Sinon :

```text
false
```

---

# PersonService

Le service ne contient maintenant plus aucune donnée.

Il contient uniquement :

```text
PersonRepository
```

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
    ) -> Vec<Person> {
        self.person_repository
            .find_all()
            .await
    }

    pub async fn get_by_id(
        &self,
        id: u32,
    ) -> Option<Person> {
        self.person_repository
            .find_by_id(id)
            .await
    }

    pub async fn create(
        &self,
        first_name: String,
        last_name: String,
        city_id: u32,
    ) -> Person {
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
        id: u32,
        first_name: String,
        last_name: String,
        city_id: u32,
    ) -> Option<Person> {
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
        id: u32,
    ) -> bool {
        self.person_repository
            .delete(id)
            .await
    }
}
```

---

# Évolution du Service

Avant :

```text
PersonService
├── id_counter
└── person_list
```

Maintenant :

```text
PersonService
└── PersonRepository
```

Le service ne connaît plus :

```text
Vec<Person>
RwLock
AtomicU32
```

Il demande simplement au repository :

```text
find_all
find_by_id
create
update
delete
```

---

# Pourquoi conserver le Service ?

Pour le moment, le service ne fait pratiquement que déléguer les appels au repository.

C’est volontaire.

Aujourd’hui :

```text
Controller
    ↓
Service
    ↓
Repository
```

Plus tard, le service pourra contenir des règles métier.

Par exemple :

```text
vérification d'une ville
contrôle métier
calcul
autorisation
appel de plusieurs repositories
transaction
```

Le controller et le repository ne devront pas contenir cette logique.

---

# PersonController

Le controller continue de dépendre uniquement du service.

Il ne connaît pas directement le repository.

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

pub fn routes() -> Router {
    let person_repository =
        PersonRepository::new();

    let person_service =
        PersonService::new(
            person_repository,
        );

    let person_controller =
        PersonController::new(
            person_service,
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
            person_controller,
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

    Ok(
        Json(output),
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
        .ok_or(
            StatusCode::NOT_FOUND,
        )?;

    let output =
        PersonOutputDto::from(&person);

    Ok(
        Json(output),
    )
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

    Ok(
        StatusCode::NO_CONTENT,
    )
}
```

---

# Construction des couches

Dans :

```rust
routes()
```

les différentes couches sont maintenant construites explicitement.

```rust
let person_repository =
    PersonRepository::new();

let person_service =
    PersonService::new(
        person_repository,
    );

let person_controller =
    PersonController::new(
        person_service,
    );
```

Cela produit :

```text
PersonRepository
    ↓
PersonService
    ↓
PersonController
```

Chaque couche reçoit la couche dont elle dépend.

---

# Dépendances entre les couches

Le controller connaît :

```text
PersonService
```

Le service connaît :

```text
PersonRepository
```

Le repository connaît :

```text
Person
```

Les dépendances sont donc :

```text
PersonController
       ↓
PersonService
       ↓
PersonRepository
       ↓
Person
```

Le sens inverse n’existe pas.

`PersonRepository` ne connaît pas :

```text
PersonService
PersonController
PersonInputDto
PersonOutputDto
Axum
StatusCode
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

#[cfg(test)]
mod controller_tests;

#[cfg(test)]
mod repository_tests;

#[cfg(test)]
mod service_tests;
```

---

# Module API

Le module API ne change pas.

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

# Tests du Repository

Le repository peut maintenant être testé indépendamment du service et du controller.

## Chemin

```text
src/api/person/repository_tests.rs
```

## Code

```rust
use super::repository::PersonRepository;

#[tokio::test]
async fn find_all_should_return_seven_persons() {
    let repository =
        PersonRepository::new();

    let persons =
        repository.find_all().await;

    assert_eq!(
        persons.len(),
        7,
    );
}

#[tokio::test]
async fn find_by_id_should_return_person() {
    let repository =
        PersonRepository::new();

    let person = repository
        .find_by_id(1)
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
async fn find_by_id_should_return_none() {
    let repository =
        PersonRepository::new();

    let person = repository
        .find_by_id(999)
        .await;

    assert_eq!(
        person,
        None,
    );
}

#[tokio::test]
async fn create_should_add_person() {
    let repository =
        PersonRepository::new();

    let person = repository
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
        repository.find_all().await;

    assert_eq!(
        persons.len(),
        8,
    );
}

#[tokio::test]
async fn update_should_modify_person() {
    let repository =
        PersonRepository::new();

    let person = repository
        .update(
            1,
            "Steven".to_string(),
            "Spielberg Updated".to_string(),
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
    let repository =
        PersonRepository::new();

    let person = repository
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
    let repository =
        PersonRepository::new();

    let deleted =
        repository.delete(1).await;

    assert!(
        deleted,
    );

    let person = repository
        .find_by_id(1)
        .await;

    assert_eq!(
        person,
        None,
    );
}

#[tokio::test]
async fn delete_should_return_false() {
    let repository =
        PersonRepository::new();

    let deleted =
        repository.delete(999).await;

    assert!(
        !deleted,
    );
}
```

---

# Tests du Service

Le service utilise maintenant un repository.

## Chemin

```text
src/api/person/service_tests.rs
```

## Code

```rust
use super::{
    repository::PersonRepository,
    service::PersonService,
};

fn create_service() -> PersonService {
    let repository =
        PersonRepository::new();

    PersonService::new(
        repository,
    )
}

#[tokio::test]
async fn get_all_should_return_seven_persons() {
    let service =
        create_service();

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
        create_service();

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
}

#[tokio::test]
async fn get_by_id_should_return_none() {
    let service =
        create_service();

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
        create_service();

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
}

#[tokio::test]
async fn update_should_modify_person() {
    let service =
        create_service();

    let person = service
        .update(
            1,
            "Steven".to_string(),
            "Spielberg Updated".to_string(),
            10,
        )
        .await
        .unwrap();

    assert_eq!(
        person.id,
        1,
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
async fn delete_should_remove_person() {
    let service =
        create_service();

    let deleted =
        service.delete(1).await;

    assert!(
        deleted,
    );

    let person = service
        .get_by_id(1)
        .await;

    assert_eq!(
        person,
        None,
    );
}
```

---

# Tests du Controller

Les tests HTTP restent identiques dans leur principe.

Ils testent maintenant toute la chaîne :

```text
HTTP
    ↓
PersonController
    ↓
PersonService
    ↓
PersonRepository
    ↓
Vec<Person>
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
    let body = to_bytes(
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

Compiler le projet :

```bash
cargo build
```

Lancer tous les tests :

```bash
cargo test
```

Lancer les tests du repository :

```bash
cargo test repository
```

Lancer les tests du service :

```bash
cargo test service
```

Lancer l’application :

```bash
cargo run
```

---

# Endpoints

Les endpoints ne changent pas.

```text
GET    /persons
GET    /persons/{id}
POST   /persons
PUT    /persons/{id}
DELETE /persons/{id}
```

---

# Exemple GET

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

---

# Exemple POST

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

```json
{
  "id": 8,
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 8
}
```

---

# Principes clés

- `PersonController` gère la couche HTTP.
- `PersonService` gère la logique applicative.
- `PersonRepository` gère l’accès aux données.
- `PersonRepository` contient temporairement les données en mémoire.
- `PersonRepository` manipule des `Person`.
- `PersonRepository` ne connaît pas les DTO.
- `PersonRepository` ne connaît pas Axum.
- `PersonRepository` ne connaît pas les codes HTTP.
- `PersonService` ne connaît plus `Vec<Person>`.
- `PersonService` ne connaît plus `RwLock`.
- `PersonService` ne connaît plus `AtomicU32`.
- `PersonService` dépend du `PersonRepository`.
- `PersonController` dépend du `PersonService`.
- `PersonController` ne dépend pas directement du repository.
- `PersonInputDto` contrôle les données entrantes.
- `PersonOutputDto` contrôle les données sortantes.
- `Person` reste le modèle interne.
- `Vec<Person>` simule temporairement la persistance.
- `RwLock` protège les accès concurrents.
- `Arc` partage le stockage.
- `AtomicU32` simule la génération des identifiants.
- Chaque couche peut maintenant être testée séparément.

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
PersonRepository
  ↓
Vec<Person>
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

# Évolution de l'architecture

## CRUD initial

```text
HTTP
  ↓
PersonController
  ↓
Vec<Person>
```

## Avec DTO

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

## Avec Service

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

## Avec Repository

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
PersonOutputDto
  ↓
HTTP
```

---

# Séparation finale

```text
Controller
    │
    │ HTTP / DTO
    ↓
Service
    │
    │ logique applicative
    ↓
Repository
    │
    │ accès aux données
    ↓
Vec<Person>
```

La donnée en dur est maintenant complètement isolée dans :

```text
PersonRepository
```

La prochaine étape naturelle sera de remplacer :

```text
Vec<Person>
```

par une vraie base de données :

```text
PostgreSQL
```

sans modifier l’architecture :

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
PostgreSQL
```