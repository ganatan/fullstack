# application.properties – essentiel Spring Boot

  ## Port HTTP

  server.port=3000

  ## Nom de l’application

  spring.application.name=springboot-starter

  ## Profil actif

  spring.profiles.active=dev

  ## Encodage

  server.servlet.encoding.charset=UTF-8
  server.servlet.encoding.enabled=true
  server.servlet.encoding.force=true

  ## Logs (niveau global)

  logging.level.root=INFO

  ## Logs applicatifs

  logging.level.com.ganatan=DEBUG

  ## Désactivation bannière

  spring.main.banner-mode=off

  ## Timezone JVM

  spring.jackson.time-zone=UTC

  ## Actuator (si présent)

  management.endpoints.web.exposure.include=health,info

  ## Désactiver stacktrace HTTP

  server.error.include-stacktrace=never
