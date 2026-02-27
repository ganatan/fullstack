## Essentiels

```bash
ssh-keygen -t ed25519 -C "user01@gmail.com"

Preferences → SSH Keys → Add new key → coller la clé `.pub`.

Host gitlab-user01
  HostName gitlab.com
  User git
  IdentityFile ~/.ssh/user01
  IdentitiesOnly yes

ssh -T git@gitlab-user01
```

```bash
git clone git@gitlab-user01:user01/test001.git
git config user.name "user01"
git config user.email "user01@gmail.com"
git config --global --list
git add *
git commit -m "First Commit"
git push origin main
```

```bash
git branch -a
git remote -v
git log -20 --oneline --decorate
git log -10 --oneline --decorate origin/main
```

```bash
git checkout -b dev
git add *
git commit -m "Add Dev Branch"
git push origin dev
```


```bash
git checkout -b feature/routing
git checkout -b feature/lazy-loading
git checkout -b release/1.0.0
git checkout -b fix/routing-guard
git checkout -b hotfix/prod-crash
git add *
git commit -m "feature"
git push origin feature/routing
git push origin feature/lazy-loading
git push origin release/1.0.0
git push origin fix/routing-guard
git push origin hotfix/prod-crash
```

```bash
git fetch gitlab
```


