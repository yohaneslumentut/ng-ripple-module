/**
 * @license
 * Copyright (c) 2019 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import { Ripple } from './ripple';
import { RippleEvent } from './ripple.event';

export type PointerListener = [string, (event: TouchEvent | MouseEvent) => any];

export enum RipplePublisher {
  CLICK = 'clickPublisher',
  TAP = 'tapPublisher',
  PRESS = 'pressPublisher',
  PRESSUP = 'pressupPublisher'
}

export enum Events {
  TAP = 'rtap',
  PRESS = 'rpress',
  PRESSUP = 'rpressup',
  CLICK = 'rclick'
}

export class RippleListener {

  listeners: PointerListener[];

  constructor(public context: any) {
    clearTimeout(this.context.dismountTimeout);
  }

  execute(action: string) {
    this.listeners.forEach((item) => {
      const type = item[0]; const handler = item[1];
      this.context.element[action](type, handler);
    });
  }

  attachListeners() {
    this.execute('addEventListener');
  }

  detachListeners() {
    this.execute('removeEventListener');
  }

  event(name: Events): RippleEvent {
    return new RippleEvent(this.context.element, this.context.host.center, name);
  }

  onMove(event: any) {
    if(!this.context.core.pointerEventCoordinateIsInHostArea(event) ||
      this.context.core.configs.fixed) {
        return this.splash();
    }
    if(this.context.core.outerPointStillInHostRadius(event)) {
      return this.context.core.translate(event);
    }
    return;
  }

  onEnd() {
    this.detachListeners();
    this.context.prepareForDismounting();
    this.context.element.blur();
    this.context.deactivate();
    this.splash();
  }

  splash() {
    this.context.deactivate();
    this.context.core.splash();
  }
}

export enum Mouse { MOVE = 'mousemove', UP = 'mouseup', LEAVE = 'mouseleave' }

export class MouseStrategy extends RippleListener {

  constructor(public context: Ripple) {
    super(context);
  }

  get listeners(): PointerListener[] {
    return [
      [Mouse.MOVE, this.onMouseMove],
      [Mouse.UP, this.onMouseUp],
      [Mouse.LEAVE, this.onMouseLeave]
    ];
  }

  onMouseMove = (event: MouseEvent) => {
    this.onMove(event);
  }

  onMouseUp = () => {
    this.context.ngZone.runOutsideAngular(() => {
      this.context.clickPublisher.next(this.event(Events.CLICK));
    });
    this.onEnd();
  }

  onMouseLeave = () => this.onEnd();
}

export enum Touch { MOVE = 'touchmove', END = 'touchend' }

export class TouchStrategy extends RippleListener {

  pressTimeout: any;
  isPressing: boolean;

  constructor(public context: Ripple) {
    super(context);
    this.setPressTimeout();
  }

  get listeners(): PointerListener[] {
    return [
      [Touch.MOVE, this.onTouchMove],
      [Touch.END, this.onTouchEnd]
    ];
  }

  setPressTimeout() {
    clearTimeout(this.pressTimeout);
    this.pressTimeout = setTimeout(() => {
      this.isPressing = true;
      this.context.ngZone.runOutsideAngular(() => {
        this.context.pressPublisher.next(this.event(Events.PRESS));
      });
    }, this.context.core.tapLimit);
  }

  onTouchMove = (event: TouchEvent) => {
    if(!this.context.core.pointerEventCoordinateIsInHostArea(event)) {
      return this.onEnd();
    }
    this.onMove(event);
  }

  onTouchEnd = () => {
    clearTimeout(this.pressTimeout);
    this.context.ngZone.runOutsideAngular(() => {
      if(this.isPressing) {
        return this.context[RipplePublisher.PRESSUP].next(this.event(Events.PRESSUP));
      }
      this.context[RipplePublisher.TAP].next(this.event(Events.TAP));
    });
    this.onEnd();
  }
}

export const POINTER_STRATEGY: any  = {
  mouse: MouseStrategy,
  touch: TouchStrategy
};

export class PointerStrategy {
  constructor(pointer: string, context: Ripple) {
    return new POINTER_STRATEGY[pointer](context);
  }
}

export const POINTERDOWN_LISTENER: any = {
  pointerdown: ['pointerdown'],
  fallback: ['touchstart', 'mousedown']
};

export class RipplePointerListener {

  pointerdownEvents: any[];
  pointer: string;
  type: string;
  strategy: any;

  constructor(private context: Ripple) {
    this.type = 'onpointerdown' in window ? 'pointerdown' : 'fallback';
    this.pointerdownEvents = POINTERDOWN_LISTENER[this.type];
    this.startListening();
  }

  private startListening() {
    this.context.ngZone.runOutsideAngular(() => {
      this.pointerdownEvents.forEach((event) => {
        this.context.element.addEventListener(event, this.onPointerDown);
      });
    });
  }

  stopListening() {
    this.context.ngZone.runOutsideAngular(() => {
      this.pointerdownEvents.forEach((event) => {
        this.context.element.removeEventListener(event, this.onPointerDown);
      });
    });
  }

  onPointerDown = (event: any) => {
    const pointer = (event.pointerType || event.type).substring(0,5);
    this.strategy = new PointerStrategy(pointer, this.context);
    this.strategy.attachListeners();
    this.context.activate();
    this.context.mountElement();
    this.context.core.fill(event);
  }
}
