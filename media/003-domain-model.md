# 003-domain-model.md

# Domain Model — Media (V1)

Modélisation de données minimale pour la vertical slice V1.

Objectif :
définir la structure du Media avant les contracts,
la base PostgreSQL, les events Kafka et MongoDB.

---

## Entité Media

Champs :

- id : UUID
- name : string
- release_date : date

---

## Représentation logique

Media
- id
- name
- release_date

---

## Rôle

Ce modèle sert de référence pour :

- table PostgreSQL (write model)
- event Kafka MediaCreated.v1
- collection MongoDB (read-model)
- DTO API
- client Angular

