# springmvc-starter — création (IntelliJ + Maven + Tomcat)

## 1) Création du projet dans IntelliJ

File → New → Project… → Maven Archetype

### 1.1 Archetype
- GroupId : org.apache.maven.archetypes
- ArtifactId : maven-archetype-webapp
- Version : 1.4

### 1.2 Coordonnées du projet
- GroupId : com.ganatan
- ArtifactId : springmvc-starter
- Name : springmvc-starter
- Version : 1.0.0-SNAPSHOT
- Packaging : WAR
- Java : 21

Cliquer sur Create.

---

## 2) Ajouts après génération

## 2.1 Remplacer pom.xml

Remplacer le contenu de pom.xml par :

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.ganatan</groupId>
  <artifactId>springmvc-starter</artifactId>
  <version>1.0.0-SNAPSHOT</version>
  <packaging>war</packaging>

  <properties>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <spring.version>6.1.14</spring.version>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-webmvc</artifactId>
      <version>${spring.version}</version>
    </dependency>

    <dependency>
      <groupId>jakarta.servlet</groupId>
      <artifactId>jakarta.servlet-api</artifactId>
      <version>6.0.0</version>
      <scope>provided</scope>
    </dependency>

    <dependency>
      <groupId>jakarta.servlet.jsp</groupId>
      <artifactId>jakarta.servlet.jsp-api</artifactId>
      <version>3.1.1</version>
      <scope>provided</scope>
    </dependency>

    <dependency>
      <groupId>org.glassfish.web</groupId>
      <artifactId>jakarta.servlet.jsp.jstl</artifactId>
      <version>3.0.1</version>
    </dependency>
  </dependencies>

  <build>
    <finalName>springmvc-starter</finalName>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-war-plugin</artifactId>
        <version>3.4.0</version>
        <configuration>
          <failOnMissingWebXml>false</failOnMissingWebXml>
        </configuration>
      </plugin>
    </plugins>
  </build>
</project>
```

---

## 2.2 Supprimer les fichiers générés inutiles

Supprimer :
- src/main/webapp/index.jsp
- src/main/webapp/WEB-INF/web.xml

---

## 2.3 Créer les packages Java

Créer :
- src/main/java/com/ganatan/springmvcstarter/config
- src/main/java/com/ganatan/springmvcstarter/controller

---

## 2.4 Ajouter les classes Java

### AppInitializer.java
Créer : src/main/java/com/ganatan/springmvcstarter/config/AppInitializer.java

```java
package com.ganatan.springmvcstarter.config;

import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

public class AppInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {

  @Override
  protected Class<?>[] getRootConfigClasses() {
    return new Class<?>[0];
  }

  @Override
  protected Class<?>[] getServletConfigClasses() {
    return new Class<?>[] { WebMvcConfig.class };
  }

  @Override
  protected String[] getServletMappings() {
    return new String[] { "/" };
  }
}
```

### WebMvcConfig.java
Créer : src/main/java/com/ganatan/springmvcstarter/config/WebMvcConfig.java

```java
package com.ganatan.springmvcstarter.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "com.ganatan.springmvcstarter")
public class WebMvcConfig implements WebMvcConfigurer {

  @Override
  public void configureViewResolvers(ViewResolverRegistry registry) {
    registry.jsp("/WEB-INF/views/", ".jsp");
  }
}
```

### RootController.java
Créer : src/main/java/com/ganatan/springmvcstarter/controller/RootController.java

```java
package com.ganatan.springmvcstarter.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RootController {

  @GetMapping("/")
  public String home(Model model) {
    model.addAttribute("app", "springmvc-starter");
    return "home";
  }
}
```

---

## 2.5 Ajouter la JSP

Créer le dossier :
- src/main/webapp/WEB-INF/views

Créer : src/main/webapp/WEB-INF/views/home.jsp

```jsp
<%@ page contentType="text/html; charset=UTF-8" %>
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>springmvc-starter</title>
  </head>
  <body>
    <h1>${app}</h1>
  </body>
</html>
```

---

## 3) Configuration Tomcat dans IntelliJ

Run → Edit Configurations… → + → Tomcat Server → Local

### Server
- Application server : Tomcat 10.1+

### Deployment
- + → Artifact → springmvc-starter:war exploded
- Application context : /springmvc-starter

---

## 4) Lancer

Run (configuration Tomcat)

URL :
- http://localhost:8080/springmvc-starter/
