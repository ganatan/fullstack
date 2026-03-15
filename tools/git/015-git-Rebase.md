# Git — Rebase

## Objectif

Comprendre le concept de `rebase`, savoir quand l’utiliser, comment l’exécuter proprement, et éviter les erreurs classiques.

---

## 1) Concept

`git rebase` permet de rejouer une série de commits sur une autre base.

Autrement dit :
- Git prend tes commits
- les retire temporairement
- déplace ta branche sur une nouvelle base
- rejoue ensuite tes commits un par un

Le but principal :
- garder un historique plus linéaire
- éviter des commits de merge inutiles
- remettre une branche à jour par rapport à une autre

---

## 2) Intuition simple

Tu as une branche `dev` et une branche `feature/routing`.

Pendant que tu travailles sur `feature/routing`, la branche `dev` avance.

Avec `rebase`, tu dis :

- prends mes commits de `feature/routing`
- repose-les au-dessus du dernier état de `dev`

---

## 3) Différence entre merge et rebase

### `merge`

- conserve l’historique réel
- crée souvent un commit de merge
- plus simple à comprendre
- historique parfois plus bruité

### `rebase`

- réécrit l’historique de la branche
- donne un historique plus propre et linéaire
- évite certains commits de merge
- demande plus d’attention

---

## 4) Exemple visuel

### Avant

```text
A---B---C  dev
     \
      D---E  feature/routing
```

La branche `feature/routing` a été créée à partir de `B`.

Ensuite `dev` a avancé avec `C`.

### Après rebase de `feature/routing` sur `dev`

```text
A---B---C  dev
         \
          D'---E'  feature/routing
```

Les commits `D` et `E` sont rejoués sur `C`.

Attention :
- `D'` et `E'` sont de nouveaux commits
- ce ne sont pas exactement les anciens hashes

---

## 5) À quoi sert un rebase

`rebase` sert souvent à :
- mettre à jour une branche de travail avec `dev`
- garder un historique propre avant une PR
- nettoyer une série de commits locaux
- éviter des merges inutiles dans une feature branch

---

## 6) Cas typique

Tu travailles sur :

```text
feature/routing
```

Mais `dev` a reçu de nouveaux commits.

Tu veux remettre ta branche à jour sans faire :

```text
Merge branch 'dev' into feature/routing
```

Tu fais donc un `rebase`.

---

## 7) Commande de base

Depuis ta branche de travail :

```bash
git checkout feature/routing
git rebase dev
```

Cela signifie :
- prendre les commits de `feature/routing`
- les rejouer sur la dernière version de `dev`

---

## 8) Méthode recommandée avant rebase

Toujours récupérer l’état distant avant :

```bash
git fetch --all --prune
```

Puis :

```bash
git checkout dev
git pull origin dev
git checkout feature/routing
git rebase dev
```

---

## 9) Exemple complet

### Situation

- `dev` contient les derniers changements
- tu veux remettre `feature/routing` à jour

Commandes :

```bash
git fetch --all --prune
git checkout dev
git pull origin dev
git checkout feature/routing
git rebase dev
```

Si tout se passe bien :
- ta branche est maintenant basée sur le dernier `dev`

---

## 10) Que se passe-t-il techniquement

Git fait ceci :
- repère le point commun entre les deux branches
- récupère les commits propres à ta branche
- repositionne la branche sur la nouvelle base
- rejoue tes commits un à un

---

## 11) Rebase en cas de conflit

Si un conflit apparaît, Git s’arrête.

Exemple de message :

```bash
CONFLICT (content): Merge conflict in src/app/app.component.ts
```

À ce moment-là :
- tu corriges le fichier
- tu ajoutes les fichiers corrigés
- tu continues le rebase

Commandes :

```bash
git add .
git rebase --continue
```

---

## 12) Boucle classique en cas de conflit

1. Git bloque sur un conflit  
2. tu corriges les fichiers  
3. tu fais :

```bash
git add .
git rebase --continue
```

4. si un autre conflit arrive, tu recommences  
5. quand c’est fini, le rebase se termine

---

## 13) Annuler un rebase en cours

Si tu veux tout annuler :

```bash
git rebase --abort
```

Git revient alors à l’état d’avant le rebase.

---

## 14) Passer un commit problématique

Possible mais à éviter sauf cas particulier :

```bash
git rebase --skip
```

Cela ignore le commit en cours de relecture.

Danger :
- tu peux perdre une modification importante

---

## 15) Vérifier le résultat

Après un rebase :

```bash
git log --oneline --graph --decorate --all
```

Tu verras normalement un historique plus propre.

---

## 16) Cas d’usage le plus courant

### Mettre une feature à jour avec `dev`

```bash
git fetch --all --prune
git checkout dev
git pull origin dev
git checkout feature/routing
git rebase dev
```

C’est probablement l’usage le plus utile au quotidien.

---

## 17) Rebase avant une PR

Avant d’ouvrir une Pull Request, certains veulent :
- une branche propre
- sans merge parasite
- avec un historique lisible

Dans ce cas :

```bash
git checkout feature/routing
git rebase dev
```

Puis push.

---

## 18) Attention après un rebase déjà poussé

Si ta branche a déjà été poussée sur le remote, le rebase change les hashes.

Tu ne pourras plus faire un simple push classique.

Il faudra souvent :

```bash
git push --force-with-lease
```

Exemple :

```bash
git push --force-with-lease origin feature/routing
```

---

## 19) Pourquoi `--force-with-lease`

Parce qu’après un rebase :
- l’historique local a été réécrit
- le remote ne correspond plus

