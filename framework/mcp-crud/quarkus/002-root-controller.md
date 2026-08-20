# RootController

Cette étape remplace la ressource d'exemple générée par Quarkus par un `RootController`.

L'application expose trois routes :

```text
GET /
GET /info
GET /status
```

Les réponses sont retournées au format JSON.

---

## ⚙️ Configuration Quarkus

### application.properties

Chemin :

```text
src/main/resources/application.properties
```

Configuration :

```properties
quarkus.application.name=quarkus-starter
quarkus.http.port=3000
```

L'application sera disponible sur :

```text
http://localhost:3000
```

---

# Refactor

Quarkus ne nécessite pas de classe principale équivalente à :

```text
StarterApplication
```

Le démarrage de l'application est directement géré par Quarkus.

---

## Ressource générée

Supprimer la ressource générée lors de l'initialisation :

```text
src/main/java/com/ganatan/starter/GreetingResource.java
```

La route :

```text
http://localhost:8080/hello
```

n'existera donc plus.

---

## Test généré

Supprimer le test :

```text
src/test/java/com/ganatan/starter/GreetingResourceTest.java
```

Un nouveau test sera créé ici :

```text
src/test/java/com/ganatan/starter/api/root/RootControllerTest.java
```

---

# Structure

La structure devient :

```text
quarkus-starter/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── ganatan/
│   │   │           └── starter/
│   │   │               └── api/
│   │   │                   └── root/
│   │   │                       └── RootController.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
│           └── com/
│               └── ganatan/
│                   └── starter/
│                       └── api/
│                           └── root/
│                               └── RootControllerTest.java
├── mvnw
├── mvnw.cmd
└── pom.xml
```

---

# Dépendance REST JSON

Le controller retourne des objets JSON.

Vérifier que l'extension suivante est présente dans :

```text
pom.xml
```

```xml
<dependency>
  <groupId>io.quarkus</groupId>
  <artifactId>quarkus-rest-jackson</artifactId>
</dependency>
```

Cette extension fournit :

```text
Quarkus REST
Jackson
conversion automatique Java → JSON
```

---

# Configuration Maven

Mettre à jour les métadonnées du projet dans :

```text
pom.xml
```

```xml
<groupId>com.ganatan.starter</groupId>
<artifactId>quarkus-starter</artifactId>
<version>1.0.0</version>
<name>quarkus-starter</name>
<description>Demo project for Quarkus</description>
```

---

# RootController

## Classe

```text
com.ganatan.starter.api.root.RootController
```

## Chemin

```text
src/main/java/com/ganatan/starter/api/root/RootController.java
```

## Code

```java
package com.ganatan.starter.api.root;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.HashMap;
import java.util.Map;

@Path("/")
@Produces(MediaType.APPLICATION_JSON)
public class RootController {

  public record ApiInfo(
      String application,
      String status,
      String java
  ) {
  }

  @GET
  public Map<String, Object> root() {

    return Map.of(
        "application",
        "quarkus-starter",
        "status",
        "running",
        "java",
        System.getProperty(
            "java.version"
        )
    );

  }

  @GET
  @Path("info")
  public ApiInfo rootWithRecord() {

    return new ApiInfo(
        "quarkus-starter",
        "running",
        System.getProperty(
            "java.version"
        )
    );

  }

  @GET
  @Path("status")
  public Map<String, Object> rootWithHashMap() {

    Map<String, Object> response =
        new HashMap<>();

    response.put(
        "application",
        "quarkus-starter"
    );

    response.put(
        "status",
        "running"
    );

    response.put(
        "java",
        System.getProperty(
            "java.version"
        )
    );

    return response;

  }

}
```

---

# Routes

Le controller expose :

```text
GET /
GET /info
GET /status
```

Base URL :

```text
http://localhost:3000
```

---

## GET /

URL :

```text
http://localhost:3000/
```

Réponse :

```json
{
  "application": "quarkus-starter",
  "status": "running",
  "java": "25.0.x"
}
```

---

## GET /info

URL :

```text
http://localhost:3000/info
```

Réponse :

```json
{
  "application": "quarkus-starter",
  "status": "running",
  "java": "25.0.x"
}
```

Cette route utilise :

```text
ApiInfo
```

défini sous forme de `record`.

---

## GET /status

URL :

```text
http://localhost:3000/status
```

Réponse :

```json
{
  "application": "quarkus-starter",
  "status": "running",
  "java": "25.0.x"
}
```

Cette route construit la réponse avec :

```text
HashMap
```

---

# Test

## Classe

```text
com.ganatan.starter.api.root.RootControllerTest
```

## Chemin

```text
src/test/java/com/ganatan/starter/api/root/RootControllerTest.java
```

## Code

```java
package com.ganatan.starter.api.root;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

@QuarkusTest
class RootControllerTest {

  @Test
  void shouldReturnApplicationInformation() {

    given()
        .when()
        .get("/")
        .then()
        .statusCode(200)
        .body(
            "application",
            is("quarkus-starter")
        )
        .body(
            "status",
            is("running")
        );

  }

}
```

---

# @QuarkusTest

L'annotation :

```java
@QuarkusTest
```

démarre l'environnement Quarkus nécessaire au test.

Le test réalise une véritable requête HTTP :

```text
GET /
```

et vérifie :

```text
status HTTP = 200
application = quarkus-starter
status = running
```

---

# Lancement en mode développement

Se placer dans le dossier contenant :

```text
pom.xml
```

---

## Avec Maven installé

```bash
mvn quarkus:dev
```

---

## Windows avec Maven Wrapper

```powershell
.\mvnw.cmd quarkus:dev
```

---

## Linux avec Maven Wrapper

```bash
./mvnw quarkus:dev
```

La différence est :

