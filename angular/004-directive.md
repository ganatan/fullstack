# angular-directive

## Commandes

```bash
  ng generate directive directives/highlightBinding
  ng generate directive directives/highlightRenderer

  ng g d directives/highlightBinding
  ng g d directives/highlightRenderer
```

---

## Code

### src/app/directives/highlight-binding.ts

```ts
import { Directive } from '@angular/core';

import {  HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlightBinding]'
})
export class HighlightBinding {

  @HostBinding('style.background') bg = ''

  @HostListener('mouseenter')
  enter() {
    this.bg = 'yellow'
  }

  @HostListener('mouseleave')
  leave() {
    this.bg = 'red'
  }  

}
```

### src/app/directives/highlight-renderer.ts

```ts
import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlightRenderer]',
  standalone: true
})
export class HighlightRenderer {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  enter() {
    this.renderer.setStyle(this.el.nativeElement, 'background', 'yellow')
  }

  @HostListener('mouseleave')
  leave() {
    this.renderer.setStyle(this.el.nativeElement, 'background', 'red')
  }
}
```

### src/app/app.html

```html
<h1>angular-directive</h1>

<p appHighlightBinding>Directive HighlightBinding</p>
<p appHighlightRenderer>Directive appHighlightRenderer</p>

<router-outlet />
```

### src/app/app.ts

```ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HighlightBinding } from './directives/highlight-binding';
import { HighlightRenderer } from './directives/highlight-renderer';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HighlightBinding,
    HighlightRenderer,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-starter');
}
```
