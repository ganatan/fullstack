# angular-behaviorsubject

## Code

### src/app/app.html

```html
<h1>angular-behaviorsubject</h1>

<button (click)="emit()">Emit</button>

<ul>
  @for (value of values; track value) {
    <li>{{ value }}</li>
  }
</ul>

<router-outlet />
```

---

## BehaviorSubject (état + valeur initiale)

### src/app/app.ts

```ts
import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { BehaviorSubject } from 'rxjs'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html'
})
export class App {

  private subject = new BehaviorSubject<number>(0)
  values: number[] = []
  counter = 0

  constructor() {
    this.subject.subscribe(value => {
      this.values.push(value)
      console.log(value)
    })
  }

  emit() {
    this.counter++
    this.subject.next(this.counter)
  }
}
```
