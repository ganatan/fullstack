# angular-routing

## Commandes

```bash
  ng g c pages/home
  ng g c pages/about
  ng g c pages/contact
```

---

## Code

### src/app/app.routes.ts

```ts
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'contact', component: Contact },
  { path: '**', redirectTo: '' }
];
```

### src/app/app.ts

```ts
import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    RouterLink,
    RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-starter');

}
```

### src/app/app.html

```html
<h1>angular-routing</h1>

<ul>
  <li><a routerLink="/">Home</a></li>
  <li><a routerLink="/about">About</a></li>
  <li><a routerLink="/contact">Contact</a></li>
</ul>

<router-outlet></router-outlet>
```



