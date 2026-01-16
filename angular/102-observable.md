# angular-observable

## Code

### src/app/app.html

```html
<h1>angular-observable</h1>

<button (click)="loadContinents()">Load continents (subscribe)</button>

<ul>
  @for (continent of continents; track continent.id) {
    <li>{{ continent.id }} - {{ continent.name }}</li>
  }
</ul>

<hr />

<ul>
  @for (continent of continents$ | async; track continent.id) {
    <li>{{ continent.id }} - {{ continent.name }}</li>
  }
</ul>

<router-outlet />
```

---

## Version Observable avec subscribe

### src/app/app.ts

```ts
import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { ContinentsService, Continent } from './continents.service'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html'
})
export class App {
  continents: Continent[] = []
  continents$: Observable<Continent[]>

  constructor(private continentsService: ContinentsService) {
    this.continents$ = this.continentsService.getContinents$()
  }

  loadContinents() {
    this.continentsService.getContinents$().subscribe(result => {
      console.log(result)
      this.continents = result
    })
  }
}
```

---

## Version Observable avec async pipe

### src/app/app.ts (alternative)

```ts
import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { ContinentsService, Continent } from './continents.service'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html'
})
export class App {
  continents$: Observable<Continent[]>

  constructor(private continentsService: ContinentsService) {
    this.continents$ = this.continentsService.getContinents$()
  }
}
```

---

## Service (Observable)

### src/app/continents.service.ts

```ts
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

export type Continent = {
  id: number
  name: string
}

@Injectable({ providedIn: 'root' })
export class ContinentsService {

  constructor(private http: HttpClient) {}

  getContinents$(): Observable<Continent[]> {
    return this.http.get<Continent[]>('http://localhost:3000/continents')
  }

}
```
