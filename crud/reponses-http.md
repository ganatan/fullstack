# Réponses HTTP — CRUD (référence essentielle)

Ce document résume **les codes de réponse HTTP essentiels** utilisés dans un **CRUD REST**,  
avec une ressource simple : `Continent`.

Objectif :  
- comprendre **quand** utiliser chaque code
- rester cohérent entre Spring Boot, NestJS, Express, Symfony, Django
- éviter les codes au hasard

---

## Vue d’ensemble rapide

| Code | Nom | Usage principal |
|----|----|----|
| 200 | OK | Lecture ou mise à jour réussie |
| 201 | Created | Ressource créée |
| 204 | No Content | Suppression réussie |
| 400 | Bad Request | Erreur de validation |
| 404 | Not Found | Ressource inexistante |
| 405 | Method Not Allowed | Verbe HTTP non autorisé |
| 415 | Unsupported Media Type | Mauvais Content-Type |
| 500 | Internal Server Error | Erreur serveur |

---

## 1️⃣ GET — Lire

### GET /continents

#### ✅ 200 OK
La requête est valide et retourne une liste.

```json
[
  { "id": 1, "name": "Europe" }
]
```

---

### GET /continents/{id}

#### ✅ 200 OK
La ressource existe.

```json
{ "id": 1, "name": "Europe" }
```

#### ❌ 404 Not Found
L’identifiant n’existe pas.

```json
{ "error": "CONTINENT_NOT_FOUND" }
```

---

## 2️⃣ POST — Créer

### POST /continents

#### ✅ 201 Created
La ressource est créée avec succès.

```json
{ "id": 7, "name": "Europe" }
```

#### ❌ 400 Bad Request
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
Le header `Content-Type` n’est pas correct.

Exemple incorrect :
```
Content-Type: text/plain
```

---

## 3️⃣ PUT — Mettre à jour

### PUT /continents/{id}

#### ✅ 200 OK
La ressource est mise à jour.

```json
{ "id": 1, "name": "Europa" }
```

#### ❌ 400 Bad Request
Les données envoyées sont invalides.

#### ❌ 404 Not Found
La ressource à modifier n’existe pas.

---

## 4️⃣ DELETE — Supprimer

### DELETE /continents/{id}

#### ✅ 204 No Content
La ressource est supprimée.

*(aucun body retourné)*

#### ❌ 404 Not Found
La ressource n’existe pas.

---

## 5️⃣ Codes transverses

### ❌ 405 Method Not Allowed
Le verbe HTTP n’est pas autorisé sur cette route.

Exemple :
```
POST /continents/1
```

---

### ❌ 500 Internal Server Error
Erreur interne du serveur.

Causes possibles :
- exception non gérée
- bug dans le code
- crash runtime

⚠️ **Ne jamais utiliser 500 pour une erreur de validation.**

---

## Bonnes pratiques essentielles

- 200 → lecture / mise à jour OK
- 201 → création uniquement
- 204 → suppression sans body
- 400 → erreur de validation client
- 404 → ressource inexistante
- 500 → bug serveur uniquement

---

## Règle d’or

> **Un code HTTP décrit le résultat de la requête,  
> pas l’implémentation interne.**

---

## Conclusion

Si ton CRUD respecte ces codes :
- ton API est prévisible
- ton frontend sait réagir correctement
- tes tests sont simples
- tes backends restent interchangeables

C’est une base indispensable pour toute API REST sérieuse.
