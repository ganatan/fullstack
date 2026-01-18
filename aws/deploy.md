# deploy.md

## Déploiement Docker sur AWS avec ECR, EKS, ALB, Route 53, CloudWatch, Aurora et Redis

### 1. Registry des images
- AWS Console → **Elastic Container Registry (ECR)**
- Création du repository
- Récupération de l’URL de l’image

---

### 2. Build et push (CI/CD)
- Pipeline **GitLab** en YAML
- Étapes :
  - lint
  - tests
  - coverage
  - build
  - build de l’image Docker
  - push vers **ECR**

---

### 3. Permissions
- **IAM** gère les accès
- Le pipeline CI/CD est autorisé à pousser vers **ECR**
- **EKS** est autorisé à tirer les images depuis **ECR**
- **CloudWatch** est autorisé à recevoir logs et métriques

---

### 4. Base de données
- Base relationnelle **Aurora** (MySQL / PostgreSQL compatible)
- Déployée dans un **VPC**
- Accès contrôlé via **Security Groups**

---

### 5. Cache
- Cache applicatif via **Redis (ElastiCache)**
- Déployé dans le **VPC**
- Utilisé pour :
  - données fréquemment lues
  - réduction de la charge sur Aurora
  - amélioration des temps de réponse

---

### 6. Connexion application → base / cache
- Application **Spring Boot** exécutée dans **EKS**
- Connexions :
  - **Aurora** via JDBC
  - **Redis** via client Redis
- Paramètres fournis via :
  - variables d’environnement
  - ou **Kubernetes Secrets**
- Communication via le réseau privé du VPC

---

### 7. Déploiement applicatif
- **EKS** exécute les conteneurs
- Ressources Kubernetes :
  - **Deployment** : déploiement de l’application
  - **Service** : exposition interne
  - **Ingress** : règles HTTP (paths, hosts)

---

### 8. Logs et métriques
- Les applications loggent sur **stdout / stderr**
- Un agent (CloudWatch Agent ou Fluent Bit) est déployé dans le cluster
- Centralisation dans :
  - **CloudWatch Logs** pour les logs
  - **CloudWatch Metrics** pour les métriques

---

### 9. Exposition externe
- **Ingress Controller** crée un **ALB (Application Load Balancer)**
- L’ALB reçoit le trafic HTTP/HTTPS
- Le trafic est routé vers les services Kubernetes via l’Ingress

---

### 10. DNS
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
- **Aurora** : base de données relationnelle
- **Redis (ElastiCache)** : cache applicatif
- **Ingress / ALB** : exposition HTTP
- **Route 53** : DNS
- **CloudWatch Logs** : logs
- **CloudWatch Metrics** : métriques
- Tout est décrit en **YAML dans le repository**
