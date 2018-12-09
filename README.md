## Ng-Ripple-Module

An Angular ripple module as an alternative of available material design ripple.

### Installation
1. Install this module by running the following command:
```shell
npm i ng-ripple-module
```

2. Import `NgRippleModule` in your application's main `@NgModule` and `BrowserAnimationsModule` (if not imported yet) at your `project_root/src/app/app.modules.ts`. 
```ts
...
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgRippleModule } from 'ng-ripple-module';
...

@NgModule({
   ...
   imports: [
      ...
      BrowserModule,
      BrowserAnimationsModule,
      NgRippleModule
      ...
   ],
   ...
})
export class MyModule { ... }
```
Now you're ready to spread the ripple easily in your angular app.<br>
For more detail information, please read the [wiki](https://github.com/yohaneslumentut/ng-ripple-module/wiki). 

<br>
It works! God Bless You :)
<br>

<br>
Thank You. <br>
INDNJC,<br>
Kota Wisata, October 2018.
