# Maven — commandes essentielles, options CLI et tests

## Limite importante

Une liste **vraiment exhaustive de toutes les commandes Maven possibles** n’existe pas dans un seul document, car Maven est un moteur de plugins : chaque plugin ajoute ses propres goals. En revanche, on peut être exhaustif sur :
- les **lifecycles**
- les **phases**
- les **options CLI**
- les **goals essentiels des plugins cœur**, surtout `help`, `dependency`, `surefire`, `failsafe`, `install`, `deploy`, `site` :contentReference[oaicite:0]{index=0}

---

## Syntaxe générale

```bash
mvn [options] [phase|goal] [phase|goal] ...
```

Exemples :

```bash
mvn clean install
mvn test
mvn help:effective-settings
mvn dependency:tree
```

Maven fonctionne avec 3 lifecycles intégrés :
- `default`
- `clean`
- `site` :contentReference[oaicite:1]{index=1}

---

## 1. Lifecycles et phases

## Lifecycle `clean`

```bash
mvn clean
```

Phases principales :

- `pre-clean`
- `clean`
- `post-clean` :contentReference[oaicite:2]{index=2}

---

## Lifecycle `default`

Phases classiques du build :

- `validate`
- `initialize`
- `generate-sources`
- `process-sources`
- `generate-resources`
- `process-resources`
- `compile`
- `process-classes`
- `generate-test-sources`
- `process-test-sources`
- `generate-test-resources`
- `process-test-resources`
- `test-compile`
- `process-test-classes`
- `test`
- `prepare-package`
- `package`
- `pre-integration-test`
- `integration-test`
- `post-integration-test`
- `verify`
- `install`
- `deploy` :contentReference[oaicite:3]{index=3}

Exemples :

```bash
mvn validate
mvn compile
mvn test
mvn package
mvn verify
mvn install
mvn deploy
```

---

## Lifecycle `site`

Phases principales :

- `pre-site`
- `site`
- `post-site`
- `site-deploy` :contentReference[oaicite:4]{index=4}

Exemples :

```bash
mvn site
mvn site-deploy
```

---

## 2. Commandes de build les plus utilisées

### Compiler

```bash
mvn compile
```

### Compiler les tests

```bash
mvn test-compile
```

### Lancer tous les tests

```bash
mvn test
```

### Créer le jar/war

```bash
mvn package
```

### Vérifier le projet

```bash
mvn verify
```

### Installer en local

```bash
mvn install
```

### Déployer sur dépôt distant

```bash
mvn deploy
```

### Nettoyer puis reconstruire

```bash
mvn clean install
```

---

## 3. Tests — tout tester ou un seul test

### Tous les tests

```bash
mvn test
mvn clean test
```

### Une seule classe de test

```bash
mvn -Dtest=UserServiceTest test
```

### Une seule méthode de test

```bash
mvn -Dtest=UserServiceTest#shouldReturnUser test
```

Pour les tests d’intégration avec Failsafe, Maven distingue généralement `test` et `integration-test` / `verify`. :contentReference[oaicite:5]{index=5}

Exemples :

```bash
mvn verify
mvn -DskipTests package
mvn -Dmaven.test.skip=true package
```

Différence utile :
- `-DskipTests` : compile les tests mais ne les exécute pas
- `-Dmaven.test.skip=true` : ne compile pas les tests et ne les exécute pas

---

## 4. Recharger / vérifier `settings.xml`

Maven lit `settings.xml` à chaque exécution.  
Il n’existe pas une commande “reload settings” séparée : il suffit de relancer Maven.

### Voir le settings effectif

```bash
mvn help:effective-settings
```

### Générer le settings effectif dans un fichier

```bash
mvn help:effective-settings -Doutput=effective-settings.xml
```

### Voir les profils actifs

```bash
mvn help:active-profiles
```

### Voir tous les profils disponibles

```bash
mvn help:all-profiles
```

### Voir le POM effectif

