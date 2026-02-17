# 001-principes.md — SonarQube — historique, intérêt, fonctionnement (20 lignes)

1. SonarQube est une plateforme d’analyse statique de code et de qualité logicielle, initiée par SonarSource.  
2. Elle s’est imposée avec l’industrialisation CI/CD : qualité mesurable, automatisable, traçable.  
3. Objectif : détecter bugs probables, vulnérabilités, code smells, duplications, complexité.  
4. Elle standardise des règles de qualité, partagées par toute l’équipe, indépendamment des personnes.  
5. Elle aide à limiter la dette technique en rendant les écarts visibles et chiffrés.  
6. Elle supporte de nombreux langages (Java, JS/TS, etc.) via analyseurs.  
7. Fonctionnement : un **scanner** analyse le repo localement (AST + règles) et produit des métriques.  
8. Le scanner lit `sonar-project.properties` (ou paramètres Maven/Gradle) pour savoir quoi analyser.  
9. Il peut intégrer la couverture de tests (ex: JaCoCo, lcov) et les rapports de tests.  
10. Le scanner envoie les résultats au serveur SonarQube via HTTP (host + token).  
11. Le serveur stocke, indexe et calcule les indicateurs, puis expose des dashboards web.  
12. Notion clé : **Quality Gate** (seuils) pour décider si un build “passe” ou “échoue”.  
13. Le Quality Gate s’appuie sur : couverture, duplications, nouveaux bugs/vulns, dette.  
14. On distingue souvent le “New Code” (ce que tu ajoutes) du legacy (historique).  
15. En CI, SonarQube devient un contrôle qualité automatique avant merge / déploiement.  
16. En dev local, il sert à corriger tôt (avant PR) et à aligner les pratiques.  
17. Les “Issues” sont triables, assignables, commentables, et suivies dans le temps.  
18. SonarQube n’exécute pas le code : il analyse structure, patterns, risques, conventions.  
19. Il complète les tests (unitaires/intégration) : il ne les remplace pas.  
20. Résultat : une qualité observable, pilotable, et partagée par toute l’organisation.  
