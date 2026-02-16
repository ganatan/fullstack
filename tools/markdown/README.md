# Markdown — afficher du code

Objectif :
comprendre comment écrire du Markdown pour afficher du code copiable
dans la documentation technique.



## Comandes bash

### Ce que tu écris dans le fichier .md

````md
## Commandes bash

```bash
curl -X POST "http://localhost:3000/kafka?topic=media-events&key=1" \
  -H "Content-Type: text/plain" \
  -d "hello"
```
````

### Ce que Markdown affiche

```bash
curl -X POST "http://localhost:3000/kafka?topic=media-events&key=1" \
  -H "Content-Type: text/plain" \
  -d "hello"
```

## application.properties

### Ce que tu écris dans le fichier .md

````md
## application.properties

```properties
server.port=8080
spring.application.name=media-api
spring.datasource.url=jdbc:postgresql://localhost:5432/backend_media
```
````

### Ce que Markdown affiche

```properties
server.port=8080
spring.application.name=media-api
spring.datasource.url=jdbc:postgresql://localhost:5432/backend_media
```

---

## application.yml

### Ce que tu écris dans le fichier .md

````md
## application.yml

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
````

### Ce que Markdown affiche

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

---

## SQL

### Ce que tu écris

````md
```sql
create table media (
  id bigserial primary key,
  name varchar(255) not null
);
```
````

### Ce qui s’affiche

```sql
create table media (
  id bigserial primary key,
  name varchar(255) not null
);
```

---

## Java

### Ce que tu écris

````md
```java
public class Media {}
```
````

### Ce qui s’affiche

```java
public class Media {}
```

---

## Règle à retenir

Pour afficher du code en Markdown :

```
```langage
code
```
```

Exemples de langages :
- sql
- java
- properties
- yaml
- json
- bash
