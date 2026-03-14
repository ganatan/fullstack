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

L'installation peut durer quelques minutes !!!!!!!!!!!
Puis redémarrer Windows.

## Activation manuelle si besoin

```bash
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

Puis redémarrer Windows.

## Vérifier la virtualisation

### Méthode 1 — Gestionnaire des tâches

- `Ctrl + Shift + Esc`
- Onglet **Performances**
- Cliquer sur **CPU** ou **Processeur**
- Chercher la ligne :

```text
Virtualisation : Activée
```

ou

```text
Virtualisation : Désactivée
```

Attention :
- il faut chercher **Virtualisation**
- pas **Service de virtualisation**

### Méthode 2 — PowerShell

Si l’onglet **Performances** n’apparaît pas, ouvrir **PowerShell** puis taper :

```bash
systeminfo | findstr /i "Hyper-V"
```

Ou afficher tout :

```bash
systeminfo
```

Chercher une ligne du style :

```text
La virtualisation activée dans le microprogramme : Oui
```

ou en anglais :

```text
Virtualization Enabled In Firmware: Yes
```

## Si la virtualisation est désactivée

Il faut l’activer dans le BIOS/UEFI puis redémarrer Windows.

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