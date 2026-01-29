# Installation et utilisation de Apache Tomcat 11 (Windows)

## 1. Pré-requis
- Java 21 minimum

```bash
java -version
```

---

## 2. Téléchargement
Site officiel :
https://tomcat.apache.org/

Choisir :
- Tomcat 11
- Windows Service Installer
- Fichier : apache-tomcat-11.0.11.exe

---

## 3. Installation
Paramètres recommandés :
- Dossier : D:\hal\Tomcat 11.0
- Port HTTP : 8080
- Java path : C:\Program Files\Java\jdk-21

---

## 4. Service Windows
Service installé :
- Apache Tomcat 11.0 Tomcat11

Raccourcis :
- Configure Tomcat
- Monitor Tomcat

---

## 5. Démarrer / Arrêter Tomcat

### Via Monitor Tomcat
- Start
- Stop

### Via services Windows
services.msc

### Via scripts
```bash
D:\hal\Tomcat 11.0\bin\startup.bat
D:\hal\Tomcat 11.0\bin\shutdown.bat
```

---

## 6. Vérification
http://localhost:8080/

---

## 7. Déploiement Spring MVC

```bash
mvn clean package
```

Résultat :
target/springmvc-starter.war

Copier le WAR dans :
D:\hal\Tomcat 11.0\webapps

---

## 8. Accès application
http://localhost:8080/springmvc-starter/

---

## 9. Logs
Dossier :
D:\hal\Tomcat 11.0\logs

---

## 10. Points techniques
- Tomcat 11 = Jakarta EE
- Packages jakarta.servlet.*
- Spring Framework 6.x
- Packaging WAR
