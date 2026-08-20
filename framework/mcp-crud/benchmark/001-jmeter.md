# Benchmark Rust vs Python avec JMeter

Apache JMeter permet de mesurer les performances d'une API HTTP sous charge.

Endpoint testé :

```text
GET http://localhost:3000/persons
```

L'objectif est de comparer deux backends avec exactement le même scénario :

```text
Rust
Python
```

---

## 1. Télécharger JMeter

Télécharger Apache JMeter :

```text
https://jmeter.apache.org/download_jmeter.cgi
```

Sous Windows, télécharger l'archive binaire ZIP puis la décompresser.

Exemple :

```text
C:\tools\apache-jmeter-5.6.3
```

---

## 2. Vérifier Java

JMeter nécessite Java.

```bash
java -version
```

---

## 3. Lancer JMeter

Sous Windows :

```powershell
cd C:\tools\apache-jmeter-5.6.3
```

Puis :

```powershell
.\bin\jmeter.bat
```

---

## 4. Vérifier l'API

Avant le benchmark, vérifier :

```text
http://localhost:3000/persons
```

La réponse doit être retournée correctement.

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

## 6. Configurer le benchmark

Configurer :

```text
Number of Threads (users) : 100
Ramp-up period (seconds)   : 20
Loop Count                 : Infinite
```

Cocher :

```text
Same user on each iteration
Specify Thread lifetime
```

Configurer :

```text
Duration (seconds)      : 200
Startup delay (seconds) : 0
```

Configuration finale :

```text
Users         : 100
Ramp-up       : 20 secondes
Loop Count    : Infinite
Duration      : 200 secondes
Startup delay : 0
```

Le benchmark fonctionne ainsi :

```text
0 → 20 secondes
montée progressive jusqu'à 100 utilisateurs

20 → 200 secondes
100 utilisateurs sous charge

Charge maximale stable :
180 secondes
```

---

## 7. Ajouter la requête HTTP

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

## 8. Activer KeepAlive

Dans la requête HTTP, laisser coché :

```text
Use KeepAlive
```

---

## 9. Ne pas ajouter de Timer

Aucun Timer ne doit être ajouté.

```text
Constant Timer
Uniform Random Timer
Gaussian Random Timer
Constant Throughput Timer
```

Chaque utilisateur envoie une nouvelle requête dès que la précédente est terminée.

```text
GET /persons
    ↓
réponse
    ↓
GET /persons
    ↓
réponse
    ↓
...
```

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

Structure :

```text
Test Plan
└── Backend Benchmark
    ├── GET Persons
    └── Summary Report
```

---

## 11. Enregistrer les résultats

Dans `Summary Report`, renseigner :

```text
Filename
```

avec :

```text
benchmarks\Backend Benchmark.jtl
```

Le fichier utilisé sera donc toujours :

```text
benchmarks\Backend Benchmark.jtl
```

---

## 12. Écraser automatiquement l'ancien résultat

Modifier :

```text
apache-jmeter-5.6.3\bin\user.properties
```

Ajouter :

```properties
resultcollector.action_if_file_exists=DELETE
```

Redémarrer ensuite JMeter.

À chaque benchmark :

```text
ancien Backend Benchmark.jtl
        ↓
suppression
        ↓
nouveau Backend Benchmark.jtl
```

---

## 13. Warm-up

Avant les mesures officielles, effectuer un test de chauffe d'environ :

```text
30 secondes
```

Les résultats du warm-up ne sont pas conservés.

Le but est simplement de démarrer :

```text
backend
pool PostgreSQL
connexions HTTP
KeepAlive
```

---

## 14. Nombre de benchmarks

Pour chaque backend :

```text
Warm-up : 30 secondes

Run 1 : 200 secondes
Run 2 : 200 secondes
Run 3 : 200 secondes
```

Utiliser ensuite la valeur médiane des trois runs pour la comparaison.

---

## 15. Lancement depuis l'interface graphique

Le bouton vert permet de vérifier le scénario :

```text
Run
    Start
```

Le `Summary Report` affiche directement les résultats.

---

## 16. Benchmark réel en CLI

Pour les mesures officielles, utiliser JMeter en ligne de commande.

Depuis le répertoire JMeter :

```powershell
.\bin\jmeter.bat -n -t "Backend Benchmark.jmx" -l "benchmarks\Backend Benchmark.jtl"
```

Si le fichier `.jmx` se trouve lui aussi dans `benchmarks` :

```powershell
.\bin\jmeter.bat -n -t "benchmarks\Backend Benchmark.jmx" -l "benchmarks\Backend Benchmark.jtl"
```

Paramètres :

```text
-n
```

Mode non graphique.

```text
-t
```

Fichier contenant le scénario JMeter.

```text
-l
```

Fichier contenant les résultats.

---

## 17. Générer directement un rapport HTML

Supprimer éventuellement l'ancien rapport :

```powershell
Remove-Item "benchmarks\report" -Recurse -Force -ErrorAction SilentlyContinue
```

Puis lancer :

```powershell
.\bin\jmeter.bat -n -t "benchmarks\Backend Benchmark.jmx" -l "benchmarks\Backend Benchmark.jtl" -e -o "benchmarks\report"
```

Le rapport est généré dans :

```text
benchmarks\report
```

Ouvrir :

```text
benchmarks\report\index.html
```

---

## 18. Résultats importants

Pour chaque backend, relever :

```text
# Samples
Average
Min
Max
Std. Dev.
Error %
Throughput
```

### Samples

Nombre total de requêtes exécutées.

```text
plus élevé = meilleur
```

### Average

Temps moyen de réponse.

```text
plus bas = meilleur
```

### Max

Temps de réponse maximum.

```text
plus bas = meilleur
```

### Error %

Pourcentage d'erreurs.

Objectif :

```text
0 %
```

### Throughput

Nombre de requêtes traitées par seconde.

```text
plus élevé = meilleur
```

---

## 19. Configuration finale

```text
Endpoint      : GET /persons
Host          : localhost
Port          : 3000

Users         : 100
Ramp-up       : 20 secondes
Loop Count    : Infinite
Duration      : 200 secondes
Full load     : 180 secondes
Startup delay : 0

KeepAlive     : activé
Timers        : aucun
```

---

## 20. Protocole de comparaison

Chaque backend doit utiliser exactement :

```text
même machine
même PostgreSQL
mêmes données
même endpoint
même fichier JMeter
100 utilisateurs
20 secondes de ramp-up
180 secondes à pleine charge
3 runs
```

Comparaison finale :

```text
Backend    Samples    Throughput    Average    Min    Max    Error %
Rust
Python
```

Le benchmark mesure ainsi les performances des backends Rust et Python dans des conditions strictement identiques.
