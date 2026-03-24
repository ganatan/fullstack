# Spring Boot avec fichiers de configuration dans `config-local`

## Objectif

Avoir :

- un `application.yml` standard dans `src/main/resources`
- un `application-dev.yml` dans `config-local`
- un `application-local.yml` dans `config-local`

et lancer l’application avec le profil voulu.

---

## Arborescence

```text
mon-projet/
  config-local/
    application-dev.yml
    application-local.yml
  src/
    main/
      resources/
        application.yml
  pom.xml
```

---

## Fichier principal

## `src/main/resources/application.yml`

```yaml
spring:
  application:
    name: demo
```

Ce fichier est toujours chargé par Spring Boot.

---

## Fichier `dev`

## `config-local/application-dev.yml`

```yaml
server:
  port: 8001
```

---

## Fichier `local`

## `config-local/application-local.yml`

```yaml
server:
  port: 8082
```

---

## Principe

Spring Boot charge automatiquement :

- `application.yml`
- puis `application-{profil}.yml` si un profil est actif

Mais ici les fichiers `application-dev.yml` et `application-local.yml` sont hors de `resources`.

Donc il faut dire à Spring Boot où les trouver avec :

```text
-Dspring.config.additional-location=./config-local/
```

---

## Lancer avec Maven

## Profil `dev`

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev -Dspring-boot.run.jvmArguments="-Dspring.config.additional-location=./config-local/"
```

## Profil `local`

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local -Dspring-boot.run.jvmArguments="-Dspring.config.additional-location=./config-local/"
```

---

## Lancer avec un jar

## Profil `dev`

```bash
java -Dspring.config.additional-location=./config-local/ -jar target/demo.jar --spring.profiles.active=dev
```

## Profil `local`

```bash
java -Dspring.config.additional-location=./config-local/ -jar target/demo.jar --spring.profiles.active=local
```

---

## IntelliJ

Aller dans :

```text
Run > Edit Configurations
```

Dans le champ `VM options` :

## pour `dev`

```text
-Dspring.config.additional-location=./config-local/ -Dspring.profiles.active=dev
```

## pour `local`

```text
-Dspring.config.additional-location=./config-local/ -Dspring.profiles.active=local
```

---

## Résultat

- profil `dev` → port `8001`
- profil `local` → port `8082`

---

## Vérification

Au démarrage, Spring Boot affiche le port utilisé dans les logs.

Exemple :

```text
Tomcat started on port 8001
```

ou

```text
Tomcat started on port 8082
```

---

## Variante possible

Tu peux aussi mettre des propriétés communes dans `application.yml` :

```yaml
spring:
  application:
    name: demo

server:
  servlet:
    context-path: /
```

et laisser seulement les différences de port dans les fichiers de profil.

---

## Important

`application-dev.yml` et `application-local.yml` doivent être nommés exactement comme ça :

```text
application-dev.yml
application-local.yml
```

car Spring Boot les associe au profil :

- `dev`
- `local`

---

## Résumé

- `application.yml` reste dans `src/main/resources`
- les fichiers par profil sont dans `config-local`
- il faut ajouter `-Dspring.config.additional-location=./config-local/`
- il faut activer le profil avec `dev` ou `local`

---

## Exemple minimal complet

### `src/main/resources/application.yml`

```yaml
spring:
  application:
    name: demo
```

### `config-local/application-dev.yml`

```yaml
server:
  port: 8001
```

### `config-local/application-local.yml`

```yaml
server:
  port: 8082
```

### lancement `dev`

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev -Dspring-boot.run.jvmArguments="-Dspring.config.additional-location=./config-local/"
```

### lancement `local`

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local -Dspring-boot.run.jvmArguments="-Dspring.config.additional-location=./config-local/"
```