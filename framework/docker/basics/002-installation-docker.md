# Installation de Docker Desktop sous Windows

## Prérequis

- Windows 11 64 bits compatible
- WSL 2 installé et actif
- Virtualisation activée dans le BIOS/UEFI
- Droits administrateur pour l’installation
- Docker Desktop pour Windows utilise en général le backend **WSL 2** ; une distribution Linux utilisateur comme Ubuntu n’est pas obligatoire pour que Docker Desktop fonctionne :contentReference[oaicite:0]{index=0}

## Vérifier WSL

Ouvrir **PowerShell** :

```bash
wsl --status
wsl -l -v