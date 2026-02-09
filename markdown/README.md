# markdown-essentials.md

# Markdown — essentiels pour la documentation technique

Objectif :
avoir un mémo simple pour écrire de la documentation technique lisible
avec du code SQL, Java et configuration Spring Boot.

---

## Titres

```
# Titre niveau 1
## Titre niveau 2
### Titre niveau 3
```

---

## Texte simple

Paragraphe normal.

**gras**  
*italique*  

---

## Listes

Liste simple :

- item 1
- item 2
- item 3

Liste numérotée :

1. étape 1
2. étape 2
3. étape 3

---

## Bloc de code

Syntaxe générale :

```
```langage
code
```
```

---

## Code SQL

```sql
create table media (
  id bigserial primary key,
  name varchar(255) not null,
  release_date date not null
);
```

---

## Code Java

```java
@RestController
@RequestMapping("/media")
public class MediaController {

  @GetMapping
  public String hello() {
    return "media";
  }
}
```

---

## application.properties

```properties
server.port=8080
spring.application.name=media-api
spring.datasource.url=jdbc:postgresql://localhost:5432/backend_media
```

---

## application.yml

```yaml
server:
  port: 8080

spring:
  application:
    name: media-api
```

---

## Lien

```
[Texte du lien](https://example.com)
```

Exemple :
[Spring Boot](https://spring.io/projects/spring-boot)

---

## Citation

```
> Ceci est une citation
```

> Ceci est une citation

---

## Ligne de séparation

```
---
```

---

## Bonnes pratiques

- un titre principal par fichier
- blocs de code avec langage
- phrases courtes
- sections courtes
- privilégier les exemples de code
