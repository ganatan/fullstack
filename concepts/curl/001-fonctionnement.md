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

### macOS (si absent)

```bash
brew install curl
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

## Options essentielles (API)

### Méthode HTTP

```bash
curl -X GET <URL>
curl -X POST <URL>
curl -X PUT <URL>
curl -X PATCH <URL>
curl -X DELETE <URL>
```

### Headers

```bash
curl -H "Accept: application/json" <URL>
curl -H "Content-Type: application/json" <URL>
curl -H "Authorization: Bearer <TOKEN>" <URL>
```

### Corps JSON

```bash
curl -X POST <URL> -H "Content-Type: application/json" -d '{"name":"test"}'
curl -X POST <URL> -H "Content-Type: application/json" -d @payload.json
```

### Upload fichier (multipart/form-data)

```bash
curl -F "file=@./document.pdf" http://localhost:3000/api/files/pdf
curl -F "file=@./document.pdf;type=application/pdf" http://localhost:3000/api/files/pdf
curl -F "file=@./document.pdf;filename=mon.pdf" http://localhost:3000/api/files/pdf
```

### Download fichier

```bash
curl -o out.pdf http://localhost:3000/api/files/<ID>/content
curl -OJ http://localhost:3000/api/files/<ID>/content
```

- `-o` écrit dans le fichier indiqué
- `-O` utilise un nom “remote”
- `-J` utilise le nom fourni par `Content-Disposition`

### Sortie silencieuse / erreurs

```bash
curl -s <URL>
curl -sS <URL>
curl -f <URL>
curl -fsS <URL>
```

- `-s` silencieux
- `-S` affiche l’erreur même si silencieux
- `-f` code d’erreur si HTTP 4xx/5xx
- `-fsS` combo courant CI

### Debug / inspection

```bash
curl -v <URL>
curl -i <URL>
curl -I <URL>
```

- `-v` verbose (requête + réponse)
- `-i` inclut les headers dans la sortie
- `-I` HEAD (headers seulement)

### Redirections

```bash
curl -L <URL>
```

### Timeouts

```bash
curl --connect-timeout 2 --max-time 10 <URL>
```

- `--connect-timeout` délai max de connexion
- `--max-time` délai max total

### HTTPS (dev)

```bash
curl -k https://localhost:8443/api
```

- `-k` ignore la validation TLS (dev uniquement)

---

## Exemples pour ton API fichiers

### Upload

```bash
curl -F "file=@./document.pdf" http://localhost:3000/api/files/pdf
```

### Lister

```bash
curl -s http://localhost:3000/api/files
```

### Télécharger

```bash
curl -OJ http://localhost:3000/api/files/<ID>/content
```

### Supprimer

```bash
curl -X DELETE http://localhost:3000/api/files/<ID>
```
