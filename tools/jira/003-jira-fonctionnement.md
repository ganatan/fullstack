# 002-jira-fonctionnement.md — Jira — fonctionnement (projet, Scrum, Kanban, backlog, tickets)

## 1) Jira en une phrase
Jira = un système de **tickets (issues)** dans des **projets**, avec un **workflow** (statuts + transitions) et des **vues** (boards) pour piloter le travail.

---

## 2) Le socle : Projet
Un **projet** Jira regroupe :
- des tickets (issues) + leurs champs
- un workflow (To Do / In Progress / Done…)
- un ou plusieurs boards (Scrum ou Kanban)
- des règles : permissions, notifications, champs, écrans, composants, versions

---

## 3) Le cœur : Tickets (Issues)
Un **ticket** = une unité de travail (tout passe par là).
- Types usuels : **Epic**, **Story**, **Task**, **Bug**, **Sub-task**
- Champs clés : **summary**, **description**, **status**, **assignee**, **priority**
- Organisation : **labels**, **components**, **fixVersion**, liens (blocks/is blocked)

Hiérarchie :
- Epic → Stories/Tasks → Sub-tasks

---

## 4) Workflow : comment “ça avance”
Le workflow définit :
- les **statuts** (ex: To Do → In Progress → Review → Done)
- les **transitions** (boutons pour passer d’un statut à l’autre)
- des règles possibles : champs obligatoires, droits, automatisations

Le board n’est qu’une **vue** de ce workflow.

---

## 5) Scrum (mode itératif)
Scrum = travailler par **sprints**.
- **Backlog** : liste priorisée des tickets à faire (futurs sprints)
- **Sprint** : lot de tickets engagé sur une période (ex: 2 semaines)
- **Board Scrum** : colonnes = statuts ; cartes = tickets du sprint
- Rapports : burndown/velocity (selon configuration)

Rythme :
- on prépare le backlog, on démarre un sprint, on exécute, on clôture.

---

## 6) Kanban (mode flux continu)
Kanban = flux sans sprints, focus sur la stabilité.
- **Board Kanban** : colonnes = étapes ; tickets coulent en continu
- **WIP limit** : limite de “In Progress” pour éviter l’empilement
- Mesures : lead time / cycle time / ageing (pilotage du flux)

Règle : **finir avant de commencer**.

---

## 7) Backlog : ce que c’est vraiment
Le **backlog** est une file d’attente priorisée :
- il contient les tickets “à venir”
- il sert à préparer : clarté, critères d’acceptation, découpage, estimation
- en Scrum : il alimente les sprints
- en Kanban : il alimente la colonne “Ready / To Do”

---

## 8) “Tickets au total” : où est la vérité ?
La “vérité” est dans :
- le **projet** (tous les tickets du projet)
- les **filtres JQL** (vue sur un sous-ensemble)
- le **board** (vue filtrée + statuts)

Exemples JQL :
- Tous les tickets non terminés : `project = MED AND status != Done`
- Mes tickets : `assignee = currentUser() AND project = MED`
- Bugs à traiter : `project = MED AND issuetype = Bug AND status != Done`

---

## 9) À retenir (mémo)
- **Projet** = conteneur + règles
- **Ticket** = unité de travail
- **Workflow** = statuts + transitions
- **Board** = vue opérationnelle (Scrum ou Kanban)
- **Backlog** = file priorisée (préparation + alimentation du flux/sprints)
