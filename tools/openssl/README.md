# Installer OpenSSL sous Windows et créer un certificat simple

## 1. Installer OpenSSL avec winget

Ouvrir un terminal **en administrateur** puis lancer :

```bat
winget install -e --id ShiningLight.OpenSSL.Light
```

## 2. Vérifier si `openssl` est accessible

Fermer puis rouvrir le terminal, puis tester :

```bat
openssl version
where openssl
```

## 3. Si `openssl` n'est pas reconnu

Chercher le binaire :

```bat
where /r "C:\Program Files" openssl.exe
where /r "C:\Program Files (x86)" openssl.exe
```

Chemin fréquent :

```text
C:\Program Files\OpenSSL-Win64\bin\openssl.exe
```

## 4. Ajouter OpenSSL au `PATH` si besoin

Ajouter ce dossier dans la variable `Path` Windows :

```text
C:\Program Files\OpenSSL-Win64\bin
```

Puis fermer et rouvrir le terminal.

## 5. Créer un certificat local simple longue durée

Dans ton dossier de travail :

```bat
openssl req -x509 -newkey rsa:2048 -sha256 -nodes -keyout mongodb.key -out mongodb.crt -days 36500 -subj "/CN=localhost"
copy /b mongodb.key + mongodb.crt mongodb.pem
```

## 6. Fichiers générés

- `mongodb.key` : clé privée
- `mongodb.crt` : certificat
- `mongodb.pem` : fichier combiné pour MongoDB

## 7. Si la commande `openssl` ne marche toujours pas

Utiliser le chemin complet :

```bat
"C:\Program Files\OpenSSL-Win64\bin\openssl.exe" req -x509 -newkey rsa:2048 -sha256 -nodes -keyout mongodb.key -out mongodb.crt -days 36500 -subj "/CN=localhost"
copy /b mongodb.key + mongodb.crt mongodb.pem
```