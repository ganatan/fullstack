# 003-docker-springboot.md

# Docker — Spring Boot (repo existant)

Objectif :
- builder le JAR Spring Boot
- construire une image Docker
- lancer le service en container

------------------------------------------------------------------------

# Pré-requis

```bash
docker version
docker info
```

------------------------------------------------------------------------

# 1) Build du JAR

## Maven Wrapper

```bash
./mvnw -DskipTests=false clean package
```

Sous Windows :

```bash
mvnw.cmd -DskipTests=false clean package
```

Le JAR est dans :

- `target/*.jar`

------------------------------------------------------------------------

# 2) Dockerfile (multi-stage)

Créer `Dockerfile` à la racine du repo :

```dockerfile
FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY . .
RUN mvn -DskipTests=false clean package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=80.0"
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
```

Si ton port Spring Boot n’est pas `8080`, remplacer `EXPOSE 8080` par ton port.

------------------------------------------------------------------------

# 3) .dockerignore

Créer `.dockerignore` :

```text
target
.git
.idea
.vscode
*.iml
.DS_Store
```

------------------------------------------------------------------------

# 4) Build de l’image

```bash
docker build -t backend-media:1.0.0 .
docker tag backend-media:1.0.0 backend-media:latest
```

------------------------------------------------------------------------

# 5) Run du container

## Foreground

```bash
docker run --rm -p 8080:8080 backend-media:latest
```

## Background

```bash
docker run -d --name backend-media -p 8080:8080 backend-media:latest
```

```bash
docker run -d --name backend-media -p 3000:3000 backend-media:latest
```

------------------------------------------------------------------------

# 6) Vérifs

## Logs

```bash
docker logs backend-media
docker logs -f backend-media
```

## Process

```bash
docker ps
docker ps -a
```

## Entrer dans le container

```bash
docker exec -it backend-media sh
```

------------------------------------------------------------------------

# 7) Stop / Remove

```bash
docker stop backend-media
docker rm backend-media
```

------------------------------------------------------------------------

# 8) Health check (si endpoint)

```bash
curl http://localhost:8080/actuator/health
```

------------------------------------------------------------------------

# 9) Docker Compose (optionnel)

Créer `docker-compose.yml` :

```yaml
services:
  backend-media:
    build: .
    image: backend-media:latest
    container_name: backend-media
    ports:
      - "8080:8080"
    environment:
      JAVA_OPTS: "-XX:+UseContainerSupport -XX:MaxRAMPercentage=80.0"
```

Run :

```bash
docker compose up -d --build
docker compose logs -f
docker compose down
```

------------------------------------------------------------------------

# 10) Nettoyage

```bash
docker system prune -a
```

------------------------------------------------------------------------

# Résumé

- build jar : `mvnw clean package`
- build image : `docker build -t backend-media .`
- run : `docker run -p 8080:8080 backend-media`
