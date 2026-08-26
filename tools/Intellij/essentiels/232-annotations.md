# Annotations

IntelliJ analyse les annotations Java et peut adapter inspections, génération de code et navigation.
Certaines annotations nécessitent un traitement spécifique.

## Exemple

```java
@Override
public String toString() {
  return "Person";
}
```

## Frameworks

```java
@Entity
@Service
@RestController
@Path
```

## Annotation Processing

Pour Lombok ou certains générateurs :

```text
Settings
→ Build, Execution, Deployment
→ Compiler
→ Annotation Processors
```

Activer si nécessaire :

```text
Enable annotation processing
```

Une annotation peut être comprise par IntelliJ, le compilateur ou un framework à l'exécution.
