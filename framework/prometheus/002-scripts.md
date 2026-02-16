# 010-scripts-prometheus-grafana.md

# Scripts Prometheus + Grafana (Docker Compose) + scripts Windows

Structure :

```
004-SPRINGBOOT-PROMETHEUS/
├─ docker/
│  ├─ compose.prometheus.yml
│  └─ prometheus/
│     └─ prometheus.yml
└─ scripts/
   ├─ metrics-up.bat
   ├─ metrics-down.bat
   ├─ metrics-clean.bat
   ├─ metrics-ps.bat
   ├─ metrics-logs-prometheus.bat
   ├─ metrics-logs-grafana.bat
   ├─ metrics-open-prometheus.bat
   └─ metrics-open-grafana.bat
```

------------------------------------------------------------------------

# Docker Compose

## docker/compose.prometheus.yml

```yml
services:
  prometheus:
    image: prom/prometheus:v2.52.0
    container_name: ganatan-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.path=/prometheus"
      - "--web.enable-lifecycle"

  grafana:
    image: grafana/grafana:11.2.0
    container_name: ganatan-grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus

volumes:
  prometheus_data:
  grafana_data:
```

------------------------------------------------------------------------

# Prometheus config (minimal)

## docker/prometheus/prometheus.yml

```yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["prometheus:9090"]
```

------------------------------------------------------------------------

# Scripts Windows

## scripts/metrics-up.bat

```bat
@echo off
docker compose -f docker\compose.prometheus.yml up -d
pause
```

## scripts/metrics-down.bat

```bat
@echo off
docker compose -f docker\compose.prometheus.yml down
pause
```

## scripts/metrics-clean.bat

```bat
@echo off
docker compose -f docker\compose.prometheus.yml down -v --remove-orphans
pause
```

## scripts/metrics-ps.bat

```bat
@echo off
docker compose -f docker\compose.prometheus.yml ps
pause
```

## scripts/metrics-logs-prometheus.bat

```bat
@echo off
docker compose -f docker\compose.prometheus.yml logs -f --tail=200 prometheus
pause
```

## scripts/metrics-logs-grafana.bat

```bat
@echo off
docker compose -f docker\compose.prometheus.yml logs -f --tail=200 grafana
pause
```

## scripts/metrics-open-prometheus.bat

```bat
@echo off
start http://localhost:9090
```

## scripts/metrics-open-grafana.bat

```bat
@echo off
start http://localhost:3001
```

------------------------------------------------------------------------

# Workflow

Démarrer :

```bash
scripts\metrics-up.bat
scripts\metrics-ps.bat
scripts\metrics-open-prometheus.bat
scripts\metrics-open-grafana.bat
```

Arrêter :

```bash
scripts\metrics-down.bat
```

Reset complet :

```bash
scripts\metrics-clean.bat
```

------------------------------------------------------------------------

# Accès

Prometheus :
- http://localhost:9090

Grafana :
- http://localhost:3001
- login : `admin`
- password : `admin`
