## Error protected branch
Enter passphrase for key '/c/Users/chend/.ssh/ganatangitlab': 
Enumerating objects: 3117, done.
Counting objects: 100% (3117/3117), done.
Delta compression using up to 12 threads
Compressing objects: 100% (1436/1436), done.
Writing objects: 100% (3117/3117), 540.34 KiB | 2.92 MiB/s, done.
Total 3117 (delta 1770), reused 2885 (delta 1572), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (1770/1770), done.
remote: GitLab: You are not allowed to force push code to a protected branch on this project.
To gitlab-ganatan:ganatan/fullstack.git
 ! [remote rejected] github/main -> main (pre-receive hook declined)
error: failed to push some refs to 'gitlab-ganatan:ganatan/fullstack.git'

# Solution

GitLab → ton projet → **Settings** → **Repository** → **Branch rules** (ou **Protected branches**)

Sur la règle de `main` :
- **Allowed to push and merge** = `Maintainers`
- **Allow force push** = `ON`

Ensuite :
```powershell
git fetch --all --prune
git push --force-with-lease gitlab github/main:main
```



