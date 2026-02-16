# 009-scripts-elk.md

# Scripts ELK (Elasticsearch + Logstash + Kibana) (Docker Compose) + scripts Windows

Structure :

```
004-SPRINGBOOT-KAFKA/
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

------------------------------------------------------------------------

# Docker Compose

## docker/compose.elk.yml

Images Elastic officielles : citeturn0search1turn0search7turn0search12

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

------------------------------------------------------------------------

# Logstash pipeline (minimal)

## docker/logstash/pipeline/logstash.conf

```conf
input {
  http {
    port => 5000
  }
}

filter {
}

output {
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
    index => "ganatan-logs-%{+YYYY.MM.dd}"
  }
  stdout {
    codec => rubydebug
  }
}
```

------------------------------------------------------------------------

# Scripts Windows

## scripts/elk-up.bat

```bat
@echo off
docker compose -f docker\compose.elk.yml up -d
pause
```

## scripts/elk-down.bat

```bat
@echo off
docker compose -f docker\compose.elk.yml down
pause
```

## scripts/elk-clean.bat

Reset total (volumes + orphelins) :

```bat
@echo off
docker compose -f docker\compose.elk.yml down -v --remove-orphans
pause
```

## scripts/elk-ps.bat

```bat
@echo off
docker compose -f docker\compose.elk.yml ps
pause
```

## scripts/elk-logs-es.bat

```bat
@echo off
docker compose -f docker\compose.elk.yml logs -f --tail=200 elasticsearch
pause
```

## scripts/elk-logs-kibana.bat

```bat
@echo off
docker compose -f docker\compose.elk.yml logs -f --tail=200 kibana
pause
```

## scripts/elk-logs-logstash.bat

```bat
@echo off
docker compose -f docker\compose.elk.yml logs -f --tail=200 logstash
pause
```

## scripts/elk-open-kibana.bat

```bat
@echo off
start http://localhost:5601
```

## scripts/elk-shell-es.bat

```bat
@echo off
docker exec -it ganatan-elasticsearch bash
```

------------------------------------------------------------------------

# Workflow

Démarrer :

```bash
scripts\elk-up.bat
scripts\elk-ps.bat
scripts\elk-open-kibana.bat
```

Envoyer un log via HTTP (PowerShell) :

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:5000 -ContentType "application/json" -Body "{\"message\":\"hello elk\",\"service\":\"media-api\"}"
```

Arrêter :

```bash
scripts\elk-down.bat
```

Reset complet :

```bash
scripts\elk-clean.bat
```
