# Eclipse — Formatter Spring MVC (2 espaces, multi-lignes stables)

Cette documentation explique **comment configurer Eclipse** pour :
- utiliser **2 espaces** (jamais 4)
- empêcher le **recompactage automatique**
- conserver un **format multi-lignes lisible**
- adapté à **Spring MVC legacy / pédagogique**

---

## Objectif final

Obtenir systématiquement ce format :

```java
return Arrays.asList(
  new Person(1, "Christopher Nolan", "London"),
  new Person(2, "Quentin Tarantino", "Knoxville"),
  new Person(3, "Martin Scorsese", "New York"),
  new Person(4, "Steven Spielberg", "Cincinnati")
);
```

---

## Accès au formatter

```
Window → Preferences
  → Java → Code Style → Formatter
```

- Sélectionner le profil actif
- Cliquer sur **Edit…**

---

## 1. Line Wrapping (empêcher le compactage)

### Menu
```
Formatter → Line Wrapping
```

### Réglages globaux

- **Maximum line width** : `80`
- **Default indentation for wrapped lines** : `2`
- **Default indentation for array initializers** : `2`
- ❌ Décoche : `Prefer wrapping outer expressions (keep nested expression on one line)`
- (optionnel) ❌ `Never join already wrapped lines`

---

## 2. Function Calls → Arguments (clé du multi-ligne)

### Menu
```
Line Wrapping → Function Calls → Arguments
```

### Wrap policy
Sélectionner :
```
Wrap all elements, every element on a new line
```

### Force
- ✅ Activer **Force split**

Les autres entrées (Qualified invocations, Object allocation, etc.)
peuvent rester **par défaut**.

---

## 3. Indentation (résoudre définitivement le 4 espaces)

### Menu
```
Formatter → Indentation
```

### Réglages obligatoires

#### Indentation de base
- **Tab policy** : `Spaces only`
- **Indentation size** : `2`
- **Tab size** : `2`

#### Continuation indentation (CRITIQUE)
- **Continuation indentation** : `2`
- **Continuation indentation for array initializers** : `2`

➡️ Si l’un de ces champs est à `4`, Eclipse produira du `4`.

---

## 4. Appliquer et tester

1. **Apply**
2. **Apply and Close**
3. Dans un fichier Java :
   ```
   Ctrl + Shift + F
   ```

---

## 5. Solution de secours (localisée)

Pour empêcher totalement le formatter sur une zone :

```java
// @formatter:off
return Arrays.asList(
  new Person(1, "Christopher Nolan", "London"),
  new Person(2, "Quentin Tarantino", "Knoxville"),
  new Person(3, "Martin Scorsese", "New York"),
  new Person(4, "Steven Spielberg", "Cincinnati")
);
// @formatter:on
```

Très utilisé en **legacy réel**.

---

## Résumé express

- Largeur de ligne trop grande ⇒ compactage
- Wrap where necessary ⇒ instable
- Continuation indentation à 4 ⇒ indentation à 4
- **2 espaces partout = 4 champs à vérifier**
- Formatter bien réglé = code stable

---

## Recommandation finale

Pour un projet **Spring MVC pédagogique / legacy** :
- Formatter configuré
- 2 espaces
- Multi-lignes forcées
- Lisibilité maximale

Ce setup est **professionnel, reproductible et durable**.
