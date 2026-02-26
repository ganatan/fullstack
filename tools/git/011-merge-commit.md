# 011-merge-commit.md — Git — Commit de merge

## Définition

Un **commit de merge** est un commit créé par Git lors d’un `git merge` quand la fusion **n’est pas** un fast-forward.

- Un commit “normal” a **1 parent**
- Un commit de merge a **2 parents**
  - parent 1 : la branche cible avant merge (ex : `main`)
  - parent 2 : la branche source mergée (ex : `dev`)

C’est ce commit qui matérialise : “`dev` a été fusionnée dans `main`”.

---

## Quand un commit de merge est créé

### 1) Fast-forward (pas de commit de merge)

Si `main` n’a pas divergé depuis la création de `dev`, Git avance simplement `main` sur le commit de `dev`.

```bash
git switch main
git merge dev
```

Résultat :
- pas de commit de merge
- `main` pointe sur le même commit que `dev`

### 2) 3-way merge (commit de merge créé)

Si `main` et `dev` ont divergé, Git crée un commit de merge.

```bash
git switch main
git merge dev
```

Résultat :
- création d’un commit avec **2 parents**
- l’historique garde une trace explicite de la fusion

---

## Forcer un commit de merge même si fast-forward est possible

```bash
git switch main
git merge --no-ff dev
```

Utile pour :
- garder une trace explicite des branches fusionnées
- faciliter la lecture de l’historique en mode “feature branches”

---

## Comment voir les commits de merge

### Liste simple

```bash
git log --merges --oneline
```

### Avec graphe

```bash
git log --merges --decorate --graph --oneline
```

### Ligne principale (très utile sur `main`)

```bash
git switch main
git log --first-parent --oneline
```

---

## Comparer : fast-forward vs merge commit

### Vérifier si un merge va être fast-forward

```bash
git fetch --all --prune
git log --oneline main..dev
```

- Si `main` n’a pas de commits “à côté” et que `dev` est juste en avance, le merge peut être fast-forward.
- Si les historiques ont divergé, Git fera un commit de merge (ou échouera si contraintes).

---

## Points pratiques

- Un commit de merge peut contenir des résolutions de conflits.
- En équipe, `--no-ff` est souvent utilisé pour garder un historique lisible.
- `--ff-only` force Git à refuser tout merge qui nécessiterait un commit de merge.

```bash
git merge --ff-only dev
```
