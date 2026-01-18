# deploy.md

## Déploiement Docker sur AWS avec ECR et EKS

### 1. Créer le repository Docker
- AWS Console → Elastic Container Registry (ECR)
- Create repository
- Récupérer l’URL de l’image

---

### 2. Push de l’image (CI/CD)
- Pipeline GitLab en YAML
- Étapes :
  - lint / test / coverage / build
  - build de l’image Docker
  - push vers ECR

---

### 3. Permissions
- IAM gère les droits
- Le pipeline a le droit de pousser vers ECR
- EKS a le droit de tirer les images depuis ECR

---

### 4. Déploiement sur EKS
- Kubernetes déploie l’image ECR
- Deployment pour l’application
- Service pour l’exposition interne
- Ingress pour l’accès externe

---

## À retenir
- ECR = registry Docker
- IAM = permissions
- EKS = exécution des conteneurs
- Tout est décrit en YAML dans le repository
