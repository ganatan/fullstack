# 001-commandes.md

# Docker + Kubernetes — Commandes utiles

## Maven
mvn clean package -DskipTests

## Docker
docker build -t media-api:local -f docker/Dockerfile.backend-springboot .
docker images
docker run -p 8080:8080 media-api:local
docker logs -f media-api
docker stop media-api

## k3d
k3d cluster create media-kube --agents 2
k3d image import media-api:local -c media-kube

## Kubernetes
kubectl get nodes
kubectl get pods
kubectl apply -f deployment.yaml
kubectl get svc
kubectl port-forward svc/media-api 8080:80
