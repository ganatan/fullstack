# 013-push-non-fast-forward.md — Git — Erreur `non-fast-forward` lors d’un push

## Nom de l’erreur

**Push rejected — non-fast-forward**  
Message typique :
> `! [rejected] main -> main (non-fast-forward)`  
> `Updates were rejected because the tip of your current branch is behind its remote counterpart`

---

## Signification

Tu tentes de pousser `main` vers le remote, mais :

- `origin/main` (ici `gitlab/main`) a **avancé** depuis ta dernière synchronisation
- ton `main` local est **en retard**
- Git refuse d’écraser l’historique distant avec un push “normal”

---

## Diagnostic rapide

Voir l’écart entre local et distant :

```bash
git fetch gitlab
git log --oneline --left-right --graph main...gitlab/main
```

- commits à gauche : seulement dans `main` (local)
- commits à droite : seulement dans `gitlab/main` (distant)

---

## Solutions (choisir 1)

### A) Cas standard (recommandé) : récupérer puis pousser

#### 1) Merge (simple)

```bash
git fetch gitlab
git switch main
git merge gitlab/main
git push gitlab main
```

#### 2) Rebase (historique linéaire)

```bash
git fetch gitlab
git switch main
git rebase gitlab/main
git push gitlab main
```

---

### B) Tu veux écraser le distant (dangereux)

À faire uniquement si tu es sûr de toi (tu es seul, ou tu assumes).

```bash
git push --force-with-lease gitlab main
```

---

## Remarques

- `--force-with-lease` est plus sûr que `--force` : il refuse si le remote a encore bougé depuis ton dernier `fetch`.
- Si tu utilises un workflow équipe, privilégie **A** (merge ou rebase).
