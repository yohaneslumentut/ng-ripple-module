/**
 * @license
 * Copyright (c) 2018 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

import {
  Component,
  ElementRef,
  ViewContainerRef,
  DebugElement
} from '@angular/core';

import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';

import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

import {
  inject,
  async,
  TestBed ,
  ComponentFixture
} from '@angular/core/testing';

import {
  style,
  animate,
  keyframes,
  AnimationBuilder,
  AnimationPlayer,
  AnimationAnimateMetadata
} from '@angular/animations';

import { By } from '@angular/platform-browser';
import { RippleComponent } from './ripple.component';
import { BackgroundComponent } from './ripple-bg.component';
import { RippleAnimation } from './ripple.animation';
import { RippleDirective } from './ripple.directive';
import { RippleMotionTracker } from './ripple.motion.tracker';
import { NgRippleModule } from './ng-ripple.module';

import {
  RIPPLE_LIGHT_BGCOLOR,
  RIPPLE_LIGHT_ACTIVE_BGCOLOR
} from './ripple.constants';

import {
  RippleEventHandler,
  MobileActionTypes,
  DesktopActionTypes,
  MobileEventHandlers,
  DesktopEventHandlers,
  Events
} from './ripple.event.handler';

@Component({
  template: `<a href="#" ripple
    fillTransition="150ms"
    splashTransition="50ms cubic-bezier(0.1,0.2,0.3,0.4)"
    fadeTransition="150ms"
    rippleBgColor="white"
    activeBgColor="grey"
  ></a>`,
  styles: [
    `:host a {
      width: 250px;
      height: 250px;
      border-radius: 50%;
      position: relative;
    }`
  ]
})
class RippleTestComponent {
  constructor(
    public elRef:ElementRef,
    public viewport: ViewContainerRef
  ) {}
}

@Component({
  template: `<a href="#" ripple light
  ></a>`,
  styles: [
    `:host a {
      width: 250px;
      height: 250px;
      border-radius: 50%;
      position: relative;
    }`
  ]
})
class RippleLightTestComponent {
  constructor(public elRef:ElementRef) {}
}

describe('Directive', () => {

  let component: RippleTestComponent;
  let fixture: ComponentFixture<RippleTestComponent>;
  let directiveEl: DebugElement;
  let directiveInstance: RippleDirective;
  let eventHandler: RippleEventHandler;
  let animation: RippleAnimation;
  let ripple: RippleComponent;
  let motionTracker: RippleMotionTracker;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        RippleTestComponent,
        RippleLightTestComponent
      ],
      imports: [
        BrowserAnimationsModule,
        NgRippleModule
      ],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(RippleTestComponent);
    component = fixture.componentInstance;
    directiveEl = fixture.debugElement.query(By.directive(RippleDirective));
    directiveInstance = directiveEl.injector.get(RippleDirective);
    directiveInstance.eventHandler = directiveInstance.rippleEventHandler;

    eventHandler = directiveInstance.eventHandler;
    motionTracker = directiveInstance.motionTracker;
    animation = directiveInstance.ripple.animation;
    animation.transition = directiveInstance.ripple.transition;
    ripple = directiveInstance.ripple;
  }));


  it('create ripple and background element', () => {

    fixture.detectChanges();

    const hostElement = component.elRef.nativeElement.children[0];
    const children = hostElement.children;
    const expectedChildren = ['ripple-core', 'ripple-bg'];

    expect(expectedChildren).toContain(children[0].localName);
    expect(expectedChildren).toContain(children[1].localName);

  });

  it('passing data transition to ripple component', () => {

    const hostElement = component.elRef.nativeElement.children[0];

    const transitions = {
      fillTransition: hostElement.getAttribute('fillTransition'),
      splashTransition: hostElement.getAttribute('splashTransition'),
      fadeTransition: hostElement.getAttribute('fadeTransition')
    };

    fixture.detectChanges();
    for(const k in transitions) {
      if(transitions[k]) {
        expect(directiveInstance.ripple[k]).toEqual(transitions[k]);
      }
    }
  });

  it('passing data color to ripple & background', () => {
    const hostElement = component.elRef.nativeElement.children[0];

    fixture.detectChanges();
    const rippleBgColor = hostElement.getAttribute('rippleBgColor');
    expect(directiveInstance.ripple.color).toEqual(rippleBgColor);

    const activeBgColor = hostElement.getAttribute('activeBgColor');
    expect(directiveInstance.background.color).toEqual(activeBgColor);

    directiveInstance.light = true;
    fixture.detectChanges();
    expect(directiveInstance.ripple.color).toEqual(RIPPLE_LIGHT_BGCOLOR);
    expect(directiveInstance.background.color).toEqual(RIPPLE_LIGHT_ACTIVE_BGCOLOR);
  });

  it('passing centered ripple', () => {
    directiveInstance.centered = true;
    fixture.detectChanges();
    expect(directiveInstance.ripple.centered).toBeTruthy();
  });

  it('passing fixed ripple', () => {
    directiveInstance.fixed = true;
    fixture.detectChanges();
    expect(directiveInstance.ripple.fixed).toBeTruthy();
  });

  it('passing tap limit', () => {
    directiveInstance.tapLimit = 250;
    fixture.detectChanges();
    expect(directiveInstance.ripple.tapLimit).toEqual(250);
  });

  it('listen to rtap event', (done) => {
    motionTracker.pointerDownTimeStamp = 0;
    eventHandler.activate();

    directiveInstance.eventHandler = directiveInstance.rippleEventHandler;
    directiveInstance.eventHandler._isMobileDevice = true;
    directiveInstance.background.eventTrigger.subscribe(() => {
      expect(eventHandler.currentEvent).toEqual(Events.TAP);
    });

    motionTracker.pointerUpTimeStamp = 350;
    eventHandler.deactivate();
    directiveInstance.background.eventTrigger.emit();
    fixture.detectChanges();
    done();
  });

  it('listen to rclick event', (done) => {
    motionTracker.pointerDownTimeStamp = 0;
    eventHandler.activate();

    directiveInstance.eventHandler = directiveInstance.rippleEventHandler;
    directiveInstance.eventHandler._isMobileDevice = false;
    directiveInstance.background.eventTrigger.subscribe(() => {
      expect(eventHandler.currentEvent).toEqual(Events.CLICK);
    });

    motionTracker.pointerUpTimeStamp = 350;
    eventHandler.deactivate();

    fixture.detectChanges();
    ripple.parentElement = ripple.element.parentNode as HTMLElement;
    fixture.detectChanges();
    ripple.initialSetup();
    ripple.cachingRectAndCenter();
    fixture.detectChanges();
    ripple.centerCoordinate(ripple.parentRect);

    directiveInstance.background.eventTrigger.emit();
    fixture.detectChanges();
    done();
  });

  it('listen to rpress event', (done) => {
    motionTracker.pointerDownTimeStamp = 0;
    eventHandler.activate();

    directiveInstance.eventHandler = directiveInstance.rippleEventHandler;
    directiveInstance.eventHandler._isMobileDevice = true;


    fixture.detectChanges();
    ripple.parentElement = ripple.element.parentNode as HTMLElement;
    fixture.detectChanges();
    ripple.initialSetup();
    ripple.cachingRectAndCenter();
    fixture.detectChanges();
    ripple.centerCoordinate(ripple.parentRect);


    directiveInstance.background.eventTrigger.subscribe(() => {
      expect(eventHandler.currentEvent).toEqual(Events.PRESS);
    });

    fixture.detectChanges();
    done();
  });

  it('listen to rpressup event', (done) => {
    motionTracker.pointerDownTimeStamp = 0;
    eventHandler.activate();

    directiveInstance.background.eventTrigger.subscribe(() => {
      expect(eventHandler.currentEvent).toEqual(Events.PRESSUP);
    });

    motionTracker.pointerUpTimeStamp = 750;
    eventHandler.deactivate();

    fixture.detectChanges();
    ripple.parentElement = ripple.element.parentNode as HTMLElement;
    fixture.detectChanges();
    ripple.initialSetup();
    ripple.cachingRectAndCenter();
    fixture.detectChanges();
    ripple.centerCoordinate(ripple.parentRect);

    directiveInstance.background.eventTrigger.emit();
    fixture.detectChanges();
    done();
  });

  it('neglect fast repeating event', (done) => {
    directiveInstance.eventHandler = directiveInstance.rippleEventHandler;
    directiveInstance.eventHandler._isMobileDevice = true;

    motionTracker.pointerDownTimeStamp = 0;
    eventHandler.activate();

    directiveInstance.background.eventTrigger.subscribe(() => {
      expect(eventHandler.emitCurrentEvent).toEqual(undefined);
    });

    motionTracker.pointerUpTimeStamp = 50;
    eventHandler.lastEventName = Events.TAP;
    eventHandler.deactivate();

    fixture.detectChanges();
    ripple.parentElement = ripple.element.parentNode as HTMLElement;
    fixture.detectChanges();
    ripple.initialSetup();
    ripple.cachingRectAndCenter();
    fixture.detectChanges();
    ripple.centerCoordinate(ripple.parentRect);

    directiveInstance.background.eventTrigger.emit();
    fixture.detectChanges();
    done();
  });

  it('provide correct mobile listeners', () => {
    const listeners = new Map<string, Function>();
    for(const i in MobileActionTypes) {
      if(MobileActionTypes[i]) {
        listeners.set(MobileActionTypes[i], eventHandler[MobileEventHandlers[`on${MobileActionTypes[i]}`]]);
      }
    }
    eventHandler._isMobileDevice = true;
    fixture.detectChanges();
    expect(eventHandler.supportedActionTypes).toEqual(listeners);
  });

  it('provide correct desktop listeners', () => {
    const listeners = new Map<string, Function>();
    for(const i in DesktopActionTypes) {
      if(DesktopActionTypes[i]) {
        listeners.set(DesktopActionTypes[i], eventHandler[DesktopEventHandlers[`on${DesktopActionTypes[i]}`]]);
      }
    }
    eventHandler._isMobileDevice = false;
    fixture.detectChanges();
    expect(eventHandler.supportedActionTypes).toEqual(listeners);
  });

  it('has a correct fill animation', () => {
    expect(animation.fill(100,100)).toBeTruthy();
  });

  it('has a correct translate animation', () => {
    expect(animation.translate(10,10,0.5)).toBeTruthy();
  });

  it('nas a correct splash animation', () => {
    expect(animation.splash).toBeTruthy();
  });

  it('has a correct fadeout animation', () => {
    expect(animation.fadeout).toBeTruthy();
  });

  it('has a correct background fadein animation', () => {
    expect(directiveInstance.background.fadeinPlayer).toBeTruthy();
  });

  it('has a correct background fadeout animation', () => {
    expect(directiveInstance.background.fadeoutPlayer).toBeTruthy();
  });

  it('get ripple current scale correctly', () => {
    ripple.parentElement = ripple.element.parentNode as HTMLElement;
    fixture.detectChanges();
    ripple.initialSetup();
    ripple.cachingRectAndCenter();
    fixture.detectChanges();
    expect(ripple.currentScale).toEqual(1);
  });

  it('detect nest shape correctly', () => {
    fixture.detectChanges();
    ripple.parentElement = ripple.element.parentNode as HTMLElement;
    fixture.detectChanges();
    ripple.initialSetup();
    ripple.cachingRectAndCenter();

    ripple.parentElement.style.borderRadius = '3px';
    fixture.detectChanges();
    ripple.initialSetup();
    ripple.cachingRectAndCenter();
    fixture.detectChanges();
    expect(ripple.isInCircleArea).toBeFalsy();

    ripple.parentElement.style.height = '150px';
    ripple.parentElement.style.width = '250px';
    fixture.detectChanges();
    ripple.initialSetup();
    ripple.cachingRectAndCenter();
    fixture.detectChanges();
    expect(ripple.isInCircleArea).toBeFalsy();

    ripple.parentElement.style.borderRadius = '50%';
    ripple.parentElement.style.height = '150px';
    ripple.parentElement.style.width = '250px';
    fixture.detectChanges();
    ripple.initialSetup();
    ripple.cachingRectAndCenter();
    fixture.detectChanges();
    expect(ripple.isInCircleArea).toBeFalsy();

    ripple.parentElement.style.borderRadius = '50%';
    ripple.parentElement.style.width = '150px';
    ripple.parentElement.style.height = '150px';
    fixture.detectChanges();
    ripple.initialSetup();
    ripple.cachingRectAndCenter();
    fixture.detectChanges();
    expect(ripple.isInCircleArea).toBeTruthy();
  });

  it('detect center position correctly', () => {
    ripple.parentElement = ripple.element.parentNode as HTMLElement;
    fixture.detectChanges();
    ripple.initialSetup();
    ripple.cachingRectAndCenter();
    fixture.detectChanges();
    ripple.centerCoordinate(ripple.parentRect);

    const rect = ripple.parentRect;

    const center = {
      x: rect.left + rect.width/2,
      y: rect.top + rect.height/2
    };

    expect(center).toEqual(ripple.center);
  });

  it('detect touch outside circle correctly', () => {

    fixture.detectChanges();
    ripple.parentElement = ripple.element.parentNode as HTMLElement;
    fixture.detectChanges();
    ripple.initialSetup();
    ripple.cachingRectAndCenter();
    fixture.detectChanges();
    ripple.centerCoordinate(ripple.parentRect);

    const rect = ripple.parentRect;

    const angle = 45;
    const x = Math.cos(angle * Math.PI/180) * rect.width/2;
    const y = Math.sin(angle * Math.PI/180) * rect.width/2;
    let pointer: any, event: any;

    const center = {
      x: rect.left + rect.width/2,
      y: rect.top + rect.height/2
    };

    // Touch at Q1 (4.30)
    pointer = {
      clientX: center.x + x,
      clientY: center.y + y,
      timeStamp: 0,
      type: 'touchmove'
    };

    event = { changedTouches: [pointer] };
    expect(ripple.pointerEventStillInCircleArea(event)).toBeTruthy();

    pointer = {
      clientX: center.x + x + 1,
      clientY: center.y + y + 1,
      timeStamp: 0,
      type: 'touchmove'
    };

    event = { changedTouches: [pointer] };
    expect(ripple.pointerEventStillInCircleArea(event)).toBeFalsy();


    // Touch at Q2 (7.30)
    pointer = {
      clientX: center.x - x,
      clientY: center.y + y,
      timeStamp: 0,
      type: 'touchmove'
    };

    event = { changedTouches: [pointer] };
    expect(ripple.pointerEventStillInCircleArea(event)).toBeTruthy();

    pointer = {
      clientX: center.x - x - 1,
      clientY: center.y + y + 1,
      timeStamp: 0,
      type: 'touchmove'
    };

    event = { changedTouches: [pointer] };
    expect(ripple.pointerEventStillInCircleArea(event)).toBeFalsy();


    // Touch at Q3 (10.30)
    pointer = {
      clientX: center.x - x,
      clientY: center.y - y + 0.5,
      timeStamp: 0,
      type: 'touchmove'
    };

    event = { changedTouches: [pointer] };
    expect(ripple.pointerEventStillInCircleArea(event)).toBeTruthy();

    pointer = {
      clientX: center.x - x - 1,
      clientY: center.y - y - 1,
      timeStamp: 0,
      type: 'touchmove'
    };

    event = { changedTouches: [pointer] };
    expect(ripple.pointerEventStillInCircleArea(event)).toBeFalsy();


    // Touch at Q4 (1.30)
    pointer = {
      clientX: center.x + x,
      clientY: center.y - y + 0.5,
      timeStamp: 0,
      type: 'touchmove'
    };

    event = { changedTouches: [pointer] };
    expect(ripple.pointerEventStillInCircleArea(event)).toBeTruthy();

    pointer = {
      clientX: center.x + x + 1,
      clientY: center.y - y - 1,
      timeStamp: 0,
      type: 'touchmove'
    };

    event = { changedTouches: [pointer] };
    expect(ripple.pointerEventStillInCircleArea(event)).toBeFalsy();
  });

  it('detect pointer outside rectangle correctly', () => {

    fixture.detectChanges();
    ripple.parentElement = ripple.element.parentNode as HTMLElement;
    fixture.detectChanges();
    ripple.initialSetup();
    ripple.cachingRectAndCenter();
    fixture.detectChanges();
    ripple.centerCoordinate(ripple.parentRect);

    const rect = ripple.parentRect;
    let pointer: any, event: any;

    const center = {
      x: rect.left + rect.width/2,
      y: rect.top + rect.height/2
    };

    // Top detection
    pointer = {
      clientX: center.x,
      clientY: rect.top + 1
    };
    event = { changedTouches: [pointer] };
    expect(ripple.pointerEventStillInCircleArea(event as TouchEvent)).toBeTruthy();

    pointer = {
      clientX: center.x,
      clientY: rect.top - 1
    };
    event = { changedTouches: [pointer] };
    expect(ripple.pointerEventStillInCircleArea(event as TouchEvent)).toBeFalsy();


    // Right detection
    pointer = {
      clientX: center.x + (rect.width/2) - 1,
      clientY: center.y
    };
    event = { changedTouches: [pointer] };
    expect(ripple.pointerEventStillInCircleArea(event as TouchEvent)).toBeTruthy();

    pointer = {
      clientX: center.x + (rect.width/2) + 1,
      clientY: center.y
    };
    event = { changedTouches: [pointer] };
    expect(ripple.pointerEventStillInCircleArea(event as TouchEvent)).toBeFalsy();


    // Bottom detection
    pointer = {
      clientX: center.x,
      clientY: rect.top + rect.height - 1
    };
    event = { changedTouches: [pointer] };
    expect(ripple.pointerEventStillInCircleArea(event as TouchEvent)).toBeTruthy();

    pointer = {
      clientX: center.x,
      clientY: rect.top + rect.height + 1
    };
    event = { changedTouches: [pointer] };
    expect(ripple.pointerEventStillInCircleArea(event as TouchEvent)).toBeFalsy();

    // Left detection
    pointer = {
      clientX: center.x - (rect.width/2) + 1,
      clientY: center.y
    };
    event = { changedTouches: [pointer] };
    expect(ripple.pointerEventStillInCircleArea(event as TouchEvent)).toBeTruthy();

    pointer = {
      clientX: center.x - (rect.width/2) - 1,
      clientY: center.y
    };
    event = { changedTouches: [pointer] };
    expect(ripple.pointerEventStillInCircleArea(event as TouchEvent)).toBeFalsy();
  });

  it('detect outer point correctly', () => {

    fixture.detectChanges();

    ripple.parentElement = ripple.element.parentNode as HTMLElement;
    ripple.element.style.transform = 'scale(0.5)';
    fixture.detectChanges();
    ripple.initialSetup();
    ripple.cachingRectAndCenter();
    fixture.detectChanges();
    ripple.centerCoordinate(ripple.parentRect);
    fixture.detectChanges();

    let pointer = {
      clientX: ripple.center.x - (ripple.parentRect.width/4) + 1,
      clientY: ripple.center.y
    };
    let event: any = { changedTouches: [pointer] };
    expect(ripple.outerPointStillInHostRadius(event as TouchEvent)).toBeTruthy();

    pointer = {
      clientX: ripple.center.x - (ripple.parentRect.width/4),
      clientY: ripple.center.y
    };
    event = { changedTouches: [pointer] };
    expect(ripple.outerPointStillInHostRadius(event as TouchEvent)).toBeFalsy();
  });

  it('motion tracker track TouchEvent correctly', () => {
    let pointer: any, event: any;
    pointer = { clientX: 100, clientY: 100 };
    event = {
      changedTouches: [pointer],
      timeStamp: 0,
      type: 'touchstart'
    };

    motionTracker.track(event);
    expect(motionTracker.pointerDownClientX).toEqual(pointer.clientX);
    expect(motionTracker.pointerDownClientY).toEqual(pointer.clientY);
    expect(motionTracker.pointerDownType).toEqual(event.type);

    event = {
      changedTouches: [pointer],
      timeStamp: 0,
      type: 'touchmove'
    };

    motionTracker.track(event);
    expect(motionTracker.pointerMoveClientX).toEqual(pointer.clientX);
    expect(motionTracker.pointerMoveClientY).toEqual(pointer.clientY);
    expect(motionTracker.pointerMoveType).toEqual(event.type);

    event = {
      changedTouches: [pointer],
      timeStamp: 0,
      type: 'touchend'
    };

    motionTracker.track(event);
    expect(motionTracker.pointerUpClientX).toEqual(pointer.clientX);
    expect(motionTracker.pointerUpClientY).toEqual(pointer.clientY);
    expect(motionTracker.pointerUpType).toEqual(event.type);
  });

  it('motion tracker track MouseEvent correctly', () => {
    let event: any;
    event = {
      clientX: 100,
      clientY: 100,
      timeStamp: 0,
      type: 'mousedown'
    };

    motionTracker.track(event);
    expect(motionTracker.pointerDownClientX).toEqual(event.clientX);
    expect(motionTracker.pointerDownClientY).toEqual(event.clientY);
    expect(motionTracker.pointerDownType).toEqual(event.type);

    event = {
      clientX: 100,
      clientY: 100,
      timeStamp: 0,
      type: 'mousemove'
    };

    motionTracker.track(event);
    expect(motionTracker.pointerMoveClientX).toEqual(event.clientX);
    expect(motionTracker.pointerMoveClientY).toEqual(event.clientY);
    expect(motionTracker.pointerMoveType).toEqual(event.type);

    event = {
      clientX: 100,
      clientY: 100,
      timeStamp: 0,
      type: 'mouseup'
    };

    motionTracker.track(event);
    expect(motionTracker.pointerUpClientX).toEqual(event.clientX);
    expect(motionTracker.pointerUpClientY).toEqual(event.clientY);
    expect(motionTracker.pointerUpType).toEqual(event.type);

    motionTracker.reset();
    expect(motionTracker.pointerDownClientX).toEqual(undefined);
    expect(motionTracker.pointerDownClientY).toEqual(undefined);
    expect(motionTracker.pointerDownType).toEqual(undefined);
    expect(motionTracker.pointerMoveClientX).toEqual(undefined);
    expect(motionTracker.pointerMoveClientY).toEqual(undefined);
    expect(motionTracker.pointerMoveType).toEqual(undefined);
    expect(motionTracker.pointerUpClientX).toEqual(undefined);
    expect(motionTracker.pointerUpClientY).toEqual(undefined);
    expect(motionTracker.pointerUpType).toEqual(undefined);
  });

  it('motion tracker detect duration and velocity', () => {
    let event: any;
    event = {
      clientX: 100,
      clientY: 200,
      timeStamp: 10,
      type: 'mousedown'
    };

    motionTracker.track(event);

    event = {
      clientX: 200,
      clientY: 330,
      timeStamp: 100,
      type: 'mousemove'
    };

    motionTracker.track(event);

    event = {
      clientX: 20,
      clientY: 33,
      timeStamp: 110,
      type: 'mouseup'
    };

    motionTracker.track(event);

    fixture.detectChanges();

    const deltaX = 200-100;
    const deltaY = 330-200;
    const deltaT = 100-10;
    const velocityX = Math.abs((deltaX/deltaT)*100);
    const velocityY = Math.abs((deltaY/deltaT)*100);
    const avgVelocity = (velocityX+velocityY)/2;
    const duration = 110-10;

    expect(motionTracker.velocityX).toEqual(velocityX);
    expect(motionTracker.velocityY).toEqual(velocityY);
    expect(motionTracker.velocity).toEqual(avgVelocity);
    expect(motionTracker.duration).toEqual(duration);
  });
});
