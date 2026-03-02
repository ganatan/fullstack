# 004-jira-details.md — Écran “How does your team plan to use Jira?” — quoi choisir pour tester

## À quoi sert cet écran
- Cet écran **ne verrouille rien** : il sert surtout à **pré-configurer** le projet (vues, suggestions, raccourcis, types d’issues).
- Tu pourras **modifier** ensuite (types d’issues, workflow, board, champs).

---

## Options proposées (traduction + effet)
- **Track bugs** : activer/mettre en avant le suivi de **Bugs** (type Bug, vues orientées défauts).
- **Manage tasks** : gestion simple de **Tasks** (tickets basiques, vue “to-do”).
- **Work in scrum** : activer une expérience **Scrum** (backlog, sprint, rituels).
- **Run sprints** : mettre l’accent sur les **sprints** (start/complete sprint, burndown).
- **Prioritize work** : faciliter la **priorisation** (backlog ordonné, champs/tri mis en avant).
- **Map work dependencies** : mise en avant des **dépendances** (liens blocks/is blocked, vues associées).

---

## Choix recommandé pour un test “vite fait” (simple)
Coche :
- ✅ **Manage tasks**
- ✅ **Track bugs**
Optionnel :
- ✅ **Prioritize work**

Résultat : un projet utilisable immédiatement comme “todo + bugs”, sans cérémonial.

---

## Choix recommandé pour tester l’Agile “Scrum” (backlog + sprints)
Coche :
- ✅ **Work in scrum**
- ✅ **Run sprints**
Optionnel :
- ✅ **Track bugs**

Résultat : tu obtiens directement **Backlog**, **Sprints**, **Board Scrum**, et les rapports Scrum.

---

## Choix recommandé si tu veux tester la complexité (à éviter au début)
- **Map work dependencies** uniquement si tu veux jouer avec :
  - liens entre tickets (blocks / is blocked by)
  - dépendances cross-modules / cross-teams

---

## Après validation : quoi vérifier tout de suite
- Dans le projet : menu **Backlog** (si Scrum) ou **Board** (Kanban/Tasks)
- Bouton **Create** : vérifier les types disponibles (*Task, Bug, Story, Epic…*)
- Colonnes du board : *To Do / In Progress / Done*
- Champs : *Assignee, Priority, Labels, Components, Fix version* (selon template)

---

## Règle simple
- Pour tester **Jira vite** : Tasks + Bugs.
- Pour tester **Scrum** : Scrum + Sprints (+ Bugs).
