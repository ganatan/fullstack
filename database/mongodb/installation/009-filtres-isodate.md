# Import BSON et filtres de dates avec `ISODate` dans MongoDB Compass

## 1. Exemple d’import BSON avec une date en 2026

Si tu veux importer une vraie date MongoDB au format BSON étendu, tu peux écrire :

```json
{
  "dateDebutValidite": {
    "$date": {
      "$numberLong": "1767225600000"
    }
  }
}
```

Cette valeur correspond à :

```text
2026-01-01T00:00:00.000Z
```

---

## 2. Exemple d’import BSON avec une date précise en 2026

Exemple pour :

```text
2026-08-12T13:46:42.857Z
```

Import BSON :

```json
{
  "dateDebutValidite": {
    "$date": {
      "$numberLong": "1786542402857"
    }
  }
}
```

---

## 3. Règle simple

### Import
Pour l’import JSON/BSON, on peut utiliser :

```json
{
  "dateDebutValidite": {
    "$date": {
      "$numberLong": "1767225600000"
    }
  }
}
```

### Filtre dans Compass
Pour filtrer dans MongoDB Compass, dans ton cas, il faut utiliser :

```javascript
ISODate("2026-01-01T00:00:00.000Z")
```

---

## 4. Filtres avec `ISODate`

On suppose que le champ s’appelle :

```text
dateDebutValidite
```

---

## Égal

```javascript
{ "dateDebutValidite": ISODate("2026-01-01T00:00:00.000Z") }
```

---

## Supérieur strict

```javascript
{ "dateDebutValidite": { "$gt": ISODate("2026-01-01T00:00:00.000Z") } }
```

---

## Supérieur ou égal

```javascript
{ "dateDebutValidite": { "$gte": ISODate("2026-01-01T00:00:00.000Z") } }
```

---

## Inférieur strict

```javascript
{ "dateDebutValidite": { "$lt": ISODate("2026-01-01T00:00:00.000Z") } }
```

---

## Inférieur ou égal

```javascript
{ "dateDebutValidite": { "$lte": ISODate("2026-01-01T00:00:00.000Z") } }
```

---

## Entre deux dates

```javascript
{
  "dateDebutValidite": {
    "$gte": ISODate("2026-01-01T00:00:00.000Z"),
    "$lt": ISODate("2027-01-01T00:00:00.000Z")
  }
}
```

---

## Toute l’année 2026

```javascript
{
  "dateDebutValidite": {
    "$gte": ISODate("2026-01-01T00:00:00.000Z"),
    "$lt": ISODate("2027-01-01T00:00:00.000Z")
  }
}
```

---

## Tout le mois d’août 2026

```javascript
{
  "dateDebutValidite": {
    "$gte": ISODate("2026-08-01T00:00:00.000Z"),
    "$lt": ISODate("2026-09-01T00:00:00.000Z")
  }
}
```

---

## Exemple exact avec la date du dessus

```javascript
{ "dateDebutValidite": ISODate("2026-08-12T13:46:42.857Z") }
```

```javascript
{ "dateDebutValidite": { "$gt": ISODate("2026-08-12T13:46:42.857Z") } }
```

```javascript
{ "dateDebutValidite": { "$gte": ISODate("2026-08-12T13:46:42.857Z") } }
```

```javascript
{ "dateDebutValidite": { "$lt": ISODate("2026-08-12T13:46:42.857Z") } }
```

```javascript
{ "dateDebutValidite": { "$lte": ISODate("2026-08-12T13:46:42.857Z") } }
```

---

## 5. Résumé simple

- pour l’import BSON : utiliser `"$date"` avec `"$numberLong"`
- pour les filtres Compass : utiliser `ISODate("...")`
- dans ton cas, `ISODate(...)` fonctionne mieux que `"$date"` dans le filtre

---

## 6. Exemple complet import + filtre

### Import

```json
{
  "_id": 1,
  "dateDebutValidite": {
    "$date": {
      "$numberLong": "1767225600000"
    }
  }
}
```

### Filtre Compass

```javascript
{
  "dateDebutValidite": {
    "$gte": ISODate("2026-01-01T00:00:00.000Z"),
    "$lt": ISODate("2027-01-01T00:00:00.000Z")
  }
}
```