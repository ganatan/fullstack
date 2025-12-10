# Initialisation d'un repository GitHub

## 1. Commandes à exécuter

``` bash
echo "# example" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/ganatan/example.git
```

------------------------------------------------------------------------

## 2. Fichier de configuration Git (`.git/config`)

``` ini
[core]
    repositoryformatversion = 0
    filemode = false
    bare = false
    logallrefupdates = true
    symlinks = false
    ignorecase = true

[remote "github"]
    url = git@github.com:ganatan/example.git
    fetch = +refs/heads/*:refs/remotes/github/*

[branch "master"]
    remote = github
    merge = refs/heads/master
    vscode-merge-base = origin/master

[user]
    email = example@gmail.com
    name = example

[branch "main"]
    remote = github
    merge = refs/heads/main
```

------------------------------------------------------------------------

## 3. Push initial du dépôt

``` bash
git push -u github main
```
