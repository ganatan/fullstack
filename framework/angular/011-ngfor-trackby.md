# angular-ngfor-trackby

## Code


### src/app/app.html

```html
<h1>angular-starter-ngfor-for</h1>
items : {{ items | json }}<br>

<h2>Version ngFor Items without trackby</h2>
<ul>
  <li *ngFor="let item of items">
    {{ item }}
  </li>
</ul>

<h2>Version ngFor Items with trackBy</h2>
<ul>
  <li *ngFor="let item of items; trackBy: trackItem">
    {{ item }}
  </li>
</ul>

<h2>Version ngFor Movies</h2>
<ul>
  <li *ngFor="let movie of movies">
    {{ movie.name }}
  </li>
</ul>


<h2>Version for Items</h2>
<ul>
  @for (item of items; track item) {
    <li>{{ item }}</li>
  }
</ul>

<h2>Version for Movies</h2>
<ul>
  @for (movie of movies; track movie) {
    <li>{{ movie.name }}</li>
  }
</ul>

<router-outlet />
```

### src/app/app.ts

```ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { JsonPipe } from '@angular/common';
import { CommonModule } from '@angular/common';

class Movie {
  public name: string = '';
  constructor() {
  }
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    JsonPipe,
    CommonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-starter');

  items: string[] = [
    'Aliens',
    'Exodus',
    'Legend',
    'Gladiator'
  ]

  movies: Movie[] = [
    { name: 'Aliens' },
    { name: 'Exodus' },
    { name: 'Legend' },
    { name: 'Gladiator' },
  ]

  trackItem(index: number, item: string) {
    return item;
  }

}
```