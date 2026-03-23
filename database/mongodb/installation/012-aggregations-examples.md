- Produits par code avec libellés affichés
```json
[
  {
    "$group": {
      "_id": "$code",
      "totalProduits": {
        "$sum": 1
      },
      "libelleCourt": {
        "$first": "$libelleCourt"
      },
      "libelleLong": {
        "$first": "$libelleLong"
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
Nom : `produit-code-with-libelles-by-total`

- Produits par codeCr avec libellés affichés
```json
[
  {
    "$group": {
      "_id": "$codeCr",
      "totalProduits": {
        "$sum": 1
      },
      "codes": {
        "$addToSet": "$code"
      },
      "libellesCourts": {
        "$addToSet": "$libelleCourt"
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
Nom : `produit-codecr-with-codes-and-libelles-by-total`

- Produits par source avec créateurs affichés
```json
[
  {
    "$group": {
      "_id": "$source",
      "totalProduits": {
        "$sum": 1
      },
      "createurs": {
        "$addToSet": "$createur"
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
Nom : `produit-source-with-createurs-by-total`

- Produits par créateur avec codes affichés
```json
[
  {
    "$group": {
      "_id": "$createur",
      "totalProduits": {
        "$sum": 1
      },
      "codes": {
        "$addToSet": "$code"
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
Nom : `produit-createur-with-codes-by-total`

- Produits par responsable avec email affiché
```json
[
  {
    "$group": {
      "_id": "$responsable.nom",
      "totalProduits": {
        "$sum": 1
      },
      "email": {
        "$first": "$responsable.email"
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
Nom : `produit-responsable-with-email-by-total`

- Produits par responsable email avec nom affiché
```json
[
  {
    "$group": {
      "_id": "$responsable.email",
      "totalProduits": {
        "$sum": 1
      },
      "nom": {
        "$first": "$responsable.nom"
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
Nom : `produit-responsable-email-with-nom-by-total`

- Produits par codeCr et code
```json
[
  {
    "$group": {
      "_id": {
        "codeCr": "$codeCr",
        "code": "$code"
      },
      "totalProduits": {
        "$sum": 1
      },
      "libelleCourt": {
        "$first": "$libelleCourt"
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
Nom : `produit-codecr-code-with-libellecourt-by-total`

- Produits par source et codeCr
```json
[
  {
    "$group": {
      "_id": {
        "source": "$source",
        "codeCr": "$codeCr"
      },
      "totalProduits": {
        "$sum": 1
      }
    }
  },
  {
    "$sort": {
      "_id.source": 1,
      "totalProduits": -1
    }
  }
]
```
Nom : `produit-source-codecr-by-total`

- Produits par créateur et source
```json
[
  {
    "$group": {
      "_id": {
        "createur": "$createur",
        "source": "$source"
      },
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
Nom : `produit-createur-source-by-total`

- Produits par année de création
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
Nom : `produit-creation-year-by-total`

- Produits par mois de création
```json
[
  {
    "$group": {
      "_id": {
        "annee": {
          "$year": "$creationDate"
        },
        "mois": {
          "$month": "$creationDate"
        }
      },
      "totalProduits": {
        "$sum": 1
      }
    }
  },
  {
    "$sort": {
      "_id.annee": 1,
      "_id.mois": 1
    }
  }
]
```
Nom : `produit-creation-year-month-by-total`

- Produits par jour de création
```json
[
  {
    "$group": {
      "_id": {
        "$dateToString": {
          "format": "%Y-%m-%d",
          "date": "$creationDate"
        }
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
Nom : `produit-creation-day-by-total`

- Produits par année de début de validité
```json
[
  {
    "$group": {
      "_id": {
        "$year": "$dateDebutValidite"
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
Nom : `produit-validite-year-by-total`

- Produits par mois de début de validité
```json
[
  {
    "$group": {
      "_id": {
        "annee": {
          "$year": "$dateDebutValidite"
        },
        "mois": {
          "$month": "$dateDebutValidite"
        }
      },
      "totalProduits": {
        "$sum": 1
      }
    }
  },
  {
    "$sort": {
      "_id.annee": 1,
      "_id.mois": 1
    }
  }
]
```
Nom : `produit-validite-year-month-by-total`

- Produits entre deux dates de création
```json
[
  {
    "$match": {
      "creationDate": {
        "$gte": {
          "$date": "2023-01-01T00:00:00.000Z"
        },
        "$lte": {
          "$date": "2023-12-31T23:59:59.999Z"
        }
      }
    }
  },
  {
    "$sort": {
      "creationDate": 1
    }
  }
]
```
Nom : `produit-creation-date-range-sorted`

- Produits entre deux dates de validité
```json
[
  {
    "$match": {
      "dateDebutValidite": {
        "$gte": {
          "$date": "2023-01-01T00:00:00.000Z"
        },
        "$lte": {
          "$date": "2023-12-31T23:59:59.999Z"
        }
      }
    }
  },
  {
    "$sort": {
      "dateDebutValidite": 1
    }
  }
]
```
Nom : `produit-validite-date-range-sorted`

- Produits créés après une date
```json
[
  {
    "$match": {
      "creationDate": {
        "$gte": {
          "$date": "2023-10-01T00:00:00.000Z"
        }
      }
    }
  },
  {
    "$sort": {
      "creationDate": -1
    }
  }
]
```
Nom : `produit-creation-after-date-sorted`

- Produits valides après une date
```json
[
  {
    "$match": {
      "dateDebutValidite": {
        "$gte": {
          "$date": "2023-10-01T00:00:00.000Z"
        }
      }
    }
  },
  {
    "$sort": {
      "dateDebutValidite": -1
    }
  }
]
```
Nom : `produit-validite-after-date-sorted`

- Produits avec projection simple
```json
[
  {
    "$project": {
      "_id": 0,
      "idProduit": 1,
      "code": 1,
      "codeCr": 1,
      "libelleCourt": 1,
      "createur": 1,
      "source": 1
    }
  }
]
```
Nom : `produit-basic-projection`

- Produits avec projection du responsable
```json
[
  {
    "$project": {
      "_id": 0,
      "idProduit": 1,
      "code": 1,
      "responsableNom": "$responsable.nom",
      "responsableEmail": "$responsable.email"
    }
  }
]
```
Nom : `produit-projection-with-responsable-fields`

- Produits triés par date de création décroissante
```json
[
  {
    "$sort": {
      "creationDate": -1
    }
  }
]
```
Nom : `produit-sorted-by-creationdate-desc`

- Produits triés par date de validité croissante
```json
[
  {
    "$sort": {
      "dateDebutValidite": 1
    }
  }
]
```
Nom : `produit-sorted-by-validitedate-asc`

- Top 5 créateurs par nombre de produits
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
  },
  {
    "$limit": 5
  }
]
```
Nom : `produit-top-createur-by-total`

- Top 5 responsables par nombre de produits
```json
[
  {
    "$group": {
      "_id": "$responsable.nom",
      "totalProduits": {
        "$sum": 1
      },
      "email": {
        "$first": "$responsable.email"
      }
    }
  },
  {
    "$sort": {
      "totalProduits": -1
    }
  },
  {
    "$limit": 5
  }
]
```
Nom : `produit-top-responsable-by-total`

- Top 5 codesCr par nombre de produits
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
  },
  {
    "$limit": 5
  }
]
```
Nom : `produit-top-codecr-by-total`

- Produits avec nombre de jours entre validité et création
```json
[
  {
    "$project": {
      "_id": 0,
      "idProduit": 1,
      "code": 1,
      "creationDate": 1,
      "dateDebutValidite": 1,
      "nbJours": {
        "$dateDiff": {
          "startDate": "$creationDate",
          "endDate": "$dateDebutValidite",
          "unit": "day"
        }
      }
    }
  }
]
```
Nom : `produit-with-day-diff-between-creation-and-validite`

- Produits avec année et mois calculés
```json
[
  {
    "$project": {
      "_id": 0,
      "code": 1,
      "source": 1,
      "anneeCreation": {
        "$year": "$creationDate"
      },
      "moisCreation": {
        "$month": "$creationDate"
      },
      "anneeValidite": {
        "$year": "$dateDebutValidite"
      },
      "moisValidite": {
        "$month": "$dateDebutValidite"
      }
    }
  }
]
```
Nom : `produit-with-year-month-calculated-fields`

- Produits sans responsable email
```json
[
  {
    "$match": {
      "responsable.email": null
    }
  }
]
```
Nom : `produit-without-responsable-email`

- Produits avec responsable email renseigné
```json
[
  {
    "$match": {
      "responsable.email": {
        "$ne": null
      }
    }
  }
]
```
Nom : `produit-with-responsable-email`

- Produits par source avec dates min et max
```json
[
  {
    "$group": {
      "_id": "$source",
      "totalProduits": {
        "$sum": 1
      },
      "creationMin": {
        "$min": "$creationDate"
      },
      "creationMax": {
        "$max": "$creationDate"
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
Nom : `produit-source-with-min-max-creationdate`

- Produits par créateur avec dates min et max
```json
[
  {
    "$group": {
      "_id": "$createur",
      "totalProduits": {
        "$sum": 1
      },
      "creationMin": {
        "$min": "$creationDate"
      },
      "creationMax": {
        "$max": "$creationDate"
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
Nom : `produit-createur-with-min-max-creationdate`

- Produits groupés avec premier et dernier libellé par codeCr
```json
[
  {
    "$sort": {
      "creationDate": 1
    }
  },
  {
    "$group": {
      "_id": "$codeCr",
      "totalProduits": {
        "$sum": 1
      },
      "premierLibelle": {
        "$first": "$libelleCourt"
      },
      "dernierLibelle": {
        "$last": "$libelleCourt"
      }
    }
  }
]
```
Nom : `produit-codecr-with-first-last-libellecourt`

- Produits par code avec dernier enregistrement créé
```json
[
  {
    "$sort": {
      "creationDate": -1
    }
  },
  {
    "$group": {
      "_id": "$code",
      "totalProduits": {
        "$sum": 1
      },
      "dernierIdProduit": {
        "$first": "$idProduit"
      },
      "derniereCreationDate": {
        "$first": "$creationDate"
      }
    }
  }
]
```
Nom : `produit-code-with-last-created-record`

- Produits avec format de date lisible
```json
[
  {
    "$project": {
      "_id": 0,
      "code": 1,
      "libelleCourt": 1,
      "creationDateTexte": {
        "$dateToString": {
          "format": "%d/%m/%Y",
          "date": "$creationDate"
        }
      },
      "dateDebutValiditeTexte": {
        "$dateToString": {
          "format": "%d/%m/%Y",
          "date": "$dateDebutValidite"
        }
      }
    }
  }
]
```
Nom : `produit-with-formatted-dates`

- Produits par trimestre de création
```json
[
  {
    "$group": {
      "_id": {
        "annee": {
          "$year": "$creationDate"
        },
        "trimestre": {
          "$ceil": {
            "$divide": [
              {
                "$month": "$creationDate"
              },
              3
            ]
          }
        }
      },
      "totalProduits": {
        "$sum": 1
      }
    }
  },
  {
    "$sort": {
      "_id.annee": 1,
      "_id.trimestre": 1
    }
  }
]
```
Nom : `produit-creation-quarter-by-total`

- Produits par trimestre de validité
```json
[
  {
    "$group": {
      "_id": {
        "annee": {
          "$year": "$dateDebutValidite"
        },
        "trimestre": {
          "$ceil": {
            "$divide": [
              {
                "$month": "$dateDebutValidite"
              },
              3
            ]
          }
        }
      },
      "totalProduits": {
        "$sum": 1
      }
    }
  },
  {
    "$sort": {
      "_id.annee": 1,
      "_id.trimestre": 1
    }
  }
]
```
Nom : `produit-validite-quarter-by-total`

- Produits avec filtre sur source et tri par date
```json
[
  {
    "$match": {
      "source": "CATALOGUE"
    }
  },
  {
    "$sort": {
      "creationDate": -1
    }
  }
]
```
Nom : `produit-source-filter-sorted-by-creationdate`

- Produits avec filtre sur créateur et projection
```json
[
  {
    "$match": {
      "createur": "Ridley Scott"
    }
  },
  {
    "$project": {
      "_id": 0,
      "idProduit": 1,
      "code": 1,
      "libelleCourt": 1,
      "creationDate": 1
    }
  }
]
```
Nom : `produit-createur-filter-with-projection`

- Produits comptés par source puis par créateur
```json
[
  {
    "$group": {
      "_id": {
        "source": "$source",
        "createur": "$createur"
      },
      "totalProduits": {
        "$sum": 1
      }
    }
  },
  {
    "$sort": {
      "_id.source": 1,
      "totalProduits": -1
    }
  }
]
```
Nom : `produit-source-createur-by-total`

- Produits avec regroupement et liste des identifiants
```json
[
  {
    "$group": {
      "_id": "$codeCr",
      "totalProduits": {
        "$sum": 1
      },
      "idsProduits": {
        "$push": "$idProduit"
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
Nom : `produit-codecr-with-idproduits-by-total`

- Produits avec regroupement et nombre de créateurs distincts
```json
[
  {
    "$group": {
      "_id": "$source",
      "createurs": {
        "$addToSet": "$createur"
      }
    }
  },
  {
    "$project": {
      "totalCreateursDistincts": {
        "$size": "$createurs"
      }
    }
  }
]
```
Nom : `produit-source-with-distinct-createur-count`

- Produits avec nombre de responsables distincts par source
```json
[
  {
    "$group": {
      "_id": "$source",
      "responsables": {
        "$addToSet": "$responsable.email"
      }
    }
  },
  {
    "$project": {
      "totalResponsablesDistincts": {
        "$size": "$responsables"
      }
    }
  }
]
```
Nom : `produit-source-with-distinct-responsable-count`