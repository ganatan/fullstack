# Fonctionnement de Spring MVC — Version détaillée avec code

Ce document explique **pas à pas** le fonctionnement d’une application **Spring MVC legacy**
(Java 8 / Spring 5.3 / Tomcat 9 / configuration XML), avec **le code réel associé**.

---

## 1. Java

Java est le langage de programmation.
Le code est compilé en bytecode (`.class`) puis exécuté par la JVM.

Dans notre cas :
- Java SE 8 (1.8)
- Pas de modules
- Pas de Spring Boot

---

## 2. Servlet (socle web Java)

Une Servlet est une classe Java capable de :
- recevoir une requête HTTP
- produire une réponse HTTP

Spring MVC repose **entièrement** sur l’API Servlet.

Exemple conceptuel :
```text
HTTP Request → Servlet → HTTP Response
```

---

## 3. Tomcat

Tomcat est un **conteneur de Servlets**.

Responsabilités :
- écouter sur un port (ex: 8080)
- charger les applications web (WAR)
- instancier et appeler les Servlets

Tomcat **ne connaît pas Spring**.

---

## 4. web.xml (point d’entrée)

`web.xml` est le **fichier lu en premier par Tomcat**.

### Rôles :
- déclarer le `DispatcherServlet`
- définir le mapping URL
- initialiser Spring

```xml
<servlet>
  <servlet-name>dispatcher</servlet-name>
  <servlet-class>
    org.springframework.web.servlet.DispatcherServlet
  </servlet-class>
  <init-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>/WEB-INF/dispatcher-servlet.xml</param-value>
  </init-param>
  <load-on-startup>1</load-on-startup>
</servlet>

<servlet-mapping>
  <servlet-name>dispatcher</servlet-name>
  <url-pattern>/</url-pattern>
</servlet-mapping>
```

---

## 5. ApplicationContext racine

Le contexte racine est chargé par `ContextLoaderListener`.

```xml
<context-param>
  <param-name>contextConfigLocation</param-name>
  <param-value>/WEB-INF/applicationContext.xml</param-value>
</context-param>

<listener>
  <listener-class>
    org.springframework.web.context.ContextLoaderListener
  </listener-class>
</listener>
```

### applicationContext.xml
```xml
<beans>
</beans>
```

Ce contexte est prévu pour :
- services
- repositories
- datasources

---

## 6. DispatcherServlet

Le `DispatcherServlet` est :
- une Servlet
- le cœur de Spring MVC

Il reçoit **toutes** les requêtes HTTP.

---

## 7. dispatcher-servlet.xml

Configuration spécifique MVC.

```xml
<context:component-scan base-package="com.ganatan.starter"/>

<mvc:annotation-driven/>
```

### Effets :
- détection des controllers
- activation de @GetMapping, @PostMapping
- activation de Jackson pour le JSON

---

## 8. Controller

Exemple réel :

```java
@RestController
public class RootController {

  @GetMapping("/")
  public Map<String, Object> root() {
    Map<String, Object> payload = new HashMap<>();
    payload.put("application", "springmvc-starter-java8-legacy");
    payload.put("java", System.getProperty("java.version"));
    return payload;
  }
}
```

Spring :
- instancie la classe
- l’enregistre dans l’ApplicationContext
- l’associe à l’URL `/`

---

## 9. Cycle complet d’une requête

```text
Navigateur
  ↓
Tomcat
  ↓
DispatcherServlet
  ↓
HandlerMapping
  ↓
Controller
  ↓
Jackson
  ↓
HTTP Response (JSON)
```

---

## 10. Sérialisation JSON

Grâce à :
- `@RestController`
- `@GetMapping`
- Jackson (`jackson-databind`)

Spring transforme automatiquement :
```java
Map<String, Object>
```
en :
```json
{
  "application": "...",
  "java": "..."
}
```

---

## 11. Séparation des responsabilités

- Tomcat : serveur
- Servlet : socle web
- Spring : gestion des objets
- Spring MVC : web
- DispatcherServlet : orchestration

---

## 12. Pourquoi cette architecture est legacy

- XML explicite
- web.xml obligatoire
- `javax.servlet`
- WAR déployé sur Tomcat

C’est exactement ce que l’on trouve encore massivement en entreprise.

---

## Résumé final

Spring MVC est une surcouche élégante au-dessus des Servlets.
Tomcat exécute.
Spring organise.
Le DispatcherServlet orchestre.
