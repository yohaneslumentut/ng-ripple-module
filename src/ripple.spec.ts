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

import { By } from "@angular/platform-browser";
import { RippleComponent } from './ripple.component';
import { BackgroundComponent } from './ripple-bg.component';
import { RippleAnimation } from './ripple.animation';
import { RippleDirective } from './ripple.directive';
import { NgRippleModule } from './ng-ripple.module';

import {
  RIPPLE_LIGHT_BGCOLOR,
  RIPPLE_LIGHT_ACTIVE_BGCOLOR
} from './ripple.constants';

import { 
  RippleGestures,
  MobileTriggers,
  DesktopTriggers,
  Events
} from './ripple.gestures';

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
  ){}
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
  constructor(public elRef:ElementRef){}
}

describe('Directive', () => {

  let component: RippleTestComponent;
  let fixture: ComponentFixture<RippleTestComponent>;
  let directiveEl: DebugElement;
  let directiveInstance: RippleDirective
  let gestures: RippleGestures
  let animation: RippleAnimation 
  let ripple: RippleComponent

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

    gestures = directiveInstance.rippleGestures;
    animation = directiveInstance.ripple.animation;
    animation.transition = directiveInstance.ripple.transition;
    ripple = directiveInstance.ripple;
  }));


  it('create ripple and background element', () => {

    fixture.detectChanges();

    let hostElement = component.elRef.nativeElement.children[0];
    let children = hostElement.children
    let expectedChildren = ['background', 'ripple']

    expect(expectedChildren).toContain(children[0].localName);
    expect(expectedChildren).toContain(children[1].localName);

  })

  it('passing data transition to ripple component', () => {

    let hostElement = component.elRef.nativeElement.children[0];

    let transitions = {
      fillTransition: hostElement.getAttribute('fillTransition'),
      splashTransition: hostElement.getAttribute('splashTransition'),
      fadeTransition: hostElement.getAttribute('fadeTransition')
    }

    fixture.detectChanges();
    for(let k in transitions){
      expect(directiveInstance.ripple[k]).toEqual(transitions[k]);
    }
  })

  it('passing data color to ripple & background', () => {
    let hostElement = component.elRef.nativeElement.children[0];

    fixture.detectChanges();
    let rippleBgColor = hostElement.getAttribute('rippleBgColor');
    expect(directiveInstance.ripple.color).toEqual(rippleBgColor);

    let activeBgColor = hostElement.getAttribute('activeBgColor');
    expect(directiveInstance.background.color).toEqual(activeBgColor);

    directiveInstance.light = true;
    fixture.detectChanges();
    expect(directiveInstance.ripple.color).toEqual(RIPPLE_LIGHT_BGCOLOR);
    expect(directiveInstance.background.color).toEqual(RIPPLE_LIGHT_ACTIVE_BGCOLOR);
  })

  it('passing centered ripple', () => {
    directiveInstance.centered = true;
    fixture.detectChanges();
    expect(directiveInstance.ripple.centered).toBeTruthy();
  })

  it('passing fixed ripple', () => {
    directiveInstance.fixed = true;
    fixture.detectChanges();
    expect(directiveInstance.ripple.fixed).toBeTruthy();
  })

  it('passing tap limit', () => {
    directiveInstance.tapLimit = 250;
    fixture.detectChanges();
    expect(directiveInstance.ripple.tapLimit).toEqual(250);
  })

  it('listen to rtap event', (done) => {
    gestures.touchstartTimeStamp = 0;
    gestures.activate();

    directiveInstance.gestures = directiveInstance.rippleGestures
    directiveInstance.gestures._isMobile = true;
    directiveInstance.background.eventTrigger.subscribe(() => {
      expect(gestures.currentEvent).toEqual(Events.TAP)
    })

    gestures.touchendTimeStamp = 350;
    gestures.deactivate();
    directiveInstance.background.eventTrigger.emit();
    fixture.detectChanges();
    done();
  })

  it('listen to rclick event', (done) => {
    gestures.touchstartTimeStamp = 0;
    gestures.activate();

    directiveInstance.gestures = directiveInstance.rippleGestures
    directiveInstance.gestures._isMobile = false;
    directiveInstance.background.eventTrigger.subscribe(() => {
      expect(gestures.currentEvent).toEqual(Events.CLICK)
    })

    gestures.touchendTimeStamp = 350;
    gestures.deactivate();
    directiveInstance.background.eventTrigger.emit();
    fixture.detectChanges();
    done();
  })

  it('listen to rpress event', (done) => {
    gestures.touchstartTimeStamp = 0;
    gestures.activate();

    directiveInstance.background.eventTrigger.subscribe(() => {
      expect(gestures.currentEvent).toEqual(Events.PRESS)
    })

    fixture.detectChanges();
    done();
  })

  it('listen to rpressup event', (done) => {
    gestures.touchstartTimeStamp = 0;
    gestures.activate();

    directiveInstance.background.eventTrigger.subscribe(() => {
      expect(gestures.currentEvent).toEqual(Events.PRESSUP)
    })

    gestures.touchendTimeStamp = 750;
    gestures.deactivate();
    directiveInstance.background.eventTrigger.emit();
    fixture.detectChanges();
    done();
  })

  it('neglect fast repeating event', (done) => {

    directiveInstance.gestures = directiveInstance.rippleGestures
    directiveInstance.gestures._isMobile = true;

    gestures.touchstartTimeStamp = 0;
    gestures.activate();

    directiveInstance.background.eventTrigger.subscribe(() => {
      expect(gestures.emitCurrentEvent).toEqual(undefined);
    })

    gestures.touchendTimeStamp = 50;
    gestures.lastEventName = Events.TAP;
    gestures.deactivate();
    directiveInstance.background.eventTrigger.emit();
    fixture.detectChanges();
    done();
  })

  it('provide correct mobile triggers', () => {
    const triggers = new Map<string, Function>();
    for(let i in MobileTriggers) triggers.set(MobileTriggers[i], gestures[`on${MobileTriggers[i]}`])
    gestures._isMobile = true;
    fixture.detectChanges();
    expect(gestures.supportedTriggers).toEqual(triggers)
  })

  it('provide correct desktop triggers', () => {
    const triggers = new Map<string, Function>();
    for(let i in DesktopTriggers) triggers.set(DesktopTriggers[i], gestures[`on${DesktopTriggers[i]}`])
    gestures._isMobile = false;
    fixture.detectChanges();
    expect(gestures.supportedTriggers).toEqual(triggers)
  })

  it('has a correct fill animation', () => {
    expect(animation.fill(100,100)).toBeTruthy();
  })

  it('has a correct translate animation', () => {
    expect(animation.translate(10,10,0.5)).toBeTruthy();
  })

  it('nas a correct splash animation', () => {
    expect(animation.splash).toBeTruthy();
  })

  it('has a correct fade animation', () => {
    expect(animation.fade).toBeTruthy();
  })

  it('has a correct background fadein animation', () => {
    directiveInstance.background.duration = 350;
    expect(directiveInstance.background.fadeinPlayer).toBeTruthy();
  })

  it('has a correct background fadeout animation', () => {
    directiveInstance.background.duration = 350;
    expect(directiveInstance.background.fadeoutPlayer).toBeTruthy();
  })

  it('get ripple current scale correctly', () => {
    ripple.parentElement = ripple.element.parentNode as HTMLElement;
    fixture.detectChanges()
    directiveInstance.ripple.updateDimensions
    fixture.detectChanges();
    expect(ripple.currentScale).toEqual(1);
  })

  it('detect nest shape correctly', () => {
    fixture.detectChanges();
    ripple.parentElement = ripple.element.parentNode as HTMLElement;

    ripple.parentElement.style.borderRadius = '3px';
    fixture.detectChanges();
    expect(ripple.isInCircleArea).toBeFalsy();

    ripple.parentElement.style.height = '150px';
    ripple.parentElement.style.width = '250px';
    fixture.detectChanges();
    expect(ripple.isInCircleArea).toBeFalsy();

    ripple.parentElement.style.borderRadius = '50%';
    ripple.parentElement.style.height = '150px';
    ripple.parentElement.style.width = '250px';
    fixture.detectChanges();
    expect(ripple.isInCircleArea).toBeFalsy();

    ripple.parentElement.style.borderRadius = '50%';
    ripple.parentElement.style.height = '150px';
    ripple.parentElement.style.width = '150px';
    ripple.updateDimensions;
    fixture.detectChanges();
    expect(ripple.isInCircleArea).toBeTruthy();
  });

  it('detect center position correctly', () => {

    fixture.detectChanges();
    ripple.parentElement = ripple.element.parentNode as HTMLElement;
    let rect = ripple.parentRect;

    let center = {
      x: rect.left + rect.width/2,
      y: rect.top + rect.height/2
    }

    expect(center).toEqual(ripple.center);
  });

  it('detect touch outside circle correctly', () => {

    fixture.detectChanges();
    ripple.parentElement = ripple.element.parentNode as HTMLElement;
    let rect = ripple.parentRect;

    let angle = 45;
    let x = Math.cos(angle * Math.PI/180) * rect.width/2;
    let y = Math.sin(angle * Math.PI/180) * rect.width/2;
    let touch: any, event: any;

    let center = {
      x: rect.left + rect.width/2,
      y: rect.top + rect.height/2
    }
    
    // Touch at Q1 (4.30)
    touch = {
      clientX: center.x + x,
      clientY: center.y + y
    }

    event = { changedTouches: [touch] }
    expect(ripple.touchEventStillInCircleArea(event as TouchEvent)).toBeTruthy();

    touch = {
      clientX: center.x + x + 1,
      clientY: center.y + y + 1
    }

    event = { changedTouches: [touch] }
    expect(ripple.touchEventStillInCircleArea(event as TouchEvent)).toBeFalsy();


    // Touch at Q2 (7.30)
    touch = {
      clientX: center.x - x,
      clientY: center.y + y
    }

    event = { changedTouches: [touch] }
    expect(ripple.touchEventStillInCircleArea(event as TouchEvent)).toBeTruthy();

    touch = {
      clientX: center.x - x - 1,
      clientY: center.y + y + 1
    }

    event = { changedTouches: [touch] }
    expect(ripple.touchEventStillInCircleArea(event as TouchEvent)).toBeFalsy();


    // Touch at Q3 (10.30)
    touch = {
      clientX: center.x - x,
      clientY: center.y - y + 0.5 
    }

    event = { changedTouches: [touch] }
    expect(ripple.touchEventStillInCircleArea(event as TouchEvent)).toBeTruthy();

    touch = {
      clientX: center.x - x - 1,
      clientY: center.y - y - 1
    }

    event = { changedTouches: [touch] }
    expect(ripple.touchEventStillInCircleArea(event as TouchEvent)).toBeFalsy();


    // // Touch at Q4 (1.30)
    touch = {
      clientX: center.x + x,
      clientY: center.y - y + 0.5
    }

    event = { changedTouches: [touch] }
    expect(ripple.touchEventStillInCircleArea(event as TouchEvent)).toBeTruthy();

    touch = {
      clientX: center.x + x + 1,
      clientY: center.y - y - 1
    }

    event = { changedTouches: [touch] }
    expect(ripple.touchEventStillInCircleArea(event as TouchEvent)).toBeFalsy();
  })

  it('detect touch outside rectangle correctly', () => {

    fixture.detectChanges();
    ripple.parentElement = ripple.element.parentNode as HTMLElement;
    let rect = ripple.parentRect;
    let touch: any, event: any;

    let center = {
      x: rect.left + rect.width/2,
      y: rect.top + rect.height/2
    }

    // Top detection
    touch = {
      clientX: center.x,
      clientY: rect.top + 1
    }
    event = { changedTouches: [touch] }
    expect(ripple.touchEventStillInCircleArea(event as TouchEvent)).toBeTruthy();

    touch = {
      clientX: center.x,
      clientY: rect.top - 1
    }
    event = { changedTouches: [touch] }
    expect(ripple.touchEventStillInCircleArea(event as TouchEvent)).toBeFalsy();


    // Right detection
    touch = {
      clientX: center.x + (rect.width/2) - 1,
      clientY: center.y
    }
    event = { changedTouches: [touch] }
    expect(ripple.touchEventStillInCircleArea(event as TouchEvent)).toBeTruthy();

    touch = {
      clientX: center.x + (rect.width/2) + 1,
      clientY: center.y
    }
    event = { changedTouches: [touch] }
    expect(ripple.touchEventStillInCircleArea(event as TouchEvent)).toBeFalsy();


    // Bottom detection
    touch = {
      clientX: center.x,
      clientY: rect.top + rect.height - 1
    }
    event = { changedTouches: [touch] }
    expect(ripple.touchEventStillInCircleArea(event as TouchEvent)).toBeTruthy();

    touch = {
      clientX: center.x,
      clientY: rect.top + rect.height + 1
    }
    event = { changedTouches: [touch] }
    expect(ripple.touchEventStillInCircleArea(event as TouchEvent)).toBeFalsy();

    // Left detection
    touch = {
      clientX: center.x - (rect.width/2) + 1,
      clientY: center.y
    }
    event = { changedTouches: [touch] }
    expect(ripple.touchEventStillInCircleArea(event as TouchEvent)).toBeTruthy();

    touch = {
      clientX: center.x - (rect.width/2) - 1,
      clientY: center.y
    }
    event = { changedTouches: [touch] }
    expect(ripple.touchEventStillInCircleArea(event as TouchEvent)).toBeFalsy();
  })

  it('detect outer point correctly', () => {

    fixture.detectChanges();

    ripple.parentElement = ripple.element.parentNode as HTMLElement;
    ripple.element.style.transform = 'scale(0.5)';

    fixture.detectChanges();
    
    let touch = {
      clientX: ripple.center.x - (ripple.parentRect.width/4) + 1,
      clientY: ripple.center.y
    }
    let event: any = { changedTouches: [touch] }
    expect(ripple.outerPointStillInHostRadius(event as TouchEvent)).toBeTruthy();

    touch = {
      clientX: ripple.center.x - (ripple.parentRect.width/4),
      clientY: ripple.center.y
    }
    event = { changedTouches: [touch] }
    expect(ripple.outerPointStillInHostRadius(event as TouchEvent)).toBeFalsy();
  })
});