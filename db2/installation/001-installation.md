# IBM Db2 — Installation locale (LUW)

## Téléchargement (site officiel)
- Get started / Download Db2 Community Edition : https://www.ibm.com/products/db2/get-started
- Page développeurs Db2 : https://www.ibm.com/products/db2/developers
- Doc install Windows (Db2 Setup Wizard) : https://www.ibm.com/docs/fr/db2/11.5.x?topic=idds-installing-db2-database-servers-by-using-db2-setup-wizard-windows
- Doc install Linux/UNIX (Db2 Setup Wizard) : https://www.ibm.com/docs/fr/db2/12.1.x?topic=idds-installing-db2-servers-by-using-db2-setup-wizard-linux-unix

Notes (Community Edition) :
- Limites usuelles : 16 GB RAM, 4 cores (tiers Community)
- Le téléchargement demande souvent un IBMid

---

## Windows (installer officiel)

### 1) Installer
- Télécharger Db2 Community Edition (Windows x64) depuis le site officiel
- Extraire l’archive puis lancer `setup.exe` en admin
- Choisir une installation serveur (Db2 Database Server)
- Définir :
  - Installation path (ex) :
    - D:\hal\Db2\12.1
  - Port TCP/IP Db2 (par défaut souvent `50000`)
  - Créer une instance (ex : `DB2`)
  - Mot de passe du compte instance (selon options)

### 2) Ouvrir un terminal Db2
Après installation, utiliser “DB2 Command Window” (menu démarrer) ou initialiser l’environnement Db2.

### 3) Test basique
```bash
db2level
```

### 4) Créer une base
```bash
db2 create db BACKEND_MEDIA using codeset UTF-8 territory FR
```

### 5) Connexion + test
```bash
db2 connect to BACKEND_MEDIA
db2 "select current date from sysibm.sysdummy1"
db2 connect reset
```

---

## Ubuntu / Debian (serveur LUW)

### 1) Pré-requis
```bash
sudo apt update
sudo apt install -y libaio1 libnuma1 ksh
```

### 2) Télécharger et extraire
- Télécharger Db2 Community Edition Linux x64 depuis le site officiel (archive `.tar.gz`)
- Exemple :
```bash
tar -xzf v*_linuxx64_server_dec.tar.gz
cd server_dec
```

### 3) Installer
```bash
sudo ./db2_install
```

### 4) Créer une instance
```bash
sudo /opt/ibm/db2/V*/instance/db2icrt -u db2fenc1 db2inst1
```

### 5) Initialiser l’environnement Db2 (session Linux)
```bash
su - db2inst1
. ~db2inst1/sqllib/db2profile
```

### 6) Test basique
```bash
db2level
```

### 7) Créer une base + test
```bash
db2 create db BACKEND_MEDIA using codeset UTF-8 territory FR
db2 connect to BACKEND_MEDIA
db2 "select current date from sysibm.sysdummy1"
db2 connect reset
```

---

## Outils / paramètres

### Ports
- Db2 TCP/IP : `50000` (fréquent, configurable à l’install)

### Commandes utiles
```bash
db2 list db directory
db2 get dbm cfg | grep -i svcename
db2set -all
```

### Administration
- Db2 est administré via `db2` (CLP)
- Possibilité d’utiliser un client SQL (DBeaver) avec le driver Db2 (JDBC) selon besoin
