# angular-service

## Commandes

```bash
  ng g service services/items

  ng g s services/items
```

---

## Code

### src/app/services/items.ts

```ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Items {
  constructor() {
    console.log('Items:constructor');
  }

  load() {
    console.log('Items:load');
    let result = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
        console.log('Items:resolve');
      }, 4000)
    })
    return result;
  }
  
}
```

### src/app/app.html

```html
<h1>angular-starter-service</h1>
<button (click)="onLoadItems()">Load Items</button>
message : {{ message }}
<router-outlet />
```

### src/app/app.ts

```ts
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Items } from './services/items';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-starter');

  message:string='';
  constructor(private items: Items) {
  }

  onLoadItems() {
    console.log('App:onLoadItems');
    this.items.load()
      .then(() => { 
        this.message = 'onLoadItems:then';
        console.log('App:onLoadItems:then') })
      .catch(() => { 
        this.message = 'onLoadItems:catch';
        console.log('onLoadItems:catch') 
      })
      .finally(() => { console.log('App:onLoadItems:finally') });
  }

}
```
