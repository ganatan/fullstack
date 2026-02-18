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
