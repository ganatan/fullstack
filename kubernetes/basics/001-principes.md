# Kubernetes — Principes

## Historique

- 2013 — Google développe Borg (orchestration interne)
- 2014 — Annonce publique de Kubernetes par Google
- 2015 — Kubernetes 1.0 + entrée dans la CNCF
- 2016 — Adoption avec Docker
- 2017 — Standard d’orchestration cloud-native
- 2018 — Support AWS, Azure, GCP
- 2019 — Montée du GitOps (ArgoCD)
- 2020 — Standard microservices en entreprise
- 2021 — Adoption massive secteur bancaire et industrie
- 2023 — Base des plateformes DevOps modernes

---

## Principes Kubernetes

Kubernetes est un orchestrateur de containers basé sur un modèle déclaratif.

Le développeur décrit l’état désiré dans des fichiers YAML.
Le control plane maintient cet état en permanence.

Un cluster Kubernetes contient plusieurs nodes.
Les applications tournent dans des Pods.
Un Pod contient un ou plusieurs containers.

Un Deployment gère la réplication, les mises à jour et le rollback.

Un Service expose les Pods dans le cluster.
Un Ingress expose l’application vers l’extérieur.

Kubernetes surveille les containers avec liveness et readiness probes.
En cas de crash, Kubernetes redémarre automatiquement le container.

Le scaling horizontal est basé sur le nombre de replicas.

La configuration est externalisée avec ConfigMap.
Les données sensibles sont stockées dans Secret.

Le scheduler place les Pods sur les nodes.
Le kubelet exécute les containers sur chaque node.
etcd stocke l’état du cluster.

kubectl est l’outil CLI pour piloter Kubernetes.

Kubernetes permet de rendre les applications portables entre environnements
et constitue la base des architectures microservices modernes.
