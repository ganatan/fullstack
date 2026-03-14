# 001-maven.md — Installation Maven (Windows) + compatibilité Java + commandes

## Installation Maven

- Télécharger Maven : https://maven.apache.org/download.cgi
- Archive : `apache-maven-3.9.11-bin.zip`
- Décompresser dans :
  - `D:\hal\apache-maven-3.9.11\`

## Archives

- archive.apache.org/dist/maven/maven-3/3.0.3/binaries/
- archive.apache.org/dist/maven/maven-3/3.5.4/binaries/
- archive.apache.org/dist/maven/maven-3/3.9.8/binaries/

# Ajouter Maven au PATH (Windows) — Utilisateur (recommandé)

## Objectif
Ajouter Maven au `PATH` **utilisateur** pour pouvoir exécuter `mvn` depuis n’importe quel terminal.

## Étapes

1. Ouvrir **Variables d’environnement**
   - Menu Démarrer → taper **variables d’environnement**
   - Ouvrir : **Modifier les variables d’environnement système**
   - Cliquer : **Variables d’environnement…**

2. Option A — **PATH utilisateur** (recommandé)
   - Dans **Variables utilisateur pour <toi>**
   - Sélectionner **Path**
   - Cliquer **Modifier**
   - Cliquer **Nouveau**
   - Coller :
     - `D:\hal\apache-maven-3.9.11\bin`
   - Valider :
     - **OK** → **OK** → **OK**

3. Appliquer
   - Fermer tous les terminaux (CMD/PowerShell/VSCode)
   - Rouvrir un terminal

4. Tester
   - PowerShell :
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

