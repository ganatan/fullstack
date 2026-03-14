# WSL ne répond pas sous Windows

## Symptôme

La commande `wsl` ne répond pas, n'est pas reconnue, ou reste bloquée.

## Vérifications

Ouvrir **PowerShell en administrateur** puis tester :

```bash
wsl --status
wsl -l -v
where wsl
```

## Installation de WSL

Si WSL n'est pas installé :

```bash
wsl --install
```

Puis redémarrer Windows.

## Activation manuelle si besoin

```bash
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

Puis redémarrer Windows.

## Vérifier la virtualisation

- Ouvrir **Gestionnaire des tâches**
- Onglet **Performance**
- CPU
- Vérifier : **Virtualisation = Activée**

Sinon, l’activer dans le BIOS/UEFI.

## Retester après redémarrage

```bash
wsl --status
wsl -l -v
```

## Lien avec Docker Desktop

Docker Desktop sous Windows fonctionne en général avec :
- WSL2 activé
- virtualisation activée
- Docker Desktop lancé