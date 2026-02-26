# 010-merge.md — Git — Merge (fusion de branches)

## C’est quoi un merge

Un **merge** fusionne l’historique et le contenu d’une branche (ex : `dev`) dans une autre (ex : `main`).

- Tu te places sur la branche **cible** (celle qui reçoit).
- Tu merges la branche **source** (celle que tu veux intégrer).

---

## Pré-requis

- Ton working tree doit être propre :

```bash
git status
```

- Mettre à jour les refs distantes :

```bash
git fetch --all --prune
```

---

## 1) Merge simple (fast-forward)

Si `main` n’a pas divergé et peut avancer directement sur `dev`, Git fait un **fast-forward**.

```bash
git switch main
git merge dev
```

Résultat :
- pas de commit de merge
- `main` pointe sur le même commit que `dev`

---

## 2) Merge avec commit (3-way merge)

Si `main` et `dev` ont divergé, Git crée un **commit de merge**.

```bash
git switch main
git merge dev
```

Résultat :
- un commit “Merge branch 'dev'”
- l’historique garde la trace de la fusion

---

## 3) Merge en mode “no-ff” (forcer un commit de merge)

Même si un fast-forward est possible, tu peux forcer un commit de merge pour garder une trace explicite.

```bash
git switch main
git merge --no-ff dev
```

---

## 4) Vérifier ce que `dev` apporte avant merge

Commits présents dans `dev` et absents de `main` :

```bash
git log --oneline main..dev
```

Diff de contenu :

```bash
git diff main..dev
```

---

## 5) Résoudre un conflit

Si Git signale un conflit :

1) Voir les fichiers en conflit :
```bash
git status
```

2) Ouvrir les fichiers, résoudre les marqueurs :
- `<<<<<<<`
- `=======`
- `>>>>>>>`

3) Ajouter les fichiers résolus :
```bash
git add .
```

4) Finaliser le merge :
```bash
git commit
```

---

## 6) Annuler un merge en cours (avant commit)

Si tu veux abandonner le merge (conflits, mauvais choix) :

```bash
git merge --abort
```

---

## 7) Supprimer la branche après merge

Quand `dev` est intégré :

```bash
git branch -d dev
```

Si Git refuse (non fully merged), c’est que tu n’as pas intégré ce que tu veux garder.

---

## 8) Lister les merges (commits de merge)

### 8.1 Liste des commits de merge

```bash
git log --merges --oneline
```

Avec un graphe lisible :

```bash
git log --merges --decorate --graph --oneline
```

### 8.2 Historique principal (très utile sur `main`)

Montre la “ligne principale” (les merges vus depuis la branche) :

```bash
git switch main
git log --first-parent --oneline
```

---

## 9) Branches mergées / non mergées (local)

### 9.1 Branches locales mergées dans `main`

```bash
git branch --merged main
```

### 9.2 Branches locales non mergées dans `main`

```bash
git branch --no-merged main
```

---

## 10) Branches mergées / non mergées (distant)

Ces commandes listent les branches **distantes** (`origin/*`).

### 10.1 Branches distantes mergées dans `origin/main`

```bash
git fetch --all --prune
git branch -r --merged origin/main
```

### 10.2 Branches distantes non mergées dans `origin/main`

```bash
git fetch --all --prune
git branch -r --no-merged origin/main
```

---

## 11) Merge + push (si tu travailles avec origin)

Après merge sur `main` :

```bash
git push origin main
```

Optionnel : supprimer la branche distante :

```bash
git push origin --delete dev
```
