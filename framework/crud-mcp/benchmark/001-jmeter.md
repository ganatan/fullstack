# Benchmark de pression avec JMeter

Apache JMeter permet d'appliquer une charge importante sur une API HTTP afin de mesurer ses performances.

Le benchmark utilisé ici doit exercer une **pression maximale pendant 30 secondes** sur :

```text
GET http://localhost:3000/persons
```

Configuration retenue :

```text
100 utilisateurs simultanés
30 secondes
aucune pause
requêtes exécutées en boucle
démarrage immédiat des 100 utilisateurs
```

Le nombre total de requêtes n'est pas fixé.

L'objectif est de mesurer combien de requêtes le backend est capable de traiter sous cette pression.

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

Sous Windows, télécharger l'archive ZIP binaire.

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

L'interface graphique sert uniquement à préparer le scénario.

Pour le véritable benchmark, le test sera exécuté en ligne de commande afin de réduire la consommation de ressources de JMeter. Apache recommande le mode CLI et déconseille les listeners lourds comme `View Results Tree` pendant les tests de charge.

---

## 4. Vérifier l'API

Démarrer le backend.

Vérifier :

```text
http://localhost:3000/persons
```

La réponse doit être correcte avant de commencer le benchmark.

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
Persons Benchmark
```

---

## 6. Configurer la pression

Configurer le `Thread Group` ainsi :

```text
Number of Threads (users) : 100
Ramp-up period (seconds)   : 0
Loop Count                 : Infinite
```

Le `Thread Group` représente les utilisateurs concurrents. `Loop Count = Infinite` permet à chaque thread de recommencer continuellement le scénario jusqu'à la fin de sa durée de vie.

Le point important pour ce benchmark est :

```text
Ramp-up = 0
```

Cela provoque le démarrage immédiat des utilisateurs, au lieu de les répartir progressivement dans le temps. JMeter indique qu'un ramp-up à `0` ou très faible provoque justement un pic de charge au démarrage.

---

## 7. Configurer exactement 30 secondes

Dans le `Thread Group`, cocher :

```text
Specify Thread lifetime
```

Configurer :

```text
Duration (seconds)      : 30
Startup delay (seconds) : 0
```

La durée limite l'activité du `Thread Group` à la période configurée.

Configuration complète :

```text
Threads       : 100
Ramp-up       : 0
Loop Count    : Infinite
Duration      : 30
Startup delay : 0
```

---

## 8. Principe du benchmark

Le fonctionnement recherché est :

```text
t = 0 s
    ↓
100 utilisateurs démarrent immédiatement
    ↓
GET /persons
GET /persons
GET /persons
GET /persons
GET /persons
...
    ↓
aucun Timer
aucune pause
aucun délai volontaire
    ↓
30 secondes
    ↓
arrêt
```

Chaque utilisateur envoie une nouvelle requête dès que la précédente est terminée.

Cela produit un benchmark de type :

```text
closed workload
```

avec :

```text
100 requêtes maximum simultanément en cours
```

et une pression continue dépendant directement de la vitesse de réponse du backend.

---

## 9. Ajouter la requête HTTP

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

Nom :

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

Ce sampler appelle :

```text
GET http://localhost:3000/persons
```

---

## 10. Ne pas ajouter de Timer

Pour ce benchmark de pression, ne pas ajouter :

```text
Constant Timer
Uniform Random Timer
Gaussian Random Timer
Constant Throughput Timer
Precise Throughput Timer
```

Le but n'est pas de limiter volontairement le débit.

Le backend doit recevoir une nouvelle requête dès qu'un thread est disponible.

---

## 11. Vérification préalable

Pendant la création du scénario, ajouter temporairement :

```text
Add
    Listener
        View Results Tree
```

Lancer quelques secondes.

Vérifier :

```text
Response code: 200
```

Une fois le scénario validé :

```text
désactiver ou supprimer View Results Tree
```

Apache recommande explicitement de ne pas utiliser `View Results Tree` ou `View Results in Table` pendant un véritable test de charge.

---

## 12. Structure finale

Pour le benchmark réel :

```text
Test Plan
└── Persons Benchmark
    └── GET Persons
```

Aucun listener graphique n'est nécessaire.

---

## 13. Sauvegarder

```text
File
    Save Test Plan As
```

Nom :

```text
persons-benchmark.jmx
```

---

## 14. Exécuter le véritable benchmark

Fermer JMeter graphique.

Supprimer les anciens résultats :

```powershell
Remove-Item results.jtl -ErrorAction SilentlyContinue
```

Supprimer l'ancien rapport :

```powershell
Remove-Item report -Recurse -Force -ErrorAction SilentlyContinue
```

Puis exécuter :

```powershell
.\bin\jmeter.bat -n -t persons-benchmark.jmx -l results.jtl -e -o report
```

Le mode CLI réduit l'impact de JMeter lui-même sur le benchmark.

---

## 15. Ouvrir le rapport

Après les 30 secondes :

```text
report/index.html
```

---

## 16. Mesures principales

Pour comparer les backends, relever :

```text
Samples
Throughput
Average
Median
90th percentile
95th percentile
99th percentile
Max
Error %
```

### Samples

Nombre total de requêtes exécutées pendant les 30 secondes.

```text
plus élevé = meilleur
```

### Throughput

Débit obtenu par le backend.

Exemple :

```text
12 000 requests/sec
```

```text
plus élevé = meilleur
```

### Average

Temps moyen de réponse.

```text
plus bas = meilleur
```

### P95

Temps sous lequel 95 % des requêtes ont répondu.

```text
plus bas = meilleur
```

### P99

Temps sous lequel 99 % des requêtes ont répondu.

```text
plus bas = meilleur
```

### Error %

Pourcentage d'erreurs.

Objectif :

```text
0 %
```

---

## 17. Configuration définitive

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
GUI           : non
Listeners     : aucun pendant le benchmark
```

Le scénario est donc :

```text
100 utilisateurs simultanés
        ↓
démarrage immédiat
        ↓
GET /persons
        ↓
requêtes en boucle sans pause
        ↓
pression continue pendant 30 secondes
        ↓
arrêt
```

---

# Comparaison des backends

Le même fichier :

```text
persons-benchmark.jmx
```

doit être utilisé pour tous les backends :

```text
Rust
Python
Java
Node.js
...
```

Il faut conserver :

```text
même machine
même PostgreSQL
mêmes données
même endpoint
même JMeter
100 threads
ramp-up 0
30 secondes
aucun Timer
```

Le tableau final pourra comparer :

```text
Backend    Requests    Req/s    Average    P95    P99    Errors
Rust
Python
Java
Node.js
```

C'est cette configuration qui met réellement chaque backend **sous pression maximale avec 100 utilisateurs concurrents pendant 30 secondes**, plutôt que d'étaler progressivement la charge.
