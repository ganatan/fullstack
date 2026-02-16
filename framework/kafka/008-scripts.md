# 008-scripts.md

# Scripts springboot

# Docker — Spring Boot (port 3000) + scripts Windows

Structure :

```
004-SPRINGBOOT-KAFKA/
├─ docker/
│  └─ Dockerfile.kafka
└─ scripts/
   ├─ docker-app-build.bat
   ├─ docker-app-clean.bat
   ├─ docker-app-run.bat
   ├─ docker-app-stop.bat
   ├─ docker-list-containers.bat
   ├─ docker-list-images.bat
   ├─ docker-list-volumes.bat
```

------------------------------------------------------------------------

# Dockerfile

## docker/Dockerfile.backend-springboot

```dockerfile
FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY . .
RUN mvn -DskipTests=false clean package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 3000
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=80.0"
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
```

------------------------------------------------------------------------

# Scripts Windows

## scripts/docker-app-build.bat

```bat
@echo off
docker build -f docker\Dockerfile.backend-springboot -t backend-springboot .
pause
```

## scripts/docker-app-run.bat

```bat
@echo off
docker run -d --name backend-springboot -p 3000:3000 backend-springboot
pause
```

## scripts/docker-app-stop.bat

```bat
@echo off
docker stop backend-springboot
docker rm backend-springboot
pause
```

## scripts/docker-app-clean.bat

```bat
@echo off
docker rm -f backend-springboot
docker rmi -f backend-springboot
pause
```

## scripts/docker-list-containers.bat

```bat
@echo off
docker ps -a
pause
```

## scripts/docker-list-images.bat

```bat
@echo off
docker images
pause
```

## scripts/docker-list-volumes.bat

```bat
@echo off
docker volume ls
pause
```

------------------------------------------------------------------------

# Workflow

Depuis la racine du projet :

```bash
scripts\docker-app-build.bat
scripts\docker-app-run.bat
```

Logs :

```bash
docker logs backend-springboot
docker logs -f backend-springboot
```

Stop / remove :

```bash
scripts\docker-app-stop.bat
```

Clean complet :

```bash
scripts\docker-app-clean.bat
```
