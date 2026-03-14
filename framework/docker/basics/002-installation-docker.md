# Installation de Docker Desktop sous Windows

## Prérequis

- Windows 11 64 bits compatible
- WSL 2 installé et actif
- Virtualisation activée dans le BIOS/UEFI
- Droits administrateur pour l’installation
- Docker Desktop pour Windows utilise en général le backend **WSL 2**
- Une distribution Linux utilisateur comme Ubuntu n’est pas obligatoire pour que Docker Desktop fonctionne

## Vérifier WSL

Ouvrir **PowerShell** :

```bash
wsl --status
wsl -l -v
```

WSL doit répondre.  
S’il n’y a aucune distribution installée, ce n’est pas bloquant pour Docker Desktop.

## Télécharger Docker Desktop

Télécharger **Docker Desktop for Windows** depuis le site officiel Docker.

## Installer Docker Desktop

Lancer l’installateur téléchargé.

Pendant l’installation :

- accepter l’UAC si Windows le demande
- laisser activée l’option liée à **WSL 2** si elle est proposée
- terminer l’installation normalement

## Lancer Docker Desktop

Après installation :

- ouvrir **Docker Desktop**
- attendre que le moteur démarre

## Vérifier la configuration WSL 2

Dans Docker Desktop :

- **Settings**
- **General**
- vérifier que **Use the WSL 2 based engine** est activé

## Vérifier que Docker fonctionne

Dans **PowerShell** :

```bash
docker version
docker info
```

Si Docker répond, l’installation est correcte.

## Tester avec un conteneur

```bash
docker run hello-world
```

Si le message de test s’affiche, Docker Desktop fonctionne.

## Remarques utiles

- Docker Desktop sur Windows n’est pas prévu pour Windows Server
- Une distro WSL comme Ubuntu devient utile surtout si tu veux travailler dans un vrai terminal Linux
- Pour faire simplement tourner Docker Desktop, une distro Linux utilisateur n’est pas obligatoire

## Résumé rapide

```text
1. Vérifier WSL
2. Télécharger Docker Desktop
3. Lancer l’installateur
4. Ouvrir Docker Desktop
5. Vérifier "Use the WSL 2 based engine"
6. Tester avec docker version
7. Tester avec docker run hello-world
```