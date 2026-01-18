# deploy.md

## Déploiement Docker sur AWS avec ECR, EKS, ALB, Route 53 et CloudWatch

### 1. Créer le repository Docker
- AWS Console → **Elastic Container Registry (ECR)**
- Create repository
- Récupérer l’URL de l’image

---

### 2. Push de l’image (CI/CD)
- Pipeline **GitLab** en YAML
- Étapes :
  - lint / test / coverage / build
  - build de l’image Docker
  - push vers **ECR**

---

### 3. Permissions
- **IAM** gère les droits
- Le pipeline CI/CD a le droit de pousser vers ECR
- **EKS** a le droit de tirer les images depuis ECR
- **CloudWatch** est autorisé à recevoir les logs

---

### 4. Déploiement sur EKS
- **EKS** exécute les conteneurs
- Ressources Kubernetes :
  - **Deployment** : déploiement de l’application
  - **Service** : exposition interne
  - **Ingress** : règles HTTP (paths, hosts)

---

### 5. Logs et monitoring
- Les applications loggent sur **stdout / stderr**
- Un agent (CloudWatch Agent ou Fluent Bit) est déployé dans le cluster
- Les logs sont centralisés dans **CloudWatch Logs**

---

### 6. Exposition externe
- **Ingress Controller** crée automatiquement un **ALB (Application Load Balancer)**
- L’ALB reçoit le trafic HTTP/HTTPS
- Le trafic est routé vers les services Kubernetes via l’Ingress

---

### 7. DNS
- **Route 53** gère les noms de domaine
- Les entrées DNS pointent vers l’ALB

Exemples :
- `www.mondomaine.com` → ALB (Ingress front)
- `api.mondomaine.com` → ALB (Ingress API)

---

## À retenir
- **ECR** : registry Docker
- **IAM** : permissions
- **EKS** : exécution des conteneurs
- **Ingress** : routage HTTP Kubernetes
- **ALB** : point d’entrée réseau AWS
- **Route 53** : DNS
- **CloudWatch** : logs et monitoring
- Tout est décrit en **YAML dans le repository**