```bash
mvn help:effective-pom
```

### Générer le POM effectif dans un fichier

```bash
mvn help:effective-pom -Doutput=effective-pom.xml
```

Ces goals font partie du Maven Help Plugin officiel. :contentReference[oaicite:6]{index=6}

---

## 5. Tester que Maven utilise bien le bon `settings.xml`

### Utiliser le `settings.xml` par défaut utilisateur

Emplacement classique :

```text
%USERPROFILE%\.m2\settings.xml
```

### Forcer un autre fichier de settings

```bash
mvn -s D:\chemin\settings.xml help:effective-settings
```

### Mode debug complet

```bash
mvn -X help:effective-settings
```

### Mode debug sur un build

```bash
mvn -X clean compile
```

Le `settings.xml` configure notamment :
- `localRepository`
- `servers`
- `mirrors`
- `profiles`
- `activeProfiles` :contentReference[oaicite:7]{index=7}

---

## 6. Commandes Help Plugin

### Profils actifs

```bash
mvn help:active-profiles
```

### Tous les profils

```bash
mvn help:all-profiles
```

### Décrire un plugin

```bash
mvn help:describe -Dplugin=compiler
mvn help:describe -Dplugin=surefire
mvn help:describe -Dplugin=dependency
```

### Décrire un goal précis

```bash
mvn help:describe -Dplugin=surefire -Dgoal=test -Ddetail
mvn help:describe -Dplugin=compiler -Dgoal=compile -Ddetail
```

### Voir le POM effectif

```bash
mvn help:effective-pom
```

### Voir le settings effectif

```bash
mvn help:effective-settings
```

### Afficher les propriétés système

```bash
mvn help:system
```

### Évaluer une expression Maven

```bash
mvn help:evaluate -Dexpression=project.version -q -DforceStdout
mvn help:evaluate -Dexpression=settings.localRepository -q -DforceStdout
```

Les goals `help:*` sont documentés officiellement. :contentReference[oaicite:8]{index=8}

---

## 7. Commandes liées aux dépendances

### Télécharger explicitement une dépendance

```bash
mvn dependency:get -Dartifact=org.apache.commons:commons-lang3:3.14.0
```

### Voir l’arbre des dépendances

```bash
mvn dependency:tree
```

### Copier les dépendances

```bash
mvn dependency:copy-dependencies
```

### Analyser les dépendances utilisées / inutilisées

```bash
mvn dependency:analyze
```

### Purger le repository local pour certaines dépendances

```bash
mvn dependency:purge-local-repository
```

### Lister les dépendances

```bash
mvn dependency:list
```

---

## 8. Options CLI Maven essentielles

### Version Maven

```bash
mvn -v
mvn --version
```

### Mode debug

```bash
mvn -X
mvn --debug
```

### Mode erreurs détaillées

```bash
mvn -e
mvn --errors
```

### Mode silencieux

```bash
mvn -q
mvn --quiet
```

### Mode batch

```bash
mvn -B
mvn --batch-mode
```

### Forcer update des snapshots / metadata

```bash
mvn -U clean install
mvn --update-snapshots clean install
```

### Offline

```bash
mvn -o clean install
mvn --offline clean install
```

### Threads parallèles

```bash
mvn -T 1C clean install
mvn -T 4 clean install
```

### Forcer un `pom.xml` spécifique

```bash
mvn -f pom.xml clean install
mvn -f D:\projet\pom.xml test
```

### Forcer un `settings.xml`

```bash
mvn -s D:\config\settings.xml clean install
```

### Forcer un global settings

```bash
mvn -gs D:\config\global-settings.xml clean install
```

### Définir une propriété système Maven

```bash
mvn -DskipTests package
mvn -Denv=dev spring-boot:run
```

### Activer un profil

```bash
mvn -Pdev clean install
mvn -Pdev,local test
```

