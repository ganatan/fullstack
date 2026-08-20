# springboot-starter

Application Spring Boot packagée au format **JAR**, avec **Checkstyle**, **tests unitaires**, **couverture de code** et **build Maven**.

---

## 📊 Mise à jour des dépendances

Vérifier les dépendances et plugins obsolètes :

```bash
mvn versions:display-dependency-updates
mvn versions:display-plugin-updates
```

---

## 🔧 Lint

Exécuter l’analyse statique du code Java avec **Checkstyle** :

```bash
mvn checkstyle:check
```

La commande échoue si le code ne respecte pas les règles définies dans `checkstyle.xml`.

---

## 🧪 Tests unitaires

Exécuter les tests unitaires :

```bash
mvn clean test
```

---

## 📈 Couverture de code

Générer le rapport de couverture **JaCoCo** :

```bash
mvn jacoco:report
```

Le rapport est disponible ici :

```text
target/site/jacoco/index.html
```

---

## 🏗️ Build

Compiler le projet, exécuter les tests et générer le fichier JAR :

```bash
mvn clean package
```

Artefact généré :

```text
target/springboot-starter-1.0.0.jar
```

---

## ✅ Vérification complète

Exécuter le cycle complet de vérification Maven :

```bash
mvn clean verify
```

Cette commande peut exécuter la compilation, les tests, Checkstyle, JaCoCo et les autres contrôles configurés dans le projet.

---

## 📦 Installation locale

Compiler, vérifier et installer l’artefact dans le repository Maven local :

```bash
mvn clean install
```

L’artefact est installé dans :

```text
~/.m2/repository
```

---

## 🚀 Exécution

Lancer l’application localement sur le port `8080` :

```bash
mvn spring-boot:run
```

Ou directement avec Java :

```bash
java -jar target/springboot-starter-1.0.0.jar
```

Application disponible à l’adresse :

```text
http://localhost:8080
```

---

## 📦 Commandes Maven courantes

```bash
mvn clean
mvn compile
mvn test
mvn package
mvn verify
mvn install
mvn checkstyle:check
mvn jacoco:report
mvn dependency:tree
mvn spring-boot:run
```
