# Résumé du ticket

## Ce que dit le ticket

Le ticket **IHM - Service recalcul évènementiel** fait évoluer l’écran de création / modification d’un **Service Recalcul**.

Jusqu’ici, le service recalcul semblait surtout fonctionner avec un mode **Endpoint**.

Le ticket ajoute un nouveau champ **Mode** avec 2 valeurs :

- `Endpoint`
- `Evenementiel`

Si l’utilisateur choisit **Evenementiel** :
- le champ `Endpoint` disparaît
- il est remplacé par **Evenement de sortie**
- ce champ permet de sélectionner un **PKE** (`ProducerKafkaEvent`)

---

## Position du ticket dans le projet

Ce ticket se place au croisement de trois sujets du projet :

- le **moteur de recalcul**
- l’**évènementiel**
- le **paramétrage IHM**

En gros :

- le projet gère des dossiers métiers
- le moteur recalcule l’état du dossier
- ce recalcul pouvait déjà s’appuyer sur des endpoints
- maintenant il doit aussi s’appuyer sur de l’**évènementiel Kafka**

Donc ce ticket est la **traduction IHM** d’une évolution d’architecture déjà présente dans le projet :

- `ConsumerKafkaEvent` pour les entrées
- `ProducerKafkaEvent` pour les sorties
- service recalcul qui doit supporter un mode évènementiel

---

## Ce que ça veut dire fonctionnellement

Le **service recalcul** devient une brique configurable avec deux façons de fonctionner :

### Mode Endpoint
Le service recalcul est lié à un endpoint externe.

### Mode Evenementiel
Le service recalcul est lié à un évènement, ici un **ProducerKafkaEvent**.

Donc le ticket montre que l’évènementiel n’est plus juste un concept backend :  
il devient **configurable dans l’IHM**.

---

## Ce que tu dois faire

## 1. Adapter l’IHM
Sur l’écran Service Recalcul :

- ajouter le champ `Mode`
- proposer les valeurs `Endpoint` et `Evenementiel`

## 2. Gérer le comportement dynamique
Selon la valeur choisie :

### si `Mode = Endpoint`
- afficher le champ `Endpoint`

### si `Mode = Evenementiel`
- masquer `Endpoint`
- afficher `Evenement de sortie`
- charger dans cette liste les **PKE**

## 3. Adapter le modèle front / back
Le DTO ou payload du Service Recalcul doit maintenant porter :
- le `mode`
- soit un `endpoint`
- soit un `producerKafkaEvent` / `evenementDeSortie`

## 4. Vérifier les règles métier
Tu dois confirmer avec le backend ou la spec :
- si `Endpoint` est obligatoire uniquement en mode Endpoint
- si `Evenement de sortie` est obligatoire uniquement en mode Evenementiel
- s’il faut vider la valeur opposée quand on change de mode

## 5. Sécuriser la persistance
Au moment de sauvegarder :
- ne pas envoyer un objet incohérent
- éviter d’avoir `endpoint` et `pke` remplis en même temps

---

## Résumé ultra court

Ce ticket sert à faire évoluer l’écran **Service Recalcul** pour lui ajouter un mode **évènementiel**.

Avant :
- service recalcul lié à un endpoint

Maintenant :
- service recalcul lié soit à un endpoint
- soit à un **ProducerKafkaEvent**

Ton boulot :
- ajouter le champ `Mode`
- afficher le bon champ selon le mode
- brancher la liste des PKE
- adapter le payload envoyé au back



# Résumé précis

## Pourquoi

Tu as déjà mis en place la **création des ProducerKafkaEvent** :
- l’IHM existe
- le `bff-adminppga` accepte la payload
- le BFF transmet à `ress-admppga`

Donc les **PKE existent déjà comme objet paramétrable**.

Le nouveau ticket arrive **une étape après** :

il ne s’agit plus de créer un PKE,  
il s’agit de **pouvoir l’utiliser dans l’écran Service Recalcul**.

Avant, le Service Recalcul semblait fonctionner avec une logique unique :
- un **Endpoint**

