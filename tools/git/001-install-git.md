# 001-install-git.md — Installer Git (Windows) et vérifier que ça marche

## 1) Installer Git

1. Télécharger et installer **Git for Windows**.
2. Pendant l’installation, laisser les options par défaut.

---

## 2) Vérifier l’installation

Ouvrir **PowerShell** (ou Git Bash) et exécuter :

```bash
git --version
```

Résultat attendu : une version du type `git version 2.xx.x`.

---

## 3) Config minimale (obligatoire)

```bash
git config --global user.name "Ton Nom"
git config --global user.email "ton@email"
git config --global init.defaultBranch main
```

Vérifier :

```bash
git config --global --list
```

---

## 4) Test local complet (repo + commit)

Créer un dossier de test et faire un commit :

```bash
mkdir D:\git-test
cd D:\git-test
echo test> hello.txt
git init
git add -A
git commit -m "chore: test"
git log --oneline -1
```

Résultat attendu :
- `git commit` OK
- `git log` affiche 1 commit

---

## 5) Commandes de diagnostic

```bash
where git
git status
```

---

## 6) Si ça ne marche pas

- Fermer/réouvrir PowerShell après installation.
- Vérifier que `where git` renvoie un chemin (ex: `C:\Program Files\Git\cmd\git.exe`).
