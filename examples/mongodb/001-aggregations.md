# Produit-count-by-createur

```json
[
  {
    "$group": {
      "_id": "$createur",
      "totalProduits": {
        "$sum": 1
      }
    }
  },
  {
    "$sort": {
      "totalProduits": -1
    }
  }
]
```

# Produit-count-by-codeCr

```json
[
  {
    "$group": {
      "_id": "$codeCr",
      "totalProduits": {
        "$sum": 1
      }
    }
  },
  {
    "$sort": {
      "totalProduits": -1
    }
  }
]
```

# Produit-count-by-source

```json
[
  {
    "$group": {
      "_id": "$source",
      "totalProduits": {
        "$sum": 1
      }
    }
  },
  {
    "$sort": {
      "totalProduits": -1
    }
  }
]
```

# Produit-list-titles-by-createur

```json
[
  {
    "$group": {
      "_id": "$createur",
      "totalProduits": {
        "$sum": 1
      },
      "titres": {
        "$push": "$libelleCourt"
      }
    }
  },
  {
    "$sort": {
      "totalProduits": -1
    }
  }
]
```

# Produit-count-by-responsable-nom

```json
[
  {
    "$group": {
      "_id": "$responsable.nom",
      "totalProduits": {
        "$sum": 1
      }
    }
  },
  {
    "$sort": {
      "totalProduits": -1
    }
  }
]
```

# Produit-count-by-annee-creation

```json
[
  {
    "$group": {
      "_id": {
        "$year": "$creationDate"
      },
      "totalProduits": {
        "$sum": 1
      }
    }
  },
  {
    "$sort": {
      "_id": 1
    }
  }
]
```

# Produit-count-by-annee-creation-detail

```json
[
  {
    "$group": {
      "_id": {
        "$year": "$creationDate"
      },
      "totalProduits": {
        "$sum": 1
      }
    }
  },
  {
    "$project": {
      "_id": 0,
      "annee": "$_id",
      "totalProduits": 1
    }
  },
  {
    "$sort": {
      "annee": 1
    }
  }
]
```