### Désactiver implicitement certains profils selon config projet
Le cas dépend des profils définis dans le `pom.xml` ou `settings.xml`. Les profils peuvent être activés explicitement, par OS, JDK, propriété, fichier, etc. :contentReference[oaicite:9]{index=9}

---

## 9. Répertoire local Maven

### Voir le dépôt local configuré

```bash
mvn help:evaluate -Dexpression=settings.localRepository -q -DforceStdout
```

### Utiliser un dépôt local temporaire

```bash
mvn -Dmaven.repo.local=D:\tmp\m2 clean install
```

Très utile pour tester proprement un nouveau `settings.xml`.

---

## 10. Commandes liées au POM

### Voir la version du projet

```bash
mvn help:evaluate -Dexpression=project.version -q -DforceStdout
```

### Voir le packaging

```bash
mvn help:evaluate -Dexpression=project.packaging -q -DforceStdout
```

### Voir l’artifactId

```bash
mvn help:evaluate -Dexpression=project.artifactId -q -DforceStdout
```

### Voir le groupId

```bash
mvn help:evaluate -Dexpression=project.groupId -q -DforceStdout
```

---

## 11. Commandes liées aux plugins

Maven est un framework de plugins. Un plugin s’exécute avec :

```bash
mvn prefix:goal
mvn groupId:artifactId:version:goal
```

Exemples :

```bash
mvn compiler:compile
mvn surefire:test
mvn dependency:tree
mvn site:site
```

Pour découvrir un plugin :

```bash
mvn help:describe -Dplugin=dependency -Ddetail
mvn help:describe -Dplugin=surefire -Ddetail
mvn help:describe -Dplugin=compiler -Ddetail
```

La résolution des préfixes de plugins est gérée par Maven. :contentReference[oaicite:10]{index=10}

---

## 12. Commandes de génération de site

```bash
mvn site
mvn site:site
mvn site:deploy
```

---

## 13. Commandes utiles pour diagnostic Artifactory / settings / credentials

### Vérifier le settings utilisé

```bash
mvn help:effective-settings
```

### Vérifier les profils actifs

```bash
mvn help:active-profiles
```

### Voir les logs détaillés de résolution

```bash
mvn -X dependency:tree
mvn -X test
mvn -X clean install
```

### Tester un téléchargement explicite

```bash
mvn -X dependency:get -Dartifact=org.apache.commons:commons-lang3:3.14.0
```

### Forcer un repository local vide

```bash
mvn -Dmaven.repo.local=D:\tmp\repo -X dependency:get -Dartifact=org.apache.commons:commons-lang3:3.14.0
```

---

## 14. Commandes de base à connaître par cœur

```bash
mvn -v
mvn clean
mvn compile
mvn test
mvn package
mvn verify
mvn install
mvn deploy
mvn clean install
mvn -U clean install
mvn -o clean install
mvn -X clean install
mvn help:effective-settings
mvn help:effective-pom
mvn help:active-profiles
mvn help:evaluate -Dexpression=settings.localRepository -q -DforceStdout
mvn dependency:tree
mvn dependency:get -Dartifact=org.apache.commons:commons-lang3:3.14.0
mvn -Dtest=NomClasseTest test
mvn -Dtest=NomClasseTest#nomMethode test
mvn -DskipTests package
mvn -Dmaven.test.skip=true package
mvn -Pdev clean install
mvn -s D:\config\settings.xml clean install
mvn -Dmaven.repo.local=D:\tmp\repo clean install
```

---

## 15. Résumé honnête

Tu peux être exhaustif sur :
- les **lifecycles**
- les **phases**
- les **options CLI**
- les **goals du Help Plugin**
- les commandes de base `dependency`, `test`, `install`, `deploy`

Tu ne peux pas être exhaustif sur **toutes les commandes Maven possibles**, car chaque plugin Maven ajoute ses propres goals. La source officielle pour explorer un plugin reste :
- la page des plugins Maven
- `mvn help:describe -Dplugin=... -Ddetail` :contentReference[oaicite:11]{index=11}