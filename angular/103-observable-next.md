# angular-observable-next

## Code

### src/app/app.html

```html
<h1>angular-observable-next</h1>

<button (click)="emit()">Emit</button>

<ul>
  @for (value of values; track value) {
    <li>{{ value }}</li>
  }
</ul>

<router-outlet />
```

---

## Observable avec next (producteur explicite)

### src/app/app.ts

```ts
import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html'
})
export class App {

  values: number[] = []
  counter = 0
  private emitFn!: () => void
  observable$: Observable<number>

  constructor() {
    this.observable$ = new Observable(observer => {
      this.emitFn = () => {
        this.counter++
        observer.next(this.counter)
      }
    })

    this.observable$.subscribe(value => {
      this.values.push(value)
      console.log(value)
    })
  }

  emit() {
    this.emitFn()
  }
}
```
