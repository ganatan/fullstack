# angular-component

## Commandes

```bash
ng g component components/edit

ng g c components/edit
```

---

## Code

### src/app/components/edit/edit.component.html

```html
<p>{{ value }}</p>
<input [value]="value" />
```

### src/app/components/edit/edit.component.ts

```ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-edit',
  standalone: true,
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent {
  @Input() value = '';
}
```

### src/app/app.component.html

```html
<h1>angular-component</h1>
<h2>app-edit</h2>

<app-edit [value]="appEditValue"></app-edit>

<button type="button" (click)="changeAppEdit()">
  changeAppEdit
</button>
```

### src/app/app.component.ts

```ts
import { Component, signal } from '@angular/core';
import { EditComponent } from './components/edit/edit.component';

@Component({
  selector: 'app-root',
  imports: [EditComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly title = signal('angular-starter');

  appEditValue = 'Aliens';

  changeAppEdit(): void {
    this.appEditValue = `${this.appEditValue}Changed`;
  }
}
```
