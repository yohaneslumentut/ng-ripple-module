## Ng-Ripple-Module

An Angular ripple module as an alternative of available material design ripple.

### Installation
1.Install this module by running the following command:
```shell
npm i ng-ripple-module
```

2.Import `NgRippleModule` in your application's main `@NgModule` and `BrowserAnimationsModule` (if not imported yet).
```ts
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgRippleModule } from 'ng-ripple-module';

@NgModule({
   ...
   imports: [
      ...
      BrowserAnimationsModule,
      NgRippleModule
   ]
})
export class MyModule { ... }
```
Now you're ready to use this module
## Directive 

This module provides you a single `ripple` directive so you can attach ripple component and its ripple effects easily into your application `HTMLElement` tag. You can freely decorate the shape, the color or the other style properties of your element by using your style sheet. <br>
The directive provides you a customizable `background` layer for your element active state and insert `activated` class at your host tag during `touch` or `click` event.
<br>
Example: <br>
```html
  <button ripple ....></button>
```
```html
  <a href="..." ripple ....></a>
```
<br>

## Available Inputs and Attributes
### `light`
Basically, the module is shipped out with `dark` ripple effect. If you need a light/white ripple effect, just use `light` attributes.
```html
  <button ripple light ...>...</button>
```

### `centered-ripple`
This attribute is used to make your ripple effect start from the center of your touched/clicked element.
```html
  <a href="..." ripple centered-ripple ...> ... </a>
```

### `fixed-ripple`
For some reason, you need a fixed ripple effect, let's say for a list item element. In this case, `fixed-ripple` attributes will help you a lot.
```html
  <ul ...>
    <li ripple fixed-ripple ...> ... </li>
    ...
  </ul>
```

### `rippleBgColor & activeBgColor`
If you need a custom ripple effect color, you can make a custom ripple effect using `rippleBgColor` and/or `activeBgColor`.
```html
  <button ... ripple 
    rippleBgColor={{_rippleBgColor}}
    activeBgColor={{_activeBgColor}}>
    ...
  </button>
```

### `fillTransition, splashTransition, fadeTransition`
Ripple effect highly depend on transition. Different time selection/transition will provide you different ripple effect too. This module provides you default transitions but you can make experiments as you like.<br><br>
<b>`fillTransition`</b> is an input of ripple fill-in effect which consist of a `transition-duration` value.<br><br>
<b>`splashTransition`</b> is a ripple splash effect input. The value have to contain of both `transition-duration` and `transition-timing-function` sequentially.<br><br>
<b>`fadeTransition`</b> is for ripple both fadeout and fadein transition in a `transition-duration` value.<br>
<br>
 Example:
```html
  <button ripple light fixed-ripple
    fillTransition="1000ms"
    splashTransition="70ms cubic-bezier(0.4, 0.0, 0.2, 1)"
    fadeTransition="250ms">
    ...
  </button>
```
This website `http://cubic-bezier.com/` is a great tool to visualize and make experiments of `transition-timing-function`.<br>
### `clickEmitDelay`
For mouse click event, by default will trigger an `rclick` event after `250ms`. You can use `clickEmitDelay` to customize your desired click delay event.
```html
  <button ripple light centered-ripple
    (rclick)="onClick($event)"
    clickEmitDelay="0ms">
        ...
  </button>
```
### `clickAndSplashTransition`
Ripple effect of mouse click event can be customized by using this input.
```html
  <button ripple light centered-ripple
    clickAndSplashTransition="250ms ease-out"
    (rclick)="onClick($event)">
        ...
  </button>
```

### `tapLimit`
This input is used in determining limit of `rtap` event. Touch event that more than this limit will be considered as `rpress`

## Available Events (`rtap`, `rpress`, `rpressup`, `rclick`)
This module provides you custom events that will emitt after your ripple effect animation completed. Of course you still can use default events ( eg. `tap` and `press` for Ionic Apps or `click` for mouse device). The events have `r` prefix to distinguish from default event.

## Custom Event Returned Object `($event)`
Every event provides by this module will return a custom event object. The returned value is an `RippleEvent` object as shown below:
```ts
target: HTMLElement;      // your host element
type: string;             // rtap | rpress | rpressup | rclick
timestamp: number;        // timestamp when the event emitted
clientX: number;          // center coordinate X of your host element
clientY: number;          // center coordinate Y of your host element
clientRect: ClientRect;   // host element ClientRect detail data
```
## Examples
Below are examples of ripple directive in Ionic (3) application. Dont't forget to set the host element style position property into `relative`;

