
# Gestion du build avec electron

  npm install --save-dev electron-builder

  Script danspackage.json
    "build": "electron-builder"
  
  Verifier package.json
    "main": "src/main/main.js",


  Rajout de l'option build dans package.json

  {
    "name": "dalog-connector",
    "version": "1.0.0",
    "description": "",
    "main": "src/main/main.js",
    "scripts": {
      "dev": "cross-env NODE_ENV=development electron src/main/main.js",
      "start": "cross-env NODE_ENV=production electron src/main/main.js",
      "build:angular": "cd src/renderer/angular && npm run build:electron",
      "build": "electron-builder"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "type": "commonjs",
    "build": {
      "appId": "com.ganatan.dialogconnector",
      "productName": "DialogConnector",
      "files": [
        "src/main/main.js",
        "src/renderer/angular/dist/**/*",
        "package.json"
      ],
      "directories": {
        "buildResources": "assets"
      },
      "mac": {
        "target": [
          "dmg",
          "zip"
        ]
      },
      "win": {
        "target": [
          "nsis"
        ]
      },
      "linux": {
        "target": [
          "AppImage"
        ]
      }
    },
    "devDependencies": {
      "cross-env": "^7.0.3",
      "electron": "37.2.0",
      "electron-builder": "^26.0.12"
    },
    "dependencies": {
      "dotenv": "17.0.1"
    }
  }