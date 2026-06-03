# SecOps - Résumé Architecture Angular / Spring Boot / GCP

## Objectif

Sécuriser la plateforme à plusieurs niveaux :

- Réseau
- Authentification
- Autorisation
- Secrets
- Infrastructure
- CI/CD

---

# 1. TLS / HTTPS

Architecture :

```text
Internet
    |
Load Balancer GCP
    |
TLS / HTTPS
    |
Ingress
    |
Applications Kubernetes
```

Le Load Balancer :

- Termine le TLS
- Gère les certificats
- Chiffre les communications
- Peut intégrer un WAF
- Peut intégrer du Rate Limiting

---

## Certificats

### Option 1 - Wildcard

Un seul certificat :

```text
*.document-platform.com
```

Couvre :

```text
api.document-platform.com

admin.document-platform.com

view.document-platform.com

auth.document-platform.com
```

Solution la plus courante.

---

### Option 2 - Certificats individuels

```text
api.document-platform.com

admin.document-platform.com

auth.document-platform.com
```

Un certificat par domaine.

---

## Sur GCP

Très souvent :

```text
Google Managed Certificate
```

avec renouvellement automatique.

---

# 2. Authentification

Service dédié :

```text
api-auth
```

Technologies :

```text
Spring Security

JWT

BCrypt
```

---

# 3. JWT

Le JWT permet d'identifier l'utilisateur.

Contenu typique :

```json
{
  "sub": "danny",
  "roles": ["ADMIN"],
  "iat": 1748850000,
  "exp": 1748853600
}
```

Signification :

```text
sub = utilisateur

roles = rôles

iat = date de création

exp = date d'expiration
```

---

## Important

Le JWT ne contient jamais :

```text
Mot de passe
```

Jamais.

---

# 4. BCrypt

Objectif :

Ne jamais stocker les mots de passe en clair.

Flux :

```text
Mot de passe
      |
      v
BCrypt
      |
      v
Hash
      |
      v
Base de données
```

Exemple :

```text
$2a$10$AbCdEf...
```

Lors du login :

```text
Mot de passe saisi
        |
        v
BCrypt compare
        |
        v
OK / KO
```

Le mot de passe original n'est jamais relu.

---

# 5. Secrets

Les informations sensibles sont stockées dans :

```text
Google Secret Manager
```

Exemples :

```text
JWT_SECRET

DB_PASSWORD

RABBITMQ_PASSWORD

SMTP_PASSWORD

OPENAI_API_KEY

ANTHROPIC_API_KEY
```

---

## Flux

```text
Secret Manager
       |
       v
Kubernetes Secret
       |
       v
Spring Boot
```

Jamais dans :

```text
application.yml
```

ou

```text
Git
```

---

# 6. ConfigMaps

Pour les valeurs non sensibles.

Exemples :

```text
Ports

URLs

Timeouts

Feature Flags

Configuration RabbitMQ
```

Flux :

```text
ConfigMap
      |
      v
Spring Boot
```

---

# 7. Autorisation

Différence importante :

```text
Authentification
=
Qui es-tu ?
```

```text
Autorisation
=
As-tu le droit ?
```

Exemple :

```java
@PreAuthorize("hasRole('ADMIN')")
```

ou

```java
@PreAuthorize("hasAuthority('DOCUMENT_WRITE')")
```

---

# 8. Validation des entrées

Protection contre :

```text
Données invalides

Attaques simples

Erreurs utilisateur
```

Exemple :

```java
@NotBlank

@Size(max = 100)

@Valid
```

---

# 9. Audit et Journalisation

Tracer :

```text
Connexion

Déconnexion

Création document

Modification document

Suppression document
```

Objectif :

```text
Qui ?

Quand ?

Quoi ?
```

---

# 10. Sécurité Base de Données

Utiliser :

```text
Compte technique dédié
```

Exemple :

```text
user_document_api
```

et non :

```text
root
```

Principe :

```text
Least Privilege
```

Le minimum de droits nécessaires.

---

# 11. Sécurité Kubernetes

Utiliser :

```text
Namespaces

RBAC

Secrets

Network Policies
```

Objectif :

Limiter les accès entre applications.

---

# 12. Sécurité GitLab

Utiliser :

```text
Protected Branches

Protected Tags

Protected Variables
```

Exemples :

```text
JWT_SECRET

DB_PASSWORD

KUBECONFIG
```

Jamais stockés dans Git.

---

# 13. Scan de Sécurité

Contrôler :

```text
Bibliothèques

Containers

Vulnérabilités
```

Outils :

```text
OWASP Dependency Check

Trivy

Snyk

GitLab Security Scan
```

Exemples :

```text
Spring CVE

Jackson CVE

Log4Shell
```

---

# 14. Sécurité Docker

Bonnes pratiques :

```text
Images minimales

Utilisateur non root

Scan Trivy
```

Exemple :

```dockerfile
USER 1001
```

Éviter :

```dockerfile
root
```

---

# Vision globale

```text
Internet
    |
Load Balancer GCP
    |
TLS / HTTPS
    |
Ingress
    |
api-gateway
    |
api-auth
    |
JWT
    |
document-api
    |
MySQL

Secrets :
Google Secret Manager

Configuration :
ConfigMaps

Sécurité :
Spring Security
BCrypt
RBAC
Audit
Validation
Trivy
OWASP
```

---

# Réponse entretien

Nous sécurisons la plateforme avec HTTPS/TLS via le Load Balancer GCP et des certificats managés. L'authentification repose sur Spring Security et JWT. Les mots de passe sont hashés avec BCrypt et jamais stockés en clair. Les secrets applicatifs sont stockés dans Google Secret Manager puis injectés dans Kubernetes via des Secrets. Les configurations non sensibles utilisent des ConfigMaps. Les autorisations sont gérées via les rôles Spring Security et RBAC Kubernetes. Nous mettons également en place la validation des entrées, l'audit, les comptes techniques à privilèges minimaux, ainsi que le scan des dépendances et des images Docker avec OWASP et Trivy.