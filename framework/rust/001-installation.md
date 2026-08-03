# Installation de Rust

Installation de Rust avec `rustup`, la méthode officielle recommandée.

---

## Windows 10 / 11

### 1. Télécharger Rust

Télécharger puis exécuter :

[https://rustup.rs](https://rustup.rs)

Le fichier téléchargé est :

```text
rustup-init.exe
```

### 2. Installer les prérequis Microsoft

Rust utilise par défaut la toolchain MSVC sous Windows.

Si l’installateur propose d’installer les prérequis Visual Studio, accepter l’installation.

Les composants nécessaires sont :

```text
Développement Desktop en C++
MSVC
Windows SDK
```

### 3. Installer Rust

Dans la fenêtre de `rustup-init.exe`, choisir :

```text
1) Proceed with standard installation
```

Fermer puis rouvrir le terminal.

### 4. Vérifier l’installation

```powershell
rustc --version
cargo --version
rustup --version
```

---

## Linux

### 1. Installer les outils de compilation

#### Debian / Ubuntu

```bash
sudo apt update
sudo apt install -y build-essential curl
```

#### Fedora

```bash
sudo dnf install -y gcc curl
```

#### Arch Linux

```bash
sudo pacman -S --needed base-devel curl
```

### 2. Installer Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Choisir :

```text
1) Proceed with standard installation
```

### 3. Charger l’environnement Rust

```bash
source "$HOME/.cargo/env"
```

### 4. Vérifier l’installation

```bash
rustc --version
cargo --version
rustup --version
```


# Site Rust
	https://rust-lang.org/fr/tools/install/
	rustup-init.exe


# Installation de Visual Studio Installer

Visual Studio Build Tools 2022


Installation standard de Rust sous Windows 
  Automatiquement Rust (rustc), 
	argo (gestionnaire de projets, dépendances et compilation)
	ustup (gestionnaire des versions de Rust)
		
		
	Téléchargement des Microsoft Visual Studio Build Tools, 
		Indispensables à la chaîne de compilation MSVC utilisée par Rust sous Windows. 
		MSVC : Microsoft Visual C++
		Ces outils (compilateur C/C++, linker et bibliothèques système)