# Réponses HTTP — CRUD (référence essentielle)

Ce document résume **les codes de réponse HTTP essentiels** utilisés dans un **CRUD REST**,  
avec une ressource simple : `Continent`.

Objectif :  
- comprendre **quand** utiliser chaque code  
- rester cohérent entre Spring Boot, NestJS, Express, Symfony, Django  
- faire le lien entre **codes numériques** et **constantes frameworks**

---

## Vue d’ensemble rapide

| Code | Nom | Constante Spring | Constante NestJS |
|----|----|------------------|------------------|
| 200 | OK | `HttpStatus.OK` | `HttpStatus.OK` |
| 201 | Created | `HttpStatus.CREATED` | `HttpStatus.CREATED` |
| 204 | No Content | `HttpStatus.NO_CONTENT` | `HttpStatus.NO_CONTENT` |
| 400 | Bad Request | `HttpStatus.BAD_REQUEST` | `HttpStatus.BAD_REQUEST` |
| 404 | Not Found | `HttpStatus.NOT_FOUND` | `HttpStatus.NOT_FOUND` |
| 405 | Method Not Allowed | `HttpStatus.METHOD_NOT_ALLOWED` | `HttpStatus.METHOD_NOT_ALLOWED` |
| 415 | Unsupported Media Type | `HttpStatus.UNSUPPORTED_MEDIA_TYPE` | `HttpStatus.UNSUPPORTED_MEDIA_TYPE` |
| 500 | Internal Server Error | `HttpStatus.INTERNAL_SERVER_ERROR` | `HttpStatus.INTERNAL_SERVER_ERROR` |

---

## 1️⃣ GET — Lire

### GET /continents

#### ✅ 200 OK  
`HttpStatus.OK`

Utilisé lorsque la requête est valide et retourne une liste.

```json
[
  { "id": 1, "name": "Europe" }
]
```

---

### GET /continents/{id}

#### ✅ 200 OK  
`HttpStatus.OK`

La ressource existe.

```json
{ "id": 1, "name": "Europe" }
```

#### ❌ 404 Not Found  
`HttpStatus.NOT_FOUND`

L’identifiant n’existe pas.

```json
{ "error": "CONTINENT_NOT_FOUND" }
```

---

## 2️⃣ POST — Créer

### POST /continents

#### ✅ 201 Created  
`HttpStatus.CREATED`

La ressource est créée avec succès.

```json
{ "id": 7, "name": "Europe" }
```

#### ❌ 400 Bad Request  
`HttpStatus.BAD_REQUEST`

Les données envoyées sont invalides.

Cas typiques :
- champ manquant
- champ vide
- champ trop long
- mauvais format JSON

```json
{
  "error": "VALIDATION_ERROR",
  "details": {
    "name": "must not be blank"
  }
}
```

#### ❌ 415 Unsupported Media Type  
`HttpStatus.UNSUPPORTED_MEDIA_TYPE`

Le header `Content-Type` n’est pas correct.

---

## 3️⃣ PUT — Mettre à jour

### PUT /continents/{id}

#### ✅ 200 OK  
`HttpStatus.OK`

La ressource est mise à jour.

```json
{ "id": 1, "name": "Europa" }
```

#### ❌ 400 Bad Request  
`HttpStatus.BAD_REQUEST`

Les données envoyées sont invalides.

#### ❌ 404 Not Found  
`HttpStatus.NOT_FOUND`

La ressource à modifier n’existe pas.

---

## 4️⃣ DELETE — Supprimer

### DELETE /continents/{id}

#### ✅ 204 No Content  
`HttpStatus.NO_CONTENT`

La ressource est supprimée avec succès.  
Aucun body retourné.

#### ❌ 404 Not Found  
`HttpStatus.NOT_FOUND`

La ressource n’existe pas.

---

## 5️⃣ Codes transverses importants

### ❌ 405 Method Not Allowed  
`HttpStatus.METHOD_NOT_ALLOWED`

Le verbe HTTP n’est pas autorisé sur cette route.

---

### ❌ 500 Internal Server Error  
`HttpStatus.INTERNAL_SERVER_ERROR`

Erreur interne du serveur.

À utiliser **uniquement** pour :
- bug applicatif
- exception non gérée
- crash runtime

⚠️ **Jamais pour une erreur de validation ou de saisie utilisateur.**

---

## Bonnes pratiques essentielles

- `200 OK` → lecture ou mise à jour réussie  
- `201 Created` → création uniquement  
- `204 No Content` → suppression sans body  
- `400 Bad Request` → erreur de validation client  
- `404 Not Found` → ressource inexistante  
- `500 Internal Server Error` → bug serveur uniquement  

---

## Règle d’or

> **Un code HTTP décrit le résultat de la requête,  
> pas l’implémentation interne.**

---

## Conclusion

Si ton CRUD respecte ces codes **et leurs constantes associées** :
- ton API est lisible
- ton code est explicite
- tes tests sont simples
- Spring Boot et NestJS restent parfaitement alignés

C’est une base indispensable pour toute API REST sérieuse.
