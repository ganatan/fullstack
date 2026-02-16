# PostgreSQL — Installation locale

## Téléchargement (site officiel)
- PostgreSQL : https://www.postgresql.org/download/
- Windows (installer) : https://www.postgresql.org/download/windows/
- macOS : https://www.postgresql.org/download/macosx/
- Linux : https://www.postgresql.org/download/linux/

---

## Windows (installer officiel)

### 1) Installer
- Télécharger l’installer Windows depuis le site officiel
- Lancer l’installation
  - Components : PostgreSQL Server, pgAdmin 4, Command Line Tools, Stack Builder
  - Mot de passe du compte `postgres`
  - Port : `5432`
  - Locale : par défaut

Choisir un répertoire dédié :

  D:\hal\PostgreSQL\18
  D:\hal\PostgreSQL\18\data

### 2) Vérifier le service
```powershell
Get-Service postgresql*
```

### 3) Ajouter `psql` au PATH (si besoin)
Chemin typique :
- `C:\Program Files\PostgreSQL\<version>\bin`

### 4) Test de connexion
```bash
psql -h localhost -p 5432 -U postgres
```

### 5) Vérifier la version + quitter
```sql
SELECT version();
\q
```

### 6) Créer un user + une base (optionnel)
```sql
CREATE USER backend WITH PASSWORD 'backend';
CREATE DATABASE backend_media OWNER backend;
GRANT ALL PRIVILEGES ON DATABASE backend_media TO backend;
```

### 7) Connexion avec le nouvel utilisateur
```bash
psql -h localhost -p 5432 -U backend -d backend_media
```

---

## Ubuntu / Debian

### 1) Installation
```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
```

### 2) Démarrage + statut
```bash
sudo systemctl enable --now postgresql
sudo systemctl status postgresql
```

### 3) Connexion (compte postgres)
```bash
sudo -u postgres psql
```

### 4) Créer user + base
```sql
CREATE USER backend WITH PASSWORD 'backend';
CREATE DATABASE backend_media OWNER backend;
GRANT ALL PRIVILEGES ON DATABASE backend_media TO backend;
\q
```

### 5) Test TCP (si autorisé par `pg_hba.conf`)
```bash
psql -h localhost -p 5432 -U backend -d backend_media
```

---

## macOS (Homebrew)

### 1) Installation
```bash
brew update
brew install postgresql@16
```

### 2) Démarrage
```bash
brew services start postgresql@16
```

### 3) Connexion
```bash
psql postgres
```

---

## Outils / paramètres

### pgAdmin
- GUI pour administrer PostgreSQL

### Paramètres par défaut
- Host : `localhost`
- Port : `5432`
- User admin : `postgres`
