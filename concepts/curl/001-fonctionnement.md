# 001-fonctionnnement.md — curl — Installation & fonctionnement (simple)

## Historique (court)

- 1997 : création de curl par Daniel Stenberg.
- curl devient l’outil standard en ligne de commande pour tester des APIs HTTP/HTTPS.

---

## Installation

### Vérifier si curl est déjà présent

```bash
curl --version
```

### Windows (si absent)

```powershell
winget install curl.curl
```

### Linux Debian/Ubuntu

```bash
sudo apt update
sudo apt install -y curl
```

---

## Commande de base

```bash
curl <URL>
```

Exemple :

```bash
curl http://localhost:3000/api/files
```

---

## Règle simple (méthode HTTP)

- Par défaut : `curl <URL>` = **GET**
- `curl -F ... <URL>` = **POST** (multipart/form-data)
- `curl -d ... <URL>` = **POST** (body)
- `curl -X <METHODE> <URL>` = méthode forcée

---

## Options (celles vues dans tes commandes)

| Option | Signification | À quoi ça sert |
|---|---|---|
| `-F` | `--form` | Envoie un formulaire **multipart/form-data** → **POST automatique** |
| `-s` | `--silent` | Silencieux (pas de progression) |
| `-O` | `--remote-name` | Sauvegarde la réponse dans un fichier |
| `-J` | `--remote-header-name` | Avec `-O`, utilise le nom fourni par `Content-Disposition` |
| `-X` | `--request` | Force la méthode HTTP (GET/POST/PUT/DELETE, etc.) |

---

## Test rapide

```bash
curl -F "file=@./document.pdf" http://localhost:3000/api/files/pdf
curl -s http://localhost:3000/api/files
curl -OJ http://localhost:3000/api/files/<ID>/content
curl -X DELETE http://localhost:3000/api/files/<ID>
```

### Explication rapide

- `curl -F "file=@./document.pdf" http://localhost:3000/api/files/pdf`  
  **POST** : upload du PDF, réponse JSON contenant un `id`.

- `curl -s http://localhost:3000/api/files`  
  **GET** : liste des fichiers (sortie silencieuse).

- `curl -OJ http://localhost:3000/api/files/<ID>/content`  
  **GET** : télécharge le PDF `<ID>` et l’enregistre avec le nom donné par le serveur.

- `curl -X DELETE http://localhost:3000/api/files/<ID>`  
  **DELETE** : supprime le fichier `<ID>` côté serveur.
