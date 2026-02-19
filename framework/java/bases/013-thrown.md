# Throw – Comprendre le fonctionnement en Java pur

---

## Le code de base

```java
public class Main {

  public static void main(String[] args) {
    process(false);
    System.out.println("status : ok");
  }

  private static void process(boolean fail) {
    if (fail) {
      throw new RuntimeException("quelque chose s'est mal passé");
    }
  }
}
```

---

## Cas 1 – fail = false → pas de throw

```java
public static void main(String[] args) {
    process(false);                      // entre dans process, fail=false, rien ne se passe
    System.out.println("status : ok");   // ← cette ligne est exécutée
}
```

Résultat :
```
status : ok
```

---

## Cas 2 – fail = true → throw sans try/catch

```java
public static void main(String[] args) {
    process(true);                       // entre dans process, fail=true → throw
    System.out.println("status : ok");   // ← cette ligne n'est JAMAIS exécutée
}
```

Résultat :
```
Exception in thread "main" java.lang.RuntimeException: quelque chose s'est mal passé
    at Main.process(Main.java:10)
    at Main.main(Main.java:4)
```

Le programme s'arrête brutalement. Tout ce qui est après `process(true)` est ignoré.

---

## Cas 3 – fail = true → throw avec try/catch

```java
public static void main(String[] args) {
    try {
      process(true);                         // throw déclenché ici
      System.out.println("status : ok");     // ← ignoré, on saute directement au catch
    } catch (RuntimeException e) {
      System.out.println("status : error");  // ← on atterrit ici
      System.out.println("message : " + e.getMessage());
    }
    System.out.println("programme continue"); // ← exécuté car le catch a géré l'erreur
}
```

Résultat :
```
status : error
message : quelque chose s'est mal passé
programme continue
```

---

## Ce qui se passe ligne par ligne

```
process(true) appelé
  → fail = true
  → throw new RuntimeException("quelque chose s'est mal passé")
  → process() s'arrête immédiatement
  → l'exception remonte vers main()
  → main() est dans un try/catch → le catch attrape l'exception
  → System.out.println("status : error") exécuté
  → System.out.println("programme continue") exécuté
```

Sans try/catch :
```
process(true) appelé
  → fail = true
  → throw new RuntimeException("quelque chose s'est mal passé")
  → process() s'arrête immédiatement
  → l'exception remonte vers main()
  → main() n'a pas de try/catch → personne n'attrape l'exception
  → la JVM affiche l'erreur et stoppe le programme
```

---

## Les 3 cas en un seul programme

```java
public class Main {

  public static void main(String[] args) {

    System.out.println("--- cas 1 : pas de throw ---");
    process(false);
    System.out.println("status : ok");

    System.out.println("--- cas 2 : throw avec try/catch ---");
    try {
      process(true);
      System.out.println("status : ok");     // jamais exécuté
    } catch (RuntimeException e) {
      System.out.println("status : error");
      System.out.println("message : " + e.getMessage());
    }

    System.out.println("--- fin du programme ---");
  }

  private static void process(boolean fail) {
    if (fail) {
      throw new RuntimeException("quelque chose s'est mal passé");
    }
  }
}
```

Résultat :
```
--- cas 1 : pas de throw ---
status : ok
--- cas 2 : throw avec try/catch ---
status : error
message : quelque chose s'est mal passé
--- fin du programme ---
```

---

## Résumé

| Situation | Résultat |
|---|---|
| `fail=false` | le code continue normalement |
| `fail=true` sans `try/catch` | programme crash, message d'erreur JVM |
| `fail=true` avec `try/catch` | l'erreur est attrapée, le programme continue |

`throw` sans `catch` = crash. `throw` avec `catch` = erreur contrôlée.
