# 012-utilisation-vim-vscode.md — Git — Éditeur Vim pendant un merge + config VSCode

## Contexte

Lors d’un `git merge` (ou rebase), Git peut ouvrir un éditeur pour saisir un message de commit (ex : commit de merge).  
Si tu vois un écran avec :

- `MERGE_MSG`
- des `~` sur les lignes vides
- des lignes qui commencent par `#`

Tu es dans **Vim**.

---

## 1) Valider le message de merge (garder le message par défaut)

1) Appuyer sur `Esc`
2) Taper `:wq`
3) Appuyer sur `Enter`

Effet :
- Vim enregistre le fichier (`w`)
- Vim quitte (`q`)
- Git finalise le merge et crée le commit de merge

Ensuite :

```bash
git push gitlab main
```

---

## 2) Modifier le message puis valider

1) Appuyer sur `i` (mode insertion)
2) Modifier la première ligne (ou le texte)
3) Appuyer sur `Esc`
4) Taper `:wq`
5) `Enter`

---

## 3) Quitter sans sauvegarder (abandonner le message)

Si tu ne veux pas créer le commit (ou si tu t’es trompé) :

1) Appuyer sur `Esc`
2) Taper `:q!`
3) `Enter`

Ensuite, si un merge est en cours et tu veux l’annuler :

```bash
git merge --abort
```

---

## 4) Rappels Vim minimum

- Passer en mode insertion : `i`
- Revenir en mode normal : `Esc`
- Sauver et quitter : `:wq`
- Quitter sans sauver : `:q!`

---

## 5) Configurer VSCode comme éditeur Git (Windows)

Configurer VSCode pour que Git ouvre VSCode au lieu de Vim :

```bash
git config --global core.editor "code --wait"
```

Vérifier :

```bash
git config --global core.editor
```

---

## 6) Alternative : Notepad (Windows)

```bash
git config --global core.editor "notepad"
```
