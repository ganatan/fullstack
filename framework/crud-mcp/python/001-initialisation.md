# Installation et initialisation d’un projet Python

Installation de Python et création d’un premier projet simple.

---

## Windows 10 / 11

### 1. Télécharger Python

Télécharger Python depuis :

```text
https://www.python.org/downloads/
```

Lancer l'installateur.

Lors de l'installation, cocher :

```text
Add python.exe to PATH
```

Puis choisir :

```text
Install Now
```

---

## Linux

### Debian / Ubuntu

Mettre à jour les paquets :

```bash
sudo apt update
```

Installer Python :

```bash
sudo apt install python3 python3-pip python3-venv
```

---

## 🔍 Vérification de Python

### Windows

```powershell
python --version
```

```powershell
pip --version
```

### Linux

```bash
python3 --version
```

```bash
pip3 --version
```

---

## 🏗️ Projet

* **Language** : Python
* **Package Manager** : pip
* **Virtual Environment** : venv
* **Project Type** : Application Python
* **Artifact** : `python-starter`

Python ne possède pas directement les notions Java suivantes :

* Group
* Artifact Maven
* Packaging JAR

Le projet correspond simplement à un répertoire contenant les fichiers Python.

---

## 📥 Création du projet

Créer le répertoire :

```bash
mkdir python-starter
```

Entrer dans le projet :

```bash
cd python-starter
```

---

## 📦 Création de l'environnement virtuel

### Windows

```powershell
python -m venv .venv
```

### Linux

```bash
python3 -m venv .venv
```

L'environnement virtuel permet d'isoler les dépendances du projet.

---

## ▶️ Activation de l'environnement virtuel

### Windows PowerShell

```powershell
.\.venv\Scripts\Activate.ps1
```

### Windows CMD

```cmd
.venv\Scripts\activate.bat
```

### Linux

```bash
source .venv/bin/activate
```

Lorsque l'environnement est actif, le terminal affiche généralement :

```text
(.venv)
```

---

## 📄 Premier programme

Créer le fichier :

```text
main.py
```

avec :

```python
print("Python starter")
```

---

## ▶️ Lancement du projet

### Windows

```powershell
python main.py
```

### Linux

```bash
python3 main.py
```

Réponse attendue :

```text
Python starter
```

---

## 📦 Installation d'une dépendance

Les dépendances Python sont installées avec `pip`.

Exemple :

```bash
pip install requests
```

Afficher les dépendances installées :

```bash
pip list
```

---

## 📄 Fichier requirements.txt

Les dépendances du projet peuvent être enregistrées avec :

```bash
pip freeze > requirements.txt
```

Exemple :

```text
requests==2.32.5
```

Pour réinstaller toutes les dépendances :

```bash
pip install -r requirements.txt
```

---

## ⏹️ Désactivation de l'environnement virtuel

```bash
deactivate
```

---

## 📄 Fichier .gitignore

Créer :

```text
.gitignore
```

avec :

```text
.venv/
__pycache__/
*.pyc
```

---

## 📁 Structure minimale

```text
python-starter/
├── .venv/
├── .gitignore
├── main.py
└── requirements.txt
```

---

## 📁 Structure d'un projet Python simple

```text
python-starter/
├── src/
│   └── main.py
├── .gitignore
└── requirements.txt
```

Lancement :

### Windows

```powershell
python src/main.py
```

### Linux

```bash
python3 src/main.py
```
