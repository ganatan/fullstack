# XRAY (JFrog Xray) — Principes

## Historique (court)

- 2014–2016 : montée des vulnérabilités “supply chain” (dépendances, registry, artefacts).
- JFrog industrialise la distribution d’artefacts (Artifactory).
- Xray ajoute la couche **sécurité + conformité** au-dessus des artefacts.
- Aujourd’hui : Xray = **SCA + scan containers + licences + policies/gates** dans la CI/CD.

---

## Intérêt (à quoi ça sert)

- Détecter les **CVE** dans tes dépendances (directes + transitives) Maven/Gradle/npm…
- Scanner tes **images Docker** (packages OS + libs applicatives).
- Contrôler les **licences** (GPL/AGPL, licences interdites).
- Mettre des **gates** : si vulnérabilité critique → build KO.
- Assurer la **traçabilité** : quel build contient quelle vulnérabilité / quel composant.

---

## Fonctionnement (pipeline simple)

1) Build Spring Boot (jar) + éventuellement image Docker.
2) Publication dans une registry (souvent **Artifactory**).
3) Xray analyse :
   - dépendances (graphe transitive),
   - image Docker (couches),
   - licences.
4) Xray applique des policies (seuils, règles).
5) La CI échoue ou passe selon le verdict.

Schéma :

```
Spring Boot (Maven/Gradle) → Jar/Image → Registry (Artifactory) → Xray Scan → Policy Gate → Deploy
```

---

## Composants (rôle de chacun)

### Artifactory
- Registry d’artefacts (Maven, npm, Docker, Helm…).
- Stocke builds + métadonnées de build (build-info).

### Xray
- Analyse sécurité/compliance :
  - SCA (dépendances),
  - container scanning (OS + libs),
  - licences,
  - policies / watch / alerting.
- Produit un verdict “pass/fail”.

### JFrog CLI
- Outil CI pour publier build-info et déclencher les scans.
- Supporte Maven/Gradle/npm/Docker via intégration JFrog.

### Policies / Watches
- Policy : règles (ex: Critical=fail, GPL=fail, fix-available obligatoire).
- Watch : périmètre (repo, projet, build) + notifications.

---

## Ports (selon packaging)

| Composant | Port | Protocole | Usage |
|---|---:|---|---|
| Artifactory | 8081/8082 | HTTP | UI + API |
| Xray | 8000/8082 | HTTP | UI + API (souvent via plateforme JFrog) |

Notes :
- En entreprise, tout passe souvent derrière un reverse-proxy (un seul domaine).
- Les ports exacts varient selon la “JFrog Platform” (Docker/Helm/on-prem).

---

## URLs (exemples)

- UI JFrog : `https://jfrog.company.tld/`
- Artifactory : `https://jfrog.company.tld/artifactory/`
- Xray : `https://jfrog.company.tld/xray/`

---

## Commandes de vérification (rapides)

```bash
jfrog --version
```

```bash
jfrog config add
```

```bash
jfrog rt mvn clean install
jfrog rt build-publish
```

```bash
jfrog rt build-scan
```

---

## Artefacts (concept clé)

- Xray scanne **ce que tu livres** (jar, image, package), pas ton code source.
- Point central : **graphe de dépendances transitive** + couches d’image.
- Une CVE peut venir d’une dépendance transitive (ex: Jackson, Netty, SnakeYAML…).

---

## Résultats (ce que tu obtiens)

- Vulnérabilités par composant :
  - sévérité, CVSS,
  - “fixed version available”,
  - impact (builds/images concernés).
- Violations de policy :
  - blocage CI si règle déclenchée,
  - waivers possibles (timebox + justification).
- Licences :
  - détection + blocage si policy l’interdit.

---

## Bonnes pratiques (niveau mission)

- Gate CI sur main/release : Critical/High bloque (au minimum).
- Patch régulier (Spring Boot patch-level + libs transverses).
- Base image minimale (réduit la surface CVE OS).
- Waivers stricts : exception justifiée + durée limitée + ticket.
- Build-info et versions immuables (traçabilité).
- Complémentarité :
  - SonarQube = qualité + SAST code,
  - Xray = SCA + containers + licences (supply chain).
