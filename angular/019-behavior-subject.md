# angular-subject-only

## Code

### src/app/app.html

```html
<h1>angular-subject-only</h1>

<ul>
  <li *ngFor="let movie of movies">{{ movie }}</li>
</ul>

<button (click)="addMovie('Blade Runner')">Add Blade Runner</button>
<button (click)="removeMovie('Exodus')">Remove Exodus</button>
<button (click)="resetMovies()">Reset</button>

<router-outlet />
```

---

### src/app/app.ts

```ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {

  private readonly moviesSubject = new Subject<string[]>();

  movies: string[] = [];

  private subscription!: Subscription;

  ngOnInit() {
    this.subscription = this.moviesSubject.subscribe(value => {
      this.movies = value;
    });

    this.moviesSubject.next([
      'Aliens',
      'Gladiator',
      'Exodus',
      'Legend',
    ]);
  }

  addMovie(name: string) {
    const value = name.trim();
    if (!value) return;
    this.moviesSubject.next([...this.movies, value]);
  }

  removeMovie(name: string) {
    this.moviesSubject.next(this.movies.filter(m => m !== name));
  }

  resetMovies() {
    this.moviesSubject.next(['Aliens', 'Gladiator', 'Exodus', 'Legend']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
```
