# application-yaml.md

# application.yml — configuration essentielle Spring Boot

## Exemple minimal

```yaml
server:
  port: 3000

spring:
  application:
    name: springboot-starter
  profiles:
    active: dev
```

Configuration minimale d’une application Spring Boot :
- port HTTP
- nom de l’application
- profil actif

---

## Serveur

### Port HTTP

```yaml
server:
  port: 3000
```

Définit le port du serveur embarqué (Tomcat).

---

### Encodage

```yaml
server:
  servlet:
    encoding:
      charset: UTF-8
      enabled: true
      force: true
```

Garantit un encodage UTF-8 pour les requêtes et réponses HTTP.

---

### Gestion des erreurs

```yaml
server:
  error:
    include-stacktrace: never
```

Empêche l’exposition des stacktraces HTTP.

---

## Application

### Nom de l’application

```yaml
spring:
  application:
    name: springboot-starter
```

Utilisé pour :
- logs
- monitoring
- environnements distribués

---

### Profil actif

```yaml
spring:
  profiles:
    active: dev
```

Charge automatiquement :

application-dev.yml

---

### Bannière Spring Boot

```yaml
spring:
  main:
    banner-mode: off
```

Désactive la bannière au démarrage.

---

### Timezone JSON

```yaml
spring:
  jackson:
    time-zone: UTC
```

Standardise la sérialisation JSON.

---

## Logs

### Niveau global

```yaml
logging:
  level:
    root: INFO
```

### Logs applicatifs

```yaml
logging:
  level:
    com.ganatan: DEBUG
```

---

## Actuator (si présent)

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info
```

Expose les endpoints essentiels.
