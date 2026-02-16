# Docker
## Commandes essentielles

Docker permet d’exécuter une application dans un container isolé.

Image = application packagée  
Container = application en cours d’exécution  

---

# Vérifier Docker

```bash
docker version
docker info
```

---

# Images

Lister les images :
```bash
docker images
docker image ls
```

Télécharger une image :
```bash
docker pull nginx
docker pull nginx:latest
```

Supprimer une image :
```bash
docker rmi nginx
docker rmi -f nginx
```

Construire une image :
```bash
docker build -t my-app .
docker build -t my-app:1.0.0 .
```

Tagger une image :
```bash
docker tag my-app:1.0.0 my-app:latest
```

---

# Containers

Créer et lancer un container :
```bash
docker run -p 8080:80 nginx
```

Lancer en arrière-plan :
```bash
docker run -d -p 8080:80 nginx
```

Nommer un container :
```bash
docker run --name my-nginx -d -p 8080:80 nginx
```

Lister les containers :
```bash
docker ps
docker ps -a
docker container ls
```

Arrêter un container :
```bash
docker stop my-nginx
```

Redémarrer un container :
```bash
docker restart my-nginx
```

Supprimer un container :
```bash
docker rm my-nginx
docker rm -f my-nginx
```

Logs :
```bash
docker logs my-nginx
docker logs -f my-nginx
```

Entrer dans un container :
```bash
docker exec -it my-nginx sh
```

---

# Dockerfile

Construire une image :
```bash
docker build -t my-app .
```

```bash
docker build -f Dockerfile.dev -t my-app .
```

Dockerfile minimal :
```dockerfile
FROM nginx
COPY . /usr/share/nginx/html
```

---

# Workflow simple

Application → Dockerfile → Image → Container

```bash
docker build -t my-app .
docker run -p 8080:80 my-app
```

---

# Nettoyage

Supprimer tous les containers windows:
```bash
for /f %i in ('docker ps -aq') do docker rm -f %i
```
Supprimer toutes les images Linux:
```bash
for /f %i in ('docker images -q') do docker rmi -f %i
```

Supprimer tous les containers Linux:
```bash
docker rm $(docker ps -a -q)
```
Supprimer toutes les images Linux:
```bash
docker rmi $(docker images -q)
```

Supprimer les ressources inutilisées :
```bash
docker system prune -a
```

---

# Résumé

docker build = crée une image  
docker run = lance un container  
docker ps = liste les containers  
docker images = liste les images  
docker logs = debug
