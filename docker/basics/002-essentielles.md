# Docker
## Commandes essentielles 

Docker permet d’exécuter une application dans un container isolé.

Image = application packagée
Container = application en cours d’exécution

---

# Vérifier Docker

docker version
docker info

---

# Images

Lister les images :
docker images

Télécharger une image :
docker pull nginx

Supprimer une image :
docker rmi nginx

---

# Containers

Lancer un container nginx :
docker run -p 8080:80 nginx

Lancer en arrière-plan :
docker run -d -p 8080:80 nginx

Lister les containers :
docker ps
docker ps -a

Stopper un container :
docker stop <container>

Supprimer un container :
docker rm <container>

Logs :
docker logs <container>

Entrer dans un container :
docker exec -it <container> sh

---

# Dockerfile

Construire une image :
docker build -t my-app .

Dockerfile minimal :

FROM nginx
COPY . /usr/share/nginx/html

---

# Workflow simple

Application → Dockerfile → Image → Container

docker build -t my-app .
docker run -p 8080:80 my-app

---

# Résumé

docker build = crée une image
docker run = lance un container
docker ps = liste les containers
docker logs = debug