```ts

...


@Component({
  selector: 'page-home',
  styles: [
    `:host .circle {
      width: 250px;
      height: 250px;
      border-radius: 50%;
      position: relative;
    }`
  ],
  template: `
    <ion-header>
      ...
    </ion-header>
    <ion-content padding>

    ...

    <h2>Centered Ripple</h2>
      <p>
        <a href="#" ripple light centered-ripple 
          class="circle button-md-secondary"
          (rtap)="onTap($event)"
          (rpress)="onPress($event)"
          (rpressup)="onPressup($event)">
        </a>
      </p>
      <br>
      <h2>Draggable ripple</h2>
      <p>
        <a href="#" ripple light 
          class="circle button-md-primary"
          (rtap)="onTap($event)"
          (rpress)="onPress($event)"
          (rpressup)="onPressup($event)">
        </a>
      </p>
    
    <br>
    <h2>Ionic button</h2>
    <p>It is better not to use ion-button directive directly. It is highly recomended to use its css class instead. These are for example only.<p>
    <p>
      <button ion-button color="light" block ripple>Light</button>
    </p>

    <p>
      <button ion-button block ripple light>Default</button>
    </p>

    <p>
      <button ion-button color="secondary" block ripple light>Secondary</button>
    </p>

    <p>
      <button ion-button color="danger" block ripple light>Danger</button>
    </p>

    <p>
      <button ion-button color="dark" block ripple light>Dark</button>
    </p>

    <p>
      <button ion-button color="light" clear ripple>Light</button>
    </p>

    <p>
      <button ion-button clear ripple>Default</button>
    </p>

    <p>
      <button ion-button color="secondary" clear ripple>Secondary</button>
    </p>

    <p>
      <button ion-button color="danger" clear ripple>Danger</button>
    </p>

    <p>
      <button ion-button color="dark" clear ripple>Dark</button>
    </p>

    <p>
      <button ion-button color="light" outline ripple>Light</button>
    </p>

    <p>
      <button ion-button outline ripple>Default</button>
    </p>

    <p>
      <button ion-button color="secondary" outline ripple>Secondary</button>
    </p>

    <p>
      <button ion-button color="danger" outline ripple>Danger</button>
    </p>

    <p>
      <button ion-button color="dark" outline ripple>Dark</button>
    </p>

    <p>
      <button ion-button color="light" small ripple>Light Small</button>
    </p>
    <p>
      <button ion-button small ripple light>Default Small</button>
    </p>
    <p>
      <button ion-button color="secondary" ripple light>Secondary Medium</button>
    </p>

    <p>
      <button ion-button color="danger" medium ripple light>Danger Medium</button>
    </p>
    <p>
      <button ion-button color="dark" large ripple light>Dark Large</button>
    </p>

    ...

    </ion-content>

  `
})
export class HomePage {

  ...

  onTap(event: any){
    console.log(event.type)
  }

  onPress(event: any){
    console.log(event.type)
  }

  onPressup(event: any){
    console.log(event.type)
  }

  ...

}
```

Examples of  ripple at button tag without ionic button directive (utilization of ionic md styling class).  
```html
<button ripple light class="disable-hover button button-md button-default button-default-md button-large button-large-md button-md-primary">
    Default
</button>
```

```html
<button ripple class="disable-hover button button-md button-default button-default-md button-block button-block-md button-md-light">
  Default
</button>
```

```html
<button ripple light class="disable-hover button button-md button-large button-large-md button-round button-round-md button-md-secondary">
  <span class="button-inner">
    <ion-icon name="home" role="img" 
          class="icon icon-md ion-md-home" 
            aria-label="home">
        </ion-icon>
        Home
  </span>
</button>
```

```html
<button color="light" ripple icon-start class="disable-hover button button-md button-default button-default-md button-md-light">
  <span class="button-inner">
    <ion-icon name="arrow-back" role="img" 
          class="icon icon-md ion-md-arrow-back" aria-label="arrow back">
        </ion-icon>
        Back
  </span><div class="button-effect"></div>
</button>
```
<br>
It works! Don't be pessimistic. God Bless You  :)

<br>
<i>"The butter has melting. Take up your Angular shield, sharpen your Typescript sword. There will be a great battle ahead!" -- yohanes.o.L</i>


<br>
Thank You. <br>
INDNJC,<br>
Kota Wisata, October 2018.