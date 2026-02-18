# 001-principes.md — ELK (Elastic Stack) — principes, ports, fonctionnement

## Historique (court)

- 2010 : naissance d’Elasticsearch (moteur de recherche distribué).
- 2012 : Logstash devient populaire pour ingérer/transformer des logs.
- 2013 : Kibana devient l’UI standard de visualisation.
- “ELK” = Elasticsearch + Logstash + Kibana.
- Aujourd’hui on parle souvent d’**Elastic Stack** (ELK + Beats/Agent + APM…).

---

## Intérêt (à quoi ça sert)

- Centraliser les logs de toutes tes applis (au lieu de chercher sur 10 serveurs).
- Rechercher vite (full-text) + filtrer (par service, level, traceId…).
- Faire des dashboards (erreurs, latence, volume, top endpoints…).
- Alerter (si trop d’erreurs, si un service tombe, etc.).

---

## Fonctionnement (pipeline simple)

1) Ton application écrit des logs (idéalement **JSON**).
2) Un collecteur lit ces logs :
   - soit **Filebeat/Elastic Agent** (le plus courant),
   - soit **Logstash** (si tu as besoin de transformations lourdes).
3) Les logs sont envoyés à **Elasticsearch** (indexation + stockage).
4) Tu consultes via **Kibana** (search + dashboards).

Schéma :

```
App (stdout / fichier) → Filebeat/Agent (ou Logstash) → Elasticsearch → Kibana
```

---

## Composants (rôle de chacun)

### Elasticsearch
- Base de données orientée recherche (index, shards, replicas).
- Stocke les documents JSON + permet les requêtes rapides.

### Logstash
- Pipeline d’ingestion/transform : input → filter → output.
- Utile si tu dois parser, enrichir, router, normaliser des formats “sales”.

### Kibana
- UI web : Discover (recherche), Dashboards, Visualize, Alerting, Dev Tools.

### Beats / Elastic Agent
- Petits agents (Filebeat, Metricbeat…) qui collectent logs/metrics et expédient.
- Souvent préféré à Logstash si tu veux “simple et léger”.

---

## Ports (local / docker le plus courant)

| Composant | Port | Protocole | Usage |
|---|---:|---|---|
| Elasticsearch | 9200 | HTTP | API REST (health, index, search) |
| Elasticsearch | 9300 | TCP | Transport interne (cluster) |
| Kibana | 5601 | HTTP | UI web |
| Logstash | 5044 | TCP | Input Beats (Filebeat → Logstash) |
| Logstash | 9600 | HTTP | Monitoring API Logstash |

Notes :
- 9200 + 5601 = les 2 ports que tu utilises tout le temps en local.
- 9300 sert surtout au cluster, rarement exposé en dev.

---

## IP / URLs (exemples)

### En local (machine hôte)
- Elasticsearch : `http://localhost:9200`
- Kibana : `http://localhost:5601`

### Depuis un container Docker (réseau compose)
- Elasticsearch : `http://elasticsearch:9200`
- Kibana : `http://kibana:5601`

---

## Commandes de vérification (rapides)

### Vérifier Elasticsearch (health)
```bash
curl -s http://localhost:9200/_cluster/health?pretty
```

### Lister les index
```bash
curl -s http://localhost:9200/_cat/indices?v
```

### Vérifier Kibana (status)
```bash
curl -s http://localhost:5601/api/status
```

---

## Indices (concept clé)

- Un **index** = une collection logique de documents (ex: `logs-springboot-2026.02.18`).
- Un document = un JSON (ex: un log).
- Elasticsearch découpe en **shards** pour scaler et réplique pour la résilience.

Exemple de document log JSON typique :

```json
{
  "@timestamp": "2026-02-18T09:12:11.123Z",
  "level": "INFO",
  "service": "springboot-starter",
  "logger": "com.ganatan.demo.LoggingController",
  "message": "GET /api/log",
  "traceId": "abc123"
}
```

---

## Bonnes pratiques (niveau mission)

- Logs en **JSON** (par service) + champs stables : `@timestamp`, `level`, `service`, `message`, `traceId`.
- En prod container/kube : logs sur **stdout**, collectés par agent (évite les volumes logs).
- Rotation si fichier (VM) : ne jamais laisser grossir sans limite.
- Ne pas logger de données sensibles (tokens, passwords, PII).
