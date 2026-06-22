# SVN - Tour d'horizon complet pour un développeur

## Objectif

Maîtriser les fonctionnalités SVN réellement utilisées en entreprise :

```text
Repository
Checkout
Update
Status
Diff
Commit
Historique
Conflits
Branches
Tags
Merge
```

Contexte :

```text
Utilisateur : mulder
Mot de passe : Trustno1
Serveur : VisualSVN
```

---

# Architecture

Serveur SVN :

```text
Repositories
└── svn-test
    ├── trunk
    ├── branches
    └── tags
```

Poste local :

```text
D:\demo
│
├── source
│
├── svn-test1
│
└── svn-test2
```

---

# 1. Création du dépôt

Créer :

```text
svn-test
```

Puis :

```text
trunk
branches
tags
```

Résultat :

```text
svn-test
├── trunk
├── branches
└── tags
```

---

# 2. Création de l'utilisateur

Créer :

```text
Login    : mulder
Password : Trustno1
```

Attribuer :

```text
Read / Write
```

sur :

```text
svn-test
```

---

# 3. Import initial

Créer :

```text
D:\demo\source\README.md
```

Contenu :

```text
Version 1
```

Import :

```bash
svn import D:\demo\source https://localhost/svn/svn-test/trunk --username mulder -m "Initial import"
```

Résultat :

```text
Committed revision 1
```

---

# 4. Premier checkout

```bash
svn checkout https://localhost/svn/svn-test/trunk D:\demo\svn-test1 --username mulder
```

---

# 5. Deuxième checkout

```bash
svn checkout https://localhost/svn/svn-test/trunk D:\demo\svn-test2 --username mulder
```

---

# 6. Modification

Modifier :

```text
README.md
```

Contenu :

```text
Version 2
```

Vérifier :

```bash
svn status
```

Résultat :

```text
M README.md
```

---

# 7. Diff

```bash
svn diff
```

Résultat :

```text
-Version 1
+Version 2
```

---

# 8. Commit

```bash
svn commit -m "Passage version 2"
```

Résultat :

```text
Committed revision 2
```

---

# 9. Update

Dans :

```text
D:\demo\svn-test2
```

Exécuter :

```bash
svn update
```

Résultat :

```text
Updated to revision 2
```

---

# 10. Historique

```bash
svn log
```

Résultat :

```text
r1 Initial import
r2 Passage version 2
```

---

# 11. Ajout d'un fichier

Créer :

```text
notes.txt
```

Ajouter :

```bash
svn add notes.txt
```

Commit :

```bash
svn commit -m "Ajout notes"
```

---

# 12. Suppression d'un fichier

```bash
svn delete notes.txt
```

Commit :

```bash
svn commit -m "Suppression notes"
```

---

# 13. Annuler une modification

Modifier :

```text
README.md
```

Puis :

```bash
svn revert README.md
```

---

# 14. Conflit

## Dans svn-test1

Modifier :

```text
Version 3
```

Commit :

```bash
svn commit -m "Version 3"
```

---

## Dans svn-test2

Modifier également :

```text
Version 4
```

Puis :

```bash
svn commit -m "Version 4"
```

Résultat :

```text
Out of date
```

---

Faire :

```bash
svn update
```

Résultat :

```text
Conflict
```

SVN génère :

```text
README.md.mine
README.md.r3
README.md.r4
```

Corriger le conflit.

Puis :

```bash
svn resolve --accept working README.md
```

Commit :

```bash
svn commit -m "Résolution conflit"
```

---

# 15. Création d'une branche

Créer :

```bash
svn copy ^
https://localhost/svn/svn-test/trunk ^
https://localhost/svn/svn-test/branches/feature-login ^
-m "Création branche feature-login"
```

Résultat :

```text
branches
└── feature-login
```

---

# 16. Checkout de la branche

```bash
svn checkout https://localhost/svn/svn-test/branches/feature-login D:\demo\feature-login --username mulder
```

---

# 17. Développement dans la branche

Modifier :

```text
README.md
```

Contenu :

```text
Version branche feature-login
```

Commit :

```bash
svn commit -m "Travail branche feature-login"
```

---

# 18. Merge vers trunk

Se placer dans :

```text
D:\demo\svn-test1
```

Mettre à jour :

```bash
svn update
```

Fusion :

```bash
svn merge https://localhost/svn/svn-test/branches/feature-login
```

Vérifier :

```bash
svn diff
```

Commit :

```bash
svn commit -m "Merge feature-login"
```

---

# 19. Création d'un tag

Créer une version figée :

```bash
svn copy ^
https://localhost/svn/svn-test/trunk ^
https://localhost/svn/svn-test/tags/v1.0 ^
-m "Tag version 1.0"
```

Résultat :

```text
tags
└── v1.0
```

---

# 20. Informations dépôt

```bash
svn info
```

Exemple :

```text
URL
Revision
Repository Root
Last Changed Rev
```

---

# 21. Voir qui a modifié une ligne

```bash
svn blame README.md
```

Résultat :

```text
r1 mulder
r2 mulder
r3 mulder
```

---

# Les commandes essentielles

```bash
svn checkout
svn update
svn status
svn diff
svn log
svn add
svn delete
svn revert
svn commit
svn info
```

---

# Les commandes avancées

```bash
svn resolve
svn copy
svn merge
svn blame
```

---

# Ce qui est utilisé au quotidien

## 90 %

```bash
svn update
svn status
svn diff
svn commit
svn log
```

## 8 %

```bash
svn add
svn delete
svn revert
```

## 2 %

```bash
svn merge
svn copy
svn blame
```

