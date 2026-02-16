# 011-scripts-redis.md

# Scripts Redis (Docker Compose) + scripts Windows

Structure :

```
004-SPRINGBOOT-KAFKA/
├─ docker/
│  └─ compose.redis.yml
└─ scripts/
   ├─ redis-up.bat
   ├─ redis-down.bat
   ├─ redis-clean.bat
   ├─ redis-ps.bat
   ├─ redis-logs.bat
   └─ redis-cli.bat
```

------------------------------------------------------------------------

# Docker Compose

## docker/compose.redis.yml

```yml
services:
  redis:
    image: redis:7.4.0
    container_name: ganatan-redis
    ports:
      - "6379:6379"
    command: ["redis-server", "--appendonly", "yes"]
    volumes:
      - redis_data:/data

volumes:
  redis_data:
```

------------------------------------------------------------------------

# Scripts Windows

## scripts/redis-up.bat

```bat
@echo off
docker compose -f docker\compose.redis.yml up -d
pause
```

## scripts/redis-down.bat

```bat
@echo off
docker compose -f docker\compose.redis.yml down
pause
```

## scripts/redis-clean.bat

Reset total (volumes + orphelins) :

```bat
@echo off
docker compose -f docker\compose.redis.yml down -v --remove-orphans
pause
```

## scripts/redis-ps.bat

```bat
@echo off
docker compose -f docker\compose.redis.yml ps
pause
```

## scripts/redis-logs.bat

```bat
@echo off
docker compose -f docker\compose.redis.yml logs -f --tail=200 redis
pause
```

## scripts/redis-cli.bat

Entrer dans le CLI Redis :

```bat
@echo off
docker exec -it ganatan-redis redis-cli
```

------------------------------------------------------------------------

# Workflow

Démarrer :

```bash
scripts\redis-up.bat
scripts\redis-ps.bat
```

CLI :

```bash
scripts\redis-cli.bat
```

Test rapide :

```text
PING
SET hello world
GET hello
DEL hello
QUIT
```

Arrêter :

```bash
scripts\redis-down.bat
```

Reset complet :

```bash
scripts\redis-clean.bat
```

------------------------------------------------------------------------

# Accès

Redis :
- host : `localhost`
- port : `6379`
