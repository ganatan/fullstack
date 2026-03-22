# Problème de lancement Spring Boot dans IntelliJ

## Constats

- IntelliJ essaie de lancer la classe `com.mvp.starter.SpringbootStarterApplication`
- Cette classe n’existe plus dans le projet
- La vraie classe principale est `com.mvp.Application`

## Cause

- Le code Java est correct
- Le problème vient d’une ancienne configuration **Run/Debug** conservée par IntelliJ

## Correction

- Ouvrir `Run > Edit Configurations`
- Supprimer la configuration `SpringbootStarterApplication`
- Garder ou recréer une configuration qui lance `com.mvp.Application`
- Le plus simple : clic droit sur `Application.java` puis `Run`

## Conclusion

Ce n’est pas un problème Spring Boot.
C’est une configuration IntelliJ obsolète qui pointe vers une mauvaise classe `main`.