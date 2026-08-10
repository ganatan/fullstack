# Tests API Person avec Postman

Validation complète du CRUD `Person` avec :

```text
Postman
    ↓
HTTP
    ↓
PersonController
    ↓
PersonService
    ↓
PersonRepository
    ↓
Database
    ↓
Table person
```

L’objectif est de tester :

- la lecture ;
- la création ;
- la modification ;
- la suppression ;
- la validation des DTO ;
- les erreurs HTTP ;
- la persistance des données ;
- les erreurs de base de données.

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
Table person
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

# Endpoints

```text
GET    /persons
GET    /persons/{id}
POST   /persons
PUT    /persons/{id}
DELETE /persons/{id}
```

URL de base :

```text
http://localhost:3000
```

---

# Configuration Postman

Créer un environnement Postman.

Ajouter :

```text
baseUrl
```

Valeur :

```text
http://localhost:3000
```

Ajouter également :

```text
personId
```

La valeur sera renseignée automatiquement lors du test de création.

Les requêtes utiliseront ensuite :

```text
{{baseUrl}}/persons
```

et :

```text
{{baseUrl}}/persons/{{personId}}
```

---

# Données initiales

La table `person` contient initialement 10 réalisateurs.

```text
1  Steven       Spielberg       1
2  Martin       Scorsese        2
3  Francis      Ford Coppola    3
4  George       Lucas           4
5  Quentin      Tarantino       5
6  David        Fincher         6
7  Spike        Lee             7
8  Christopher  Nolan           8
9  James        Cameron         9
10 Ridley       Scott           10
```

Vérification directe :

```sql
SELECT
    id,
    first_name,
    last_name,
    city_id
FROM person
ORDER BY id;
```

---

# 1. GET toutes les personnes

## Requête

```text
GET {{baseUrl}}/persons
```

Aucun body.

## Résultat attendu

```text
200 OK
```

Exemple :

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

Au début des tests :

```text
10 personnes
```

doivent être retournées.

---

# 2. GET une personne existante

## Requête

```text
GET {{baseUrl}}/persons/1
```

## Résultat attendu

```text
200 OK
```

```json
{
  "id": 1,
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 1
}
```

---

# 3. GET une personne inexistante

## Requête

```text
GET {{baseUrl}}/persons/999999
```

## Résultat attendu

```text
404 NOT FOUND
```

---

# 4. GET avec id égal à zéro

## Requête

```text
GET {{baseUrl}}/persons/0
```

## Résultat attendu

```text
404 NOT FOUND
```

`0` est un entier valide pour le routeur mais aucune personne ne possède cet identifiant.

---

# 5. GET avec id négatif

## Requête

```text
GET {{baseUrl}}/persons/-1
```

## Résultat attendu

```text
404 NOT FOUND
```

---

# 6. GET avec id invalide

## Requête

```text
GET {{baseUrl}}/persons/abc
```

## Résultat attendu

```text
400 BAD REQUEST
```

Le paramètre attendu est :

```rust
Path<i32>
```

La valeur :

```text
abc
```

ne peut pas être convertie en entier.

---

# 7. POST création valide

## Requête

```text
POST {{baseUrl}}/persons
```

Header :

```text
Content-Type: application/json
```

Body :

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 11
}
```

## Résultat attendu

```text
201 CREATED
```

Exemple :

```json
{
  "id": 11,
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 11
}
```

L'identifiant est généré par la base.

---

# Sauvegarder automatiquement l'identifiant dans Postman

Dans l'onglet :

```text
Scripts
    ↓
Post-response
```

ajouter :

```javascript
pm.test("Status 201", function () {
    pm.response.to.have.status(201);
});

const body = pm.response.json();

pm.environment.set(
    "personId",
    body.id
);
```

Après le POST :

```text
personId
```

contient l'identifiant créé.

Les tests suivants peuvent donc utiliser :

```text
{{personId}}
```

---

# 8. Vérifier la personne créée

## Requête

```text
GET {{baseUrl}}/persons/{{personId}}
```

## Résultat attendu

```text
200 OK
```

```json
{
  "id": 11,
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 11
}
```

---

# 9. Vérifier directement dans la table

```sql
SELECT
    id,
    first_name,
    last_name,
    city_id
