# architecture-deploiement.md

## Déploiement

### Back-end
- Application **Spring (Java)**
- Déployée sur **EC2**
- Build Java
- Génération d’un artefact (WAR)
- Déploiement sur serveur applicatif
- Exposition des APIs HTTP

---

### Front-end
- Application **Angular avec SSR**
- Runtime **Node.js**
- Déployée sur **EC2**
- Build Angular SSR
- Déploiement de l’application Node
- Exposition HTTP

---

### Fichiers
- Types : documents, XML, TXT
- Stockage sur **S3**
- Accès via URL

---

## Exposition des URLs

### DNS
- Gestion des noms de domaine via **Route 53**

### Enregistrements
- `www.ganatan.com`
  - Pointe vers l’EC2 front (Node SSR)
  - Type A ou CNAME
- `api.ganatan.com`
  - Pointe vers l’EC2 back-end (Spring)
  - Type A ou CNAME
- `assets.ganatan.com`
  - Pointe vers S3
  - Type CNAME

---

## Synthèse
- Back-end Spring → EC2
- Front-end Angular SSR (Node) → EC2
- Fichiers (doc, XML, TXT) → S3
- DNS → Route 53
