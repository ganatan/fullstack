# Java Enterprise & Jakarta — Synthèse complète

## Définitions

**J2SE / Java SE**  
Base standard de Java (JDK), utilisée pour applications desktop, serveur et fondation de toutes les autres éditions.

**J2ME / Java ME (Java Mobile / Micro Edition)**  
Plateforme Java pour **mobile et embarqué** (anciens téléphones, devices), basée sur des profils CLDC/CDC, **hors JEE**.

**J2EE (Java 2 Enterprise Edition)**  
Plateforme Java enterprise historique pour applications web et métiers, basée sur des serveurs d’applications, namespace `javax.*`.

**Java EE (JEE)**  
Renommage et modernisation de J2EE (annotations, simplifications), maintenu par Sun puis Oracle, toujours `javax.*`.

**Jakarta EE**  
Successeur de Java EE sous l’Eclipse Foundation, mêmes concepts enterprise, namespace `jakarta.*` suite à une rupture juridique.

---

## Panorama des éditions Java (historique)

| Nom            | Cible principale            | Période (approx.) | Namespace           | Idée clé                          |
|----------------|-----------------------------|-------------------|---------------------|-----------------------------------|
| Java SE        | Standard / Desktop / Serveur| 1996–…            | java.*              | Base du langage Java              |
| Java ME        | Mobile / Embarqué           | 1999–…            | javax.* (partiel)   | Java “micro” (CLDC / CDC)         |
| J2EE           | Enterprise (web/métier)     | 1999–2006         | javax.*             | Enterprise Java originel          |
| Java EE (JEE)  | Enterprise (web/métier)     | 2006–2017         | javax.*             | J2EE modernisé                    |
| Jakarta EE     | Enterprise (web/métier)     | 2018–…            | jakarta.*           | Rupture javax → jakarta           |

---

## Versions Java & écosystème JEE / Jakarta (focus Servlet)

| Java | Année | Type | JEE / Jakarta EE associé | Servlet API |
|------|-------|------|--------------------------|-------------|
| 8    | 2014  | LTS  | Java EE 7 / 8            | Servlet 3.1 / 4.0 |
| 9    | 2017  | STS  | Java EE 8                | Servlet 4.0 |
| 10   | 2018  | STS  | Java EE 8                | Servlet 4.0 |
| 11   | 2018  | LTS  | Java EE 8                | Servlet 4.0 |
| 12   | 2019  | STS  | Java EE 8                | Servlet 4.0 |
| 13   | 2019  | STS  | Java EE 8                | Servlet 4.0 |
| 14   | 2020  | STS  | Java EE 8                | Servlet 4.0 |
| 15   | 2020  | STS  | Java EE 8                | Servlet 4.0 |
| 16   | 2021  | STS  | Java EE 8                | Servlet 4.0 |
| 17   | 2021  | LTS  | Jakarta EE 9 / 10        | Servlet 5.0 / 6.0 |
| 18   | 2022  | STS  | Jakarta EE 9 / 10        | Servlet 5.0 / 6.0 |
| 19   | 2022  | STS  | Jakarta EE 9 / 10        | Servlet 5.0 / 6.0 |
| 20   | 2023  | STS  | Jakarta EE 9 / 10        | Servlet 5.0 / 6.0 |
| 21   | 2023  | LTS  | Jakarta EE 10 / 11       | Servlet 6.0 |
| 22   | 2024  | STS  | Jakarta EE 11            | Servlet 6.1 |
| 23   | 2024  | STS  | Jakarta EE 11            | Servlet 6.1 |
| 24   | 2025  | STS  | Jakarta EE 11            | Servlet 6.1 |
| 25   | 2025  | LTS  | Jakarta EE 11+           | Servlet 6.1+ |

---

## Points clés à retenir

- **Java ME** : mobile / embarqué, indépendant du web enterprise (pas Servlet/JSP côté serveur).
- **J2EE / Java EE** : monde **`javax.*`**, serveurs d’applications classiques.
- **Jakarta EE** : monde **`jakarta.*`**, rupture juridique et technique.
- **Java ≤ 16** : écosystème Java EE.
- **Java ≥ 17** : écosystème Jakarta EE.
