# angular-component

## Commandes

```bash
ng g component components/edit

ng g c components/edit
```

---

## Code

### src/app/components/edit/edit.html

```html
<p>{{ value }}</p>
<input [value]="value" />
```

### src/app/components/edit/edit.ts

```ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-edit',
  imports: [],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class Edit {
  @Input() value = '';
}
```

### src/app/app.html

```html
<h1>angular-component</h1>
<h2>app-edit</h2>

<app-edit [value]="appEditValue"></app-edit>

<button type="button" (click)="changeAppEdit()">
  changeAppEdit
</button>
```

### src/app/app.ts

```ts
import { Component, signal } from '@angular/core';
import { Edit } from './components/edit/edit'

@Component({
  selector: 'app-root',
  imports: [Edit],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-starter');
  appEditValue = 'Aliens';

  changeAppEdit(): void {
    this.appEditValue = `${this.appEditValue}Changed`;
  }

}
```
