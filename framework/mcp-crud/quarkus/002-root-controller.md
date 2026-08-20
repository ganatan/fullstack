# RootController

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

---

## Refactor

Quarkus ne nécessite pas de classe principale équivalente à :

```text
StarterApplication
```

Le démarrage de l’application est géré directement par Quarkus.

### Ressource générée

Supprimer :

```text
src/main/java/com/ganatan/starter/GreetingResource.java
```

### Test généré

Supprimer ou renommer :

```text
src/test/java/com/ganatan/starter/GreetingResourceTest.java
```

en :

```text
src/test/java/com/ganatan/starter/api/root/RootControllerTest.java
```

---

## Implémentation

### Classe

```text
com.ganatan.starter.api.root.RootController
```

### Chemin

```text
src/main/java/com/ganatan/starter/api/root/RootController.java
```

### Code

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
@SuppressWarnings("unused")
public class RootController {

  public record ApiInfo(String application, String status, String java) {}

  @GET
  public Map<String, Object> root() {
    return Map.of(
      "application", "quarkus-starter",
      "status", "running",
      "java", System.getProperty("java.version")
    );
  }

  @GET
  @Path("/info")
  public ApiInfo rootWithRecord() {
    return new ApiInfo(
      "quarkus-starter",
      "running",
      System.getProperty("java.version")
    );
  }

  @GET
  @Path("/status")
  public Map<String, Object> rootWithHashMap() {
    Map<String, Object> response = new HashMap<>();
    response.put("application", "quarkus-starter");
    response.put("status", "running");
    response.put("java", System.getProperty("java.version"));
    return response;
  }

}
```

---

## Tests

### Classe

```text
com.ganatan.starter.api.root.RootControllerTest
```

### Chemin

```text
src/test/java/com/ganatan/starter/api/root/RootControllerTest.java
```

### Code

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
      .body("application", is("quarkus-starter"))
      .body("status", is("running"));
  }

}
```

---

## Configuration Maven

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

Vérifier que l’extension JSON est présente :

```xml
<dependency>
  <groupId>io.quarkus</groupId>
  <artifactId>quarkus-rest-jackson</artifactId>
</dependency>
```

---

## Build et tests

### Windows

```powershell
.\mvnw.cmd clean install
```

### Linux

```bash
./mvnw clean install
```

L’application exécutable est générée dans :

```text
target/quarkus-app/
```

Fichier de lancement :

```text
target/quarkus-app/quarkus-run.jar
```

Le dossier complet suivant doit être conservé :

```text
target/quarkus-app/
```

---

## Run

### Exécution via Maven sous Windows

```powershell
.\mvnw.cmd quarkus:dev
```

### Exécution via Maven sous Linux

```bash
./mvnw quarkus:dev
```

### Exécution via Java

Compiler préalablement l’application :

```powershell
.\mvnw.cmd clean package
```

Puis lancer :

```bash
java -jar target/quarkus-app/quarkus-run.jar
```

---

## Run avec IntelliJ IDEA

Ouvrir :

```text
Run
Edit Configurations
```

Ajouter une configuration :

```text
Maven
```

Configurer les propriétés suivantes :

```text
Name              : Quarkus Dev
Command line      : quarkus:dev
Working directory : $ProjectFileDir$
Profiles          :
```

Le champ `Profiles` reste vide.

Cliquer sur :

```text
Apply
OK
```

Sélectionner ensuite :

```text
Quarkus Dev
```

Puis cliquer sur :

```text
Run ▶
```

---

## Accès

### Root

```text
http://localhost:3000/
```

### Info

```text
http://localhost:3000/info
```

### Status

```text
http://localhost:3000/status
```

---

## Résultat

Appel via navigateur ou curl :

```text
http://localhost:3000/
```

Réponse JSON :

```json
{
  "application": "quarkus-starter",
  "status": "running",
  "java": "25.0.x"
}
```

---

## Test avec curl

### Root

```bash
curl http://localhost:3000/
```

### Info

```bash
curl http://localhost:3000/info
```

### Status

```bash
curl http://localhost:3000/status
```

---

## 📦 Commandes Maven usuelles

### Nettoyage

```powershell
.\mvnw.cmd clean
```

### Compilation

```powershell
.\mvnw.cmd compile
```

### Tests

```powershell
.\mvnw.cmd test
```

### Packaging

```powershell
.\mvnw.cmd package
```

### Installation dans le repository Maven local

```powershell
.\mvnw.cmd install
```

### Nettoyage, tests et installation

```powershell
.\mvnw.cmd clean install
```

### Affichage des dépendances

```powershell
.\mvnw.cmd dependency:tree
```

### Affichage des mises à jour des dépendances

```powershell
.\mvnw.cmd versions:display-dependency-updates
```

### Affichage des mises à jour des plugins

```powershell
.\mvnw.cmd versions:display-plugin-updates
```

### Lancement en mode développement

```powershell
.\mvnw.cmd quarkus:dev
```

### Lancement de la version compilée

```bash
java -jar target/quarkus-app/quarkus-run.jar
```