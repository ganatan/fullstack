# 002-kube.md

# Kubernetes en local — Installation et utilisation

## Pré-requis

Installer Docker Desktop (WSL2 activé)
Installer kubectl
Installer k3d

---

## Installation kubectl (Windows via winget)

winget install -e --id Kubernetes.kubectl

Vérification :
kubectl version --client

---

## Installation k3d

winget install k3d

Vérification :
k3d version

---

## Création d’un cluster Kubernetes local

k3d cluster create cats-lab --agents 2

Vérifier le cluster :
kubectl get nodes
kubectl get pods -A

---

## Déployer une application de test (nginx)

kubectl create deployment nginx --image=nginx
kubectl expose deployment nginx --port=80 --type=NodePort

Vérifier :
kubectl get deployments
kubectl get pods
kubectl get svc

---

## Accéder au service

kubectl port-forward service/nginx 8080:80

Navigateur :
http://localhost:8080

---

## Commandes utiles

Voir les pods :
kubectl get pods

Voir les logs :
kubectl logs <pod-name>

Entrer dans un container :
kubectl exec -it <pod-name> -- sh

Supprimer un deployment :
kubectl delete deployment nginx

Supprimer le cluster :
k3d cluster delete cats-lab

---

## Objectif

Comprendre le cycle :
Cluster → Deployment → Pod → Service

Kubernetes devient l’environnement d’exécution local pour tester
les déploiements avant CI/CD et GitOps.
