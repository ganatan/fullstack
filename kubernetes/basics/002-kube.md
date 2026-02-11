# Kubernetes — Installation et utilisation

---

# Installation de l’environnement (Windows)

## Installer WSL2

Activer WSL :
```bash
wsl --install
```

Redémarrer la machine.

Vérifier :
```bash
wsl --status
```

Installer une distribution Linux (Ubuntu recommandé) depuis le Microsoft Store.

Définir WSL2 par défaut :
```bash
wsl --set-default-version 2
```

---

## Installer Docker Desktop

Télécharger :
https://www.docker.com/products/docker-desktop

Dans les paramètres Docker :
Settings → General → Enable WSL2 based engine

Vérifier :
```bash
docker version
```

---

## Installer kubectl

winget install -e --id Kubernetes.kubectl

Vérification :
```bash
kubectl version --client
```

---

## Installer k3d

```bash
winget install k3d
```

Vérification :
```bash
k3d version
```

---

# Création d’un cluster Kubernetes local

k3d cluster create cats-lab --agents 2

Vérifier le cluster :
```bash
kubectl get nodes
kubectl get pods -A
```

---

# Déployer une application de test (nginx)

```bash
kubectl create deployment nginx --image=nginx
kubectl expose deployment nginx --port=80 --type=NodePort
```

Vérifier :
```bash
kubectl get deployments
kubectl get pods
kubectl get svc
```

---

# Accéder au service

```bash
kubectl port-forward service/nginx 8080:80
```

Navigateur :
http://localhost:8080

---

# Commandes utiles

Voir les pods :
```bash
kubectl get pods
```

Voir les logs :
```bash
kubectl logs <pod-name>
```

Entrer dans un container :
```bash
kubectl exec -it <pod-name> -- sh
```

Supprimer un deployment :
```bash
kubectl delete deployment nginx
```

Supprimer le cluster :
```bash
k3d cluster delete media-lab
```

---

# Objectif

Comprendre le cycle :
```bash
Cluster → Deployment → Pod → Service
```

Kubernetes devient l’environnement d’exécution local pour tester
les déploiements avant CI/CD et GitOps.
