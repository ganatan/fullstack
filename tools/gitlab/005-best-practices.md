# 005-best-practices.md — Git — Best practices noms de branches (succinct)

## Objectif
Standardiser les noms de branches pour :
- comprendre l’intention immédiatement
- automatiser CI/CD (rules, pipelines)
- garder un historique lisible

---

## Règles générales
- minuscules, ASCII (pas d’accents)
- pas d’espaces
- séparateurs : `/` pour la catégorie, `-` pour les mots
- 1 branche = 1 sujet
- inclure un identifiant de ticket si dispo : `ABC-123`

---

## Convention recommandée (simple)
Format :

`<type>/<ticket>-<slug>`

- `<type>` : catégorie
- `<ticket>` : optionnel (Jira/GitLab)
- `<slug>` : description courte (2–6 mots)

Exemples :
- `feature/ABC-123-add-pagination`
- `feature/add-pagination`
- `fix/ABC-241-null-pointer-save`
- `hotfix/prod-payment-timeout`
- `release/1.8.0`

---

## Types de branches
### feature/*
Nouvelle fonctionnalité ou évolution.
Ex :
- `feature/login-oauth`
- `feature/ABC-123-add-pagination`

### release/*
Stabilisation avant mise en production (gel + correctifs + tag).
Ex :
- `release/1.8.0`
- `release/2026-02-27-sprint-12`

### hotfix/*
Correction urgente en production (part de `main`).
Ex :
- `hotfix/prod-crash-on-start`
- `hotfix/ABC-911-payment-timeout`

### (optionnel) fix/*
Correction non urgente (hors incident prod).
Ex :
- `fix/bad-date-format`

### (optionnel) refactor/*, chore/*, docs/*
- `refactor/split-media-service`
- `chore/bump-node-versions`
- `docs/update-readme`

---

## Mapping workflow (rappel)
- `feature/*` → merge vers `dev`
- `fix/*` → merge vers `dev`
- `release/*` → merge vers `main` (+ back-merge vers `dev` recommandé)
- `hotfix/*` → depuis `main` → merge vers `main` + back-merge vers `dev`

---

## Anti-patterns à éviter
- `features/...` (préférer `feature/...`)
- `test`, `wip`, `tmp`, `new` (pas informatif)
- noms trop longs (> 60 caractères)
- plusieurs sujets dans la même branche
