# Services Google Cloud à Provisionner

## Réseau

### Virtual Private Cloud (VPC)

Produit :

```text
VPC Network
```

Rôle :

```text
Réseau privé principal
```

---

### Subnets

Produit :

```text
VPC Subnets
```

Rôle :

```text
Découpage du réseau
```

---

## DNS

Produit :

```text
Cloud DNS
```

Rôle :

```text
Gestion des domaines
```

Exemples :

```text
document-platform.com

api.document-platform.com

admin.document-platform.com

app.document-platform.com
```

---

## Adresse IP Publique

Produit :

```text
External Static IP Address
```

Rôle :

```text
Adresse IP fixe Internet
```

---

## HTTPS

Produit :

```text
Cloud Load Balancing
```

Type :

```text
Global External Application Load Balancer
```

Rôle :

```text
HTTPS

TLS

Routage
```

---

## Certificats

Produit :

```text
Certificate Manager
```

ou

```text
Google Managed SSL Certificates
```

Rôle :

```text
Gestion automatique TLS
```

---

## Kubernetes

Produit :

```text
Google Kubernetes Engine (GKE)
```

Rôle :

```text
Cluster Kubernetes
```

---

## Base de données

Produit :

```text
Cloud SQL
```

Type :

```text
MySQL
```

ou

```text
PostgreSQL
```

---

## Secrets

Produit :

```text
Secret Manager
```

Rôle :

```text
JWT_SECRET

DB_PASSWORD

API_KEYS
```

---

## Registry Docker

Produit :

```text
Artifact Registry
```

Rôle :

```text
Stockage images Docker
```

---

## Logs

Produit :

```text
Cloud Logging
```

Rôle :

```text
Centralisation des logs
```

---

## Monitoring

Produit :

```text
Cloud Monitoring
```

Rôle :

```text
CPU

RAM

Disponibilité

Alertes
```

---

## Sécurité

Produit :

```text
Cloud Armor
```

Rôle :

```text
WAF

Protection DDoS

Rate Limiting
```

---

## IAM

Produit :

```text
Identity and Access Management (IAM)
```

Rôle :

```text
Gestion des droits
```

---

## Comptes techniques

Produit :

```text
Service Accounts
```

Rôle :

```text
Accès sécurisés entre services
```

---

# Services GCP à connaître absolument

```text
Cloud DNS

External Static IP

Cloud Load Balancing

Certificate Manager

Google Kubernetes Engine (GKE)

Cloud SQL

Secret Manager

Artifact Registry

Cloud Logging

Cloud Monitoring

Cloud Armor

IAM

Service Accounts
```

# Pour ton schéma

Si on me demande :

"Quels services GCP avez-vous utilisés ?"

Je réponds :

- Cloud DNS
- External Static IP
- Cloud Load Balancing
- Certificate Manager
- Google Kubernetes Engine (GKE)
- Cloud SQL MySQL
- Secret Manager
- Artifact Registry
- Cloud Logging
- Cloud Monitoring
- Cloud Armor
- IAM
- Service Accounts

C'est exactement la liste cohérente avec ton architecture Document Platform.