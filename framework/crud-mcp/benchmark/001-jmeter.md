# Benchmark de pression avec JMeter

Apache JMeter permet de mesurer les performances d'une API HTTP sous charge.

Le benchmark utilisé ici applique une pression continue pendant **30 secondes** sur :

```text
GET http://localhost:3000/persons
```

Configuration retenue :

```text
100 utilisateurs simultanés
30 secondes
aucune pause
requêtes exécutées en boucle
démarrage immédiat
```

Le nombre total de requêtes n'est pas fixé.

L'objectif est de mesurer combien de requêtes le backend peut traiter pendant ces 30 secondes.

---

## 1. Prérequis

JMeter nécessite Java.

Vérifier :

```bash
java -version
```

---

## 2. Télécharger JMeter

Télécharger Apache JMeter :

```text
https://jmeter.apache.org/download_jmeter.cgi
```

Sous Windows, télécharger l'archive binaire ZIP.

Exemple :

```text
apache-jmeter-5.6.3.zip
```

Décompresser par exemple dans :

```text
C:\tools\apache-jmeter-5.6.3
```

---

## 3. Lancer JMeter

```powershell
cd C:\tools\apache-jmeter-5.6.3
```

Puis :

```powershell
.\bin\jmeter.bat
```

---

## 4. Vérifier l'API

Démarrer le backend.

Vérifier :

```text
http://localhost:3000/persons
```

La réponse doit être retournée correctement avant de lancer le benchmark.

---

## 5. Créer le Thread Group

Dans JMeter :

```text
Test Plan
    clic droit
        Add
            Threads (Users)
                Thread Group
```

Renommer :

```text
Backend Benchmark
```

---

## 6. Configurer la charge

Configurer :

```text
Number of Threads (users) : 100
Ramp-up period (seconds)   : 0
Loop Count                 : Infinite
```

Configuration :

```text
100 utilisateurs
démarrage immédiat
boucle infinie
```

Chaque utilisateur recommence une requête dès que la précédente est terminée.

---

## 7. Configurer la durée

Dans le `Thread Group`, cocher :

```text
Specify Thread lifetime
```

Configurer :

```text
Duration (seconds)      : 30
Startup delay (seconds) : 0
```

Configuration complète :

```text
Threads       : 100
Ramp-up       : 0
Loop Count    : Infinite
Duration      : 30
Startup delay : 0
```

---

## 8. Ajouter la requête HTTP

Clic droit sur :

```text
Backend Benchmark
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

Configurer :

```text
Protocol          : http
Server Name or IP : localhost
Port Number       : 3000
Method            : GET
Path              : /persons
```

Cela correspond à :

```text
GET http://localhost:3000/persons
```

---

## 9. Ne pas ajouter de Timer

Pour appliquer une pression maximale, ne pas ajouter :

```text
Constant Timer
Uniform Random Timer
Gaussian Random Timer
Constant Throughput Timer
Precise Throughput Timer
```

Chaque thread doit envoyer une nouvelle requête dès que la précédente est terminée.

---

## 10. Ajouter Summary Report

Clic droit sur :

```text
Backend Benchmark
```

Puis :

```text
Add
    Listener
        Summary Report
```

La structure devient :

```text
Test Plan
└── Backend Benchmark
    ├── GET Persons
    └── Summary Report
```

---

## 11. Enregistrer les résultats

Dans :

```text
Summary Report
```

renseigner :

```text
Filename
```

avec :

```text
benchmarks\Backend Benchmark.jtl
```

Le dossier doit donc exister :

```text
benchmarks\
```

Le fichier utilisé sera toujours :

```text
benchmarks\Backend Benchmark.jtl
```

---

## 12. Écraser automatiquement l'ancien résultat

Par défaut, JMeter demande quoi faire lorsque le fichier existe déjà.

Pour toujours remplacer automatiquement l'ancien benchmark, ouvrir :

```text
apache-jmeter-5.6.3\bin\user.properties
```

Ajouter :

```properties
resultcollector.action_if_file_exists=DELETE
```

Puis redémarrer JMeter.

À chaque lancement :

```text
benchmarks\Backend Benchmark.jtl
        ↓
ancien fichier supprimé
        ↓
nouveau benchmark enregistré
```

Il ne faut pas utiliser :

```properties
resultcollector.action_if_file_exists=APPEND
```

car les résultats de plusieurs tests seraient mélangés.

---

## 13. Lancer le benchmark

Cliquer sur :

```text
Run
    Start
```

ou sur le bouton vert.

Le scénario devient :

```text
100 utilisateurs
        ↓
démarrage immédiat
        ↓
GET /persons
        ↓
GET /persons
        ↓
GET /persons
        ↓
...
        ↓
30 secondes
        ↓
arrêt
```

---

## 14. Voir les résultats

Cliquer sur :

```text
Summary Report
```

Les principales colonnes sont :

```text
# Samples
Average
Min
Max
Std. Dev.
Error %
Throughput
Received KB/sec
Sent KB/sec
```

---

## 15. Valeurs importantes

### Samples

Nombre total de requêtes exécutées pendant les 30 secondes.

```text
plus élevé = meilleur
```

### Average

Temps moyen de réponse en millisecondes.

```text
plus bas = meilleur
```

### Min

Temps de réponse minimum.

### Max

Temps de réponse maximum.

### Error %

Pourcentage de requêtes en erreur.

Objectif :

```text
0 %
```

### Throughput

Nombre de requêtes traitées par unité de temps.

```text
plus élevé = meilleur
```

C'est une des valeurs principales pour comparer les backends.

---

## 16. Benchmark en mode ligne de commande

L'interface graphique est pratique pour créer et contrôler le scénario.

Pour un benchmark plus fiable, utiliser ensuite le mode non graphique.

Avec le fichier :

```text
Backend Benchmark.jmx
```

lancer :

```powershell
.\bin\jmeter.bat -n -t "Backend Benchmark.jmx" -l "benchmarks\Backend Benchmark.jtl"
```

Le résultat est écrit dans :

```text
benchmarks\Backend Benchmark.jtl
```

---

## 17. Configuration finale

```text
Endpoint      : GET /persons
Host          : localhost
Port          : 3000

Users         : 100
Ramp-up       : 0 seconde
Loop Count    : Infinite
Duration      : 30 secondes
Startup delay : 0

Timers        : aucun
```

Résultats :

```text
benchmarks\Backend Benchmark.jtl
```

Comportement si le fichier existe :

```properties
resultcollector.action_if_file_exists=DELETE
```

---

## 18. Comparaison des backends

Le même benchmark doit être utilisé pour chaque technologie :

```text
Rust
Python
Java
Node.js
...
```

Chaque test doit utiliser :

```text
même machine
même PostgreSQL
mêmes données
même endpoint
100 utilisateurs
30 secondes
aucun Timer
même fichier JMeter
```

Le tableau de comparaison pourra ensuite contenir :

```text
Backend    Samples    Throughput    Average    Max    Error %
Rust
Python
Java
Node.js
```

Le principe du benchmark est simple :

```text
100 utilisateurs simultanés
        ↓
pression maximale pendant 30 secondes
        ↓
nombre de requêtes traitées
        ↓
temps de réponse
        ↓
débit
        ↓
erreurs
```
