# Origines

## Histoire Java → Spring (synthèse chronologique)

1. **1991–1995** : projet *Green* chez Sun → naissance de Java  
   Objectifs : portabilité, sécurité, robustesse  
   **JVM** (*Java Virtual Machine*) : exécute le bytecode Java

2. **1996** : Java 1.0  
   **WORA** (*Write Once Run Anywhere*) : même binaire sur tous les OS

3. **1998–2002** : arrivée de **J2EE** (*Java 2 Enterprise Edition*)  
   Objectif : standardiser le backend entreprise

4. Acronymes J2EE majeurs :  
   **EJB** (*Enterprise JavaBeans*) : composants métier serveur  
   **JTA** (*Java Transaction API*) : gestion des transactions  
   **JNDI** (*Java Naming Directory Interface*) : lookup de ressources  
   **JSP** (*Java Server Pages*) : génération de vues web

5. Limites J2EE : lourdeur, XML massif, couplage au conteneur, tests complexes

6. **2002** : Rod Johnson critique J2EE dans un ouvrage de référence

7. **2003–2004** : naissance de Spring Framework  
   Réaction directe aux excès de J2EE

8. Acronymes fondateurs Spring :  
   **IoC** (*Inversion of Control*) : le conteneur gère la création des objets  
   **DI** (*Dependency Injection*) : dépendances injectées, pas instanciées  
   **AOP** (*Aspect Oriented Programming*) : gestion transverse (transactions, sécurité)

9. Principe clé : **POJO** (*Plain Old Java Object*)  
   Classes métier sans dépendance technique

10. **2006–2012** : généralisation des annotations  
    Réduction du XML, configuration plus proche du code

11. **2014** : naissance de Spring Boot  
    Objectif : productivité maximale et démarrage immédiat

12. Concepts Spring Boot :  
    **Auto-Configuration** : configuration automatique selon le classpath  
    **Starter** : dépendances préconfigurées  
    **Embedded Server** : serveur HTTP embarqué

13. Situation actuelle :  
    Java = socle stable  
    Spring = infrastructure  
    Spring Boot = accélérateur de mise en production
