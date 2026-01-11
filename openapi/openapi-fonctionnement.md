# Fonctionnement d’OpenAPI

Ce document est une **documentation d’exemple**.  
Il sert à **comprendre OpenAPI par la pratique**, pas à définir le contrat officiel du projet.

Objectif : voir **un contrat OpenAPI complet**, lisible, cohérent, dans un seul fichier.

---

## Définition simple

> **OpenAPI est un contrat écrit qui décrit précisément une API HTTP.**

Il décrit :
- les routes
- les paramètres
- les corps de requêtes
- les réponses
- les codes HTTP

Il ne décrit pas :
- l’implémentation
- la base de données
- le framework
- la logique métier

---

## Pourquoi OpenAPI est utilisé

Sans contrat explicite :
- chaque backend implémente différemment
- le frontend devine
- les tests sont fragiles
- la documentation dérive

Avec OpenAPI :
- une seule description partagée
- plusieurs implémentations possibles
- API stable dans le temps
- validation automatique possible

---

## Exemple canonique : API Continent

On décrit ici **une API volontairement simple**, avec **une seule ressource**.

### Représentation exposée

```json
{
  "id": 1,
  "name": "Europe"
}
```

### Règles métier minimales

- `id`
  - entier strictement positif
  - généré par le backend
- `name`
  - obligatoire
  - non vide
  - longueur maximale : 50 caractères
  - espaces inutiles ignorés (trim)

---

## Contrat OpenAPI complet (exemple)

⚠️ **Ce fichier YAML est un exemple pédagogique.**  
Le contrat réel du projet peut être stocké séparément dans  
`contracts/openapi/continents-api.yaml`.

```yaml
openapi: 3.0.3
info:
  title: Continents API
  version: 1.0.0

paths:
  /continents:
    get:
      summary: List continents
      operationId: getContinents
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Continent'

    post:
      summary: Create a continent
      operationId: createContinent
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateContinentRequest'
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Continent'
        '400':
          description: Validation error

  /continents/{id}:
    get:
      summary: Get continent by id
      operationId: getContinentById
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
            minimum: 1
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Continent'
        '404':
          description: Not found

    put:
      summary: Update continent
      operationId: updateContinent
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
            minimum: 1
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateContinentRequest'
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Continent'
        '400':
          description: Validation error
        '404':
          description: Not found

    delete:
      summary: Delete continent
      operationId: deleteContinent
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
            minimum: 1
      responses:
        '204':
          description: No content
        '404':
          description: Not found

components:
  schemas:
    Continent:
      type: object
      required: [id, name]
      properties:
        id:
          type: integer
          minimum: 1
        name:
          type: string
          minLength: 1
          maxLength: 50

    CreateContinentRequest:
      type: object
      required: [name]
      additionalProperties: false
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 50

    UpdateContinentRequest:
      type: object
      required: [name]
      additionalProperties: false
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 50
```

---

## Lien avec les DTO

Ce contrat définit :
- la forme des DTO d’entrée (`CreateContinentRequest`)
- la forme des DTO de sortie (`Continent`)
- les règles de validation de surface

Les DTO dans le code backend **doivent correspondre** à ce contrat.

---

## À retenir

> **OpenAPI est la description officielle de l’API.**  
> Le code n’est qu’une implémentation de ce contrat.

Dans une doc d’exemple :
- on montre le YAML
- on explique chaque partie
- on apprend le concept

Dans un projet réel :
- le YAML devient un artefact versionné
- le code doit s’y conformer strictement

---

## Conclusion

Si tu comprends ce document :
- tu comprends ce qu’est un contrat OpenAPI
- tu peux lire un fichier YAML OpenAPI
- tu peux implémenter la même API dans plusieurs backends

C’est exactement l’objectif de cette documentation pédagogique.
