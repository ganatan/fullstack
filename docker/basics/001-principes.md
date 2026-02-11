# 001-principes.md

# Docker + Kubernetes — Principes

## Build vs Run
Application → JAR → Image Docker → Container → Kubernetes

Docker construit l’image.
Kubernetes exécute les containers.

## Docker
Image = application packagée
Container = instance en cours d’exécution

Docker permet :
- build
- run
- isolation
- reproductibilité

## Kubernetes
Objets principaux :
- Deployment
- Pod
- Service
- Namespace
- ConfigMap
- Secret

Garanties :
- restart automatique
- scaling
- réseau interne
- déploiement déclaratif

## Workflow moderne
CI :
build → tests → image Docker → registry

CD :
Kubernetes déploie via YAML.
