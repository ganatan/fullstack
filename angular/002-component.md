# angular-component

## Commandes

    ng g component components/edit
    ng g component components/table

    ng g c components/edit
    ng g c components/table

---

## Code

### src/app/components/edit/edit.html

    {{ value }}<br>
    <input [value]="value">

### src/app/components/edit/edit.ts

    import { Component, Input } from '@angular/core';

    @Component({
      selector: 'app-edit',
      imports: [],
      templateUrl: './edit.html',
      styleUrl: './edit.css',
    })
    export class EditComponent {
      @Input() value = '';
    }

### src/app/app.html

    <h1>angular-component</h1>
    <h2>app-edit</h2><br>
    <app-edit [value]="appEditValue"></app-edit><br>
    <button (click)="changeAppEdit()">changeAppEdit</button>

### src/app/app.ts

    import { Component, signal } from '@angular/core';
    import { EditComponent } from './components/edit/edit';

    @Component({
      selector: 'app-root',
      imports: [
        EditComponent,
      ],
      templateUrl: './app.html',
      styleUrl: './app.css'
    })
    export class App {
      protected readonly title = signal('angular-starter');

      appEditValue: string = 'Aliens';

      changeAppEdit(): void {
        this.appEditValue = this.appEditValue + 'Changed';
      }
    }

---

## Décorateur @Component

- @Component({...})

interface TypeDecorator

Décorateur Angular qui transforme une classe TypeScript en composant Angular.
Il permet de configurer le composant (template, styles, dépendances…).

---

## Propriétés par défaut

- selector
- imports
- templateUrl
- styleUrl

---

## Paramètres

    @Input() value = '';
