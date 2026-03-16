# Maven — commandes essentielles d’un projet

## Vérifier Maven

```bash
mvn -v
```

Affiche la version de Maven, Java et le chemin utilisé.

---

## Nettoyer le projet

```bash
mvn clean
```

Supprime le répertoire `target`.

---

## Compiler le projet

```bash
mvn compile
```

Compile le code source principal.

---

## Compiler les tests

```bash
mvn test-compile
```

Compile le code de test.

---

## Lancer tous les tests

```bash
mvn test
```

Exécute tous les tests.

---

## Lancer un seul test

```bash
mvn -Dtest=NomClasseTest test
```

Exemple :

```bash
mvn -Dtest=UserServiceTest test
```

---

## Lancer une seule méthode de test

```bash
mvn -Dtest=NomClasseTest#nomMethode test
```

Exemple :

```bash
mvn -Dtest=UserServiceTest#shouldReturnUser test
```

---

## Construire le package

```bash
mvn package
```

Génère le `jar` ou le `war`.

---

## Vérifier le projet complet

```bash
mvn verify
```

Lance les vérifications après les tests.

---

## Installer en local

```bash
mvn install
```

Installe l’artefact dans le dépôt local Maven.

---

## Déployer sur le dépôt distant

```bash
mvn deploy
```

Publie l’artefact sur le dépôt distant configuré.

---

## Enchaînements les plus utilisés

### Nettoyer puis tester

```bash
mvn clean test
```

### Nettoyer puis construire

```bash
mvn clean package
```

### Nettoyer puis installer

```bash
mvn clean install
```

---

## Ignorer les tests

### Ne pas exécuter les tests

```bash
mvn -DskipTests package
```

### Ne pas compiler ni exécuter les tests

```bash
mvn -Dmaven.test.skip=true package
```

---

## Recharger les dépendances snapshot

```bash
mvn -U clean install
```

Le `-U` force la mise à jour des snapshots et métadonnées.

---

## Mode debug

```bash
mvn -X clean install
```

Affiche les logs détaillés.

---

## Voir les profils actifs

```bash
mvn help:active-profiles
```

---

## Voir le `settings.xml` réellement utilisé

```bash
mvn help:effective-settings
```

Pour générer un fichier :

```bash
mvn help:effective-settings -Doutput=effective-settings.xml
```

---

## Voir le `pom.xml` effectif

```bash
mvn help:effective-pom
```

Pour générer un fichier :

```bash
mvn help:effective-pom -Doutput=effective-pom.xml
```

---

## Vérifier le dépôt local Maven

```bash
mvn help:evaluate -Dexpression=settings.localRepository -q -DforceStdout
```

---

## Utiliser un autre `settings.xml`

```bash
mvn -s D:\chemin\settings.xml clean install
```

---

## Utiliser un dépôt local temporaire

```bash
mvn -Dmaven.repo.local=D:\tmp\repo clean install
```

---

## Travailler avec un profil

```bash
mvn -Pdev clean install
```

Plusieurs profils :

```bash
mvn -Pdev,local test
```

---

## Commandes les plus utiles au quotidien

```bash
mvn -v
mvn clean
mvn compile
mvn test
mvn clean test
mvn package
mvn clean package
mvn install
mvn clean install
mvn -Dtest=NomClasseTest test
mvn -Dtest=NomClasseTest#nomMethode test
mvn -DskipTests package
mvn -U clean install
mvn -X clean install
mvn help:active-profiles
mvn help:effective-settings
mvn help:effective-pom
mvn help:evaluate -Dexpression=settings.localRepository -q -DforceStdout
```