Maintenant, le projet introduit une deuxième logique :
- un mode **Evenementiel**
- qui référence un **PKE existant**

Donc la raison du ticket est simple :

> faire évoluer l’écran Service Recalcul pour qu’il puisse être paramétré soit avec un endpoint, soit avec un évènement de sortie déjà créé.

Autrement dit :
- avant : Service Recalcul orienté **API / Endpoint**
- maintenant : Service Recalcul orienté **API ou Evènementiel**

Ce ticket est donc une **intégration fonctionnelle des PKE dans le paramétrage du Service Recalcul**.

---

## Comment

## 1. Retrouver le flux de création / modification du Service Recalcul

Dans `bff-adminppga`, tu dois retrouver tout ce qui concerne l’écran **Service Recalcul** :

- controller
- service
- `InputDTO`
- mapping vers `ress-admppga`

Le point clé est de repérer l’endroit où la payload contient aujourd’hui le champ :
- `endpoint`
- ou `codeEndpoint`
- ou équivalent

---

## 2. Faire évoluer le contrat d’entrée

Le `InputDTO` du Service Recalcul doit maintenant supporter un nouveau modèle :

- `mode`
- `endpoint` si mode `Endpoint`
- `producerKafkaEvent` ou `codeProducerKafkaEvent` si mode `Evenementiel`

La logique devient :

- si `mode = Endpoint`  
  alors `endpoint` est utilisé

- si `mode = Evenementiel`  
  alors la référence du **PKE** est utilisée

---

## 3. Adapter l’IHM

Sur l’écran de création / modification du Service Recalcul :

- ajouter le champ `Mode`
- proposer :
  - `Endpoint`
  - `Evenementiel`

Puis gérer l’affichage conditionnel :

### si `Mode = Endpoint`
- afficher `Endpoint`
- masquer `Evenement de sortie`

### si `Mode = Evenementiel`
- masquer `Endpoint`
- afficher `Evenement de sortie`
- remplir cette liste avec les **PKE existants**

---

## 4. Brancher la liste des PKE

Comme les PKE existent déjà dans ton système, tu dois réutiliser la logique permettant de les récupérer pour alimenter la liste :

- soit un endpoint de recherche/listing existe déjà
- soit il faut réutiliser le même mécanisme que celui utilisé dans l’IHM PKE
- soit il faut ajouter l’appel côté front si la liste n’est pas encore branchée ici

Le but est uniquement de **sélectionner un PKE existant**, pas de le recréer.

---

## 5. Vérifier le transport BFF -> Ress

Tu dois contrôler que la nouvelle payload du Service Recalcul est bien transmise à `ress-admppga` avec :

- le `mode`
- soit `endpoint`
- soit la référence `PKE`

Il faut vérifier :
- le nom exact des champs
- le mapping
- si le back attend déjà ce nouveau format
- si le back accepte un champ nullable selon le mode

---

## 6. Sécuriser les règles

Il faut éviter une payload incohérente.

Donc au minimum :

- `mode = Endpoint` → pas de PKE envoyé
- `mode = Evenementiel` → pas d’endpoint envoyé

Et idéalement :
- vider le champ opposé quand l’utilisateur change de mode
- empêcher l’envoi des deux en même temps

---

## Ce que tu fais vraiment

Tu ne travailles pas sur la création des PKE.

Tu travailles sur **l’intégration des PKE dans le paramétrage du Service Recalcul**.

Donc ton vrai chantier est :

1. retrouver le `InputDTO` Service Recalcul
2. identifier le champ `endpoint`
3. ajouter `mode`
4. ajouter la référence PKE
5. adapter l’IHM
6. adapter la payload envoyée
7. vérifier la transmission jusqu’à `ress-admppga`

---

## Résumé ultra net

### Pourquoi
Parce que les **PKE existent déjà**, et maintenant le projet veut pouvoir les **référencer dans un Service Recalcul** via un nouveau mode **Evenementiel**.

### Comment
En faisant évoluer l’écran **Service Recalcul** et sa payload pour gérer :
- un champ `Mode`
- soit un `Endpoint`
- soit un `ProducerKafkaEvent` existant



