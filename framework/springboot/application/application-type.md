# application-type.md

# application.properties vs application.yml — Spring Boot

## Historique
- Spring Framework utilisait historiquement des fichiers `.properties`.
- Spring Boot (2014) a conservé `.properties` comme format par défaut.
- Spring Boot a ensuite ajouté le support YAML (`.yml`) pour faciliter la configuration hiérarchique.
- YAML est devenu courant avec l’essor des microservices et de Kubernetes.
- Les deux formats sont officiellement supportés et équivalents.

---

## application.properties
Format clé-valeur simple.

Exemple :

```properties
server.port=8080
spring.application.name=media-api
spring.datasource.url=jdbc:postgresql://localhost:5432/backend_media
```

Caractéristiques :
- format historique Java
- simple à comprendre
- généré par Spring Initializr
- moins lisible quand la configuration grossit

---

## application.yml
Format hiérarchique basé sur YAML.

Exemple :

```yaml
server:
  port: 8080

spring:
  application:
    name: media-api
  datasource:
    url: jdbc:postgresql://localhost:5432/backend_media
    username: postgres
    password: postgres
```

Caractéristiques :
- configuration structurée
- lisibilité supérieure
- standard dans les architectures microservices
- très utilisé avec Kubernetes et GitOps

---

## Règle d’usage
- petit projet ou starter → application.properties
- application moderne ou microservices → application.yml
- ne jamais utiliser les deux en même temps

---

## Conclusion
application.properties = historique et simple
application.yml = moderne et structuré
Spring Boot supporte les deux sans différence fonctionnelle.
