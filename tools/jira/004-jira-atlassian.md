# 003-jira-atlassian-pas-a-pas.md — Jira (Atlassian Cloud) — utilisation pas à pas

## 0) Objectif
Prendre en main Jira Cloud : créer un projet, configurer un board, créer/organiser les tickets, piloter un sprint (Scrum) ou un flux (Kanban), et exploiter filtres/dashboards.

---

## 1) Accéder à Jira
1. Ouvrir **Atlassian** (ton site) puis **Jira**.
2. Vérifier en haut la **navigation** : *Projects*, *Filters*, *Dashboards*, *Apps*.

---

## 2) Créer un projet
1. Menu **Projects** → **Create project**.
2. Choisir un template :
   - **Scrum** : backlog + sprints
   - **Kanban** : flux continu
3. Nommer le projet (ex: `MEDIA`) et définir la **key** (ex: `MED`).
4. Valider : le **board** est créé automatiquement.

---

## 3) Comprendre l’écran projet
- **Backlog** (Scrum) : tickets prêts + futurs sprints
- **Board** : colonnes (statuts) + cartes (issues)
- **Reports** : burndown, velocity, cycle time…
- **Project settings** : workflow, champs, permissions, notifications

---

## 4) Créer un ticket (Issue)
1. Bouton **Create**.
2. Choisir le **Project** et l’**Issue type** : *Epic / Story / Task / Bug*.
3. Remplir :
   - **Summary** (titre court)
   - **Description** (structure : contexte → attente → critères)
   - **Assignee**, **Priority**
   - **Labels**, **Components**, **Fix version** si utilisés
4. Valider.

Bon format “story” :
- Contexte
- Critères d’acceptation (AC) en bullet points
- Notes techniques (optionnel)

---

## 5) Organiser : Epic / Stories / Sub-tasks
### Créer un Epic
1. **Create** → type **Epic**.
2. Donner un nom clair (ex: “Classement Box Office”).

### Rattacher des stories à un Epic
1. Ouvrir une Story/Task.
2. Champ **Parent/Epic** (selon la config) → sélectionner l’epic.

### Découper en sub-tasks
1. Ouvrir la Story.
2. Section **Subtasks** → **Create subtask** (ex: UI, API, tests).

---

## 6) Utiliser le board (drag & drop)
1. Aller sur **Board**.
2. Déplacer une issue d’une colonne à l’autre.
3. Si une transition refuse :
   - champ obligatoire manquant
   - permission insuffisante
   - règle de workflow (validator/condition)

---

## 7) Scrum : gérer un sprint (de A à Z)
### 7.1 Préparer (Backlog)
1. Aller dans **Backlog**.
2. Trier/prioriser les issues (drag).
3. S’assurer qu’elles sont “Ready” : AC clairs, taille raisonnable, dépendances connues.

### 7.2 Créer un sprint
1. **Create sprint**.
2. Glisser les issues du backlog dans le sprint.

### 7.3 Démarrer
1. Bouton **Start sprint**.
2. Fixer dates + objectif du sprint.

### 7.4 Exécuter
- **Daily** : mettre à jour statuts, gérer blocages
- Garder le WIP sous contrôle : finir avant de commencer

### 7.5 Terminer
1. Bouton **Complete sprint**.
2. Jira propose de remonter les issues non terminées au backlog.

---

## 8) Kanban : piloter un flux
1. Sur le board Kanban, activer des **WIP limits** si dispo (board settings).
2. Faire du “finish first” : limiter le In Progress.
3. Utiliser les vues **Cumulative Flow / Control Chart** (selon plan Jira) pour analyser le flux.

---

## 9) Recherche et filtres (JQL)
### Créer un filtre
1. Menu **Filters** → **Advanced issue search**.
2. Saisir une requête JQL, ex :
   - `project = MED AND status != Done ORDER BY priority DESC, updated DESC`
   - `assignee = currentUser() AND status in ("In Progress","Review")`
3. **Save as** : nommer le filtre (ex: “MED — Mon travail”).

### Utiliser un filtre sur un board
- Board settings → **Filter query** → sélectionner le filtre.

---

## 10) Dashboard (pilotage)
1. Menu **Dashboards** → **Create dashboard**.
2. Ajouter des gadgets :
   - Filter Results
   - Pie Chart (par statut/assignee)
   - Sprint Burndown (Scrum)
   - Created vs Resolved
3. Partager le dashboard avec un groupe/équipe.

---

## 11) Commentaires, pièces jointes, watchers
- **Comment** : tracer décisions / questions
- **@mention** : notifier une personne
- **Watch** : suivre l’issue
- **Attachments** : logs, captures, specs

Bon usage : décisions et liens (PR, doc) dans l’issue, pas en DM.

---

## 12) Versions / Releases (fixVersion)
1. Project → **Releases** (ou Project settings → Versions).
2. Créer une version (ex: `1.2.0`).
3. Assigner `fixVersion` sur les issues livrées dans cette version.
4. Marquer la version comme **Released** le jour du déploiement.

---

## 13) Automatisation (basique)
1. Project settings → **Automation**.
2. Créer une règle :
   - Trigger : issue created / transitioned
   - Condition : issue type = Bug
   - Action : assign / set field / comment / notify
3. Tester sur un ticket de démo.

---

## 14) Paramètres projet (où agir)
- **Workflows** : statuts + transitions
- **Issue types** : types et hiérarchies
- **Screens / Fields** : champs visibles/obligatoires
- **Components** : ownership (équipe/module)
- **Permissions** : qui voit/édite/transitionne
- **Notifications** : mails/mentions

Règle : toucher au workflow seulement si c’est utile et stable.

---

## 15) Checklist “propre” pour démarrer vite
- 1 projet = 1 board clair (Scrum ou Kanban)
- 5–7 statuts max au début
- DoD explicite (tests/review/build vert)
- WIP limité
- 2 filtres utiles : “Mon travail” + “À valider”
- 1 dashboard minimal (résultats filtre + burndown/flow)

