# delete

## Supprimer le cluster Kubernetes
```bash
k3d cluster delete media-kube
k3d cluster list
```

## Désinstaller k3d
```bash
winget uninstall k3d
k3d version
```

## Désinstaller kubectl
```bash
winget uninstall Kubernetes.kubectl
kubectl version
```

## Supprimer la configuration Kubernetes

Windows
```bash
rmdir %USERPROFILE%\.kube /s /q
```

WSL
```bash
rm -rf ~/.kube
```

## Nettoyer Docker
```bash
docker system prune -a
```

## Résultat attendu
- WSL2 conservé
- Docker Desktop conservé
- Kubernetes supprimé
- k3d supprimé
- kubectl supprimé
- configuration kube supprimée
