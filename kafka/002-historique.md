# 002-historique.md

# Kafka — Zookeeper vs KRaft (historique et évolution)

## Origine de Kafka
Kafka est créé chez LinkedIn pour résoudre un problème simple :
transporter de gros volumes d’événements en temps réel de manière fiable et distribuée.

Dates clés :

- 2010 → Kafka est développé chez LinkedIn
- 2011 → Kafka devient open source
- 2014 → création de Confluent (par les créateurs de Kafka)
- 2015–2020 → adoption massive en entreprise
- 2020 → début du remplacement de Zookeeper
- 2022 → Kafka 3.x introduit KRaft en production
- 2023+ → KRaft devient l’architecture recommandée
- 2025+ → Zookeeper considéré comme legacy

---

# Kafka + Zookeeper (architecture historique)

Pendant plus de 10 ans, Kafka dépendait de Zookeeper.

Zookeeper servait à :
- stocker les métadonnées du cluster
- gérer les brokers
- élire le controller
- gérer la configuration distribuée

Architecture classique :

Zookeeper
   ↑
Kafka brokers

Un cluster Kafka nécessitait toujours :
- au moins un broker
- un cluster Zookeeper

Même en local :
zookeeper + kafka

C’était robuste mais complexe à opérer.

---

# Problèmes de Zookeeper

Zookeeper n’est pas Kafka.
C’est un système distribué séparé.

Cela introduisait :
- une dépendance supplémentaire
- une maintenance complexe
- des problèmes de synchronisation
- une difficulté de scaling
- deux systèmes distribués à administrer

Kafka dépendait donc d’un composant externe critique.

---

# KRaft (Kafka Raft Metadata Mode)

KRaft est la nouvelle architecture Kafka.

Objectif :
supprimer Zookeeper et intégrer la gestion des métadonnées dans Kafka.

KRaft repose sur :
- le protocole Raft
- un metadata quorum
- un controller intégré

Architecture moderne :

Kafka broker + controller (KRaft)

Kafka devient autonome.

---

# Pourquoi Raft

Raft est un algorithme de consensus distribué qui permet :
- l’élection d’un leader
- la réplication des métadonnées
- la cohérence du cluster

Même rôle que Zookeeper, mais intégré à Kafka.

---

# Différences principales

## Kafka + Zookeeper
- architecture historique
- deux systèmes distribués
- plus complexe à opérer
- encore présent dans certains clusters existants

## Kafka KRaft
- architecture moderne
- Kafka autonome
- moins de composants
- plus simple en local et en prod
- recommandé par la communauté Kafka

---

# Où en est Kafka aujourd’hui

Aujourd’hui :

- Kafka 3.x supporte pleinement KRaft
- Confluent recommande KRaft
- les nouveaux clusters sont créés en KRaft
- Zookeeper reste supporté pour compatibilité

La tendance est claire :
Kafka sans Zookeeper est le futur.

---

# Résumé

Kafka a évolué en trois phases :

1. Kafka dépend de Zookeeper (2011–2020)
2. Transition vers KRaft (2020–2022)
3. Kafka autonome (2023+)

KRaft remplace Zookeeper pour la gestion des métadonnées du cluster.