FROM person
WHERE id = 11;
```

La personne doit être présente.

---

# 10. POST avec espaces

## Requête

```text
POST {{baseUrl}}/persons
```

```json
{
  "firstName": "   Peter   ",
  "lastName": "   Jackson   ",
  "cityId": 12
}
```

## Résultat attendu

```text
201 CREATED
```

La méthode :

```text
validate_and_normalize()
```

effectue un `trim`.

La réponse doit contenir :

```json
{
  "firstName": "Peter",
  "lastName": "Jackson",
  "cityId": 12
}
```

---

# 11. POST prénom vide

## Requête

```text
POST {{baseUrl}}/persons
```

```json
{
  "firstName": "",
  "lastName": "Eastwood",
  "cityId": 11
}
```

## Résultat attendu

```text
400 BAD REQUEST
```

---

# 12. POST prénom composé uniquement d'espaces

```json
{
  "firstName": "     ",
  "lastName": "Eastwood",
  "cityId": 11
}
```

## Résultat attendu

```text
400 BAD REQUEST
```

Le `trim` transforme :

```text
"     "
```

en :

```text
""
```

---

# 13. POST nom vide

```json
{
  "firstName": "Clint",
  "lastName": "",
  "cityId": 11
}
```

## Résultat attendu

```text
400 BAD REQUEST
```

---

# 14. POST nom composé uniquement d'espaces

```json
{
  "firstName": "Clint",
  "lastName": "     ",
  "cityId": 11
}
```

## Résultat attendu

```text
400 BAD REQUEST
```

---

# 15. POST cityId égal à zéro

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 0
}
```

## Résultat attendu

```text
400 BAD REQUEST
```

---

# 16. POST cityId négatif

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": -1
}
```

## Résultat attendu

```text
400 BAD REQUEST
```

---

# 17. POST prénom supérieur à 50 caractères

```json
{
  "firstName": "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXY",
  "lastName": "Eastwood",
  "cityId": 11
}
```

## Résultat attendu

```text
400 BAD REQUEST
```

---

# 18. POST nom supérieur à 50 caractères

```json
{
  "firstName": "Clint",
  "lastName": "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXY",
  "cityId": 11
}
```

## Résultat attendu

```text
400 BAD REQUEST
```

---

# 19. POST sans firstName

```json
{
  "lastName": "Eastwood",
  "cityId": 11
}
```

## Résultat attendu

```text
422 UNPROCESSABLE ENTITY
```

Le JSON est valide mais ne peut pas être transformé en :

```text
PersonInputDto
```

car :

```text
firstName
```

est obligatoire.

---

# 20. POST sans lastName

```json
{
  "firstName": "Clint",
  "cityId": 11
}
```

## Résultat attendu

```text
422 UNPROCESSABLE ENTITY
```

---

# 21. POST sans cityId

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood"
}
```

## Résultat attendu

```text
422 UNPROCESSABLE ENTITY
```

---

# 22. POST avec firstName null

```json
{
  "firstName": null,
  "lastName": "Eastwood",
  "cityId": 11
}
```

## Résultat attendu

```text
422 UNPROCESSABLE ENTITY
```

---

# 23. POST avec lastName null

```json
{
  "firstName": "Clint",
  "lastName": null,
  "cityId": 11
}
```

## Résultat attendu

```text
422 UNPROCESSABLE ENTITY
```

---

# 24. POST avec cityId null

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": null
}
```

## Résultat attendu

```text
422 UNPROCESSABLE ENTITY
```

---

# 25. POST avec mauvais type pour firstName

```json
{
  "firstName": 123,
  "lastName": "Eastwood",
  "cityId": 11
}
```

## Résultat attendu

```text
422 UNPROCESSABLE ENTITY
```

---

# 26. POST avec mauvais type pour cityId

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": "11"
}
```

## Résultat attendu

```text
422 UNPROCESSABLE ENTITY
```

---

