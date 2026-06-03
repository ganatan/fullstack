# GCloud




## Installation 

- Creer une organisation
  https://workspace.google.com

- Creer un projet
  https://cloud.google.com

  Numéro du projet      XXXXXXXX 
  ID du projet          document-platform-XXXXXX 

- Activer Kubernetes Engine
  Kubernetes Engine API
  Google Enterprise API

- Créer des applications et des services à exécuter dans GKE

- Créer un cluster
  Nom         document-platform-cluster
  Region      europe-west9

- Acces Kubernetes
  https://console.cloud.google.com/kubernetes

  Menu
    Kubernetes Engine
      Clusters

- Creer les namespaces
    Kubernetes Engine
      Clusters
        Connecter

  google shell
    kubectl create namespace dev
    kubectl create namespace preprod
    kubectl create namespace prod        
    
    kubectl get namespaces

- Parametrage
  
  kubectl config set-context --current --namespace=prod
  
  kubectl config view --minify | grep namespace


kubectl create configmap document-platform-config \
  --from-literal=SPRING_PROFILES_ACTIVE=prod \
  --from-literal=MYSQL_HOST=mysql-document-platform-prod \
  --from-literal=MYSQL_PORT=3306 \
  --from-literal=MYSQL_DATABASE=document_platform \
  --from-literal=RABBITMQ_HOST=rabbitmq \
  --from-literal=RABBITMQ_PORT=5672 \
  --from-literal=JWT_EXPIRATION=3600 \
  --from-literal=LOG_LEVEL=INFO  