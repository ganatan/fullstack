# Lombok dans IntelliJ

## Plugin Lombok

Lombok ajoute du code automatiquement à la compilation : getters, setters, constructeurs, builder, etc.

Dans IntelliJ, il faut souvent installer le plugin Lombok pour éviter les fausses erreurs dans l’éditeur.

### Installation du plugin

- `File > Settings`
- `Plugins`
- rechercher `Lombok`
- cliquer sur `Install`
- redémarrer IntelliJ

## Annotation Processing

IntelliJ doit aussi autoriser le traitement des annotations, sinon Lombok ne génère rien correctement.

### Activation

- `File > Settings`
- `Build, Execution, Deployment`
- `Compiler`
- `Annotation Processors`
- cocher `Enable annotation processing`

## Résultat attendu

Après ça :

- IntelliJ reconnaît `@Data`, `@Builder`, `@Getter`, etc.
- les erreurs rouges disparaissent
- le projet compile correctement avec Maven ou Gradle