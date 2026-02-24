# GitHub — Créer un repo

## 1) Créer le repo sur GitHub

GitHub → New repository → Create repository.

---

## 2) Créer le repo local + commit + push

Dans ton dossier projet :

```bash
cd D:\ton-projet
echo "# test001" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:USER/REPO.git
git remote -v
ssh -T git@github.com
git push -u origin main
```

---

## 2) Créer le repo local + commit + push + en SSL

Dans ton dossier projet :

```bash
cd D:\ton-projet
echo "# test001" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote set-url origin git@github.com:USER/REPO.git
git remote -v
ssh -T git@github.com
git push -u origin main
```

---


## 3) Vérifier

```bash
git status
git remote -v
git log --oneline -5
```

---

## 4) Push des commits suivants

```bash
git add -A
git commit -m "feat: x"
git push
```

---

## 5) Si erreur d’auth HTTPS

Configurer Git Credential Manager :

```bash
git config --global credential.helper manager-core
```

Relancer :

```bash
git push
```
