~~~bash
npm install --save-dev typescript
~~~

~~~bash
npx tsc --init
~~~

~~~json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "npm run build && npm run start"
  },
  "devDependencies": {
    "typescript": "^5.9.2"
  }
}
~~~

~~~json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "module": "commonjs",
    "target": "ES2020"
  }
}
~~~

~~~text
media-node/
  src/
    index.ts
  dist/
  package.json
  tsconfig.json
~~~

~~~bash
npm run dev
~~~