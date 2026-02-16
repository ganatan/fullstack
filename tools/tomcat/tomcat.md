# Installation et utilisation de Apache Tomcat 11 (Windows)

## 0. Compatibilité

| Tomcat | Java | Spring Framework | Spring Boot | Maven |
|-------|------|------------------|-------------|--------|
| 9.0.x | 8 → 17 | 5.3.x | 2.7.x | 3.6+ |
| 10.0.x | 11 → 17 | 5.3.x | 2.7.x | 3.6+ |
| 10.1.x | 17 → 25 | 6.0.x → 6.2.x | 3.1.x → 3.4.x | 3.8+ |
| 11.0.x | 17 → 25 | 6.2.x | 4.0.x | 3.9+ |



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
- Fichier : apache-tomcat-11.0.18.exe

---

## 3. Installation
Paramètres recommandés :
- user-name : admin
- Password : Trustno1
- Java path Virtual Machine : D:\hal\Java\jdk-25
- Dossier : D:\hal\Tomcat 11.0
- Port HTTP : 8080

---

## 4. Service Windows
Service installé :
- Apache Tomcat 11.0 Tomcat11

Raccourcis :
- Configure Tomcat
- Monitor Tomcat

---

## 5. Démarrer / Arrêter Tomcat

### Creer Icone Monitor Tomcat
- D:\hal\Tomcat 10.0\bin\Tomcat9w.exe
- D:\hal\Tomcat 10.0\bin\Tomcat10w.exe
- D:\hal\Tomcat 10.0\bin\Tomcat11w.exe

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
