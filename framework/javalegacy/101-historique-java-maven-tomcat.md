
# Java, Maven et Tomcat - Correspondances des versions

## Objectif

Comprendre les correspondances entre :

```text
Java
Maven
Tomcat
Spring
Spring Boot
```

afin d'identifier rapidement les technologies utilisées dans un projet.

---

# Historique Java

| Année | Version Java | Nom |
|---------|---------|---------|
| 1996 | Java 1.0 | Première version |
| 1997 | Java 1.1 | Événements AWT |
| 1998 | Java 1.2 | Collections Framework |
| 2000 | Java 1.3 | HotSpot |
| 2002 | Java 1.4 | Assertions |
| 2004 | Java 5 | Generics, Annotations |
| 2006 | Java 6 | Version entreprise historique |
| 2011 | Java 7 | NIO.2 |
| 2014 | Java 8 | Lambdas, Streams |
| 2017 | Java 9 | Modules |
| 2018 | Java 10 | var |
| 2018 | Java 11 | LTS |
| 2019 | Java 12 | Non LTS |
| 2019 | Java 13 | Non LTS |
| 2020 | Java 14 | Records Preview |
| 2020 | Java 15 | Text Blocks |
| 2021 | Java 16 | Records |
| 2021 | Java 17 | LTS |
| 2022 | Java 18 | Non LTS |
| 2022 | Java 19 | Non LTS |
| 2023 | Java 20 | Non LTS |
| 2023 | Java 21 | LTS |
| 2024 | Java 22 | Non LTS |
| 2024 | Java 23 | Non LTS |
| 2025 | Java 24 | Non LTS |
| 2025 | Java 25 | LTS |

---

# Historique Maven

| Année | Version Maven |
|---------|---------|
| 2002 | Maven 1 |
| 2005 | Maven 2 |
| 2010 | Maven 3.0 |
| 2015 | Maven 3.3 |
| 2017 | Maven 3.5 |
| 2019 | Maven 3.6 |
| 2021 | Maven 3.8 |
| 2024 | Maven 3.9 |
| 2025 | Maven 3.9.11 |

---

# Historique Tomcat

| Année | Version Tomcat | Servlet |
|---------|---------|---------|
| 2003 | Tomcat 5.0 | Servlet 2.4 |
| 2005 | Tomcat 5.5 | Servlet 2.4 |
| 2007 | Tomcat 6 | Servlet 2.5 |
| 2011 | Tomcat 7 | Servlet 3.0 |
| 2014 | Tomcat 8 | Servlet 3.1 |
| 2016 | Tomcat 8.5 | Servlet 3.1 |
| 2018 | Tomcat 9 | Servlet 4.0 |
| 2022 | Tomcat 10 | Jakarta Servlet 5 |
| 2024 | Tomcat 11 | Jakarta Servlet 6 |

---

# Correspondances Java / Tomcat

## Java 6

```text
Tomcat 6
Tomcat 7
```

---

## Java 7

```text
Tomcat 7
Tomcat 8
```

---

## Java 8

```text
Tomcat 8
Tomcat 8.5
Tomcat 9
```

C'est la combinaison la plus fréquente dans les projets legacy.

---

## Java 11

```text
Tomcat 9
```

Très fréquent dans les projets récents.

---

## Java 17

```text
Tomcat 10
Tomcat 10.1
```

---

## Java 21

```text
Tomcat 10.1
Tomcat 11
```

---

# Correspondances Spring Boot

## Spring Boot 1.x

```text
Java 7
Java 8
Tomcat 8
```

---

## Spring Boot 2.x

```text
Java 8
Java 11
Java 17

Tomcat 8.5
Tomcat 9
```

Très répandu.

---

## Spring Boot 3.x

```text
Java 17 minimum
Java 21 recommandé

Tomcat 10.1
```

Jakarta EE obligatoire.

---

# Correspondances Maven recommandées

## Projet Java 8

```text
Java 8
Maven 3.9.11
```

---

## Projet Java 11

```text
Java 11
Maven 3.9.11
```

---

## Projet Java 17

```text
Java 17
Maven 3.9.11
```

---

## Projet Java 21

```text
Java 21
Maven 3.9.11
```

---

# Cas typique 

Probabilité élevée :

```text
Java 8
SVN
Maven 3.3 à 3.6
JUnit 4
Mockito
Apache Commons
Tomcat 8.5 ou 9
Linux
```

---

# Cas typique 

```text
Java 8
Maven 3.x
Jenkins
JUnit 4
Mockito
Tomcat 8.5
```

---

# Cas typique 

```text
Java 17
Maven 3.9
Spring Boot 3
Docker
OpenShift
Tomcat embarqué
```

---

# Recommandation pour les révisions

## Prototype Legacy

```text
JDK 8u202
Maven 3.9.11
Tomcat 9
SVN
JUnit 4
Mockito
Apache Commons
```

---

## Prototype Moderne

```text
Java 21
Maven 3.9.11
Spring Boot 3.5
Tomcat 10.1 embarqué
JUnit 5
Mockito
Docker
```

---

# Résumé


```text
Java 8
Maven 3.9.11
Tomcat 9
SVN
JUnit 4
Mockito
Apache Commons
```

Pour préparer les projets modernes :

```text
Java 21
Maven 3.9.11
Spring Boot 3.x
Tomcat 10.1
JUnit 5
Docker
Kubernetes
```