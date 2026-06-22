# 002 - SVN : Les commandes essentielles

## Objectif

Maîtriser les commandes SVN utilisées quotidiennement dans une mission Java legacy.

---

# Vérifier l'installation

Afficher la version :

```bash
svn --version
```

---

# Récupérer un projet

Créer une copie locale du dépôt :

```bash
svn checkout https://serveur/svn/projet/trunk
```

Version courte :

```bash
svn co https://serveur/svn/projet/trunk
```

Exemple :

```bash
svn co https://localhost/svn/demo-svn/trunk
```

---

# Connaître les informations du dépôt

```bash
svn info
```

Exemple :

```text
URL: https://localhost/svn/demo-svn/trunk
Revision: 12
Repository Root: https://localhost/svn/demo-svn
```

---

# Mettre à jour son workspace

Récupérer les modifications des autres développeurs :

```bash
svn update
```

Version courte :

```bash
svn up
```

Exemple :

```text
Updated to revision 15
```

---

# Vérifier les modifications locales

```bash
svn status
```

Version courte :

```bash
svn st
```

Exemple :

```text
M src/Main.java
A src/User.java
D src/Test.java
? target
```

Signification :

```text
M = Modified
A = Added
D = Deleted
? = Non versionné
C = Conflict
```

---

# Voir les différences

Afficher toutes les modifications :

```bash
svn diff
```

Afficher les modifications d'un fichier :

```bash
svn diff src/Main.java
```

---

# Ajouter un fichier

Créer un fichier :

```text
User.java
```

Ajouter au dépôt :

```bash
svn add User.java
```

Vérification :

```bash
svn status
```

Résultat :

```text
A User.java
```

---

# Ajouter un répertoire

```bash
svn add src/service
```

---

# Supprimer un fichier

```bash
svn delete User.java
```

Version courte :

```bash
svn del User.java
```

Résultat :

```text
D User.java
```

---

# Renommer un fichier

```bash
svn move User.java Customer.java
```

Version courte :

```bash
svn mv User.java Customer.java
```

---

# Copier un fichier

```bash
svn copy User.java UserBackup.java
```

Version courte :

```bash
svn cp User.java UserBackup.java
```

---

# Annuler une modification locale

Annuler un fichier :

```bash
svn revert User.java
```

Annuler récursivement :

```bash
svn revert -R .
```

---

# Consulter l'historique

```bash
svn log
```

Exemple :

```text
r10 Correction bug
r9 Ajout service utilisateur
r8 Création projet
```

---

# Consulter un nombre limité de révisions

```bash
svn log -l 5
```

Afficher les 5 dernières révisions.

---

# Voir l'auteur d'une révision

```bash
svn log -v
```

---

# Afficher le contenu d'une révision

```bash
svn cat README.md
```

---

# Comparer avec une ancienne révision

Comparer la révision actuelle avec la révision 10 :

```bash
svn diff -r 10 HEAD
```

Comparer deux révisions :

```bash
svn diff -r 10:15
```

---

# Voir les fichiers verrouillés

```bash
svn status -u
```

---

# Rechercher les conflits

```bash
svn status
```

Résultat :

```text
C Main.java
```

Le fichier est en conflit.

---

# Résoudre un conflit

Après correction manuelle :

```bash
svn resolve --accept working Main.java
```

---

# Créer un commit

```bash
svn commit -m "Correction calcul TVA"
```

Version courte :

```bash
svn ci -m "Correction calcul TVA"
```

---

# Commit d'un seul fichier

```bash
svn commit Main.java -m "Correction Main"
```

---

# Voir les révisions disponibles

```bash
svn log
```

---

# Exporter sans les métadonnées SVN

```bash
svn export https://serveur/svn/projet/trunk export
```

---

# Workflow quotidien

Arrivée le matin :

```bash
svn update
svn status
```

Pendant le développement :

```bash
svn status
svn diff
```

Avant commit :

```bash
svn update
svn status
svn diff
```

Commit :

```bash
svn commit -m "Description claire de la correction"
```

---

# Les 10 commandes à connaître par cœur

```bash
svn checkout
svn update
svn status
svn diff
svn add
svn delete
svn revert
svn log
svn info
svn commit
```

---

# Correspondance Git / SVN

| Git | SVN |
|------|------|
| git clone | svn checkout |
| git pull | svn update |
| git status | svn status |
| git diff | svn diff |
| git add | svn add |
| git rm | svn delete |
| git log | svn log |
| git commit | svn commit |
| git push | svn commit |

Attention :

```text
Git :
commit local puis push

SVN :
commit directement sur le serveur
```

C'est la différence la plus importante à retenir.