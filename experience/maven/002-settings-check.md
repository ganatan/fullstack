# Utilisation de `settings.xml` avec Maven

## Rôle de `settings.xml`

Le fichier `settings.xml` sert à configurer Maven côté machine ou côté utilisateur.

Il permet notamment de définir :

- le dépôt local Maven
- les identifiants d’accès aux dépôts distants
- les miroirs
- les profils actifs
- certaines propriétés globales

Il ne remplace pas le `pom.xml`.

## Différence entre `pom.xml` et `settings.xml`

- `pom.xml` : décrit le projet
- `settings.xml` : décrit l’environnement Maven utilisé pour exécuter le projet

En pratique :

- `pom.xml` = ce que le projet veut
- `settings.xml` = comment Maven va travailler sur ta machine

---

## Dans ton cas

Ton `settings.xml` dit à Maven :

- d’utiliser `D:\HAL\PARTI` comme dépôt local
- d’utiliser des repositories Artifactory pour télécharger les dépendances
- d’utiliser les identifiants stockés dans les variables d’environnement
- d’activer automatiquement les profils `artifactory`, `jdks` et `docker`

---

## Dépôt local

```xml
<localRepository>D:\HAL\PARTI</localRepository>
```

Cela signifie que Maven stocke les dépendances téléchargées dans :

```text
D:\HAL\PARTI
```

Ce dossier est le cache local Maven.

---

## Dépôts distants

Les dépendances ne viennent pas du dossier local.

Elles viennent des URLs Artifactory définies dans :

- `repositories`
- `pluginRepositories`
- `mirrors`

Le dépôt local sert seulement à conserver ce qui a déjà été téléchargé.

---

## Authentification

La section `servers` contient les identifiants associés aux dépôts distants.

Dans ton fichier, les credentials viennent de variables d’environnement :

- `MAVEN_ARTIFACTORY_USERNAME`
- `MAVEN_ARTIFACTORY_PASSWORD`

Si elles ne sont pas définies, Maven ne pourra pas s’authentifier correctement.

---

## Miroir

La section `mirrors` permet de rediriger certains dépôts vers Artifactory.

Exemple :

```xml
<mirrorOf>central,apache.snapshots,nexus-generique-librairies</mirrorOf>
```

Cela signifie que Maven n’ira pas directement sur ces dépôts :
il passera par `mvp-maven-virtual`.

---

## Profils

Les profils servent à activer des blocs de configuration.

Dans ton fichier, les profils actifs sont :

- `artifactory`
- `jdks`
- `docker`

Le profil `artifactory` est le plus important pour la résolution des dépendances.

---

## Commandes de vérification

### Voir le settings effectif

```bash
mvn help:effective-settings
```

Cette commande montre la configuration réellement utilisée par Maven.

Pour générer un fichier :

```bash
mvn help:effective-settings -Doutput=effective-settings.xml
```

---

### Voir les profils actifs

```bash
mvn help:active-profiles
```

Cette commande permet de vérifier quels profils sont réellement activés.

---

### Vérifier les propriétés système et l’environnement Maven

```bash
mvn help:system
```

---

## Tester le téléchargement des dépendances

### Build avec logs détaillés

```bash
mvn -U clean compile -X
```

Cette commande permet de voir :

- le dépôt local utilisé
- les repositories distants appelés
- les miroirs appliqués
- les téléchargements
- les erreurs d’authentification éventuelles

---

### Test ciblé d’une dépendance

```bash
mvn dependency:get -Dartifact=org.apache.commons:commons-lang3:3.14.0 -X
```

Ce test force Maven à tenter de télécharger une dépendance précise.

Si tout est bon :

- Maven contacte Artifactory
- télécharge l’artefact
- le stocke dans `D:\HAL\PARTI`

---

## Ce qu’il faut vérifier dans les logs

Tu dois retrouver :

- le chemin du dépôt local
- les profils actifs
- les URLs Artifactory
- l’utilisation du mirror
- l’absence d’erreur `401`, `403` ou `404`

---

## Résumé final

Avec ton `settings.xml` :

- Maven télécharge depuis Artifactory
- Maven stocke en local dans `D:\HAL\PARTI`
- les accès sont gérés via `servers`
- les redirections de dépôts sont gérées via `mirrors`
- les blocs actifs sont gérés via `profiles`

## Commandes essentielles

```bash
mvn help:effective-settings
mvn help:active-profiles
mvn -U clean compile -X
mvn dependency:get -Dartifact=org.apache.commons:commons-lang3:3.14.0 -X
```