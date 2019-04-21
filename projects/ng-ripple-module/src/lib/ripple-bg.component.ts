/**
 * @license
 * Copyright (c) 2019 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import {
  Component,
  ElementRef,
  Inject,
  Renderer2
} from '@angular/core';

import {
  style,
  animate,
  keyframes,
  AnimationBuilder,
  AnimationPlayer
} from '@angular/animations';

import {
  RippleBgConfigs,
  RIPPLE_BG_CONFIGS
} from './ripple.configs';

import { RippleComponent } from './ripple.component';
import { RippleHost } from './ripple.host';

@Component({
  selector: 'ripple-bg',
  template: `<ng-content></ng-content>`,
  styles: [
    `:host {
      top: 0;
      left: 0;
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      opacity: 0;
    }`
  ]
})
export class BackgroundComponent extends RippleComponent {

  fadeTransition: string;
  fadeDuration: number;

  constructor(
    elRef: ElementRef,
    host: RippleHost,
    private builder: AnimationBuilder,
    private renderer: Renderer2,
    @Inject(RIPPLE_BG_CONFIGS) public configs: RippleBgConfigs,
  ) {
    super(elRef, host);
    this.renderer.setStyle(this.element, 'background', this.configs.backgroundColor);
    this.fadeTransition = this.configs.fadeTransition;
    this.fadeDuration = parseInt(this.fadeTransition.replace(/\D/g,''), 10);
  }

  private animationPlayerFactory(animation: any[]) {
    return this.builder.build(animation).create(this.element);
  }

  get fadeinAnimationPlayer(): AnimationPlayer {
    return this.animationPlayerFactory([
      animate(this.fadeTransition, keyframes([
        style({ opacity: 0 }), style({ opacity: 1 })
      ]))
    ]);
  }

  get fadeoutAnimationPlayer(): AnimationPlayer {
    return this.animationPlayerFactory([
      animate(this.fadeTransition, style({ opacity: 0 }))
    ]);
  }

  fadein() {
    this.fadeinPlayer = this.fadeinAnimationPlayer;
    this.fadeinPlayer.play();
  }

  fadeout() {
    if(this.fadeinPlayer) {
      this.fadeoutPlayer = this.fadeoutAnimationPlayer;
      this.fadeoutPlayer.play();
    }
  }
}
