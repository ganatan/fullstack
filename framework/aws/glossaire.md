## Shortlist

- IAM / IRSA / OIDC  
- EKS + ALB + Ingress  
- ECR  
- S3 + DynamoDB  
- Aurora + Redis  
- CloudWatch  
- VPC + Security Groups


## Acronymes AWS / Kubernetes

| Acronyme | Nom complet | Rôle | Description           |
|--------|-------------|------|-----------------------|
| AWS | Amazon Web Services | Cloud provider | Écosystème cloud complet |
| IAM | Identity and Access Management | Sécurité | Users, Roles, Policies, moindre privilège |
| MFA | Multi-Factor Authentication | Sécurité | Obligatoire sur comptes sensibles |
| EC2 | Elastic Compute Cloud | VM | Serveur classique AWS |
| ASG | Auto Scaling Group | Scalabilité | Scaling horizontal EC2 |
| ELB | Elastic Load Balancer | Load balancer | Terme générique historique |
| ALB | Application Load Balancer | Load balancer L7 | HTTP/HTTPS, Ingress K8s |
| NLB | Network Load Balancer | Load balancer L4 | TCP/UDP, très performant |
| EKS | Elastic Kubernetes Service | Kubernetes managé | Orchestration containers |
| ECR | Elastic Container Registry | Registry Docker | Stockage images Docker |
| ECS | Elastic Container Service | Orchestrateur AWS | Alternative à Kubernetes |
| S3 | Simple Storage Service | Stockage objet | Assets, backups, state Terraform |
| RDS | Relational Database Service | Base relationnelle | MySQL, PostgreSQL |
| Aurora | Aurora Database | DB optimisée AWS | Compatible MySQL/PostgreSQL |
| ElastiCache | ElastiCache | Cache managé | Redis / Memcached |
| VPC | Virtual Private Cloud | Réseau | Isolation réseau AWS |
| CIDR | Classless Inter-Domain Routing | Adressage IP | Ex : 10.0.0.0/16 |
| SG | Security Group | Firewall stateful | Règles ingress/egress |
| NACL | Network Access Control List | Firewall stateless | Niveau subnet |
| Route 53 | Route 53 | DNS | DNS public et privé |
| CloudWatch | CloudWatch | Logs & métriques | Logs applicatifs, monitoring |
| IRSA | IAM Roles for Service Accounts | Sécurité EKS | Pods AWS sans clés |
| OIDC | OpenID Connect | Auth fédérée | CI/CD sans secrets |
| HPA | Horizontal Pod Autoscaler | Scaling K8s | Scaling basé métriques |
| Pod | Pod | Unité K8s | 1+ containers |
| Deployment | Deployment | Déploiement K8s | Rolling update |
| Service | Service | Réseau K8s | Exposition interne |
| Ingress | Ingress | Routage HTTP | Host/path vers services |
| ConfigMap | ConfigMap | Configuration | Variables non sensibles |
| Secret | Secret | Données sensibles | Mots de passe, tokens |
| Helm | Helm | Package manager K8s | Charts versionnés |
| Terraform | Terraform | IaC | Infra déclarative |
| tfstate | Terraform State | État infra | Fichier critique |
| DynamoDB | DynamoDB | NoSQL | Lock Terraform |
| CI/CD | Continuous Integration / Delivery | Pipeline | Build, test, deploy |
| WAR | Web Application Archive | Java legacy | Packaging serveur |
| Docker | Docker | Containerisation | Image immutable |
| K8s | Kubernetes | Orchestrateur | Standard de facto |

---