# Service Recalcul - Implémentation mode évènementiel (RESS)

## Fichiers nécessaires

1. ServiceRecalculDTO.java  
2. ValidServiceRecalcul.java  
3. Validator associé  
4. ServiceRecalculEntity.java  
5. Mapper DTO ↔ Entity  
6. Service ServiceRecalcul  
7. DAO / Repository ServiceRecalcul  
8. ProducerKafkaEventDTO.java  
9. ProducerKafkaEventEntity.java  
10. DAO ProducerKafkaEvent  
11. MongoPipeline.java  
12. ParametrageAgregeServiceImpl.java  
13. ParametrageAgregeDaoImpl.java  

Minimum vital :

- ServiceRecalculDTO  
- Validator  
- ServiceRecalculEntity  
- Mapper  
- MongoPipeline  
- ParametrageAgregeServiceImpl  

---

## 1. DTO ServiceRecalculDTO

Ajouter :

private String mode;  
private String evenementSortie;  

---

## 2. Entity ServiceRecalculEntity

Ajouter :

private String mode;  
private String evenementSortie;  

---

## 3. Constantes métier

public static final String MODE_ENDPOINT = "ENDPOINT";  
public static final String MODE_EVENEMENTIEL = "EVENEMENTIEL";  

---

## 4. Mapping DTO → Entity

entity.setMode(dto.getMode());  
entity.setEvenementSortie(dto.getEvenementSortie());  

Fallback :

if (entity.getMode() == null || entity.getMode().isBlank()) {  
    entity.setMode(MODE_ENDPOINT);  
}  

---

## 5. Mapping Entity → DTO

dto.setMode(entity.getMode());  
dto.setEvenementSortie(entity.getEvenementSortie());  

Fallback :

if (dto.getMode() == null || dto.getMode().isBlank()) {  
    dto.setMode(MODE_ENDPOINT);  
}  

---

## 6. Validation ServiceRecalcul

String mode = dto.getMode() == null || dto.getMode().isBlank()  
    ? MODE_ENDPOINT  
    : dto.getMode();  

if (!MODE_ENDPOINT.equals(mode) && !MODE_EVENEMENTIEL.equals(mode)) {  
    return false;  
}  

if (MODE_ENDPOINT.equals(mode)) {  
    return dto.getEndpoint() != null  
        && !dto.getEndpoint().isBlank()  
        && (dto.getEvenementSortie() == null || dto.getEvenementSortie().isBlank());  
}  

return dto.getEvenementSortie() != null  
    && !dto.getEvenementSortie().isBlank()  
    && (dto.getEndpoint() == null || dto.getEndpoint().isBlank());  

---

## 7. Validation endpoint conditionnelle

if (MODE_ENDPOINT.equals(mode)) {  
    checkEndpoint(dto.getEndpoint());  
}  

---

## 8. Validation PKE

if (MODE_EVENEMENTIEL.equals(mode)) {  
    checkProducerKafkaEvent(dto.getEvenementSortie());  
}  

---

## 9. MongoDB

Cas endpoint :

{  
  "mode": "ENDPOINT",  
  "endpoint": "END00009"  
}  

Cas évènementiel :

{  
  "mode": "EVENEMENTIEL",  
  "evenementSortie": "PKE00001"  
}  

---

## 10. MongoPipeline

Chercher :

ServiceRecalcul  
recalcul  
endpoint  
$project  
$addFields  

Ajouter dans projection :

mode  
evenementSortie  

---

## 11. ParametrageAgrege

Vérifier présence des champs :

mode  
evenementSortie  

dans les objets recalcul  

---

## 12. Tests API

Ancien payload :

{  
  "code": "REC00001",  
  "codeCr": "87900",  
  "endpoint": "END00009"  
}  

Attendu :

mode = ENDPOINT  

---

Nouveau payload :

{  
  "code": "REC00001",  
  "codeCr": "87900",  
  "mode": "EVENEMENTIEL",  
  "evenementSortie": "PKE00001"  
}  

Attendu :

