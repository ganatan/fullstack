# Docker

Commandes essentielles pour utiliser Docker.

## Version

```bash
docker --version
```

## Containers

```bash
docker ps
docker ps -a
```

## Images

```bash
docker images
```

## Démarrer et arrêter

```bash
docker start container
docker stop container
```

## Logs

```bash
docker logs container
docker logs -f container
```

## Shell dans un container

```bash
docker exec -it container bash
```

## Supprimer un container

```bash
docker rm container
```

## Docker Compose

```bash
docker compose up -d
docker compose down
```