# 27. POST avec nombre décimal

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 10.5
}
```

## Résultat attendu

```text
422 UNPROCESSABLE ENTITY
```

`cityId` attend :

```rust
i32
```

---

# 28. POST JSON invalide

Body :

```text
{
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 11
```

La fermeture :

```text
}
```

est absente.

## Résultat attendu

```text
400 BAD REQUEST
```

---

# 29. POST body vide

Header :

```text
Content-Type: application/json
```

Body vide.

## Résultat attendu

```text
400 BAD REQUEST
```

---

# 30. POST objet vide

```json
{}
```

## Résultat attendu

```text
422 UNPROCESSABLE ENTITY
```

---

# 31. POST tableau JSON

```json
[
  {
    "firstName": "Clint",
    "lastName": "Eastwood",
    "cityId": 11
  }
]
```

## Résultat attendu

```text
422 UNPROCESSABLE ENTITY
```

L'API attend un objet :

```text
PersonInputDto
```

et non un tableau.

---

# 32. POST sans Content-Type

Supprimer :

```text
Content-Type: application/json
```

Body :

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 11
}
```

## Résultat attendu

```text
415 UNSUPPORTED MEDIA TYPE
```

---

# 33. POST avec champ supplémentaire

```json
{
  "id": 99999,
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 11,
  "unknown": "test"
}
```

## Résultat attendu

Avec le DTO actuel :

```text
201 CREATED
```

Les champs non déclarés dans :

```text
PersonInputDto
```

sont ignorés.

L'identifiant envoyé par le client :

```text
99999
```

n'est pas utilisé.

L'identifiant est généré par la base.

---

# 34. POST avec apostrophe

```json
{
  "firstName": "John",
  "lastName": "O'Connor",
  "cityId": 11
}
```

## Résultat attendu

```text
201 CREATED
```

Les paramètres sont envoyés avec :

```rust
.bind(...)
```

et ne sont pas concaténés directement dans la requête SQL.

---

# 35. PUT modification valide

Utiliser la personne créée au début du scénario principal.

## Requête

```text
PUT {{baseUrl}}/persons/{{personId}}
```

Header :

```text
Content-Type: application/json
```

Body :

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood Updated",
  "cityId": 20
}
```

## Résultat attendu

```text
200 OK
```

Exemple :

```json
{
  "id": 11,
  "firstName": "Clint",
  "lastName": "Eastwood Updated",
  "cityId": 20
}
```

---

# 36. Vérification après modification

## Requête

```text
GET {{baseUrl}}/persons/{{personId}}
```

## Résultat attendu

```text
200 OK
```

```json
{
  "id": 11,
  "firstName": "Clint",
  "lastName": "Eastwood Updated",
  "cityId": 20
}
```

---

# 37. PUT personne inexistante

## Requête

```text
PUT {{baseUrl}}/persons/999999
```

Body :

```json
{
  "firstName": "Unknown",
  "lastName": "Person",
  "cityId": 1
}
```

## Résultat attendu

```text
404 NOT FOUND
```

---

# 38. PUT avec id invalide

## Requête

```text
PUT {{baseUrl}}/persons/abc
```

Body :

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 11
}
```

## Résultat attendu

```text
400 BAD REQUEST
```

---

# 39. PUT prénom vide

```json
{
  "firstName": "",
  "lastName": "Eastwood",
  "cityId": 11
}
```

## Résultat attendu

```text
400 BAD REQUEST
```

---

# 40. PUT nom vide

```json
{
  "firstName": "Clint",
  "lastName": "",
  "cityId": 11
}
```

## Résultat attendu

```text
400 BAD REQUEST
```

---

# 41. PUT cityId égal à zéro

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 0
}
```

## Résultat attendu

```text
400 BAD REQUEST
```

---

# 42. PUT propriété manquante

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood"
}
```

## Résultat attendu

```text
422 UNPROCESSABLE ENTITY
```

---

# 43. PUT avec espaces

```json
{
  "firstName": "   Clint   ",
  "lastName": "   Eastwood   ",
  "cityId": 11
}
```

## Résultat attendu

```text
200 OK
```

La réponse contient :

```json
{
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 11
}
```

---

# 44. DELETE personne existante

## Requête

```text
DELETE {{baseUrl}}/persons/{{personId}}
```

## Résultat attendu

```text
204 NO CONTENT
```

Le body doit être vide.

---

# 45. Vérification après suppression

## Requête

```text
GET {{baseUrl}}/persons/{{personId}}
```

## Résultat attendu

```text
404 NOT FOUND
```

---

# 46. DELETE une deuxième fois

## Requête

```text
DELETE {{baseUrl}}/persons/{{personId}}
```

## Résultat attendu

```text
404 NOT FOUND
```

La personne a déjà été supprimée.

---

