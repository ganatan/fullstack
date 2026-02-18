# 004-SPRINGBOOT-ELK — ELK local (Elasticsearch + Logstash + Kibana) — Docker Compose + scripts Windows

## Objectif

- Démarrer ELK en local via Docker Compose
- Envoyer un événement JSON à Logstash (HTTP)
- Vérifier l’indexation dans Elasticsearch
- Ouvrir Kibana pour visualiser

---

## Structure

```
004-SPRINGBOOT-ELK/
├─ docker/
│  ├─ compose.elk.yml
│  └─ logstash/
│     └─ pipeline/
│        └─ logstash.conf
└─ scripts/
   ├─ elk-up.bat
   ├─ elk-down.bat
   ├─ elk-clean.bat
   ├─ elk-ps.bat
   ├─ elk-logs-es.bat
   ├─ elk-logs-kibana.bat
   ├─ elk-logs-logstash.bat
   ├─ elk-open-kibana.bat
   └─ elk-shell-es.bat
```

---

## Docker Compose

### `docker/compose.elk.yml`

- Elasticsearch : `http://localhost:9200`
- Kibana : `http://localhost:5601`
- Logstash HTTP input : `http://localhost:5000`

```yml
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.15.1
    container_name: ganatan-elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - xpack.security.enrollment.enabled=false
      - ES_JAVA_OPTS=-Xms1g -Xmx1g
    ports:
      - "9200:9200"
    volumes:
      - elk_es_data:/usr/share/elasticsearch/data

  kibana:
    image: docker.elastic.co/kibana/kibana:8.15.1
    container_name: ganatan-kibana
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

  logstash:
    image: docker.elastic.co/logstash/logstash:8.15.1
    container_name: ganatan-logstash
    environment:
      - LS_JAVA_OPTS=-Xms512m -Xmx512m
    ports:
      - "5000:5000"
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline:ro
    depends_on:
      - elasticsearch

volumes:
  elk_es_data:
```

---

## Logstash pipeline (minimal, JSON)

### `docker/logstash/pipeline/logstash.conf`

- Input HTTP sur `5000`
- Parse JSON (important)
- Output vers Elasticsearch (index journalier)

```conf
input {
  http {
    port => 5000
    additional_codecs => { "application/json" => "json" }
    response_code => 200
  }
}

output {
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
    index => "ganatan-logs-%{+YYYY.MM.dd}"
  }
  stdout { codec => rubydebug }
}
```

---

## Scripts Windows

### `scripts/elk-up.bat`

```bat
@echo off
docker compose -f docker\compose.elk.yml up -d
pause
```

### `scripts/elk-down.bat`

```bat
@echo off
docker compose -f docker\compose.elk.yml down
pause
```

### `scripts/elk-clean.bat`

```bat
@echo off
docker compose -f docker\compose.elk.yml down -v --remove-orphans
pause
```

### `scripts/elk-ps.bat`

```bat
@echo off
docker compose -f docker\compose.elk.yml ps
pause
```

### `scripts/elk-logs-es.bat`

```bat
@echo off
docker compose -f docker\compose.elk.yml logs -f --tail=200 elasticsearch
pause
```

### `scripts/elk-logs-kibana.bat`

```bat
@echo off
docker compose -f docker\compose.elk.yml logs -f --tail=200 kibana
pause
```

### `scripts/elk-logs-logstash.bat`

```bat
@echo off
docker compose -f docker\compose.elk.yml logs -f --tail=200 logstash
pause
```

### `scripts/elk-open-kibana.bat`

```bat
@echo off
start http://localhost:5601
```

### `scripts/elk-shell-es.bat`

```bat
@echo off
docker exec -it ganatan-elasticsearch bash
```

---

## Workflow (test immédiat)

### 1) Démarrer

```bat
scripts\elk-up.bat
scripts\elk-ps.bat
scripts\elk-open-kibana.bat
```

### 2) Vérifier Elasticsearch

```bash
curl -s http://localhost:9200
```

### 3) Envoyer un log JSON vers Logstash (PowerShell)

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:5000" -ContentType "application/json" -Body '{"@timestamp":"2026-02-18T10:00:00Z","level":"INFO","service":"media-api","message":"hello elk","traceId":"abc123"}'
```

### 4) Vérifier l’indexation dans Elasticsearch

Lister les index :

```bash
curl -s "http://localhost:9200/_cat/indices?v"
```

Rechercher les derniers documents :

```bash
curl -s "http://localhost:9200/ganatan-logs-*/_search?pretty" -H "Content-Type: application/json" -d '{"size":10,"sort":[{"@timestamp":{"order":"desc"}}],"query":{"match_all":{}}}'
```

### 5) Kibana (voir les logs)

- http://localhost:5601
- Stack Management → Data Views → Create data view
  - Pattern : `ganatan-logs-*`
  - Timestamp : `@timestamp`
- Discover

---

## Arrêt / reset

Arrêter :

```bat
scripts\elk-down.bat
```

Reset total :

```bat
scripts\elk-clean.bat
```
