# VirtualBox sur Windows : guide complet d’utilisation

## 1. À quoi sert VirtualBox

VirtualBox est un logiciel de virtualisation.

Il permet de lancer une **machine virtuelle** dans ton PC :
- Windows dans Windows
- Linux dans Windows
- autre système invité sans toucher à ton système principal

Tu as donc :
- **hôte** = ton vrai PC
- **invité / VM** = le système installé dans VirtualBox

---

## 2. Cas d’usage classiques

VirtualBox sert à :
- tester Linux sans formater ton PC
- faire des essais réseau
- lancer un ancien système
- isoler un environnement de développement
- ouvrir un fichier `.ova` ou `.vdi`
- apprendre Docker, Ubuntu, serveur, réseau, etc.

---

## 3. Installation de VirtualBox

## Télécharger

Télécharger VirtualBox depuis le site officiel Oracle.

Installer :
- VirtualBox
- éventuellement le **VirtualBox Extension Pack** si tu veux des fonctions avancées

---

## 4. Fichiers courants utilisés par VirtualBox

## `.ova`
Archive complète d’une VM prête à importer.

## `.ovf`
Descriptif de la VM.

## `.vdi`
Disque dur virtuel.

## `.vbox`
Fichier de configuration de la VM.

---

## 5. Créer une machine virtuelle

## Étapes

1. Ouvrir VirtualBox
2. Cliquer sur **Nouvelle**
3. Donner un nom à la VM
4. Choisir le type de système :
   - Linux
   - Windows
   - autre
5. Choisir la quantité de RAM
6. Créer un disque virtuel
7. Choisir la taille du disque
8. Démarrer la VM
9. Monter un fichier ISO si besoin
10. Installer le système invité

---

## 6. Importer une machine virtuelle `.ova`

## Étapes

1. Ouvrir VirtualBox
2. **Fichier > Importer un appareil virtuel**
3. Sélectionner le fichier `.ova`
4. Vérifier les paramètres
5. Cliquer sur **Importer**

Ensuite tu peux lancer la VM directement.

---

## 7. Paramètres importants d’une VM

## Système
Permet de régler :
- ordre de boot
- chipset
- EFI
- nombre de processeurs

## Affichage
Permet de régler :
- mémoire vidéo
- accélération graphique
- taille écran

## Stockage
Permet de monter :
- ISO d’installation
- disque virtuel

## Réseau
Permet de choisir :
- NAT
- Accès par pont
- Réseau interne
- Hôte seulement

## Dossiers partagés
Permet d’échanger des fichiers entre l’hôte et la VM.

---

## 8. Réseau VirtualBox : comprendre vite

## NAT
Le plus simple.

La VM a Internet.
Pratique pour :
- installer Ubuntu
- télécharger des paquets
- faire des tests simples

La VM sort sur Internet via l’hôte.

## Accès par pont
La VM apparaît comme une vraie machine du réseau local.

Pratique si tu veux :
- pinguer la VM depuis d’autres machines
- exposer un serveur web
- accéder à la VM par son IP locale

## Hôte seulement
Communication entre ton PC hôte et la VM, sans Internet ou presque selon config.

Pratique pour :
- lab local
- tests isolés

## Réseau interne
Communication entre plusieurs VM uniquement.

---

## 9. Utiliser la VM au quotidien

## Démarrer
Sélectionner la VM puis **Démarrer**.

## Éteindre proprement
Toujours préférer l’arrêt depuis le système invité :
- Ubuntu : menu arrêt
- Windows : arrêter

Éviter de fermer brutalement sauf blocage.

## Pause
Met la VM en pause temporaire.

## Sauvegarder l’état
Permet de reprendre plus tard exactement au même endroit.

---

## 10. Capturer et libérer la souris/clavier

Quand tu cliques dans la VM, VirtualBox peut capturer :
- la souris
- le clavier

Pour sortir de la capture, utiliser la **touche Hôte**.

Par défaut sur Windows :
- **Ctrl droit**

