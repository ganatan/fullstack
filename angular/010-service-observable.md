# angular-service

## Commandes

```bash
  ng g service services/items

  ng g s services/items
```

---

## Code

### src/app/services/items.ts

```ts
import { Injectable } from '@angular/core';
import { Observable, concat, of, throwError, timer } from 'rxjs';
import { delay, tap, mergeMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class Items {
  constructor() {
    console.log('Items:constructor');
  }

  load$(): Observable<boolean> {
    console.log('RxObservable:loadItems');

    return concat(
      of(true).pipe(
        delay(2000),
        tap(() => console.log('RxObservable:loadItems:next:true'))
      ),
      of(false).pipe(
        delay(2000),
        tap(() => console.log('RxObservable:loadItems:next:false'))
      ),
      timer(2000).pipe(
        tap(() => console.log('RxObservable:loadItems:error')),
        mergeMap(() => throwError(() => 'error'))
      )
    );
  }
}
```
### src/app/app.ts

```ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Items } from './services/items';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-starter');

  message = '';
  private readonly destroy$ = new Subject<void>();

  constructor(private items: Items) {}

  onLoadItems() {
    console.log('App:onLoadItems');

    this.items.load$()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (value) => {
          this.message = `onLoadItems:next:${value}`;
          console.log('App:onLoadItems:next', value);
        },
        error: () => {
          this.message = 'onLoadItems:error';
          console.log('App:onLoadItems:error');
        },
        complete: () => {
          this.message = 'onLoadItems:complete';
          console.log('App:onLoadItems:complete');
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```
