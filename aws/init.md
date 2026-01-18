# Inscription
  https://aws.amazon.com/fr/

# Connection
  Sign in to an existing AWS account

  Sign in using alternative factors
  SMS

  IAM = Identity and Access Management  
  MFA = Multi-Factor Authentication (Authentification Multi-Facteurs)

# Connection MFA
  Attribuer un dispositif MFA
  Choisir 
    Application d'authentification
    Google Authenticator  


# Creation de comptes    
  https://console.aws.amazon.com/
  Recherche IAM (Identity & Access Management)
    Users

# Modification mot de passe Use
  Sur le compte 
    Security Credentials    
      Manage console Access


# Deploy

## Synthèse AWS — Legacy vs Kubernetes

| Besoin | Version Legacy (EC2) | Version Kubernetes (EKS) |
|------|----------------------|--------------------------|
| Exécution du back-end | EC2 (Elastic Compute Cloud) | EKS (Elastic Kubernetes Service) |
| Exécution du front | EC2 + Node.js | EKS (Pods) |
| Packaging | WAR / fichiers build | Image Docker |
| Registry images | N/A | ECR (Elastic Container Registry) |
| Déploiement | Copie artefact + restart | Deployment Kubernetes |
| Scalabilité | Auto Scaling EC2 | HPA / scaling Kubernetes |
| Point d’entrée HTTP | IP EC2 ou ELB | ALB via Ingress |
| Routage HTTP | Nginx / Apache | Ingress |
| DNS | Route 53 | Route 53 |
| Stockage fichiers | S3 | S3 |
| Sécurité | Security Groups | IAM + Security Groups |
| Logs / monitoring | Logs serveur | CloudWatch |
| Infra déclarative | Scripts | YAML Kubernetes |
| Ops | VM-centric | Container-centric |

