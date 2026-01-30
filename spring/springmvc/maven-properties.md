# Maven Properties — documentation simple

## Objectif
Centraliser les versions et paramètres dans un `pom.xml` afin de :
- éviter la duplication
- faciliter les montées de version
- améliorer la lisibilité
- garantir la cohérence du projet

Ce mécanisme s’appelle **Maven Properties**.

---

## Principe

Une propriété Maven est définie dans la section `<properties>` :
```xml
<properties>
  <spring.version>7.0.3</spring.version>
</properties>
```

Elle est réutilisée partout avec la syntaxe :
```xml
${spring.version}
```

---

## Exemple complet basé sur un projet Spring MVC (Java 21)

### Définition des propriétés

```xml
<properties>
  <java.version>21</java.version>

  <spring.version>7.0.3</spring.version>
  <jackson.version>2.18.3</jackson.version>
  <tomcat.version>11.0.5</tomcat.version>
  <jakarta.servlet.version>6.1.0</jakarta.servlet.version>
  <junit.jupiter.version>5.10.0</junit.jupiter.version>
  <jacoco.version>0.8.10</jacoco.version>

  <maven.compiler.source>${java.version}</maven.compiler.source>
  <maven.compiler.target>${java.version}</maven.compiler.target>
  <maven.compiler.release>${java.version}</maven.compiler.release>
</properties>
```

---

## Utilisation dans les dépendances

```xml
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-webmvc</artifactId>
  <version>${spring.version}</version>
</dependency>
```

```xml
<dependency>
  <groupId>org.junit.jupiter</groupId>
  <artifactId>junit-jupiter</artifactId>
  <version>${junit.jupiter.version}</version>
  <scope>test</scope>
</dependency>
```

---

## Utilisation dans les plugins Maven

```xml
<plugin>
  <groupId>org.jacoco</groupId>
  <artifactId>jacoco-maven-plugin</artifactId>
  <version>${jacoco.version}</version>
</plugin>
```

---

## Bonnes pratiques

- Centraliser **toutes les versions** dans `<properties>`
- Nommer les propriétés de façon explicite (`spring.version`, `java.version`)
- Réutiliser `java.version` pour le compilateur
- Ne pas mélanger valeurs en dur et propriétés

---

## Ce que les Maven Properties ne font PAS

- Elles ne résolvent pas automatiquement les conflits de versions
- Elles ne remplacent pas un BOM (`dependencyManagement`)
- Elles ne chargent pas de dépendances

Elles servent uniquement à **déclarer et réutiliser des valeurs**.

---

## Résumé

- Concept : **Maven Properties**
- Portée : projet Maven
- Syntaxe : `${nom.propriete}`
- Usage : versions, ports, chemins, options de build
- Indispensable pour tout projet Maven sérieux
