# thrown – Java (exceptions)

---

## Définition

`thrown` **n’est pas un mot-clé Java**.

Le terme **thrown** est utilisé dans la documentation et le vocabulaire Java pour désigner une **exception qui a été levée** (passé de l’état normal à l’état exceptionnel).

Le mot-clé réel en Java est **`throw`**.

---

## Cycle de vie d’une exception

1. Une exception est **créée**
2. Elle est **levée** (`throw`)
3. Elle est **propagée**
4. Elle est **attrapée** (`catch`) ou remonte jusqu’à la JVM

Quand on dit *“the exception is thrown”*, cela signifie :
→ l’instruction `throw` a été exécutée.

---

## Mot-clé réel : throw

```java
throw new IllegalArgumentException("invalid value");
```

- `throw` lève explicitement une exception
- arrête immédiatement l’exécution du flux courant
- nécessite une instance de `Throwable`

---

## thrown vs throw vs throws

### throw
Mot-clé Java  
Utilisé **dans le code** pour lever une exception.

```java
throw new RuntimeException("error");
```

---

### throws
Mot-clé Java  
Utilisé **dans la signature d’une méthode**.

```java
public void readFile() throws IOException {
}
```

Indique que la méthode **peut propager** une exception.

---

### thrown
Terme conceptuel (documentation / langage naturel)

- jamais écrit dans le code
- signifie : *l’exception a été levée*
- utilisé dans :
  - Javadoc
  - documentation
  - messages d’erreur
  - entretiens techniques

---

## Exemple complet

```java
public void divide(int a, int b) {
  if (b == 0) {
    throw new ArithmeticException("division by zero");
  }
  int result = a / b;
}
```

- `ArithmeticException` est **thrown**
- la méthode ne la capture pas
- elle remonte à l’appelant

---

## Checked vs Unchecked (lien avec thrown)

### Checked Exception
- doit être déclarée avec `throws`
- ou capturée avec `try/catch`

```java
public void load() throws IOException {
  throw new IOException();
}
```

---

### Unchecked Exception
- hérite de `RuntimeException`
- peut être thrown sans déclaration

```java
throw new IllegalStateException();
```

---

## Règles importantes

- on ne peut `throw` que des `Throwable`
- une exception thrown interrompt le flux
- une méthode peut propager plusieurs exceptions
- une exception non capturée termine le thread

---

## Résumé

- ❌ `thrown` n’est pas un mot-clé Java
- ✅ `throw` lève une exception
- ✅ `throws` déclare une propagation
- `thrown` = état logique d’une exception levée
- terme fondamental en lecture de stacktrace et doc

