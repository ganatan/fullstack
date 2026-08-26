# Mémoire

Commandes essentielles pour surveiller la mémoire sous Linux.

## Afficher la mémoire

```bash
free
```

## Format lisible

```bash
free -h
```

## Surveillance globale

```bash
top
```

## Interface améliorée

```bash
htop
```

## Statistiques mémoire et système

```bash
vmstat
vmstat 2
```

## Processus Java

```bash
ps -ef | grep java
```

## Trier par mémoire

```bash
ps aux --sort=-%mem
```
