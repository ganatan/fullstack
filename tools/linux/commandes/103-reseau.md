# Réseau

Commandes essentielles pour vérifier et diagnostiquer le réseau sous Linux.

## Adresse IP

```bash
ip addr
```

Version courte :

```bash
ip a
```

## Adresse IP locale

```bash
hostname -I
```

## Routes réseau

```bash
ip route
```

## Interfaces réseau

```bash
ip link
```

## Tester une connexion

```bash
ping google.com
```

Tester une adresse IP :

```bash
ping 8.8.8.8
```

## Résolution DNS

```bash
nslookup google.com
```

ou :

```bash
dig google.com
```

## Parcours réseau

```bash
traceroute google.com
```