endpoint vide  
evenementSortie sauvegardé  

---

## 13. Ordre de dev

1. DTO  
2. Entity  
3. Mapper  
4. Validator  
5. Test sauvegarde Mongo  
6. Validation endpoint  
7. Validation PKE  
8. MongoPipeline  
9. ParametrageAgrege  
10. Tests API  



# Service Recalcul - Implémentation mode évènementiel (RESS)

## 1. DTO `ServiceRecalculDTO`

Ajouter les champs :

private String mode;
private String evenementSortie;

## 2. Constantes métier

public static final String MODE_ENDPOINT = "ENDPOINT";
public static final String MODE_EVENEMENTIEL = "EVENEMENTIEL";

## 3. Validation (`ValidServiceRecalcul`)

Règles :

- Si mode null → considérer ENDPOINT
- Si mode = ENDPOINT
  - endpoint obligatoire
  - evenementSortie vide
- Si mode = EVENEMENTIEL
  - evenementSortie obligatoire
  - endpoint vide
- Sinon → erreur

Pseudo-code :

String mode = dto.getMode() == null || dto.getMode().isBlank()
    ? "ENDPOINT"
    : dto.getMode();

if (!mode.equals("ENDPOINT") && !mode.equals("EVENEMENTIEL")) return false;

if (mode.equals("ENDPOINT")) {
    return dto.getEndpoint() != null && !dto.getEndpoint().isBlank()
        && (dto.getEvenementSortie() == null || dto.getEvenementSortie().isBlank());
}

return dto.getEvenementSortie() != null && !dto.getEvenementSortie().isBlank()
    && (dto.getEndpoint() == null || dto.getEndpoint().isBlank());

## 4. Mapping DTO → Entity

entity.setMode(dto.getMode());
entity.setEvenementSortie(dto.getEvenementSortie());

Fallback :

if (entity.getMode() == null) {
    entity.setMode("ENDPOINT");
}

## 5. Mapping Entity → DTO

dto.setMode(entity.getMode());
dto.setEvenementSortie(entity.getEvenementSortie());

Fallback :

if (dto.getMode() == null) {
    dto.setMode("ENDPOINT");
}

## 6. Entity Mongo

private String mode;
private String evenementSortie;

## 7. Sauvegarde Mongo (si Document manuel)

document.append("mode", entity.getMode());
document.append("evenementSortie", entity.getEvenementSortie());

## 8. PKE (ProducerKafkaEvent)

Exposer :

GET /producer-kafka-events

Format :

[
  {
    "code": "PKE00001",
    "libelleCourt": "..."
  }
]

## 9. Validation existence PKE

if ("EVENEMENTIEL".equals(mode)) {
    existsByCode(evenementSortie);
}

## 10. Validation endpoint

if ("ENDPOINT".equals(mode)) {
    checkEndpoint(dto.getEndpoint());
}

## 11. Unicité (à valider métier)

- code + codeCr
ou
- Endpoint → codeCr + endpoint
- Event → codeCr + evenementSortie

## 12. Tests unitaires

OK :

- mode null + endpoint
- mode ENDPOINT + endpoint
- mode EVENEMENTIEL + evenementSortie

KO :

- ENDPOINT sans endpoint
- EVENEMENTIEL sans evenementSortie
- ENDPOINT + evenementSortie
- EVENEMENTIEL + endpoint
- mode invalide

## 13. Tests API

Ancien payload :

{
  "code": "REC00001",
  "codeCr": "87900",
  "endpoint": "END00009"
}

Résultat attendu :

mode = ENDPOINT

Nouveau payload :

{
  "code": "REC00001",
  "codeCr": "87900",
  "mode": "EVENEMENTIEL",
  "evenementSortie": "PKE00001"
}

## 14. OpenAPI

mode:
  type: string
  enum: [ENDPOINT, EVENEMENTIEL]

evenementSortie:
  type: string

## 15. Ordre de dev

1. DTO
2. Entity
3. Mapper
4. Fallback mode
5. Validator
6. Endpoint conditionnel
7. PKE conditionnel
8. Tests unitaires
9. Tests API