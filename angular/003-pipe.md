# angular-component

## Commandes

```bash
ng g pipe pipes/budget

ng g p pipes/budget
```

---

## Code

### src/app/pipes/budget/budget-pipe.ts

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'budget',
})
export class BudgetPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    const number = Number(value) || 0;
    return `$${number.toLocaleString('en-US')}`;
  }

}
```

### src/app/app.html

```html
<h1>angular-starter-pipe</h1>

budgetMovie : {{ budgetMovie | budget}}<br>
nameMovie : {{ nameMovie}}<br>

budgetMovie : {{ budgetMovie | currency:'USD'}}<br>
```

### src/app/app.ts

```ts
import { Component, signal } from '@angular/core';

import { BudgetPipe } from './pipes/budget-pipe';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    BudgetPipe,
    CurrencyPipe
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-starter');
  budgetMovie: number = 714844358;
  nameMovie: string = 'Dune: Part Two'

}
```
