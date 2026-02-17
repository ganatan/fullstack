# 001-installation.md — SonarQube (local) — Installation & utilisation (Docker + Maven)

# Installation

## compose.sonarqube.yml

```yaml
services:

  sonarqube:
    image: sonarqube:lts-community
    container_name: sonarqube
    ports:
      - "9000:9000"
    environment:
      - SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true
    volumes:
      - sonarqube_data:/opt/sonarqube/data
      - sonarqube_extensions:/opt/sonarqube/extensions
      - sonarqube_logs:/opt/sonarqube/logs

volumes:
  sonarqube_data:
  sonarqube_extensions:
  sonarqube_logs:
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

---

# Créer un projet (UI)

1) `Projects` → `Create project`
2) Choisir `Manually`
3) Renseigner :
   - `Project key` : `springboot-starter`
   - `Display name` : `springboot-starter`
4) `Set up`
5) Choisir `Maven`
6) Copier la commande fournie

---

# Générer un token

1) `My Account` → `Security`
2) `Generate Token`
3) Copier le token (il ne sera plus affiché)

---

# Scanner Maven (Spring Boot)

## Lancer l’analyse (1 ligne)

À la racine du projet Maven :

```bash
mvn clean verify sonar:sonar -Dsonar.projectKey=springboot-starter -Dsonar.host.url=http://localhost:9000 -Dsonar.login="XXXXXXXX"
```

---

# Résultat (UI)

Dans SonarQube → projet `springboot-starter` :

- `Overview` : synthèse qualité
- `Issues` : bugs / vulnérabilités / code smells
- `Security Hotspots` : points à vérifier
- `Coverage` : couverture (si rapport disponible)
- `Duplications` : duplications