Cette touche est très importante.

Elle sert à :
- libérer la souris
- revenir au système hôte
- utiliser certains raccourcis VirtualBox

---

## 11. Plein écran et mode ajusté

## Plein écran
Permet d’utiliser la VM comme si elle occupait tout l’écran.

## Ajuster la taille
Si les outils invités sont bien installés, l’écran de la VM s’adapte mieux à la fenêtre.

---

## 12. Copier-coller entre l’hôte et la VM

Le copier-coller entre l’hôte et la VM ne fonctionne généralement pas bien tant que les **Additions invité** ne sont pas installées.

---

## 13. Installer les Additions invité

Les **Additions invité** améliorent :
- copier-coller
- glisser-déposer
- affichage dynamique
- intégration souris
- dossiers partagés

## Étapes générales

1. Démarrer la VM
2. Dans la fenêtre VirtualBox :
   **Périphériques > Insérer l’image CD des Additions invité**
3. Dans le système invité, lancer l’installation
4. Redémarrer la VM

---

## 14. Copier-coller hôte vers VM : activation

## Activer le presse-papiers partagé

1. Éteindre la VM si besoin
2. Dans VirtualBox, sélectionner la VM
3. Cliquer sur **Configuration**
4. Aller dans **Général > Avancé**
5. Régler **Presse-papiers partagé**

Valeurs possibles :
- **Désactivé**
- **Hôte vers invité**
- **Invité vers hôte**
- **Bidirectionnel**

## Recommandation
Mettre :
- **Bidirectionnel** si tu veux copier-coller dans les deux sens
- **Hôte vers invité** si tu veux seulement coller depuis ton PC vers la VM

---

## 15. Glisser-déposer hôte vers VM

Toujours dans :
**Configuration > Général > Avancé**

Régler **Glisser-déposer** :
- Désactivé
- Hôte vers invité
- Invité vers hôte
- Bidirectionnel

Comme pour le copier-coller, cette fonction dépend souvent des **Additions invité**.

---

## 16. Si le copier-coller ne marche pas

Vérifier dans cet ordre :

## 1. Les Additions invité sont-elles installées ?
Sans elles, le copier-coller marche souvent mal ou pas du tout.

## 2. Le presse-papiers partagé est-il activé ?
Vérifier :
**Configuration > Général > Avancé**

## 3. La VM a-t-elle été redémarrée ?
Souvent nécessaire après installation.

## 4. Le système invité supporte-t-il bien la fonction ?
Certaines distributions Linux légères ou environnements minimaux peuvent être capricieux.

## 5. Tentes-tu de coller dans un terminal ?
Selon le terminal Linux :
- `Ctrl + V` ne marche pas toujours
- il faut parfois utiliser :
  - `Ctrl + Shift + V`
  - clic droit > coller

---

## 17. Copier du texte de l’hôte vers une VM Linux

## Cas courant Ubuntu

1. Copier le texte sur Windows
2. Cliquer dans la VM Ubuntu
3. Coller :
   - dans un terminal : `Ctrl + Shift + V`
   - dans un éditeur texte : `Ctrl + V`

Si ça ne marche pas :
- vérifier les Additions invité
- vérifier le presse-papiers bidirectionnel
- redémarrer

---

## 18. Copier du texte de l’hôte vers une VM Windows

Si la VM invitée est Windows :
- `Ctrl + C` sur l’hôte
- `Ctrl + V` dans la VM

Là aussi :
- Additions invité
- presse-papiers partagé activé
- redémarrage si besoin

---

## 19. Échanger des fichiers : meilleure méthode

Le copier-coller de texte est pratique.
Pour les fichiers, le plus propre reste souvent le **dossier partagé**.

---

## 20. Créer un dossier partagé entre l’hôte et la VM

## Étapes

1. Éteindre la VM
2. Sélectionner la VM dans VirtualBox
3. **Configuration > Dossiers partagés**
4. Ajouter un dossier du PC hôte
5. Choisir :
   - chemin du dossier
   - nom du partage
   - montage automatique si proposé
