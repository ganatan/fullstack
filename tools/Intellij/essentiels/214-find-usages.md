# Find Usages

Find Usages affiche tous les endroits où une classe, méthode ou variable est utilisée.
C'est essentiel avant de modifier ou supprimer du code.

## Utilisation

Positionner le curseur sur un symbole.

```text
Alt + F7
```

## Usages rapides

```text
Ctrl + Alt + F7
```

## Exemple

```java
PersonService
```

Find Usages peut montrer :

```text
constructeurs
appels de méthodes
imports
tests
héritages
```

Avant un refactoring important, vérifier les usages évite de casser des appels existants.
