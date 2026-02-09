# markdown-exemples-code.md

# Exemples de blocs de code en Markdown

Voici comment afficher du code directement copiable dans une documentation Markdown.

---

## application.properties

```properties
server.port=8080
spring.application.name=media-api
spring.datasource.url=jdbc:postgresql://localhost:5432/backend_media
```

---

## SQL

```sql
create table media (
  id bigserial primary key,
  name varchar(255) not null,
  release_date date not null
);
```

---

## Java

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

## application.yml

```yaml
server:
  port: 8080

spring:
  application:
    name: media-api
```