6. Démarrer la VM

Dans la VM, ce dossier peut apparaître automatiquement ou nécessiter une petite configuration.

---

## 21. Dossier partagé sous Linux invité

Avec Ubuntu, les Additions invité sont souvent nécessaires.

Le dossier est souvent monté dans un emplacement du type :
```bash
/media
```

ou accessible selon la config.

Parfois il faut ajouter l’utilisateur au groupe adapté, puis redémarrer la session.

---

## 22. Snapshots : très utile

Un **snapshot** est un point de sauvegarde.

Très pratique avant :
- installation logicielle
- test risqué
- modification système
- update important

## Avantage
Tu peux revenir en arrière rapidement.

## Bon usage
Faire un snapshot :
- avant une grosse installation
- avant une manip réseau
- avant un test Docker ou serveur

---

## 23. Cloner une VM

VirtualBox permet de cloner une VM.

Utile pour :
- garder une VM propre de base
- faire plusieurs variantes
- créer un labo

---

## 24. Performances : conseils

Pour éviter une VM lente :

- ne pas donner toute la RAM à la VM
- ne pas donner tous les CPU à la VM
- garder des ressources pour l’hôte
- utiliser SSD si possible
- activer la virtualisation matérielle dans le BIOS/UEFI si nécessaire

---

## 25. Problèmes fréquents

## La VM est très lente
Causes possibles :
- pas assez de RAM
- disque lent
- virtualisation BIOS désactivée
- trop d’applications ouvertes sur l’hôte

## Écran figé
Essayer :
- redémarrage VM
- vérifier affichage
- reinstall Additions invité

## Pas de réseau
Vérifier :
- NAT ou pont
- câble réseau virtuel activé
- DHCP du réseau
- pare-feu

## Impossible de copier-coller
Vérifier :
- Additions invité
- presse-papiers partagé
- redémarrage
- type de terminal ou appli

---

## 26. Touche Hôte : rappel important

Par défaut :
```text
Ctrl droit
```

Elle sert à :
- libérer la souris
- sortir de la capture clavier
- utiliser des fonctions VirtualBox

---

## 27. Différence entre copier-coller texte et transfert de fichiers

## Texte
Utilise :
- presse-papiers partagé

## Fichiers
Utilise plutôt :
- dossier partagé
- glisser-déposer
- réseau
- clé USB virtuelle selon le besoin

---

## 28. Ordre conseillé pour une première VM

1. Installer VirtualBox
2. Créer ou importer la VM
3. Démarrer
4. Installer le système
5. Installer les Additions invité
6. Activer le presse-papiers partagé
7. Activer éventuellement le glisser-déposer
8. Créer un dossier partagé
9. Faire un snapshot propre

---

## 29. Cas pratique : copier-coller hôte vers Ubuntu dans VirtualBox

## Côté VirtualBox
- VM arrêtée
- **Configuration > Général > Avancé**
- **Presse-papiers partagé = Bidirectionnel**

## Côté VM
- Démarrer Ubuntu
- **Périphériques > Insérer l’image CD des Additions invité**
- installer les Additions
- redémarrer

## Test
- Copier un texte sur Windows
- Dans Ubuntu :
  - terminal : `Ctrl + Shift + V`
  - éditeur : `Ctrl + V`

---

## 30. Résumé simple

- VirtualBox permet de lancer une machine virtuelle sur ton PC
- l’hôte est ton vrai PC
- l’invité est le système dans la VM
- pour bien utiliser la VM, installe les **Additions invité**
- pour copier-coller entre hôte et VM, active **Presse-papiers partagé**
- pour transférer des fichiers, préfère les **dossiers partagés**
- pour sortir de la capture souris/clavier, utilise la **touche Hôte** : `Ctrl droit`
- pour éviter les galères, fais des **snapshots**
- pour Internet simple, utilise le mode **NAT**
- pour exposer la VM sur ton réseau local, utilise le mode **Accès par pont**