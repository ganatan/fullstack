# 009-scripts-sonarqube.md

# Scripts SonarQube (Docker Compose) + scripts Windows

Structure :

```
004-SPRINGBOOT-KAFKA/
├─ docker/
│  └─ compose.sonarqube.yml
└─ scripts/
   ├─ sonar-up.bat
   ├─ sonar-down.bat
   ├─ sonar-clean.bat
   ├─ sonar-ps.bat
   ├─ sonar-logs.bat
   ├─ sonar-open.bat
   └─ sonar-shell.bat
```

------------------------------------------------------------------------

# Docker Compose

## docker/compose.sonarqube.yml

```yml
services:
  sonarqube:
    image: sonarqube:lts-community
    container_name: ganatan-sonarqube
    ports:
      - "9000:9000"
    environment:
      - SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true
    volumes:
      - sonarqube_data:/opt/sonarqube/data
      - sonarqube_extensions:/opt/sonarqube/extensions
      - sonarqube_logs:/opt/sonarqube/logs

volumes:
  sonarqube_data:
  sonarqube_extensions:
  sonarqube_logs:
```

------------------------------------------------------------------------

# Scripts Windows

## scripts/sonar-up.bat

```bat
@echo off
docker compose -f docker\compose.sonarqube.yml up -d
pause
```

## scripts/sonar-down.bat

```bat
@echo off
docker compose -f docker\compose.sonarqube.yml down
pause
```

## scripts/sonar-clean.bat

Reset total (volumes + orphelins) :

```bat
@echo off
docker compose -f docker\compose.sonarqube.yml down -v --remove-orphans
pause
```

## scripts/sonar-ps.bat

```bat
@echo off
docker compose -f docker\compose.sonarqube.yml ps
pause
```

## scripts/sonar-logs.bat

```bat
@echo off
docker compose -f docker\compose.sonarqube.yml logs -f --tail=200 sonarqube
pause
```

## scripts/sonar-open.bat

```bat
@echo off
start http://localhost:9000
```

## scripts/sonar-shell.bat

```bat
@echo off
docker exec -it ganatan-sonarqube bash
```

------------------------------------------------------------------------

# Workflow

Démarrer :

```bash
scripts\sonar-up.bat
scripts\sonar-ps.bat
scripts\sonar-open.bat
```

Accès interface :

- `http://localhost:9000`
- login : `admin`
- password : `admin`

Arrêter :

```bash
scripts\sonar-down.bat
```

Reset complet :

```bash
scripts\sonar-clean.bat
```

------------------------------------------------------------------------

# Scanner (exemples)

## 1) Node.js / JavaScript (sonarqube-scanner)

Installer :

```bash
npm install --save-dev sonarqube-scanner
```

Créer `sonar-project.properties` à la racine :

```properties
sonar.projectKey=backend-javascript
sonar.sources=src
sonar.tests=src/__tests__
sonar.exclusions=**/*.test.js, **/*.spec.js, **/__tests__/**
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.host.url=http://localhost:9000
sonar.token=TON_TOKEN
```

Lancer :

```bash
npx sonarqube-scanner
```

## 2) Maven (Spring Boot / Java)

Lancer l’analyse (token requis) :

```bash
mvn clean test
mvn sonar:sonar -Dsonar.host.url=http://localhost:9000 -Dsonar.token=TON_TOKEN
```
