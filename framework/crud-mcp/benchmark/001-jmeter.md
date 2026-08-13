# Installation et utilisation de JMeter

Apache JMeter est un outil permettant d'effectuer des tests de charge et de mesurer les performances d'une application HTTP.

JMeter est une application Java. La version actuelle proposée officiellement est **JMeter 5.6.3** et nécessite Java 8 minimum ; Java 17 ou supérieur est recommandé.

---

## 🔍 Vérification de Java

```bash
java -version
```

Exemple :

```text
openjdk version "21"
```

Si Java n'est pas installé, installer un JDK avant JMeter.

---

# 📥 Installation de JMeter

## Windows

Télécharger la distribution binaire ZIP depuis la page officielle Apache JMeter.

Le fichier est actuellement :

```text
apache-jmeter-5.6.3.zip
```

Décompresser le fichier, par exemple dans :

```text
C:\tools\apache-jmeter-5.6.3
```

La structure contient notamment :

```text
apache-jmeter-5.6.3/
├── bin/
├── docs/
├── extras/
├── lib/
└── licenses/
```

---

## ▶️ Lancement sous Windows

Se placer dans :

```powershell
cd C:\tools\apache-jmeter-5.6.3
```

Puis lancer :

```powershell
.\bin\jmeter.bat
```

L'interface graphique JMeter s'ouvre.

Le script `jmeter.bat` est le lanceur officiel Windows de JMeter.

---

# Linux

Télécharger la distribution binaire :

```text
apache-jmeter-5.6.3.tgz
```

Puis extraire :

```bash
tar -xzf apache-jmeter-5.6.3.tgz
```

Entrer dans le répertoire :

```bash
cd apache-jmeter-5.6.3
```

Lancer JMeter :

```bash
./bin/jmeter
```

---

# 🎯 API à tester

L'application doit être démarrée sur :

```text
http://localhost:3000
```

Endpoint testé :

```text
GET http://localhost:3000/persons
```

Vérifier avant le benchmark que l'endpoint fonctionne directement dans le navigateur :

```text
http://localhost:3000/persons
```

---

# 🏗️ Création du Test Plan

Au démarrage, JMeter possède automatiquement :

```text
Test Plan
```

Un test JMeter minimal est constitué d'un `Test Plan`, d'un `Thread Group` et d'un ou plusieurs `Sampler`.

---

# 👥 Ajouter un Thread Group

Clic droit sur :

```text
Test Plan
```

Puis :

```text
Add
└── Threads (Users)
    └── Thread Group
```

Renommer :

```text
Persons Benchmark
```

---

## Paramètres

Configurer :

```text
Number of Threads (users) : 10
Ramp-up period (seconds)   : 1
Loop Count                  : 100
```

Cela signifie :

```text
10 utilisateurs
×
100 appels chacun
=
1 000 requêtes
```

Le `Thread Group` permet de définir le nombre d'utilisateurs simulés et le nombre d'exécutions des requêtes.

---

# 🌐 Ajouter la requête HTTP

Clic droit sur :

```text
Persons Benchmark
```

Puis :

```text
Add
└── Sampler
    └── HTTP Request
```

Le sampler `HTTP Request` est prévu pour envoyer des requêtes HTTP vers une application ou une API REST.

---

## Configuration

Nom :

```text
GET Persons
```

Protocol :

```text
http
```

Server Name or IP :

```text
localhost
```

Port Number :

```text
3000
```

HTTP Request :

```text
GET
```

Path :

```text
/persons
```

Ne pas écrire :

```text
http://localhost:3000/persons
```

dans `Path`.

La configuration est séparée :

```text
Protocol    : http
Server      : localhost
Port        : 3000
Path        : /persons
```

C'est le fonctionnement prévu par le sampler HTTP de JMeter.

---

# 📊 Ajouter les résultats

Clic droit sur :

```text
Persons Benchmark
```

Puis :

```text
Add
└── Listener
    └── Summary Report
```

Ajouter également pour vérifier les premières requêtes :

```text
Add
└── Listener
    └── View Results Tree
```

Les `Listeners` permettent d'afficher ou d'enregistrer les résultats produits par les requêtes JMeter.

---

# 🌳 Structure finale

Le Test Plan doit ressembler à :

```text
Test Plan
└── Persons Benchmark
    ├── GET Persons
    ├── View Results Tree
    └── Summary Report
```

---

# 💾 Sauvegarder le benchmark

Menu :

```text
File
└── Save Test Plan As
```

Nom :

```text
persons-benchmark.jmx
```

Le fichier `.jmx` contient toute la configuration du benchmark.

---

# ▶️ Premier test

Démarrer l'application backend.

Par exemple :

```powershell
python -m src.main
```

Vérifier :

```text
http://localhost:3000/persons
```

Puis dans JMeter :

```text
Run
└── Start
```

ou :

```text
Ctrl + R
```

Le mode graphique est adapté à la création et à la vérification du Test Plan. Apache recommande cependant le mode CLI pour effectuer le véritable test de charge.

---

# 🔍 Vérification avec View Results Tree

Cliquer sur :

```text
View Results Tree
```

Les requêtes doivent apparaître en vert.

Sélectionner une requête.

Vérifier :

```text
Response code: 200
```

et dans :

```text
Response data
```

une réponse similaire à :

```json
[
  {
    "id": 1,
    "firstName": "Steven",
    "lastName": "Spielberg",
    "cityId": 1
  }
]
```

---

# 📊 Summary Report

Après le test, ouvrir :

```text
Summary Report
```

Les principales informations sont :

```text
# Samples
Average
Min
Max
Std. Dev.
Error %
Throughput
```

Pour comparer les performances des différents backends, les valeurs particulièrement intéressantes seront :

```text
Average
Min
Max
Error %
Throughput
```

`Throughput` représente le débit obtenu pendant le test.

---

# 🚀 Benchmark réel en ligne de commande

Pour mesurer réellement les performances, ne pas utiliser l'interface graphique.

Apache indique explicitement que le mode GUI doit servir à construire et déboguer le Test Plan et que les tests de charge doivent être lancés en mode CLI.

Fermer JMeter graphique.

Puis sous Windows :

```powershell
.\bin\jmeter.bat -n -t persons-benchmark.jmx -l results.jtl
```

Paramètres :

```text
-n
```

Mode CLI.

```text
-t persons-benchmark.jmx
```

Test Plan à exécuter.

```text
-l results.jtl
```

Fichier contenant les résultats.

---

# 📊 Génération d'un rapport HTML

JMeter peut également générer un rapport HTML à partir du benchmark.

Sous Windows :

```powershell
.\bin\jmeter.bat -n -t persons-benchmark.jmx -l results.jtl -e -o report
```

Cela génère :

```text
report/
├── index.html
├── content/
└── sbadmin2-1.0.7/
```

Ouvrir :

```text
report/index.html
```

---

# 🎯 Configuration de référence

Pour notre premier benchmark :

```text
Endpoint     : GET /persons
Host         : localhost
Port         : 3000
Threads      : 10
Ramp-up      : 1 seconde
Loop Count   : 100
Total        : 1 000 requêtes
```

Architecture JMeter :

```text
Test Plan
└── Persons Benchmark
    └── GET Persons
```

Commande réelle de benchmark :

```powershell
.\bin\jmeter.bat -n -t persons-benchmark.jmx -l results.jtl -e -o report
```

Cette configuration pourra ensuite être utilisée **strictement à l'identique pour comparer les différents backends**, afin que le même nombre de requêtes, le même endpoint et le même niveau de concurrence soient appliqués à chaque technologie.
