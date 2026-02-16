# infra.md

## Objectif

Provisionner l’infrastructure AWS une seule fois, puis uniquement lors des évolutions.
Les repositories front et back déploient uniquement l’applicatif (CI/CD + Kubernetes).

---

## Prérequis sur le poste

### Terraform
```bash
terraform -v
```

### AWS CLI
```bash
aws --version
```

### Credentials AWS
```bash
aws configure
```

Terraform utilise ces credentials pour accéder au compte AWS.

---

## Structure minimale du repo infra

```text
infra-aws/
├── providers.tf
├── main.tf
├── variables.tf
├── outputs.tf
```

---

## Fichiers Terraform minimum

### providers.tf
```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "eu-west-3"
}
```

### main.tf
```hcl
# Déclaration des ressources AWS
# EKS
# ECR
# Aurora
# Redis (ElastiCache)
# IAM
# ALB
# Route 53
# VPC / réseau
```

### variables.tf
```hcl
variable "environment" {
  type = string
}
```

### outputs.tf
```hcl
output "cluster_name" {
  value = "eks-cluster-name"
}
```

---

## Démarrage (création initiale)

```bash
terraform init
terraform plan
terraform apply
```

---

## Évolution de l’infrastructure

```bash
terraform plan
terraform apply
```

---

## Workflow avec Merge Requests

- MR : terraform plan
- Merge main : terraform apply (manuel)

---

## Lien avec les repos applicatifs

- L’infrastructure est déjà provisionnée
- Les repos front/back buildent et déploient l’applicatif
- Terraform n’est jamais exécuté depuis les repos applicatifs

---

## À retenir

- Terraform = infrastructure
- Un repo dédié pour l’infra
- Exécution initiale + exécutions ponctuelles
- Front / back = déploiement applicatif uniquement
