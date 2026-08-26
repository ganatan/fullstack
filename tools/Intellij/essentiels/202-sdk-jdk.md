# SDK et JDK

IntelliJ utilise un SDK pour compiler et exécuter le projet.
Pour Java, ce SDK correspond généralement à un JDK installé localement.

## Configuration

```text
File
→ Project Structure
→ Project
```

Vérifier :

```text
Project SDK
Project language level
```

## Ajouter un JDK

```text
File
→ Project Structure
→ SDKs
→ +
→ JDK
```

## Vérifier dans le terminal

```bash
java -version
javac -version
```

Le JDK IntelliJ et le JDK du terminal peuvent être différents.
