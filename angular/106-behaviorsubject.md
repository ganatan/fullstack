# angular-behaviorsubject

## Code

### src/app/app.html

```html
<h1>angular-behaviorsubject</h1>

<button (click)="emit()">Emit</button>
<button (click)="lateSubscribe()">Late subscribe</button>

<ul>
  @for (value of values1; track value) {
    <li>sub1: {{ value }}</li>
  }
</ul>

<ul>
  @for (value of values2; track value) {
    <li>sub2: {{ value }}</li>
  }
</ul>

<router-outlet />
```

---

## BehaviorSubject

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
  values1: number[] = []
  values2: number[] = []
  counter = 0

  constructor() {
    this.subject.subscribe(value => {
      this.values1.push(value)
    })
  }

  emit() {
    this.counter++
    this.subject.next(this.counter)
  }

  lateSubscribe() {
    this.subject.subscribe(value => {
      this.values2.push(value)
    })
  }
}
```
