
# Angular App – Fullstack with Angular 19 & Node.js  
[🇬🇧 English] | [🇫🇷 Si vous parlez français, c’est ici ➝ README.fr.md](./README.fr.md)

This repository contains a **fullstack web application** made up of two separate projects:

- **frontend-angular**: Angular 19 frontend application  
- **backend-nodesjs**: Node.js API using mocked or real data (PostgreSQL/MySQL)

---

## 🌐 Live Demo  
[Check the demo](https://angular.ganatan.com)

---

## 🔧 Frontend behavior (Angular)

The Angular app uses the `environment.ts` file:

```ts
useDatabase: false,
backend: 'http://localhost:3000',
```

### Two modes available:

| `useDatabase` | Behavior                                  |
|---------------|-------------------------------------------|
| `false`       | Uses **mock data** from the frontend      |
| `true`        | Uses **real data** from the backend (`http://localhost:3000`) |

---

## 🛠️ Backend behavior (Node.js)

The backend uses a `.env` configuration file:

```env
PORT=3000
DB_CLIENT=mock
```

### Behavior based on `DB_CLIENT`:

| `DB_CLIENT` | Data source           | Setup required        |
|-------------|------------------------|------------------------|
| `mock`      | Mocked data            | None                   |
| `pg`        | PostgreSQL             | Run SQL scripts        |
| `mysql`     | MySQL                  | Run SQL scripts        |

---

## 🔗 Available API endpoints

Default backend endpoints are:

- [http://localhost:3000/continents](http://localhost:3000/continents)
- [http://localhost:3000/cities](http://localhost:3000/cities)
- [http://localhost:3000/countries](http://localhost:3000/countries)
- [http://localhost:3000/persons](http://localhost:3000/persons)
- [http://localhost:3000/professions](http://localhost:3000/professions)

---

## 🚀 Quick Start

### Frontend

```bash
git clone https://github.com/ganatan/angular-app.git
cd angular-app/frontend-angular
npm install
npm start
```

Accessible at: [http://localhost:4200](http://localhost:4200)

---

### Backend

```bash
cd angular-app/backend-nodesjs
npm install
npm start
```

Accessible at: [http://localhost:3000](http://localhost:3000)

---

## 👤 Author

- **Danny** – [www.ganatan.com](https://www.ganatan.com)

---

## 📚 Documentation

- 🇬🇧 [Tutorials in English](https://www.ganatan.com/tutorials/en)
- 🇫🇷 [Tutoriels en français](https://www.ganatan.com/tutorials)
