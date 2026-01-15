# angular-subject

## Code


### src/app/app.html

```html
<h1>template-driven forms : sans signals vs avec signals</h1>

<h2>Sans signals</h2>
<button (click)="changeInput()">Change</button>
<input [(ngModel)]="name">
{{ name }}

<h3>Movie sans signals</h3>
<form>
  <label for="name1">Name</label>
  <input id="name1" type="text" name="name1" [(ngModel)]="movie.name">

  <br><br>

  <label for="releaseDate1">Release Date</label>
  <input id="releaseDate1" type="date" name="releaseDate1" [(ngModel)]="movie.releaseDate">

  <br><br>

  <label for="franchise1">Franchise</label>
  <input id="franchise1" type="checkbox" name="franchise1" [(ngModel)]="movie.franchise">

  <br><br>

  <label for="budget1">Budget</label>
  <input id="budget1" type="number" name="budget1" [(ngModel)]="movie.budget">

  <br><br>

  <button type="submit">Valider</button>
</form>

<hr>

<h2>Avec signals</h2>
<button (click)="changeInput()">Change</button>
<input [ngModel]="nameS()" (ngModelChange)="nameS.set($event)">
{{ nameS() }}

<h3>Movie avec signals</h3>
<form>
  <label for="name2">Name</label>
  <input
    id="name2"
    type="text"
    name="name2"
    [ngModel]="movieS().name"
    (ngModelChange)="movieS.update(m => ({ ...m, name: $event }))"
  >

  <br><br>

  <label for="releaseDate2">Release Date</label>
  <input
    id="releaseDate2"
    type="date"
    name="releaseDate2"
    [ngModel]="movieS().releaseDate"
    (ngModelChange)="movieS.update(m => ({ ...m, releaseDate: $event }))"
  >

  <br><br>

  <label for="franchise2">Franchise</label>
  <input
    id="franchise2"
    type="checkbox"
    name="franchise2"
    [ngModel]="movieS().franchise"
    (ngModelChange)="movieS.update(m => ({ ...m, franchise: $event }))"
  >

  <br><br>

  <label for="budget2">Budget</label>
  <input
    id="budget2"
    type="number"
    name="budget2"
    [ngModel]="movieS().budget"
    (ngModelChange)="movieS.update(m => ({ ...m, budget: $event }))"
  >

  <br><br>

  <button type="submit">Valider</button>
</form>

<router-outlet />
```

### src/app/app.ts

```ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FormsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  name = 'Alien';

  movie = {
    name: 'Alien',
    releaseDate: '',
    franchise: false,
    budget: 0
  };

  readonly nameS = signal('Alien');

  readonly movieS = signal({
    name: 'Alien',
    releaseDate: '',
    franchise: false,
    budget: 0
  });

  changeInput() {
    this.name = 'Exodus';
    this.movie.name = 'Exodus';

    this.nameS.set('Exodus');
    this.movieS.update(m => ({ ...m, name: 'Exodus' }));
  }
}
```