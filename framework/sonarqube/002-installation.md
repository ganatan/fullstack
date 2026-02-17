# 001-installation.md — SonarQube (local) — Installation & utilisation (Docker + Node)

# Installation

## compose.sonarqube.yml

```yaml
services:

  sonarqube:
    image: sonarqube:latest
    container_name: sonarqube
    ports:
      - "9000:9000"
    environment:
      - SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true
    volumes:
      - sonarqube_data:/opt/sonarqube/data
      - sonarqube_extensions:/opt/sonarqube/extensions

volumes:
  sonarqube_data:
  sonarqube_extensions:
```

## Démarrer

```bash
docker compose -f compose.sonarqube.yml up -d
```

---

# Utilisation

## Accès interface

- `http://localhost:9000`
- login : `admin`
- password : `admin`

### Changer le mot de passe au premier démarrage

- login : `admin`
- password : `Trustno1234&`

---

# Créer un token

- Menu : `MyAccount / Security`
- URL : `http://localhost:9000/account/security`

Exemple :
- Name : `backend-javascript`
- Type : `User Token`
- `Generate`

---

# Installation Node

## Installer le scanner

```bash
npm install --save-dev sonarqube-scanner
```

## Créer le fichier sonar-project.properties (à la racine)

```properties
sonar.projectKey=backend-javascript
sonar.sources=src
sonar.tests=src/__tests__

sonar.exclusions=**/*.test.js, **/*.spec.js, **/__tests__/**

sonar.javascript.lcov.reportPaths=coverage/lcov.info

sonar.host.url=http://localhost:9000
sonar.token=TON_TOKEN
```

---

# Explications des paramètres

| Propriété | Utilité |
|---|---|
| `sonar.sources=src` | Analyse tout le code de `src/` uniquement |
| `sonar.tests=src/__tests__` | Identifie les tests présents dans les sous-dossiers |
| `sonar.exclusions=**/*.test.js...` | Exclut les fichiers de test des sources |
| `sonar.javascript.lcov.reportPaths=coverage/lcov.info` | Envoie la couverture Jest (via `npm run test:coverage`) |
| `sonar.host.url=http://localhost:9000` | URL du serveur SonarQube |
| `sonar.token=TON_TOKEN` | Authentification via token |

---

# Fonctionnement

1) Le client SonarQube Scanner :
- Lit `sonar-project.properties`
- Analyse le code localement (JS/TS)
- Rassemble :
  - Bugs
  - Vulnérabilités
  - Code Smells
  - Couverture (Jest)
  - Duplications
  - Complexité

2) Connexion au serveur SonarQube :
- Envoie les résultats via HTTP :
  - `sonar.host.url=http://localhost:9000`
  - `sonar.token=TON_TOKEN`

3) Serveur :
- Reçoit les rapports
- Les indexe
- Génère dashboards + métriques

---

# Commandes (UI)

- `Dashboard` : vue d’ensemble de la qualité
- `Issues` : bugs / vulnérabilités / code smells
- `Code` : code analysé dans l’interface
- `Coverage` : taux de couverture (Jest)
- `Duplications` : duplications de code
