# 006-jira-tickets.md — Jira — Tickets (Task, Bug, Story, Epic) + bonnes pratiques

## 1) Ticket (Issue) : l’unité de base
Un ticket Jira = une unité de travail traçable :
- un **type** (Task, Bug, Story, Epic…)
- un **statut** (workflow)
- des **champs** (assignee, priority, labels, components, fixVersion…)
- un **historique** (commentaires, transitions, changements)

---

## 2) Task (Tâche)
### Quand l’utiliser
- Travail “à faire” **sans récit utilisateur** explicite
- Tech/ops : refacto, upgrade deps, config CI, scripts, nettoyage, POC

### Bon contenu
- objectif technique clair
- critères de fin (DoD) : tests, build vert, doc, PR merge

---

## 3) Bug
### Quand l’utiliser
- Comportement incorrect vs attendu
- Régression, défaut prod, erreur fonctionnelle/technique

### Champs utiles
- **Steps to reproduce**
- **Expected / Actual**
- **Environment** (version, navigateur, OS, build)
- **Severity / Priority** (selon modèle)
- logs/captures, lien incident

### Bonnes pratiques
- un bug = reproductible ou au moins observé + contexte
- créer une sous-tâche “test non-régression” si nécessaire

---

## 4) Story (User Story)
### Quand l’utiliser
- Besoin utilisateur / valeur produit
- Résultat observable côté UI/API

### Format simple
- **Contexte**
- **Objectif**
- **Critères d’acceptation (AC)** en puces (Given/When/Then possible)

### Exemple d’AC (style)
- L’utilisateur peut saisir un film (titre+année obligatoires)
- Si doublon (titre+année), une erreur est affichée
- Le film apparaît dans le classement après création

---

## 5) Epic
### Quand l’utiliser
- Grand thème / objectif qui regroupe plusieurs stories/tasks
- Horizon plus long, découpage en livrables

### Bon contenu
- vision + périmètre (in/out)
- sous-éléments attendus (stories)
- jalon (fixVersion/roadmap si utilisé)

Exemple : “Classements Box Office” → stories “Top 10 monde”, “Top 10 France”, “Filtre par année”, “Export”.

---

## 6) Hiérarchie et découpage
- **Epic** → regroupe **Stories/Tasks**
- **Story/Task** → peut être découpée en **Sub-tasks**
- Les liens (blocks/is blocked) modélisent les dépendances

Règle : éviter les stories trop grosses ; découper jusqu’à pouvoir livrer vite.

---

## 7) Champs à utiliser (pragmatiques)
- **Assignee** : qui fait
- **Priority** : ordre d’exécution
- **Components** : ownership (module/équipe)
- **Labels** : tags ponctuels (avec parcimonie)
- **fixVersion** : jalon de release
- **Links** : dépendances / blocages

---

## 8) DoR / DoD (qualité)
### DoR (Ready)
- AC présents, dépendances identifiées, taille raisonnable

### DoD (Done)
- code + tests + review + build vert
- doc/notes si nécessaire
- déployé ou prêt à déployer selon process

---

## 9) Règles simples (terrain)
- 1 ticket = 1 résultat clair
- Titre court, description structurée
- Pas de roman : bullets + AC + infos repro pour bugs
- Toujours fermer la boucle : preuve (PR, commit, release, capture)
