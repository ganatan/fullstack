# 001-principes.md — SonarQube — Historique, intérêt, fonctionnement

---

## Qu'est-ce que SonarQube ?

SonarQube est une plateforme d'**analyse statique de code et de qualité logicielle**, créée par SonarSource.
Elle s'est imposée avec l'industrialisation CI/CD : qualité mesurable, automatisable, traçable.

> SonarQube n'exécute pas le code — il analyse structure, patterns, risques et conventions.
> Il complète les tests unitaires et d'intégration : il ne les remplace pas.

---

## Objectifs

- Détecter **bugs probables**, vulnérabilités, code smells, duplications, complexité cyclomatique
- Standardiser des règles de qualité partagées par toute l'équipe, indépendamment des personnes
- Rendre la **dette technique** visible, chiffrée et pilotable dans le temps
- Supporter de nombreux langages : Java, TypeScript, JavaScript, Python, C#, etc.

---

## Comment ça fonctionne ?

### 1. Le Scanner

- Analyse le dépôt localement via **AST (Abstract Syntax Tree)** + règles configurées
- Lit `sonar-project.properties` ou les paramètres Maven/Gradle pour savoir quoi analyser
- Intègre les rapports de couverture de tests (JaCoCo, lcov, Istanbul…)
- Envoie les résultats au serveur SonarQube via HTTP (host + token d'authentification)

### 2. Le Serveur

- Reçoit, stocke et indexe les métriques envoyées par le scanner
- Calcule les indicateurs consolidés et expose les dashboards web
- Maintient un historique des analyses pour suivre l'évolution dans le temps

### 3. Le Quality Gate

Seuils de qualité configurables qui décident si un build **passe** ou **échoue** :

| Critère              | Exemple de seuil         |
|----------------------|--------------------------|
| Couverture de tests  | ≥ 80% sur le nouveau code |
| Nouveaux bugs        | 0                         |
| Nouvelles vulnérabilités | 0                    |
| Duplications         | < 3%                      |
| Dette technique      | < 1 jour                  |

---

## New Code vs Legacy

SonarQube distingue :

- **New Code** : ce que tu ajoutes depuis une date de référence ou une version → contrôlé strictement
- **Legacy** : code historique → suivi mais non bloquant par défaut

Cette distinction permet de ne pas être paralysé par la dette existante tout en garantissant que le nouveau code est propre.

---

## Usages

### En CI/CD
SonarQube devient un **contrôle qualité automatique** avant merge ou déploiement.
Un Quality Gate échoué peut bloquer la PR ou le pipeline.

### En développement local
- Corriger les issues tôt, avant la PR
- Aligner les pratiques au sein de l'équipe
- Lancer via Maven : `mvn sonar:sonar -Dsonar.token=xxx`

---

## Les Issues

Les problèmes détectés (Issues) sont :

- **Triables** par sévérité, type, langage, fichier
- **Assignables** à un développeur
- **Commentables** et suivies dans le temps
- Classées par type : Bug / Vulnerability / Code Smell / Security Hotspot

---

## Résumé

| Dimension        | Ce que SonarQube apporte                        |
|------------------|-------------------------------------------------|
| Qualité          | Règles standardisées, mesurables, partagées     |
| Sécurité         | Détection de vulnérabilités et hotspots         |
| Dette technique  | Visible, chiffrée, suivie dans le temps         |
| CI/CD            | Quality Gate automatique avant merge/déploiement|
| Équipe           | Pratiques alignées, indépendantes des individus |

> **Résultat** : une qualité observable, pilotable et partagée par toute l'organisation.
