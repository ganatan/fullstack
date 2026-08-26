# Ports

Commandes essentielles pour identifier les ports utilisés sous Linux.

## Ports en écoute

```bash
ss -lnt
```

## Ports avec processus

```bash
ss -lntp
```

## TCP et UDP

```bash
ss -tulpn
```

## Rechercher un port

```bash
ss -lntp | grep 3000
```

## Trouver le processus utilisant un port

```bash
lsof -i :3000
```

## Afficher les connexions réseau

```bash
lsof -i
```

## Arrêter le processus trouvé

```bash
kill PID
kill -9 PID
```