```text
mvn   → utilise Maven installé sur la machine
mvnw  → utilise le Maven Wrapper fourni avec le projet
```

Quarkus démarre en mode développement avec :

```text
Live Coding
```

Les modifications du code sont automatiquement détectées.

---

# Vérification dans le navigateur

Une fois l'application démarrée, tester :

```text
http://localhost:3000/
```

Puis :

```text
http://localhost:3000/info
```

et :

```text
http://localhost:3000/status
```

---

# Test avec curl

## Root

```bash
curl http://localhost:3000/
```

---

## Info

```bash
curl http://localhost:3000/info
```

---

## Status

```bash
curl http://localhost:3000/status
```

---

# Lancement avec IntelliJ IDEA

Ouvrir :

```text
Run
Edit Configurations
```

Cliquer sur :

```text
Add new run configuration...
```

Sélectionner :

```text
Maven
```

Configurer :

```text
Name              : Quarkus Dev
Command line      : quarkus:dev
Working directory : $ProjectFileDir$
Profiles          :
```

Le champ :

```text
Profiles
```

reste vide.

Cliquer sur :

```text
Apply
OK
```

Dans la barre supérieure d'IntelliJ, sélectionner :

```text
Quarkus Dev
```

Puis :

```text
Run ▶
```

Cette configuration exécute l'équivalent de :

```bash
mvn quarkus:dev
```

---

# Debug avec IntelliJ IDEA

Utiliser la même configuration :

```text
Quarkus Dev
```

Puis cliquer sur :

```text
Debug 🐞
```

Les breakpoints placés dans le code Java sont alors actifs.

---

# Tests

## Avec Maven

```bash
mvn test
```

---

## Windows avec Maven Wrapper

```powershell
.\mvnw.cmd test
```

---

## Linux avec Maven Wrapper

```bash
./mvnw test
```

Résultat attendu :

```text
Tests run: 1
Failures: 0
Errors: 0
BUILD SUCCESS
```

---

# Build

## Avec Maven

```bash
mvn clean package
```

---

## Windows avec Maven Wrapper

```powershell
.\mvnw.cmd clean package
```

---

## Linux avec Maven Wrapper

```bash
./mvnw clean package
```

Le build est généré dans :

```text
target/quarkus-app/
```

---

# Structure du build Quarkus

Le dossier contient notamment :

```text
target/quarkus-app/
├── app/
├── lib/
├── quarkus/
└── quarkus-run.jar
```

Contrairement à un JAR Spring Boot classique, le fichier :

```text
quarkus-run.jar
```

ne doit pas être utilisé seul.

Le dossier complet :

```text
target/quarkus-app/
```

doit être conservé.

---

# Exécution de la version compilée

Après :

```bash
mvn clean package
```

lancer :

```bash
java -jar target/quarkus-app/quarkus-run.jar
```

L'application écoute sur :

```text
http://localhost:3000
```

Tester :

```bash
curl http://localhost:3000/
```

---

# Installation Maven locale

Compiler, tester et installer l'artefact dans le repository Maven local :

```bash
mvn clean install
```

Avec Maven Wrapper sous Windows :

```powershell
.\mvnw.cmd clean install
```

Avec Maven Wrapper sous Linux :

```bash
./mvnw clean install
```

---

# Commandes Maven usuelles

## Nettoyage

```bash
mvn clean
```

---

## Compilation

```bash
mvn compile
```

---

## Tests

```bash
mvn test
```

---

## Packaging

```bash
mvn package
```

---

## Vérification

```bash
mvn verify
```

---

## Installation dans le repository Maven local

```bash
mvn install
```

---

## Nettoyage et packaging

```bash
mvn clean package
```

---

## Nettoyage, tests et installation

```bash
mvn clean install
```

---

## Affichage des dépendances

```bash
mvn dependency:tree
```

---

## Affichage des mises à jour des dépendances

```bash
mvn versions:display-dependency-updates
```

---

## Affichage des mises à jour des plugins

```bash
mvn versions:display-plugin-updates
```

---

## Lancement en mode développement

```bash
mvn quarkus:dev
```

---

## Lancement de la version compilée

```bash
java -jar target/quarkus-app/quarkus-run.jar
```

---

# Principes clés

* `@Path("/")` définit la route racine.
* `@GET` expose une route HTTP `GET`.
* `@Path("info")` expose la route `/info`.
* `@Path("status")` expose la route `/status`.
* `@Produces(MediaType.APPLICATION_JSON)` indique que les réponses sont en JSON.
* `Map` peut être automatiquement converti en JSON.
* Un `record` peut être automatiquement converti en JSON.
* `quarkus-rest-jackson` assure la sérialisation JSON.
* Quarkus ne nécessite pas de classe `main` pour cette application.
* `quarkus:dev` lance Quarkus en mode développement.
* Le mode développement active le Live Coding.
* `@QuarkusTest` permet de démarrer Quarkus pendant les tests.
* RestAssured permet de tester les endpoints HTTP.
* `mvn` utilise Maven installé sur la machine.
* `mvnw` utilise le Maven Wrapper du projet.
* Le port HTTP est configuré dans `application.properties`.
* Le build Quarkus est généré dans `target/quarkus-app/`.
* Le dossier complet `target/quarkus-app/` doit être conservé pour l'exécution.

---

# Architecture actuelle

```text
Client HTTP
    ↓
RootController
    ↓
Map / ApiInfo
    ↓
Jackson
    ↓
JSON
    ↓
Client HTTP
```

L'application possède maintenant :

```text
GET /
GET /info
GET /status
```

La prochaine étape pourra ajouter le premier CRUD :

```text
PersonController
```

avec :

```text
GET    /persons
GET    /persons/{id}
POST   /persons
PUT    /persons/{id}
DELETE /persons/{id}
```
