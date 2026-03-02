# 001-principes.md — Jira — principes et fonctionnement

## 1) Jira, c’est quoi (en 1 phrase)
Jira est un outil de gestion du travail basé sur des tickets (“issues”) organisés dans des projets, pilotés par des workflows (statuts + transitions), visualisés via des boards (Scrum/Kanban) et mesurés via des rapports.

---

## 2) Objets clés (modèle)
### Projet
Conteneur logique : configuration, permissions, notifications, composants, versions.

### Issue (ticket)
Unité de travail. Champs typiques :
- key (ex: PROJ-123), summary, description
- issueType (Bug, Story, Task, Epic, Sub-task)
- status, assignee, reporter, priority
- labels, components, fixVersion
- champs custom, dates, estimations, commentaires, historique, pièces jointes

### Types usuels
- Epic : grand thème, regroupe des Stories/Tasks
- Story : besoin utilisateur (valeur produit)
- Task : travail technique/ops
- Bug : défaut
- Sub-task : découpage d’une issue

### Liens / hiérarchie
- Epic ↔ Story via parent/epic link selon configuration
- Relations : blocks / is blocked by, duplicates, relates, depends, etc.

---

## 3) Workflow : le moteur
Un workflow = un graphe :
- statuts (To Do / In Progress / Done…)
- transitions (actions)
- règles sur transitions :
  - conditions (qui peut ?)
  - validators (champs obligatoires ?)
  - post-functions (assignation, notifications, mise à jour champs…)

Objectif : standardiser l’avancement et sécuriser la qualité.

---

## 4) Board : la vue opérationnelle
Le board est une projection d’un sous-ensemble d’issues, pilotée par :
- un filtre (JQL)
- un mapping colonnes ↔ statuts
- des règles (swimlanes, quick filters, WIP limit…)

### Scrum board
- Backlog + Sprints
- Itérations, engagement, burndown, sprint goal

### Kanban board
- Flux continu
- WIP limit, lead time, cycle time

---

## 5) Backlog / Sprint / Release
- Backlog : liste priorisée des issues candidates
- Sprint : lot d’issues engagées pour une itération
- Version/Release (fixVersion) : jalon de livraison (ex: 1.4.0)
- Roadmap : vue macro (souvent basée sur epics + versions)

---

## 6) Champs, écrans, schémas
- Field : donnée (standard ou custom)
- Screen : écran Create/Edit/View
- Screen Scheme : association écrans ↔ types d’issues
- Field Configuration : champs cachés/obligatoires/optionnels

But : adapter Jira au contexte sans casser l’ergonomie.

---

## 7) Permissions et sécurité
- Permission Scheme : qui peut voir/créer/éditer/commenter/transitionner
- Issue Security : restreindre la visibilité d’un sous-ensemble d’issues
- Rôles et groupes (SSO/LDAP) selon l’organisation

Points critiques : Browse Projects, Edit Issues, transitions, administrateurs.

---

## 8) Notifications et collaboration
- Notification Scheme : qui reçoit quoi (assigné, reporter, watchers…)
- Watchers : abonnements manuels
- Mentions, commentaires, pièces jointes
- Historique : audit des changements (statuts, champs, utilisateurs)

---

## 9) JQL : retrouver, piloter, automatiser
JQL = langage de requête pour filtres/boards/rapports/abonnements.
Exemples :
- project = MEDIA AND status != Done ORDER BY priority DESC, updated DESC
- assignee = currentUser() AND status in ("In Progress","Review")
- fixVersion = "1.2.0" AND issuetype in (Bug, Story)

---

## 10) Automatisation (Automation Rules)
Une règle = trigger + conditions + actions.
Cas typiques :
- auto-assign par component
- imposer des champs à une transition
- créer sous-tâches standard à la création d’une Story
- synchroniser via webhook (Slack/Teams/CI/CD)

---

## 11) Intégrations (dev)
- Git (GitHub/GitLab/Bitbucket) : liens commits/branches/PR
- CI/CD : builds, déploiements, environnements
- Confluence : specs/ADR liées aux issues
- Service Management : portail, SLA, files d’attente (si activé)

---

## 12) Bonnes pratiques terrain
- 1 issue = 1 résultat clair (titre court + description structurée)
- définir “Done” (DoD) : tests, review, doc, déploiement si besoin
- limiter le WIP (éviter 20 tickets “In Progress”)
- components pour ownership, fixVersion pour release, labels avec parcimonie
- découper : Epic → Stories → Sub-tasks
- standardiser les statuts (éviter la multiplication inutile)
- utiliser dashboards/rapports (lead time, cycle time, burndown)

---

## 13) Glossaire rapide
- Issue : ticket
- Workflow : statuts + transitions + règles
- Board : tableau Scrum/Kanban
- Backlog : liste priorisée
- Sprint : itération Scrum
- fixVersion : cible de release
- Component : module/ownership
- JQL : requêtes
- WIP : limite de travail en cours
- DoR/DoD : Definition of Ready/Done
