# 003-coverage – Tests et couverture de code

## 🎯 Objectif

Mettre en place les dépendances de test et la couverture de code afin de :
- valider le bon fonctionnement du socle technique
- mesurer la couverture des classes principales
- rester cohérent avec les conventions Spring Initializr

---

## 📦 Dépendances Maven

Ajouter ou vérifier les dépendances suivantes dans le `pom.xml` :

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
</dependency>
```

---

## 🧪 Plugin de couverture de code (JaCoCo)

Ajouter le plugin suivant dans la section `<plugins>` du `pom.xml` :

```xml
<plugin>
  <groupId>org.jacoco</groupId>
  <artifactId>jacoco-maven-plugin</artifactId>
  <version>0.8.14</version>
  <executions>
    <execution>
      <goals>
        <goal>prepare-agent</goal>
      </goals>
    </execution>
    <execution>
      <id>report</id>
      <phase>test</phase>
      <goals>
        <goal>report</goal>
      </goals>
    </execution>
  </executions>
</plugin>
```

---

## 📁 Structure des tests

Conformément aux conventions Spring Initializr, les classes de test sont nommées au pluriel.

```
src/test/java
└── com.ganatan.starter.api
    ├── grouppurchase
    │   ├── GroupPurchaseControllerTests.java
    │   └── GroupPurchaseTests.java
    └── root
        └── RootControllerTests.java
```

---

## ✅ Tests implémentés

### GroupPurchaseControllerTests

Objectif :
- vérifier que le controller retourne une collection valide
- s’assurer que les données de bootstrap sont présentes

```java
@Test
void getItemsReturnsGroupPurchases() {
  GroupPurchaseController controller = new GroupPurchaseController();
  Collection<GroupPurchase> result = controller.getItems();

  assertNotNull(result);
  assertFalse(result.isEmpty());
  assertEquals(4, result.size());
}
```

---

### GroupPurchaseTests

Objectif :
- valider le constructeur
- vérifier l’intégrité des données du modèle

```java
@Test
void constructor_setsIdAndName() {
  GroupPurchase groupPurchase = new GroupPurchase(1L, "Computer");

  assertEquals(1L, groupPurchase.getId());
  assertEquals("Computer", groupPurchase.getName());
}
```

---

### RootControllerTests

Objectif :
- vérifier la réponse de l’endpoint racine
- valider les informations techniques retournées

```java
@Test
void rootReturnsApplicationInfo() {
  RootController controller = new RootController();
  Map<String, Object> result = controller.root();

  assertNotNull(result);
  assertEquals("springboot-starter", result.get("application"));
  assertTrue(result.containsKey("java"));
}
```

---

## ▶️ Exécution des tests et génération du rapport

```bash
mvn clean test
```

---

## 📊 Rapport de couverture

Après l’exécution des tests, le rapport JaCoCo est généré à l’emplacement suivant :

```
target/site/jacoco/index.html
```

---

## ✅ Résultat attendu

- Les tests passent sans erreur
- Les classes de test respectent les conventions Spring Initializr
- La couverture de code est générée
- Le socle technique est validé avant l’implémentation du MVP
