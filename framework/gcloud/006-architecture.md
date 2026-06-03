# Document Platform - Architecture GCP / GKE

## Objectif

Plateforme distribuée Angular + Spring Boot déployée sur Google Cloud Platform avec Kubernetes (GKE), MySQL et RabbitMQ.

L'architecture est conçue pour :

- Séparer les responsabilités
- Faciliter le déploiement
- Assurer la sécurité
- Supporter la montée en charge
- Simplifier les tests et l'exploitation

---

# Architecture globale

```text
Internet
    |
Cloud DNS
    |
IP Publique Statique
    |
Google Cloud Load Balancer HTTPS
    |
Ingress GKE
    |
+-----------------------------+
|         Cluster GKE         |
|         Namespace prod      |
+-----------------------------+
```

---

# Domaines publics

```text
app.document-platform.com

admin.document-platform.com

api.document-platform.com
```

Tous pointent vers :

```text
34.155.20.20
```

via :

```text
Cloud DNS
```

et

```text
Google Load Balancer HTTPS
```

---

# Frontends Angular

## frontend-view

URL :

```text
https://app.document-platform.com
```

Responsabilité :

```text
Consultation publique
Recherche
Lecture
Reporting
```

IP Kubernetes :

```text
10.60.1.10
```

---

## frontend-admin

URL :

```text
https://admin.document-platform.com
```

Responsabilité :

```text
Administration
Gestion documentaire
Gestion métier
```

IP Kubernetes :

```text
10.60.1.11
```

---

# Backends Spring Boot

## api-gateway

URL :

```text
https://api.document-platform.com
```

Responsabilité :

```text
Point d'entrée unique
Routage
CORS
Sécurité
JWT
```

IP Kubernetes :

```text
10.60.1.20
```

---

## api-auth

Responsabilité :

```text
Authentification
Gestion utilisateurs
JWT
Gestion rôles
```

IP Kubernetes :

```text
10.60.1.21
```

---

## document-api

Responsabilité :

```text
Création document
Modification document
Suppression document
Publication RabbitMQ
```

IP Kubernetes :

```text
10.60.1.22
```

---

## document-view

Responsabilité :

```text
Consultation
Recherche
Lecture optimisée
Reporting
```

IP Kubernetes :

```text
10.60.1.23
```

---

## document-worker

Responsabilité :

```text
Traitements asynchrones

Génération PDF

Notifications

Emails

Contrôles métier

Appels externes
```

IP Kubernetes :

```text
10.60.1.24
```

---

# Base de données

## Cloud SQL MySQL

Adresse privée :

```text
10.70.0.10
```

Responsabilité :

```text
Source de vérité

Utilisateurs

Documents

Référentiels métier
```

Accessible uniquement depuis le réseau privé.

Jamais exposée sur Internet.

---

# RabbitMQ

Adresse :

```text
10.60.1.30
```

Responsabilité :

```text
File de messages

Découplage

Communication asynchrone
```

Utilisé entre :

```text
document-api
```

et

```text
document-worker
```

---

# Flux métier

## Création document

```text
frontend-admin
      |
      v
api-gateway
      |
      v
document-api
      |
      +--> MySQL
      |
      +--> RabbitMQ
```

---

## Traitement asynchrone

```text
RabbitMQ
      |
      v
document-worker
      |
      v
MySQL
```

---

## Consultation

```text
frontend-view
      |
      v
api-gateway
      |
      v
document-view
      |
      v
MySQL
```

---

## Authentification

```text
frontend-admin
      |
      v
api-gateway
      |
      v
api-auth
      |
      v
JWT
```

---

# Réseau Kubernetes

## Nodes

```text
10.40.0.0/20
```

---

## Pods

```text
10.50.0.0/16
```

---

## Services Kubernetes

```text
10.60.0.0/20
```

---

## Services GCP privés

```text
10.70.0.0/24
```

---

# Sécurité

## TLS / HTTPS

Gestion :

```text
Google Cloud Load Balancer
```

Certificat :

```text
*.document-platform.com
```

ou

```text
Certificats managés GCP
```

Responsabilités :

```text
HTTPS

Chiffrement

Renouvellement automatique
```

---

## Authentification

Technologies :

```text
Spring Security

JWT

BCrypt
```

---

## JWT

Contient :

```text
Identité utilisateur

Rôles

Date création

Date expiration
```

Ne contient jamais :

```text
Mot de passe
```

---

## BCrypt

Utilisé pour :

```text
Hash des mots de passe
```

Les mots de passe ne sont jamais stockés en clair.

---

## Gestion des secrets

Utilisation :

```text
Google Secret Manager
```

Exemples :

```text
JWT_SECRET

DB_PASSWORD

RABBITMQ_PASSWORD

SMTP_PASSWORD

API_KEYS
```

---

## Kubernetes Secrets

Injection dans :

```text
Spring Boot
```

via :

```text
Secrets Kubernetes
```

---

## ConfigMaps

Pour les données non sensibles :

```text
URLs

Ports

Timeouts

Feature Flags

Configuration applicative
```

---

# Observabilité

## Cloud Logging

Collecte :

```text
Logs applications

Logs Kubernetes

Logs système
```

---

## Cloud Monitoring

Collecte :

```text
CPU

Mémoire

Latence

Disponibilité

Erreurs
```

---

# Haute disponibilité

## Kubernetes

```text
Multi Nodes

Auto Healing

Auto Scaling
```

---

## MySQL

```text
Cloud SQL Haute Disponibilité
```

---

# Performance

## Autoscaling

Géré par :

```text
GKE
```

---

## Découplage

Assuré par :

```text
RabbitMQ
```

---

# Ressources GCP

```text
Projet GCP

VPC

Subnets

Cluster GKE

Namespace prod

Cloud DNS

Load Balancer HTTPS

Ingress GKE

Cloud SQL MySQL

RabbitMQ

Secret Manager

Cloud Logging

Cloud Monitoring
```

---

# Réponse entretien

L'architecture repose sur deux applications Angular et cinq applications Spring Boot déployées dans un cluster Kubernetes GKE. L'accès Internet est sécurisé par un Load Balancer HTTPS GCP avec certificats TLS managés. L'authentification est assurée par Spring Security, JWT et BCrypt. Les secrets sont stockés dans Google Secret Manager puis injectés dans Kubernetes. La persistance est assurée par Cloud SQL MySQL et les traitements asynchrones par RabbitMQ. L'observabilité repose sur Cloud Logging et Cloud Monitoring. Les pipelines GitLab construisent les images Docker, exécutent les tests, publient les artefacts puis déclenchent les déploiements sur les environnements Kubernetes.