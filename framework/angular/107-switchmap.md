# 107-switchmap

## Code

### src/app/app.ts

```ts
import { Component } from '@angular/core'
import { Subject, of } from 'rxjs'
import { switchMap, delay } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  template: `
    <button (click)="search('Matrix')">Matrix</button>
    <button (click)="search('Inception')">Inception</button>
    <button (click)="search('Avatar')">Avatar</button>

    <ul>
      @for (movie of results; track movie) {
        <li>{{ movie }}</li>
      }
    </ul>
  `
})
export class App {

  private search$ = new Subject<string>()
  results: string[] = []

  constructor() {
    this.search$
      .pipe(
        switchMap(title =>
          of(`Résultat pour ${title}`).pipe(delay(1000))
        )
      )
      .subscribe(value => {
        this.results = [value]
      })
  }

  search(title: string) {
    this.search$.next(title)
  }
}
```
