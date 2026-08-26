# Disques et partitions

Commandes essentielles pour identifier les disques et partitions.

## Lister les disques

```bash
lsblk
```

## Afficher les identifiants

```bash
blkid
```

## Afficher les systèmes montés

```bash
mount
```

## Afficher l'espace disque

```bash
df -h
```

## Informations sur les partitions

```bash
sudo fdisk -l
```

## Monter un système de fichiers

```bash
sudo mount /dev/sdb1 /mnt/data
```

## Démonter

```bash
sudo umount /mnt/data
```
