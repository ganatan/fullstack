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

# 2. Créer un dépôt SVN

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

# 3. Installer TortoiseSVN

Télécharger :

https://tortoisesvn.net/

Installer puis redémarrer Windows.

Vous disposez maintenant du menu :

```text
clic droit
→ SVN Checkout
```

---

# 4. Créer l'arborescence de démonstration

Créer les répertoires :

```text
D:\demo
D:\demo\svn-test
D:\demo\workspace
D:\demo\workspace2
```

Créer le fichier :

```text
D:\demo\svn-test\README.md
```

Contenu :

```text
Mon premier projet SVN
```

---

# 5. Importer le projet dans SVN

Ouvrir une invite de commande.

Commande :

```bash
svn import D:\demo\svn-test https://localhost/svn/demo-svn/trunk -m "Initial import"
```

Résultat attendu :

```text
Committed revision 1
```

---

# 6. Effectuer un checkout

Commande :

```bash
svn checkout https://localhost/svn/demo-svn/trunk D:\demo\workspace
```

ou

```bash
svn co https://localhost/svn/demo-svn/trunk D:\demo\workspace
```

Résultat :

```text
D:\demo\workspace
    README.md
```

---

# 7. Vérifier l'état du dépôt

Se placer dans le workspace :

```bash
cd D:\demo\workspace
```

Commande :

```bash
svn status
```

ou

```bash
svn st
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

# 8. Modifier un fichier

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

# 9. Voir les modifications

Commande :

```bash
svn status
```

Résultat :

```text
M README.md
```

Signification :

```text
M = Modified
```

---

# 10. Voir le détail des modifications

Commande :

```bash
svn diff
```

Résultat :

```text
- Mon premier projet SVN

+ Mon premier projet SVN
+ Version 2
```

---

# 11. Commit des modifications

Commande :

```bash
svn commit -m "Ajout version 2"
```

ou

```bash
svn ci -m "Ajout version 2"
```

Résultat :

```text
Committed revision 2
```

---

# 12. Consulter l'historique

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

# 13. Ajouter un fichier

Créer :

```text
D:\demo\workspace\notes.txt
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

# 14. Supprimer un fichier

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

# 15. Annuler une modification locale

Modifier :

```text
README.md
```

Puis :

```bash
svn revert README.md
```

Résultat :

```text
la dernière version du dépôt est restaurée
```

---

# 16. Mettre à jour son workspace

Supposons qu'un collègue ait effectué un commit.

Commande :

```bash
svn update
```

ou

```bash
svn up
```

Résultat :

```text
Updated to revision 5
```

---

# 17. Simuler un deuxième développeur

Effectuer un second checkout :

```bash
svn checkout https://localhost/svn/demo-svn/trunk D:\demo\workspace2
```

Vous avez maintenant :

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

# 18. Créer un conflit

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

# 19. Structure classique d'un dépôt SVN

Très souvent :

```text
project
│
├── trunk
│
├── branches
│
└── tags
```

Signification :

```text
trunk     = développement principal
branches  = branches parallèles
tags      = versions figées
```

---

# 20. Les commandes indispensables pour la mission

Voir les informations du dépôt :

```bash
svn info
```

Mettre à jour :

```bash
svn update
```

Voir les modifications :

```bash
svn status
```

Voir les différences :

```bash
svn diff
```

Ajouter un fichier :

```bash
svn add fichier
```

Supprimer un fichier :

```bash
svn delete fichier
```

Annuler une modification :

```bash
svn revert fichier
```

Consulter l'historique :

```bash
svn log
```

Commit :

```bash
svn commit -m "message"
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

Les commandes à connaître parfaitement :

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

Le réflexe numéro 1 :

```bash
svn update
```

Le réflexe numéro 2 :

```bash
svn status
```

Le réflexe numéro 3 :

```bash
svn diff
```

Ces trois commandes couvrent plus de 90 % de l'utilisation quotidienne de SVN dans un projet Java legacy.