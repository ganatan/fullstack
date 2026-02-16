# Maven properties – exemple simple

```xml
<properties>
  <java.version>21</java.version>
  <checkstyle.version>11.0.1</checkstyle.version>
</properties>
```

Utilisation :

```xml
<plugin>
  <artifactId>maven-checkstyle-plugin</artifactId>
  <version>${checkstyle.version}</version>
</plugin>
```

Principe :
- une valeur définie une fois
- réutilisée avec ${nom}
- modification centralisée
