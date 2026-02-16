# angular-observable-multi-next

## Code

### src/app/app.html

```html
<h1>angular-observable-multi-next</h1>

<button (click)="start()">Start</button>
<button (click)="stop()">Stop</button>

<ul>
  @for (value of values; track value) {
    <li>{{ value }}</li>
  }
</ul>

<router-outlet />
```

---

## Observable avec plusieurs next (flux dans le temps)

### src/app/app.ts

```ts
import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { Observable, Subscription } from 'rxjs'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html'
})
export class App {

  values: number[] = []
  private sub!: Subscription
  private observable$: Observable<number>

  constructor() {
    this.observable$ = new Observable(observer => {
      let i = 0
      const id = setInterval(() => {
        i++
        observer.next(i)
        if (i === 5) {
          observer.complete()
          clearInterval(id)
        }
      }, 1000)
    })
  }

  start() {
    this.values = []
    this.sub = this.observable$.subscribe({
      next: v => {
        this.values.push(v)
        console.log(v)
      },
      complete: () => {
        console.log('complete')
      },
      error: e => {
        console.error(e)
      }
    })
  }

  stop() {
    this.sub?.unsubscribe()
  }
}
```

---

## Principe

- `next` peut être appelé **plusieurs fois**
- chaque appel envoie une nouvelle valeur
- `complete` termine définitivement le flux
- après `complete` ou `error`, plus aucun `next` n’est possible
