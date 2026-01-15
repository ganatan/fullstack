# angular-subject

## Code


### src/app/app.html

```html
<h2>Sans signals</h2>

<input [(ngModel)]="name">
<button (click)="change()">Change</button>
<p>{{ name }}</p>

<hr>

<h2>Avec signals</h2>

<input [ngModel]="nameS()" (ngModelChange)="nameS.set($event)">
<button (click)="change()">Change</button>
<p>{{ nameS() }}</p>
```

### src/app/app.ts

```ts
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html'
})
export class App {

  name = 'Alien';

  readonly nameS = signal('Alien');

  change() {
    this.name = 'Exodus';
    this.nameS.set('Exodus');
  }
}
```