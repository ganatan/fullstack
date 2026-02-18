# 001-starter.md — ELK (Elastic Stack) — Starter (Docker + tests)

## Objectif

- Démarrer un ELK local (Elasticsearch + Kibana + Logstash)
- Avoir un endpoint Logstash HTTP pour pousser un log JSON
- Vérifier dans Elasticsearch et Kibana que le log est bien indexé

Index utilisé : `logs-starter`

---

## Prérequis

- Docker + Docker Compose
- Ports libres :
  - Elasticsearch : `9200`
  - Kibana : `5601`
  - Logstash HTTP input : `8088`

---

## Docker (Elasticsearch + Kibana + Logstash)

### Fichiers

```
docker/compose.elk.yml
docker/logstash/pipeline/logstash.conf
scripts/elk-up.bat
scripts/elk-down.bat
```

### scripts/elk-up.bat

```bat
@echo off
docker compose -f docker\compose.elk.yml up -d
```

### scripts/elk-down.bat

```bat
@echo off
docker compose -f docker\compose.elk.yml down -v
```

### docker/compose.elk.yml

```yml
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.12.2
    container_name: ganatan-elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
    ports:
      - "9200:9200"
      - "9300:9300"
    volumes:
      - es_data:/usr/share/elasticsearch/data

  kibana:
    image: docker.elastic.co/kibana/kibana:8.12.2
    container_name: ganatan-kibana
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

  logstash:
    image: docker.elastic.co/logstash/logstash:8.12.2
    container_name: ganatan-logstash
    environment:
      - xpack.monitoring.enabled=false
      - LS_JAVA_OPTS=-Xms256m -Xmx256m
    ports:
      - "8088:8088"
      - "5044:5044"
      - "9600:9600"
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    depends_on:
      - elasticsearch

volumes:
  es_data:
```

---

## Logstash pipeline

`docker/logstash/pipeline/logstash.conf`

- Input HTTP : `POST http://localhost:8088/log`
- Output Elasticsearch : index `logs-starter`

```conf
input {
  http {
    port => 8088
    additional_codecs => { "application/json" => "json" }
    response_code => 200
  }
}

filter {
  if ![@timestamp] {
    mutate { add_field => { "@timestamp" => "%{@timestamp}" } }
  }
}

output {
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
    index => "logs-starter"
  }
  stdout { codec => rubydebug }
}
```

---

## Démarrage

```bat
scripts\elk-up.bat
```

Interfaces :
- Kibana : http://localhost:5601
- Elasticsearch : http://localhost:9200

---

## Tests (curl)

### 1) Vérifier Elasticsearch up

```bash
curl -s http://localhost:9200
```

### 2) Envoyer un log JSON à Logstash (HTTP input)

```bash
curl -i -X POST http://localhost:8088/log   -H "Content-Type: application/json"   -d "{"level":"INFO","service":"starter","message":"hello elk","traceId":"abc123"}"
```

### 3) Vérifier que l’index existe

```bash
curl -s "http://localhost:9200/_cat/indices?v"
```

Tu dois voir `logs-starter`.

### 4) Rechercher les logs (Elasticsearch)

```bash
curl -s "http://localhost:9200/logs-starter/_search?pretty"   -H "Content-Type: application/json"   -d "{"query":{"match_all":{}}}"
```

---

## Kibana (vérif rapide)

1) Ouvre Kibana : http://localhost:5601  
2) Menu : **Stack Management** → **Data Views** → **Create data view**  
3) Name : `logs-starter*`  
4) Timestamp field : `@timestamp` (si proposé)  
5) Puis : **Discover** → tu dois voir tes documents

---

## Ports (rappel)

| Composant | Port | Usage |
|---|---:|---|
| Elasticsearch | 9200 | API REST |
| Elasticsearch | 9300 | Transport cluster |
| Kibana | 5601 | UI |
| Logstash | 8088 | Input HTTP (POST /log) |
| Logstash | 5044 | Input Beats (Filebeat) |
| Logstash | 9600 | Monitoring API |

---

## Nettoyage

Stop + delete volumes :

```bat
scripts\elk-down.bat
```
