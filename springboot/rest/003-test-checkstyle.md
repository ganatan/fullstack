# Quality setup — JaCoCo + Checkstyle (Spring Boot / Maven)

Cette documentation décrit **pas à pas**, de façon **essentielle**, comment ajouter :
- le **coverage avec JaCoCo**
- le **contrôle de style avec Checkstyle**

dans une application Spring Boot Maven.

---

## 0) Pré-requis

Vérifier Maven :

```bash
mvn -v
```

---

## 1) Ajouter le coverage (JaCoCo)

### 1.1 Modifier le pom.xml

  Veiller à la version pour Java 25
  Exclure **/tools/**

Ajouter le plugin suivant dans :

```xml
<build>
  <plugins>
    ...
  </plugins>
</build>
```

```xml
<plugin>
  <groupId>org.jacoco</groupId>
  <artifactId>jacoco-maven-plugin</artifactId>
  <version>0.8.14</version>
	<configuration>
		<excludes>
		  <exclude>**/tools/**</exclude>
	  </excludes>
  </configuration>
  <executions>
    <execution>
      <id>prepare-agent</id>
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

### 1.2 Générer le rapport de coverage

```bash
mvn clean test
```

---

### 1.3 Consulter le rapport

```text
target/site/jacoco/index.html
```

---

## 2) Ajouter Checkstyle

### 2.1 Créer la configuration

Créer le fichier :

```text
config/checkstyle/checkstyle.xml
```

Contenu minimal :

```xml
<?xml version="1.0"?>
<!DOCTYPE module PUBLIC
  "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
  "https://checkstyle.org/dtds/configuration_1_3.dtd">

<module name="Checker">
  <module name="TreeWalker">
    <module name="AvoidStarImport"/>
    <module name="UnusedImports"/>
    <module name="RedundantImport"/>
    <module name="NeedBraces"/>
  </module>
</module>
```

---

### 2.2 Modifier le pom.xml

Ajouter le plugin Checkstyle dans `<build><plugins>` :

```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-checkstyle-plugin</artifactId>
  <version>3.6.0</version>
  <configuration>
    <configLocation>config/checkstyle/checkstyle.xml</configLocation>
    <encoding>UTF-8</encoding>
    <consoleOutput>true</consoleOutput>
    <failsOnError>true</failsOnError>
  </configuration>
  <executions>
    <execution>
      <id>checkstyle</id>
      <phase>verify</phase>
      <goals>
        <goal>check</goal>
      </goals>
    </execution>
  </executions>
</plugin>
```

---

### 2.3 Lancer Checkstyle

```bash
mvn verify
```

---

## 3) Commande finale à retenir

```bash
mvn clean install
```

Cette commande :
- exécute les tests
- génère le rapport JaCoCo
- applique Checkstyle
- échoue si une règle est violée

---

## 4) Fichiers ajoutés au projet

```text
config/
└── checkstyle/
    └── checkstyle.xml
pom.xml
```

---

## Résumé

- JaCoCo : mesure du coverage
- Checkstyle : qualité du code
- `mvn clean install` = validation complète du projet
