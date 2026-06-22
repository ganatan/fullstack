# 001 - Installation et découverte de SVN en local sous Windows

## Objectif

Installer un environnement SVN complet sur son poste Windows afin de comprendre :

- checkout
- update
- status
- diff
- commit
- log
- conflits
- utilisateurs
- authentification

comme dans un projet Java legacy chez Naval Group.

---

# 1. Installer VisualSVN Server

Télécharger :

https://www.visualsvn.com/server/

Installation :

```text
Next
Next
Next
Install
```

Une fois installé :

```text
VisualSVN Server Manager
```

---

# 2. Créer un utilisateur SVN

Ouvrir :

```text
VisualSVN Server Manager
```

Créer un utilisateur :

```text
Users
→ Create User
```

Exemple :

```text
User name : danny
Password  : danny123
```

Valider.

Vous disposez maintenant d'un compte SVN :

```text
Login    : danny
Password : danny123
```

---

# 3. Créer un dépôt SVN

Dans VisualSVN Server :

```text
Repositories
→ Create New Repository
```

Choisir :

```text
Regular FSFS Repository
```

Nom :

```text
demo-svn
```

Valider.

Une URL est créée :

```text
https://localhost/svn/demo-svn
```

---

# 4. Donner les droits au dépôt

Dans :

```text
Repositories
→ demo-svn
→ Properties
→ Security
```

Ajouter :

```text
danny
```

avec les droits :

```text
Read / Write
```

Valider.

Le dépôt est maintenant accessible avec :

```text
Login    : danny
Password : danny123
```

---

# 5. Installer TortoiseSVN

Télécharger :

https://tortoisesvn.net/

Installer puis redémarrer Windows.

Vous disposez maintenant du menu :

```text
clic droit
→ SVN Checkout
```

---

# 6. Créer l'arborescence de démonstration

Créer :

```text
D:\demo
D:\demo\svn-test
D:\demo\workspace
D:\demo\workspace2
```

Créer :

```text
D:\demo\svn-test\README.md
```

Contenu :

```text
Mon premier projet SVN
```

---

# 7. Créer l'arborescence standard SVN

Dans VisualSVN :

```text
Repositories
→ demo-svn
```

Créer :

```text
trunk
branches
tags
```

Résultat :

```text
demo-svn
│
├── trunk
├── branches
└── tags
```

---

# 8. Importer le projet dans SVN

Ouvrir une invite de commande.

Commande :

```bash
svn import D:\demo\svn-test https://localhost/svn/demo-svn/trunk --username danny -m "Initial import"
```

SVN demande :

```text
Password for 'danny':
```

Saisir :

```text
danny123
```

Résultat attendu :

```text
Committed revision 1
```

---

# 9. Effectuer un checkout

Commande :

```bash
svn checkout https://localhost/svn/demo-svn/trunk D:\demo\workspace --username danny
```

ou

```bash
svn co https://localhost/svn/demo-svn/trunk D:\demo\workspace --username danny
```

SVN demande :

```text
Password for 'danny':
```

Saisir :

```text
danny123
```

Résultat :

```text
D:\demo\workspace
    README.md
```

---

# 10. Vérifier l'état du dépôt

Se placer dans :

```bash
cd D:\demo\workspace
```

Commande :

```bash
svn status
```

Résultat :

```text
aucune sortie
```

Cela signifie :

```text
workspace propre
aucune modification
```

---

# 11. Modifier un fichier

Modifier :

```text
D:\demo\workspace\README.md
```

Nouveau contenu :

```text
Mon premier projet SVN
Version 2
```

---

# 12. Voir les modifications

Commande :

```bash
svn status
```

Résultat :

```text
M README.md
```

---

# 13. Voir le détail des modifications

Commande :

```bash
svn diff
```

---

# 14. Commit des modifications

Commande :

```bash
svn commit -m "Ajout version 2"
```

Résultat :

```text
Committed revision 2
```

---

# 15. Consulter l'historique

Commande :

```bash
svn log
```

Résultat :

```text
r1 Initial import
r2 Ajout version 2
```

---

# 16. Ajouter un fichier

Créer :

```text
notes.txt
```

Commande :

```bash
svn add notes.txt
```

Vérification :

```bash
svn status
```

Résultat :

```text
A notes.txt
```

Commit :

```bash
svn commit -m "Ajout notes"
```

---

# 17. Supprimer un fichier

Commande :

```bash
svn delete notes.txt
```

Vérification :

```bash
svn status
```

Résultat :

```text
D notes.txt
```

Commit :

```bash
svn commit -m "Suppression notes"
```

---

# 18. Annuler une modification locale

Commande :

```bash
svn revert README.md
```

---

# 19. Mettre à jour son workspace

Commande :

```bash
svn update
```

ou :

```bash
svn up
```

---

# 20. Simuler un deuxième développeur

Effectuer un second checkout :

```bash
svn checkout https://localhost/svn/demo-svn/trunk D:\demo\workspace2 --username danny
```

Résultat :

```text
D:\demo\workspace
D:\demo\workspace2
```

Simulation :

```text
workspace  = Danny
workspace2 = Collègue
```

---

# 21. Créer un conflit

Dans :

```text
D:\demo\workspace
```

Modifier :

```text
README.md
```

Puis :

```bash
svn commit
```

Dans :

```text
D:\demo\workspace2
```

Modifier également :

```text
README.md
```

Puis :

```bash
svn commit
```

Résultat :

```text
Conflict
```

SVN demandera une résolution manuelle.

---

# 22. Structure classique d'un dépôt SVN

```text
demo-svn
│
├── trunk
├── branches
└── tags
```

Signification :

```text
trunk     = développement principal
branches  = branches parallèles
tags      = versions figées
```

---

# 23. Commandes indispensables

```bash
svn info
svn update
svn status
svn diff
svn add
svn delete
svn revert
svn log
svn checkout
svn commit
```

---

# Workflow SVN recommandé

Avant de commencer :

```bash
svn update
svn status
```

Après modifications :

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

Puis :

```bash
svn commit -m "Description de la correction"
```

---

# Résumé

Compte de démonstration :

```text
URL      : https://localhost/svn/demo-svn
Login    : danny
Password : danny123
```

Commandes à connaître :

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

Les trois réflexes quotidiens :

```bash
svn update
svn status
svn diff
```