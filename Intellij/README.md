
# Installation
  
  https://www.jetbrains.com/idea/download/?section=windows

  ideaIU-2025.1.3.exe

  IntelliJ Ultimate Edition 🟢	✔️ support complet des serveurs (Tomcat, GlassFish...)
  IntelliJ Community Edition 🔴	❌ pas de support Tomcat, pas de "Run on Server"

  Il faut Activer ta licence IntelliJ Ultimate
    via
      Files / Settings / Plugins


# Utilisation de Intellij
  Ouvrir un projet
  Selection Maven Project

# Parametrage du JDK Configuré   
  - Test de java
  where java
      C:\Program Files\Common Files\Oracle\Java\javapath

  File > Project Structure (Ctrl+Alt+Maj+S)
    Onglet Project
      Dans Project SDK, clique Add SDK > JDK
      Sélectionne ton dossier JDK local :
        Ex sous Windows : C:\Program Files\Java\jdk-21
      Valide > Apply > OK

# Touches Commentaires
  File / Settings
    KeyMap / Windows
      Main Menu / code
        Comment Actions
          Tout supprimer
          Add Keyboard Shortcut
            Taper       Ctrl + /


# Format du texte
  File / Settings
    KeyMap / Windows
      Main Menu / code
        code Formatting Actions
          Reformat Code
          Tout supprimer
          Add Keyboard Shortcut
            Taper       Maj + Alt + F

# Changement de la version de JDK
  Ouvre le menu :
  File → Project Structure… (Ctrl + Alt + Shift + S)
  Dans Project :
    Project SDK → choisis jdk-25

# Changement Couleur Editeur
  File → Settings → Appearance & Behavior → Appearance    
    Light with Light Header

# Changement Taille Texte / font 
  File → Settings → Editor → Font
    consolas   12 / 1.0

# Formattage
  Formattage du texte
    Ctrl + Alt + L

# Indetation et Tab
  
  - Pour les fichiers Java
    File → Settings → Editor → Code Style → Java → Tabs and Indents
    2 partout

  - Pour les fichiers XML
    File → Settings → Editor → Code Style → XML    

# Raccourcis
  
  Ctrl + F4 : Ferme Fichier

# Lancement run et Browser
  run / Edit Configurations
    Modify Options
      Add Before Launch Task
        Laucnh Web Browser
          URL : http://localhost:3003/

# Parametrage de Tomcat
  Run / Edit Configurations

# Parametre Microsoft
  Microsoft Defender
    Exclude Folders      

# Execution
  backend-java
    Type : WebApp Java EE/Jakarta EE (Servlets)
    main() : ❌ Pas de méthode main()
    Fonctionnement : WAR déployé sur un serveur externe (Tomcat, Jetty…)
    Lancement :
      Eclipse : Run on Server
      IntelliJ : Edit Configurations > Tomcat Server > Deployment WAR

  backend-spring
    Type : Spring MVC classique (sans Spring Boot)
    main() : ❌ Pas de méthode main()
    Fonctionnement : WAR avec DispatcherServlet, Spring XML ou JavaConfig, déployé sur Tomcat
    Lancement :
      Eclipse : Run on Server (via WTP)
      IntelliJ : Tomcat Server > Deployment WAR

  backend-springboot
    Type : Spring Boot application
    main() : ✅ Avec méthode main()
    Fonctionnement : Serveur intégré (Tomcat embarqué), lancé via SpringApplication.run(...)
    Lancement :
      Eclipse : clic droit sur Application.java → Run as > Java Application
      IntelliJ : clic droit → Run 'Application.main()'

# Fermer une fenetre
  File → Settings → Keymap
      
    Window
      Editor Tabs
        Editor Close Action
          Close Tab

# Formattage
  Ctrl + Alt + L      

# Erreur UTF sur Eclipse
  Clic droit sur ton projet java-starter → Properties
  Menu Resource
  Dans la section Text file encoding :
  Sélectionne Other
  Choisis UTF-8
    Clique sur Apply and Close  

# lombok
# Activer l’annotation processing
  File → Settings…
    Build, Execution, Deployment
      Compiler
        Annotation Processors
          Coche Enable annotation processing
          En bas → cocher aussi :
          ✔ "Obtain processors from project classpath"
        Valide → OK