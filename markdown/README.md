# markdown-cheatsheet.md

# Markdown — afficher du code (cheatsheet)

Objectif :
comprendre comment écrire du Markdown pour afficher du code copiable
dans la documentation technique.

---

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
