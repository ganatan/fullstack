# Installation et benchmark avec JMeter

Apache JMeter permet de tester les performances d'une API HTTP.

Dans cet exemple, nous allons tester :

```text
GET http://localhost:3000/persons
```

---

## 1. Prérequis

JMeter nécessite Java.

Vérifier l'installation :

```bash
java -version
```

---

## 2. Télécharger JMeter

Télécharger Apache JMeter depuis :

```text
https://jmeter.apache.org/download_jmeter.cgi
```

Sous Windows, télécharger l'archive binaire :

```text
apache-jmeter-5.6.3.zip
```

Décompresser l'archive, par exemple dans :

```text
C:\tools\apache-jmeter-5.6.3
```

---

## 3. Lancer JMeter

Ouvrir un terminal dans le répertoire JMeter :

```powershell
cd C:\tools\apache-jmeter-5.6.3
```

Lancer :

```powershell
.\bin\jmeter.bat
```

L'interface graphique JMeter s'ouvre.

---

## 4. Vérifier l'API

Avant de créer le benchmark, démarrer le backend.

Vérifier dans le navigateur :

```text
http://localhost:3000/persons
```

La requête doit retourner les personnes au format JSON.

---

## 5. Créer le Test Plan

Au démarrage, JMeter contient :

```text
Test Plan
```

Ajouter un groupe d'utilisateurs :

```text
Test Plan
    clic droit
        Add
            Threads (Users)
                Thread Group
```

Renommer le groupe :

```text
Persons Benchmark
```

---

## 6. Configurer le Thread Group

Configurer :

```text
Number of Threads (users) : 10
Ramp-up period (seconds)   : 1
Loop Count                 : 100
```

Cela produit :

```text
10 utilisateurs
×
100 requêtes
=
1 000 requêtes
```

---

## 7. Ajouter la requête HTTP

Clic droit sur :

```text
Persons Benchmark
```

Puis :

```text
Add
    Sampler
        HTTP Request
```

Renommer :

```text
GET Persons
```

---

## 8. Configurer la requête

Configurer :

```text
Protocol            : http
Server Name or IP   : localhost
Port Number         : 3000
Method              : GET
Path                : /persons
```

Configuration complète :

```text
http://localhost:3000/persons
```

Ne pas mettre l'URL complète dans `Path`.

Le champ `Path` doit uniquement contenir :

```text
/persons
```

---

## 9. Ajouter un Summary Report

Clic droit sur :

```text
Persons Benchmark
```

Puis :

```text
Add
    Listener
        Summary Report
```

---

## 10. Ajouter View Results Tree

Pour vérifier les réponses pendant la préparation du test :

```text
Add
    Listener
        View Results Tree
```

---

## 11. Structure finale

```text
Test Plan
└── Persons Benchmark
    ├── GET Persons
    ├── View Results Tree
    └── Summary Report
```

---

## 12. Sauvegarder le test

Menu :

```text
File
    Save Test Plan As
```

Nom du fichier :

```text
persons-benchmark.jmx
```

---

## 13. Lancer le test

Cliquer sur :

```text
Run
    Start
```

ou utiliser :

```text
Ctrl + R
```

---

## 14. Vérifier les réponses

Dans :

```text
View Results Tree
```

les requêtes réussies apparaissent en vert.

Vérifier :

```text
Response code: 200
```

La réponse doit contenir les données retournées par :

```text
GET /persons
```

---

## 15. Lire les résultats

Dans :

```text
Summary Report
```

les principales valeurs sont :

```text
# Samples
Average
Min
Max
Std. Dev.
Error %
Throughput
```

Pour comparer plusieurs backends, les valeurs les plus intéressantes sont :

```text
Average
Min
Max
Error %
Throughput
```

---

## 16. Benchmark en ligne de commande

L'interface graphique sert principalement à créer et vérifier le test.

Pour effectuer le benchmark réel, utiliser le mode ligne de commande.

Fermer JMeter graphique puis lancer :

```powershell
.\bin\jmeter.bat -n -t persons-benchmark.jmx -l results.jtl
```

Paramètres :

```text
-n
```

Mode non graphique.

```text
-t persons-benchmark.jmx
```

Fichier de test.

```text
-l results.jtl
```

Fichier contenant les résultats.

---

## 17. Générer un rapport HTML

```powershell
.\bin\jmeter.bat -n -t persons-benchmark.jmx -l results.jtl -e -o report
```

Le rapport est généré dans :

```text
report/
```

Ouvrir :

```text
report/index.html
```

---

## Configuration du benchmark

```text
Endpoint     : GET /persons
Host         : localhost
Port         : 3000
Threads      : 10
Ramp-up      : 1 seconde
Loop Count   : 100
Total        : 1 000 requêtes
```

Cette configuration doit être conservée à l'identique pour comparer plusieurs backends.

```text
Rust
Python
Java
Node.js
...
```

Chaque backend doit être testé avec :

```text
même endpoint
même base de données
mêmes données
même nombre de threads
même nombre de requêtes
même machine
```
