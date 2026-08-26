# Services

Commandes essentielles pour gérer les services avec systemd.

## État d'un service

```bash
systemctl status postgresql
```

## Démarrer

```bash
sudo systemctl start postgresql
```

## Arrêter

```bash
sudo systemctl stop postgresql
```

## Redémarrer

```bash
sudo systemctl restart postgresql
```

## Recharger la configuration

```bash
sudo systemctl reload postgresql
```

## Activer au démarrage

```bash
sudo systemctl enable postgresql
```

## Désactiver au démarrage

```bash
sudo systemctl disable postgresql
```

## Lister les services

```bash
systemctl list-units --type=service
```
