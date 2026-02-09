# application-properties.md

# application.properties — configuration essentielle Spring Boot

## Exemple minimal

```properties
server.port=3000
spring.application.name=springboot-starter
spring.profiles.active=dev
```

Configuration minimale d’une application Spring Boot :
- port HTTP
- nom de l’application
- profil actif

---

## Serveur

### Port HTTP

```properties
server.port=3000
```

Définit le port du serveur embarqué (Tomcat).

---

### Encodage

```properties
server.servlet.encoding.charset=UTF-8
server.servlet.encoding.enabled=true
server.servlet.encoding.force=true
```

Garantit un encodage UTF-8 pour les requêtes et réponses HTTP.

---

### Gestion des erreurs

```properties
server.error.include-stacktrace=never
```

Empêche l’exposition des stacktraces HTTP.

---

## Application

### Nom de l’application

```properties
spring.application.name=springboot-starter
```

Utilisé pour :
- logs
- monitoring
- environnements distribués

---

### Profil actif

```properties
spring.profiles.active=dev
```

Charge automatiquement :

application-dev.properties

---

### Bannière Spring Boot

```properties
spring.main.banner-mode=off
```

Désactive la bannière au démarrage.

---

### Timezone JSON

```properties
spring.jackson.time-zone=UTC
```

Standardise la sérialisation JSON.

---

## Logs

### Niveau global

```properties
logging.level.root=INFO
```

### Logs applicatifs

```properties
logging.level.com.ganatan=DEBUG
```

---

## Actuator (si présent)

```properties
management.endpoints.web.exposure.include=health,info
```

Expose les endpoints essentiels.
