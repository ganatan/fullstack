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

## Options (celles vues dans tes commandes)

| Option | Signification | À quoi ça sert |
|---|---|---|
| `-F` | `--form` | Envoie des champs **multipart/form-data** (formulaire, upload, etc.) |
| `-s` | `--silent` | Mode silencieux (pas de progression, sortie plus “propre”) |
| `-O` | `--remote-name` | Sauvegarde la réponse dans un fichier (nom “remote”) |
| `-J` | `--remote-header-name` | Avec `-O`, utilise le nom donné par `Content-Disposition` |
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
  Upload : envoie `document.pdf` au serveur, qui le stocke et renvoie un JSON avec un `id`.

- `curl -s http://localhost:3000/api/files`  
  Liste : récupère la liste des fichiers (le `-s` enlève la barre de progression).

- `curl -OJ http://localhost:3000/api/files/<ID>/content`  
  Download : télécharge le PDF `<ID>` et l’enregistre sur ton disque avec le nom donné par le serveur.

- `curl -X DELETE http://localhost:3000/api/files/<ID>`  
  Delete : supprime le fichier `<ID>` côté serveur (on force la méthode DELETE).
