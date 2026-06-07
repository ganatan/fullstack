# Installation Python 3.13 sous Windows 11

## 1. Télécharger Python

https://www.python.org/downloads/

Télécharger la dernière version Python 3.13 x64.

---

## 2. Lancer l'installation

Cocher :

☑ Add python.exe to PATH

Cliquer sur :

Install Now

Attendre la fin de l'installation.

---

## 3. Vérifier l'installation

Ouvrir un terminal Windows :

```bash
python --version
```

ou

```bash
py --version
```

Résultat attendu :

```text
Python 3.13.x
```

---

## 4. Vérifier pip

```bash
pip --version
```

Résultat attendu :

```text
pip xx.x.x
```

---

## 5. Créer le projet

```bash
mkdir backend-django
cd backend-django
```

---

## 6. Créer un environnement virtuel

```bash
python -m venv .venv
```

---

## 7. Activer l'environnement

PowerShell :

```bash
.venv\Scripts\Activate.ps1
```

Invite de commande :

```bash
.venv\Scripts\activate.bat
```

Résultat attendu :

```text
(.venv)
```

au début de la ligne.

---

## 8. Mettre pip à jour

```bash
python -m pip install --upgrade pip
```

---

## 9. Installer Django

```bash
pip install django djangorestframework
```

---

## 10. Vérifier Django

```bash
django-admin --version
```

Résultat attendu :

```text
5.x.x
```

---

## 11. Créer le projet

```bash
django-admin startproject config .
```

---

## 12. Créer l'application

```bash
python manage.py startapp movies
```

---

## 13. Lancer le serveur

```bash
python manage.py runserver
```

Ouvrir :

http://localhost:8000