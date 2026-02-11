# 001-etapes.md
# Kubernetes — Déployer media-api en local

---

## Objectif

Déployer le service **media-api** sur Kubernetes local (**k3d**)  
en utilisant une image Docker et des manifests YAML.

---

## Étape 1 — Construire l’image Docker

Depuis le dossier `media-api` :

```bash
docker build -t media-api:local .
```

Vérifier :
```bash
docker images | grep media-api
```

---

## Étape 2 — Charger l’image dans k3d

```bash
k3d image import media-api:local -c media-kube
```

---

## Étape 3 — Créer un namespace

```bash
kubectl create namespace media
kubectl get ns
```

---

## Étape 4 — Deployment YAML

Créer le fichier `deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: media-api
  namespace: media
spec:
  replicas: 1
  selector:
    matchLabels:
      app: media-api
  template:
    metadata:
      labels:
        app: media-api
    spec:
      containers:
        - name: media-api
          image: media-api:local
          imagePullPolicy: Never
          ports:
            - containerPort: 8080
```

---

## Étape 5 — Service YAML

Créer le fichier `service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: media-api
  namespace: media
spec:
  selector:
    app: media-api
  ports:
    - port: 80
      targetPort: 8080
  type: ClusterIP
```

---

## Étape 6 — Déployer

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

---

## Étape 7 — Vérification

```bash
kubectl get pods -n media
kubectl get svc -n media
kubectl describe pod -n media
```

---

## Étape 8 — Accès local

```bash
kubectl port-forward svc/media-api -n media 8080:80
```

Navigateur :
```
http://localhost:8080
```

---

## Étape 9 — Debug

Logs :
```bash
kubectl logs -n media deployment/media-api
```

Restart :
```bash
kubectl rollout restart deployment media-api -n media
```

Supprimer :
```bash
kubectl delete namespace media
```

---

## Résultat

`media-api` tourne maintenant dans Kubernetes local.

Cycle complet :

```
Docker → Image → k3d → Deployment → Pod → Service
```