# 47. DELETE personne inexistante

## Requête

```text
DELETE {{baseUrl}}/persons/999999
```

## Résultat attendu

```text
404 NOT FOUND
```

---

# 48. DELETE avec id invalide

## Requête

```text
DELETE {{baseUrl}}/persons/abc
```

## Résultat attendu

```text
400 BAD REQUEST
```

---

# 49. Route inexistante

## Requête

```text
GET {{baseUrl}}/unknown
```

## Résultat attendu

```text
404 NOT FOUND
```

---

# 50. Méthode HTTP non supportée

## Requête

```text
PATCH {{baseUrl}}/persons/1
```

## Résultat attendu

```text
405 METHOD NOT ALLOWED
```

---

# 51. POST sur une mauvaise route

## Requête

```text
POST {{baseUrl}}/persons/1
```

## Résultat attendu

```text
405 METHOD NOT ALLOWED
```

---

# 52. Vérification de la persistance

Créer une personne :

```text
POST {{baseUrl}}/persons
```

```json
{
  "firstName": "Sergio",
  "lastName": "Leone",
  "cityId": 30
}
```

Vérifier :

```text
GET {{baseUrl}}/persons/{id}
```

Arrêter l'application :

```text
Ctrl + C
```

Relancer :

```bash
cargo run
```

Refaire :

```text
GET {{baseUrl}}/persons/{id}
```

## Résultat attendu

```text
200 OK
```

La donnée doit toujours exister.

Cela valide la persistance réelle des données.

---

# 53. Vérification directe de la création

Après un POST :

```sql
SELECT
    id,
    first_name,
    last_name,
    city_id
FROM person
ORDER BY id;
```

La personne créée doit être présente.

---

# 54. Vérification directe de la modification

Après un PUT :

```sql
SELECT
    id,
    first_name,
    last_name,
    city_id
FROM person
WHERE id = 11;
```

Les nouvelles valeurs doivent être présentes.

---

# 55. Vérification directe de la suppression

Après un DELETE :

```sql
SELECT
    id,
    first_name,
    last_name,
    city_id
FROM person
WHERE id = 11;
```

Résultat attendu :

```text
0 ligne
```

---

# 56. Base inaccessible au démarrage

Arrêter la base puis lancer :

```bash
cargo run
```

## Résultat attendu

L'application ne doit pas démarrer.

Le code :

```rust
.connect(
    &database_url,
)
.await
.expect(
    "Connexion à la database impossible",
);
```

doit provoquer l'arrêt du programme.

---

# 57. Base inaccessible pendant l'exécution

Démarrer :

```bash
cargo run
```

Vérifier que l'application fonctionne.

Arrêter ensuite la base.

Puis envoyer :

```text
GET {{baseUrl}}/persons
```

## Résultat attendu

Après échec de l'accès aux données :

```text
500 INTERNAL SERVER ERROR
```

Le controller transforme les erreurs du repository en :

```text
500
```

---

# 58. Redémarrage de la base

Redémarrer la base.

Attendre que le pool puisse récupérer une connexion.

Refaire :

```text
GET {{baseUrl}}/persons
```

## Résultat attendu

```text
200 OK
```

---

# Cas métier actuels

Avec l'implémentation actuelle :

```text
firstName
```

est obligatoire.

```text
lastName
```

est obligatoire.

```text
cityId
```

est obligatoire.

Les contraintes sont :

```text
firstName : 1 à 50 caractères après trim
lastName  : 1 à 50 caractères après trim
cityId    : supérieur à 0
```

---

# Doublons

Avec l'implémentation actuelle, rien n'interdit deux personnes identiques.

Exécuter deux fois :

```text
POST {{baseUrl}}/persons
```

avec :

```json
{
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 1
}
```

## Résultat attendu

Si aucune contrainte `UNIQUE` n'existe dans la base :

```text
201 CREATED
```

pour les deux requêtes.

Les deux lignes possèdent des identifiants différents.

---

# cityId inexistant

Avec l'implémentation actuelle, si aucune clé étrangère n'existe sur :

```text
city_id
```

le payload suivant est accepté :

```json
{
  "firstName": "Test",
  "lastName": "Person",
  "cityId": 999999
}
```

## Résultat attendu

```text
201 CREATED
```

Ce comportement changera lorsque :

```text
city_id
```

