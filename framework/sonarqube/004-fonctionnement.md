# 004-fonctionnement.md — SonarQube — Ajouter des règles (Quality Profile) + Seuils (Quality Gate)

## Objectif
- Ajouter/activer des règles d’analyse (Quality Profile)
- Définir des seuils bloquants (Quality Gate)
- Appliquer au projet puis relancer une analyse Maven

---

## 1) Ajouter / activer des règles (Quality Profile)

### 1.1 Ouvrir les profils
- SonarQube → `Quality Profiles`

### 1.2 Créer un profil “custom” (recommandé)
- Choisir le langage (ex: `Java`)
- Cliquer `Copy`
- Nommer le profil : `java-custom` (ou `springboot-custom`)
- Valider

### 1.3 Activer des règles
- Ouvrir le profil `java-custom`
- Onglet `Rules`
- Filtrer par :
  - Type : `Bug`, `Vulnerability`, `Code Smell`
  - Severity : `Major`, `Critical`
  - Tags : `security`, `pitfall`, `convention`, `performance`
- Pour chaque règle : `Activate`

### 1.4 Ajuster la sévérité / paramètres (si dispo)
- Dans la règle :
  - `Change severity` (ex: Major → Critical)
  - `Parameters` (ex: complexité max, taille max, etc.)

---

## 2) Appliquer le Quality Profile au projet

- Projet → `Project Settings` → `Quality Profiles`
- Pour `Java` : sélectionner `java-custom`
- Sauvegarder

---

## 3) Définir des seuils (Quality Gate)

### 3.1 Créer un Quality Gate
- SonarQube → `Quality Gates`
- `Create` (ou `Copy` du gate par défaut)
- Nom : `gate-custom`

### 3.2 Ajouter des conditions (conseillé sur “New Code”)
Exemples utiles :
- `New Bugs` = 0
- `New Vulnerabilities` = 0
- `New Security Hotspots Reviewed` = 100%
- `Coverage on New Code` >= 80%
- `Duplications on New Code` <= 3%
- `New Code Smells` <= 0 (ou <= 5 selon tolérance)
- `Maintainability Rating on New Code` = A
- `Reliability Rating on New Code` = A
- `Security Rating on New Code` = A

### 3.3 Appliquer le Quality Gate au projet
- Projet → `Project Settings` → `Quality Gate`
- Choisir `gate-custom`

---

## 4) Relancer l’analyse Maven (Spring Boot)

Depuis la racine du projet :

```bash
mvn clean verify sonar:sonar -Dsonar.projectKey=springboot-starter -Dsonar.host.url=http://localhost:9000 -Dsonar.login="XXXXXXXX"
```

---

## 5) Vérifier le résultat

Dans le projet SonarQube :
- `Overview` : statut du Quality Gate (Passed/Failed)
- `Issues` : liste des règles déclenchées
- `Security Hotspots` : hotspots à reviewer
- `Measures` : métriques (coverage, duplications, complexité)

---

## 6) Stratégie simple (pratique)

### 6.1 Phase 1 (strict sur le nouveau code)
- Gate centré “New Code”
- Tolérance basse sur bugs/vulns
- Coverage New Code 80%

### 6.2 Phase 2 (durcir progressivement)
- Monter la coverage (ex: 85% → 90%)
- Réduire duplications
- Ajouter des règles de maintainability

---

## 7) Notes importantes

- Ajouter des règles = `Quality Profiles`
- Mettre des seuils bloquants = `Quality Gates`
- Le projet est mis à jour uniquement après une nouvelle analyse
- Évite de modifier `Sonar way` : copie le profil puis customise
