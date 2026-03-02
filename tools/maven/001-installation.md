# 001-maven.md — Installation Maven (Windows) + compatibilité Java + commandes

## Installation Maven

- Télécharger Maven : https://maven.apache.org/download.cgi
- Archive : `apache-maven-3.9.11-bin.zip`
- Décompresser dans :
  - `D:\hal\apache-maven-3.9.11\`
- Ajouter au `PATH` (Variables d’environnement Windows) :
  - `D:\hal\apache-maven-3.9.11\bin`
- Tester :
  - `mvn -version`

---

## Compatibilité Maven / Java

| Java | Maven minimum | Plugin compiler minimum |
|---:|---:|---:|
| 8  | 3.0   | 3.3  |
| 11 | 3.6   | 3.8  |
| 17 | 3.8.4 | 3.10 |
| 21 | 3.9.5 | 3.12 |
| 22 | 3.9.6 | 3.13 |
| 23 | 3.9.6 | 3.13 |
| 24 | 3.9.7 | 3.13 |
| 25 | 3.9.9 | 3.13 |

---

## Commandes Maven (mémo)

| Commande | Description |
|---|---|
| `mvn clean` | Supprime `target/` et nettoie les fichiers générés |
| `mvn compile` | Compile les sources Java |
| `mvn test` | Compile et exécute les tests unitaires |
| `mvn package` | Crée le livrable (`.jar`/`.war`) dans `target/` |
| `mvn install` | Installe le livrable dans le dépôt local `~/.m2/repository` |
| `mvn deploy` | Déploie vers un dépôt distant (Nexus, Artifactory…) |
| `mvn verify` | Vérifie l’intégrité (tests, intégration, packaging) |
| `mvn site` | Génère la documentation du projet (Maven Site) |
| `mvn clean install -U` | Force la mise à jour des dépendances |
| `mvn spring-boot:run` | Démarre une application Spring Boot |

