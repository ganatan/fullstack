# Lombok — Documentation succincte

## Exemple simple avec `@Data`

```java
package com.ganatan.starter.continents;

import lombok.Data;

@Data
public class Continent {
  private int id;
  private String name;
}
```

---

## Lombok

- Lombok est une **bibliothèque Java** qui génère du code à la compilation.
- Elle réduit le **code boilerplate** (getters, setters, etc.).
- Le code généré **n’apparaît pas dans les sources**, mais existe dans le bytecode.
- Lombok fonctionne via des **annotations**.

---

## `@Data`

`@Data` est une annotation Lombok **composite**.

Elle regroupe automatiquement :

- `@Getter` sur tous les champs
- `@Setter` sur tous les champs non `final`
- `@ToString`
- `@EqualsAndHashCode`
- `@RequiredArgsConstructor`

---

## Équivalence conceptuelle

Le code suivant :

```java
@Data
public class Continent {
  private int id;
  private String name;
}
```

est équivalent conceptuellement à :

```java
public class Continent {

  private int id;
  private String name;

  public int getId() { return id; }
  public void setId(int id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  @Override
  public String toString() { ... }

  @Override
  public boolean equals(Object o) { ... }

  @Override
  public int hashCode() { ... }
}
```

---

## Classe `Continent`

- Classe **POJO**
- Sans logique métier
- Sert de :
  - modèle
  - DTO
  - projection simple

Les champs :

```java
private int id;
private String name;
```

- sont encapsulés
- accessibles via getters/setters générés
- respectent les conventions JavaBeans

---

## Avantages

- Réduction massive du code répétitif
- Fichiers courts et lisibles
- Évolution rapide du modèle
- Aucune surcharge runtime

---

## Points d’attention

- Lombok agit **à la compilation**
- Requiert :
  - dépendance Lombok
  - plugin Lombok dans l’IDE
- Le code généré n’est pas visible dans le fichier source
- À éviter pour :
  - API publiques de librairies
  - projets nécessitant un contrôle strict du bytecode

---

## Résumé

- Lombok génère du code boilerplate automatiquement
- `@Data` fournit getters, setters, `toString`, `equals`, `hashCode`
- Les classes restent des POJO simples
- Usage idéal pour modèles et DTO
