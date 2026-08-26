# Sécurité

Kafka peut sécuriser les communications, l'authentification et les autorisations.
En production, un cluster Kafka ne doit généralement pas être exposé sans contrôle d'accès.

## Trois niveaux

```text
TLS
  ↓
chiffrement

SASL
  ↓
authentification

ACL
  ↓
autorisation
```

## Exemple conceptuel

```text
Application
   ↓
TLS + SASL
   ↓
Kafka
   ↓
ACL
```

## Informations sensibles

Ne jamais stocker directement dans Git :

```text
mot de passe
clé privée
token
secret
```

Utiliser des variables d'environnement ou un gestionnaire de secrets.
