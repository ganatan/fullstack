# angular-promise

## Code

### src/app/app.html

```html
<h1>angular-promise</h1>

<button (click)="loadContinents()">Load continents</button>

<ul>
  @for (continent of continents; track continent.id) {
    <li>{{ continent.id }} - {{ continent.name }}</li>
  }
</ul>

<router-outlet />
```

---

## Version Promise avec then / catch

### src/app/app.ts

```ts
import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { ContinentsService, Continent } from './continents.service'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html'
})
export class App {
  continents: Continent[] = []

  constructor(private continentsService: ContinentsService) {}

  loadContinents() {
    this.continentsService.getContinents()
      .then(result => {
        console.log(result)
        this.continents = result
      })
      .catch(err => {
        console.error(err)
      })
  }
}
```

---

## Version Promise avec async / await

### src/app/app.ts

```ts
import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { ContinentsService, Continent } from './continents.service'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html'
})
export class App {
  continents: Continent[] = []

  constructor(private continentsService: ContinentsService) {}

  async loadContinents() {
    try {
      const result = await this.continentsService.getContinents()
      console.log(result)
      this.continents = result
    } catch (err) {
      console.error(err)
    }
  }
}
```

---

## Service (Promise)

### src/app/continents.service.ts

```ts
import { Injectable } from '@angular/core'

export type Continent = {
  id: number
  name: string
}

@Injectable({ providedIn: 'root' })
export class ContinentsService {

  getContinents(): Promise<Continent[]> {
    return fetch('http://localhost:3000/continents')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
  }

}
```
