# Logs système

Commandes essentielles pour consulter les logs Linux.

## Tous les logs systemd

```bash
journalctl
```

## Suivre les logs

```bash
journalctl -f
```

## Logs d'un service

```bash
journalctl -u postgresql
```

## Suivre un service

```bash
journalctl -u postgresql -f
```

## Logs depuis aujourd'hui

```bash
journalctl --since today
```

## Logs du noyau

```bash
dmesg
```

## Suivre un fichier de log

```bash
tail -f application.log
```
