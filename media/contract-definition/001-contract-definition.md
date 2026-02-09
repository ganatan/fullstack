# Contract Definition

# Contrat OpenAPI — media-api (V1)

Objectif :
définir le contrat HTTP du service `media-api` pour la vertical slice V1
et savoir le visualiser / tester avec Swagger.

---

## Fichier : media-contracts/openapi/media-api.yaml

```yaml
openapi: 3.0.3
info:
  title: Media API
  version: 1.0.0

paths:
  /admin/media:
    post:
      summary: Create a media
      operationId: createMedia
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MediaCreateRequest'
      responses:
        '201':
          description: Media created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MediaCreateResponse'

components:
  schemas:
    MediaCreateRequest:
      type: object
      required:
        - name
        - release_date
      properties:
        name:
          type: string
        release_date:
          type: string
          format: date

    MediaCreateResponse:
      type: object
      properties:
        id:
          type: integer
          format: int64
```

---

## Lecture rapide du contrat

Endpoint :
- POST /admin/media

Request JSON :
- name : string
- release_date : date (format ISO, exemple 2010-07-16)

Response JSON (201) :
- id : int64

---

## Visualiser le contrat avec Swagger Editor (le plus simple)

1. Ouvrir Swagger Editor :
https://editor.swagger.io

2. Supprimer le contenu existant

3. Coller le YAML du fichier `media-api.yaml`

4. Vérifier à droite que l’API affiche :
- POST /admin/media
- MediaCreateRequest
- MediaCreateResponse

---

## Tester avec Swagger (Try it out)

Swagger Editor permet de tester uniquement si une URL de serveur est définie.
Quand `media-api` sera lancé en local, ajoute dans le YAML :

```yaml
servers:
  - url: http://localhost:8080
```

Ensuite :

1. Ouvrir Swagger Editor
2. Coller le YAML avec `servers`
3. Cliquer sur POST /admin/media
4. Cliquer Try it out
5. Exemple de body :

```json
{
  "name": "Inception",
  "release_date": "2010-07-16"
}
```

6. Cliquer Execute

Résultat attendu :
- HTTP 201
- réponse JSON contenant `id`

---

## Notes

- Tant que `media-api` n’est pas démarré, Swagger ne peut pas exécuter l’appel.
- Swagger Editor sert d’abord à valider le contrat et voir le rendu.
- Le test réel dépend du backend (media-api) qui respecte ce contrat.