sera relié à une table `city` avec une contrainte ou une validation métier.

---

# Ordre recommandé pour le test CRUD complet

Exécuter les tests dans cet ordre.

```text
1. GET /persons
2. GET /persons/1
3. POST /persons
4. récupérer personId
5. GET /persons/{{personId}}
6. PUT /persons/{{personId}}
7. GET /persons/{{personId}}
8. vérifier directement la base
9. DELETE /persons/{{personId}}
10. GET /persons/{{personId}}
11. GET /persons
```

Le nombre de lignes doit revenir à sa valeur initiale si une seule personne de test a été créée puis supprimée.

---

# Scénario CRUD complet

## Étape 1

```text
GET {{baseUrl}}/persons
```

Résultat :

```text
200
```

---

## Étape 2

```text
POST {{baseUrl}}/persons
```

```json
{
  "firstName": "Test",
  "lastName": "Postman",
  "cityId": 100
}
```

Résultat :

```text
201
```

Sauvegarder :

```text
id → personId
```

---

## Étape 3

```text
GET {{baseUrl}}/persons/{{personId}}
```

Résultat :

```text
200
```

---

## Étape 4

```text
PUT {{baseUrl}}/persons/{{personId}}
```

```json
{
  "firstName": "Test Updated",
  "lastName": "Postman Updated",
  "cityId": 101
}
```

Résultat :

```text
200
```

---

## Étape 5

```text
GET {{baseUrl}}/persons/{{personId}}
```

Résultat attendu :

```json
{
  "id": 11,
  "firstName": "Test Updated",
  "lastName": "Postman Updated",
  "cityId": 101
}
```

L'identifiant exact dépend de la séquence de la base.

---

## Étape 6

```text
DELETE {{baseUrl}}/persons/{{personId}}
```

Résultat :

```text
204
```

---

## Étape 7

```text
GET {{baseUrl}}/persons/{{personId}}
```

Résultat :

```text
404
```

---

# Matrice des principaux tests

| Test | Résultat attendu |
|---|---:|
| GET toutes les personnes | 200 |
| GET personne existante | 200 |
| GET personne inexistante | 404 |
| GET id invalide | 400 |
| POST valide | 201 |
| POST prénom vide | 400 |
| POST nom vide | 400 |
| POST cityId zéro | 400 |
| POST cityId négatif | 400 |
| POST propriété absente | 422 |
| POST mauvais type | 422 |
| POST JSON invalide | 400 |
| POST sans Content-Type | 415 |
| PUT valide | 200 |
| PUT personne inexistante | 404 |
| PUT payload invalide | 400 |
| PUT propriété absente | 422 |
| DELETE existant | 204 |
| DELETE inexistant | 404 |
| DELETE id invalide | 400 |
| Route inconnue | 404 |
| Méthode non autorisée | 405 |
| Erreur repository | 500 |

---

# Codes HTTP utilisés

```text
200 OK
```

Lecture ou modification réussie.

```text
201 CREATED
```

Création réussie.

```text
204 NO CONTENT
```

Suppression réussie.

```text
400 BAD REQUEST
```

Payload invalide selon les règles métier ou paramètre de route invalide.

```text
404 NOT FOUND
```

Ressource inexistante.

```text
405 METHOD NOT ALLOWED
```

Méthode HTTP non supportée.

```text
415 UNSUPPORTED MEDIA TYPE
```

Payload JSON envoyé sans le bon `Content-Type`.

```text
422 UNPROCESSABLE ENTITY
```

JSON valide mais incompatible avec `PersonInputDto`.

```text
500 INTERNAL SERVER ERROR
```

Erreur d'accès aux données.

---

# Validation globale

Lorsque tous les tests passent, la chaîne complète est validée :

```text
Postman
    ↓
Routing Axum
    ↓
PersonInputDto
    ↓
Validation
    ↓
PersonController
    ↓
PersonService
    ↓
PersonRepository
    ↓
Table person
    ↓
Person
    ↓
PersonOutputDto
    ↓
JSON
    ↓
Postman
```

Les quatre opérations CRUD sont alors couvertes :

```text
CREATE
READ
UPDATE
DELETE
```

ainsi que les principaux cas d'erreur :

```text
validation
ressource inexistante
payload incorrect
route incorrecte
méthode incorrecte
erreur d'accès aux données
```