`--force-with-lease` est préférable à `--force` :
- plus sûr
- évite d’écraser silencieusement un travail distant inattendu

---

## 20) Règle importante

Ne jamais faire de rebase sauvage sur une branche partagée par plusieurs personnes sans le savoir.

Pourquoi :
- tu réécris l’historique
- tu casses la synchronisation des autres
- tu peux provoquer du bazar inutile

---

## 21) Règle simple à retenir

### Rebase : oui

- sur tes branches locales
- sur tes branches personnelles
- avant PR
- pour te remettre à jour proprement

### Rebase : prudence

- sur une branche déjà utilisée par plusieurs développeurs
- sur `main`
- sur `dev` partagé
- sur une branche publique sans coordination

---

## 22) Rebase interactif

Il existe une version plus puissante :

```bash
git rebase -i HEAD~3
```

Cela permet de :
- réordonner des commits
- fusionner plusieurs commits
- renommer des messages
- supprimer un commit local

Très utile pour nettoyer l’historique avant push.

---

## 23) Exemple de rebase interactif

```bash
git rebase -i HEAD~3
```

Git ouvre une liste du style :

```text
pick a1b2c3 first commit
pick d4e5f6 second commit
pick g7h8i9 third commit
```

Tu peux remplacer :
- `pick` par `squash`
- `pick` par `reword`
- `pick` par `drop`

---

## 24) Signification rapide en interactif

### `pick`

- garder le commit tel quel

### `reword`

- garder le commit mais changer son message

### `squash`

- fusionner le commit avec le précédent

### `drop`

- supprimer le commit de l’historique réécrit

---

## 25) Exemple concret de squash

Tu as 3 commits :

```text
feat: add routing
fix: correct route typo
fix: remove console log
```

Tu veux n’en garder qu’un propre.

Tu fais :

```bash
git rebase -i HEAD~3
```

Puis :

```text
pick  a1b2c3 feat: add routing
squash d4e5f6 fix: correct route typo
squash g7h8i9 fix: remove console log
```

Résultat :
- un seul commit final plus propre

---

## 26) Rebase d’une branche sur une autre

Forme classique :

```bash
git rebase dev
```

Forme explicite :

```bash
git rebase dev feature/routing
```

Cela signifie :
- rebaser `feature/routing` sur `dev`

---

## 27) Rebase local propre avant livraison

Exemple de séquence :

```bash
git fetch --all --prune
git checkout dev
git pull origin dev
git checkout feature/auth-jwt
git rebase dev
git push --force-with-lease origin feature/auth-jwt
```

---

## 28) Quand préférer merge

Préférer `merge` si :
- tu veux garder l’historique réel exact
- la branche est partagée
- tu veux éviter la réécriture d’historique
- l’équipe n’est pas à l’aise avec rebase

---

## 29) Quand préférer rebase

Préférer `rebase` si :
- tu veux un historique propre
- tu travailles seul sur ta branche
- tu veux éviter des commits de merge inutiles
- tu veux remettre une feature à jour avant PR

---

## 30) Erreur classique

Faire un rebase puis oublier que l’historique a changé.

Ensuite tu fais :

```bash
git push origin feature/routing
```

Git peut refuser car le remote a encore l’ancien historique.

Il faudra alors :

```bash
git push --force-with-lease origin feature/routing
```

---

## 31) Vérifier l’état avant rebase

Toujours utile :

```bash
git status
```

Ton working tree doit être propre avant un rebase.

Si tu as des modifications non commit :
- commit
- ou stash

Exemple :

```bash
git stash
```

Puis après le rebase :

```bash
git stash pop
```

---

## 32) Cas pratique complet

### Tu veux remettre `feature/routing` à jour

```bash
git fetch --all --prune
git checkout dev
git pull origin dev
git checkout feature/routing
git status
git rebase dev
```

Si conflit :

```bash
git add .
git rebase --continue
```

Si tu veux annuler :

```bash
git rebase --abort
```

Puis push si la branche existait déjà à distance :

```bash
git push --force-with-lease origin feature/routing
```

---

## 33) Bonnes pratiques

- faire un `git status` avant
- récupérer les dernières branches distantes
- rebaser surtout des branches perso
- utiliser `--force-with-lease` après rebase d’une branche déjà poussée
- résoudre les conflits proprement
- vérifier l’historique après
- utiliser `rebase -i` pour nettoyer avant PR

---

## 34) Mauvaises pratiques

- rebaser une branche partagée sans prévenir
- faire un `push --force` brutal
- rebaser avec un working tree sale
- utiliser `--skip` sans comprendre
- rebaser `main` n’importe comment
- confondre `merge` et `rebase`

---

## 35) Résumé ultra simple

- `rebase` rejoue tes commits sur une nouvelle base
- ça donne un historique plus propre
- c’est pratique pour remettre une feature à jour avec `dev`
- en cas de conflit : corriger puis `git rebase --continue`
- pour annuler : `git rebase --abort`
- après rebase d’une branche déjà poussée : souvent `git push --force-with-lease`

---

## 36) Commandes utiles

Mettre à jour une feature avec `dev` :

```bash
git fetch --all --prune
git checkout dev
git pull origin dev
git checkout feature/routing
git rebase dev
```

Continuer après conflit :

```bash
git add .
git rebase --continue
```

Annuler :

```bash
git rebase --abort
```

Rebase interactif :

```bash
git rebase -i HEAD~3
```

Push après réécriture :

```bash
git push --force-with-lease origin feature/routing
```