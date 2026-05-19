# typescript-node.md

# TypeScript + Node.js — Installation minimale

## Objectif
Compiler un fichier `.ts` en `.js` puis l’exécuter avec Node.js.

---

# Installation de TypeScript

Commande :

```bash
npm install --save-dev typescript
```

Cela installe :
- TypeScript
- la commande `tsc`

---

# Génération du fichier tsconfig.json

Commande :

```bash
npx tsc --init
```

Cela crée le fichier :

```text
tsconfig.json
```

---

# package.json

Exemple minimal :

```json
{
  "name": "media-node",
  "version": "1.0.0",
  "type": "commonjs",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "npm run build && npm run start"
  },
  "devDependencies": {
    "typescript": "^5.9.2"
  }
}
```

---

# tsconfig.json

Configuration minimale :

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "module": "commonjs",
    "target": "ES2020"
  }
}
```

---

# Structure du projet

```text
media-node/
  src/
    index.ts
  dist/
  package.json
  tsconfig.json
```

---

# src/index.ts

```typescript
console.log('00000000001:');

function getItems() {
  console.log('00000000001:getItems');
}

getItems();
```

---

# Compilation

Commande :

```bash
npm run build
```

Résultat :

```text
src/index.ts
→
dist/index.js
```

---

# Exécution

Commande :

```bash
npm run start
```

---

# Compilation + Exécution

Commande :

```bash
npm run dev
```

Cela fait :

```text
1. compilation TypeScript
2. génération du JavaScript
3. exécution Node.js
```