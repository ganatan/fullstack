# Passer `MovieDTO` en version Lombok

## Classe actuelle

```java
package com.ganatan.starter.test;

public class MovieDTO {
    private String name;

    public MovieDTO(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

## Version Lombok avec `@Data`, `@Builder`, constructeur vide et constructeur complet

```java
package com.ganatan.starter.test;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieDTO {
    private String name;
}
```

## Ce que Lombok génère ici

- `@Data` :
  - getter
  - setter
  - `toString()`
  - `equals()`
  - `hashCode()`
- `@Builder` :
  - création avec builder
- `@NoArgsConstructor` :
  - constructeur vide
- `@AllArgsConstructor` :
  - constructeur avec tous les champs

## Exemple d'utilisation

### constructeur classique

```java
MovieDTO movie = new MovieDTO("Aliens");
```

### setter

```java
MovieDTO movie = new MovieDTO();
movie.setName("Aliens");
```

### builder

```java
MovieDTO movie = MovieDTO.builder()
    .name("Aliens")
    .build();
```

## Dépendance Maven

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

## Remarque

Pour que Lombok fonctionne bien dans IntelliJ :

- installer le plugin Lombok si besoin
- activer l’annotation processing

## Résumé

Version courte et complète :

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieDTO
```