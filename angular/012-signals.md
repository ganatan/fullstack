# angular-ngfor-trackby

## Code


### src/app/app.html

```html
<h1>angular-signals</h1>

<ul>
  @for (movie of movies(); track movie) {
    <li>{{ movie }}</li>
  }
</ul>

<button (click)="addMovie('Blade Runner')">Add Blade Runner</button>
<button (click)="removeMovie('Exodus')">Remove Exodus</button>
<button (click)="resetMovies()">Reset</button>

<router-outlet />
```

### src/app/app.ts

```ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-starter');

  readonly movies = signal<string[]>([
    'Aliens',
    'Gladiator',
    'Exodus',
    'Legend',
  ]);

  addMovie(name: string) {
    const value = name.trim();
    if (!value) return;
    this.movies.update(list => [...list, value]);
  }

  removeMovie(name: string) {
    this.movies.update(list => list.filter(m => m !== name));
  }

  resetMovies() {
    this.movies.set(['Aliens', 'Gladiator', 'Exodus', 'Legend']);
  }
}
```