# angular-reactive-forms

## Code


### src/app/app.html

```html
<h2>Reactive forms</h2>

<label>Name</label>
<input [formControl]="name">
<p>{{ name.value }}</p>

<hr>

<h2>Reactive + signal</h2>

<form [formGroup]="formS">
  <label>Name</label>
  <input formControlName="name">
</form>

<p>{{ formS.get('name')?.value }}</p>

<hr>

<h2>Signal seul</h2>

<input [value]="nameS()" (input)="nameS.set(($any($event.target)).value)">
<p>{{ nameS() }}</p>

<button (click)="change()">Change</button>
```

### src/app/app.ts

```ts
import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html'
})
export class App {

  name = new FormControl('Alien');

  readonly nameS = signal('Alien');
  readonly formS = new FormGroup({
    name: new FormControl('Alien')
  });

  change() {
    this.name.setValue('Exodus');
    this.formS.get('name')!.setValue('Exodus');
    this.nameS.set('Exodus');
  }
}
```