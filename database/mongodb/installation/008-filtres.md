# Filtres de date dans MongoDB Compass

Si le champ date est par exemple `createdAt` et que la valeur est au format :

`2022-08-12T13:46:42.857+00:00`

voici quoi mettre dans le champ **Filter** de MongoDB Compass.

---

## Supérieur strict

```json
{ "createdAt": { "$gt": { "$date": "2022-08-12T13:46:42.857+00:00" } } }
```

---

## Inférieur strict

```json
{ "createdAt": { "$lt": { "$date": "2022-08-12T13:46:42.857+00:00" } } }
```

---

## Égal

```json
{ "createdAt": { "$eq": { "$date": "2022-08-12T13:46:42.857+00:00" } } }
```

---

## Supérieur ou égal

```json
{ "createdAt": { "$gte": { "$date": "2022-08-12T13:46:42.857+00:00" } } }
```

---

## Inférieur ou égal

```json
{ "createdAt": { "$lte": { "$date": "2022-08-12T13:46:42.857+00:00" } } }
```

---

## Entre deux valeurs

```json
{
  "createdAt": {
    "$gte": { "$date": "2022-08-01T00:00:00.000+00:00" },
    "$lte": { "$date": "2022-08-31T23:59:59.999+00:00" }
  }
}
```

---

## Entre deux valeurs strictes

```json
{
  "createdAt": {
    "$gt": { "$date": "2022-08-01T00:00:00.000+00:00" },
    "$lt": { "$date": "2022-08-31T23:59:59.999+00:00" }
  }
}
```

---

## Exemple avec un autre nom de champ

```json
{ "dateCreation": { "$gt": { "$date": "2022-08-12T13:46:42.857+00:00" } } }
```

---

## Rappel des opérateurs

- `$gt` : supérieur strict
- `$lt` : inférieur strict
- `$eq` : égal
- `$gte` : supérieur ou égal
- `$lte` : inférieur ou égal
```