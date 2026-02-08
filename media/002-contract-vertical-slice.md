# Contract-first + Vertical Slice (V1) — Cadre projet

## Pourquoi on commence par le contrat
Dans une organisation multi-repo, le risque n°1 est la dérive : chaque équipe avance et les interfaces ne correspondent plus.
Le repo **contracts** devient la source unique de vérité pour :
- APIs HTTP (OpenAPI) : endpoints, DTO, erreurs, pagination
- Événements Kafka : schémas, versioning, compatibilité
- Génération : clients TypeScript (Angular) et éventuellement stubs Java

Résultat : alignement immédiat Front ↔ Back ↔ Event, sans dépendre du code d’un autre repo.

---

## Pourquoi une “vertical slice”
Une vertical slice est le plus petit cas d’usage qui traverse toute la chaîne technique.
But : valider l’architecture réelle en conditions proches prod (latence, asynchronisme, projections, CI), avant d’ajouter du fonctionnel.

La slice V1 doit prouver :
- write transactionnel SQL (PostgreSQL)
- publication Kafka
- consommation worker + idempotence
- projection Mongo read-model
- lecture via query-service
- consommation par 2 frontends Angular (admin/user)
- outillage CI (tests + rapports)

---

## Slice V1 recommandée (Media)
Cas d’usage : **Admin crée un Media → User le consulte**

Flux :
1. frontend-admin appelle `command-service` (POST)
2. `command-service` valide + écrit en SQL
3. `command-service` publie l’event `MediaCreated.v1` sur Kafka
4. `projection-worker` consomme, applique idempotence, met à jour Mongo
5. `query-service` expose `GET /media/{id}` depuis Mongo
6. frontend-user affiche le media

C’est la preuve que CQRS + event-driven fonctionnent réellement.

---

## Étapes de mise en œuvre (sans entrer dans le détail)

### Étape 0 — Décisions communes
- conventions de nommage repos/services
- conventions API (codes HTTP, erreurs, pagination)
- conventions events (enveloppe, versioning, topics, DLQ)
- stratégie d’IDs (UUID recommandé)

### Étape 1 — Repo `contracts`
- créer `openapi/command-api.yaml`
- créer `openapi/query-api.yaml`
- créer `events/MediaCreated.v1` (schéma)
- ajouter `VERSIONING.md` (règles v1/v2)
- ajouter `README.md` (génération clients)

### Étape 2 — `command-service` (write path)
- implémenter l’API de création
- persister en PostgreSQL
- publier l’événement Kafka
- ajouter tests + rapports (JUnit + coverage)

### Étape 3 — `projection-worker` (async)
- consommer l’événement Kafka
- gérer idempotence (eventId)
- projeter dans Mongo (read-model)
- prévoir DLQ/retry (au minimum au niveau infra)

### Étape 4 — `query-service` (read path)
- implémenter `GET /media/{id}` sur Mongo
- ajouter recherche/pagination en V2

### Étape 5 — Fronts Angular
- générer le client TypeScript depuis OpenAPI
- connecter admin (create)
- connecter user (get by id / list minimal)

### Étape 6 — CI/CD + GitOps
- CI backend : build, tests, Jacoco, Sonar, (Xray si activé)
- CI frontend : build, tests, Sonar (léger)
- Kube local : deployments + probes
- ArgoCD : sync env `dev` depuis `infra-gitops`

---

## Critères de réussite (fin socle)
- une commande crée un media et le rend consultable côté user
- la chaîne Kafka + projection est observable (logs corrélés)
- les contrats sont versionnés et consommés par les repos
- la CI produit des rapports et bloque en cas d’échec

Ce socle devient ensuite réutilisable tel quel pour le domaine **Credit** (avec DB2 et durcissement progressif).
