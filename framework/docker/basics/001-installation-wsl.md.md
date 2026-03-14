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

Si WSL n'est pas installé : L'installation peut durer quelques minutes !!!!!!!!!!!

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

## Cas possible : WSL installé mais aucune distribution Linux

Si la commande :

```bash
wsl -l -v
```

retourne :

```text
Sous-système Windows pour Linux n’a aucune distribution installée.
```

alors WSL est bien installé, mais aucune distribution Linux n’est encore présente.

Lister les distributions disponibles :

```bash
wsl --list --online
```

Installer Ubuntu :

```bash
wsl --install Ubuntu
```

ou :

```bash
wsl --install -d Ubuntu
```

Puis redémarrer Windows si demandé.

Lancer ensuite :

```bash
wsl
```

ou :

```bash
ubuntu
```

Au premier démarrage, créer :
- un nom d’utilisateur Linux
- un mot de passe Linux

Vérifier ensuite :

```bash
wsl -l -v
```

Résultat attendu :

```text
  NAME      STATE           VERSION
* Ubuntu    Running         2
```

## Si `wsl` reste bloqué

Tester :

```bash
wsl --shutdown
wsl --status
wsl -l -v
```

Puis redémarrer Windows si nécessaire.

## Remarque utile avec Docker Desktop

Si Docker Desktop fonctionne correctement, alors :
- la virtualisation est en principe active
- WSL2 est en général correctement activé
- le problème vient souvent d’une distribution Linux non installée ou d’un souci local de commande `wsl`