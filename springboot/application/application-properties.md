# application-properties.md

# application.properties – essentiel Spring Boot

## Exemple minimal

```properties
server.port=3000
spring.application.name=springboot-starter
spring.profiles.active=dev
```

Cet exemple montre la configuration de base d’une application Spring Boot :
- port HTTP
- nom de l’application
- profil actif

---

## Port HTTP

server.port=3000

Définit le port du serveur embarqué (Tomcat).

---

## Nom de l’application

spring.application.name=springboot-starter

Utilisé pour les logs, le monitoring et les environnements distribués.

---

## Profil actif

spring.profiles.active=dev

Permet de charger :
application-dev.properties

---

## Encodage

server.servlet.encoding.charset=UTF-8
server.servlet.encoding.enabled=true
server.servlet.encoding.force=true

Garantit un encodage UTF-8 pour les requêtes et réponses HTTP.

---

## Logs (niveau global)

logging.level.root=INFO

---

## Logs applicatifs

logging.level.com.ganatan=DEBUG

---

## Désactivation bannière

spring.main.banner-mode=off

---

## Timezone JVM

spring.jackson.time-zone=UTC

---

## Actuator (si présent)

management.endpoints.web.exposure.include=health,info

---

## Désactiver stacktrace HTTP

server.error.include-stacktrace=never
