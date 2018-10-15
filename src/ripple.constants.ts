/**
 * @license
 * Copyright (c) 2018 Yohanes Oktavianus Lumentut All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/yohaneslumentut/ng-ripple-module/blob/master/LICENSE
 */

const RIPPLE_TO_CENTER_TRANSFORM = 'translate(0, 0) scale(1)';
const RIPPLE_LIGHT_BGCOLOR = 'rgba(255,255,255, 0.25)';
const RIPPLE_LIGHT_ACTIVE_BGCOLOR = 'rgba(255,255,255,0.15)';
const RIPPLE_DARK_BGCOLOR = 'rgba(0,0,0,0.1)';
const RIPPLE_DARK_ACTIVE_BGCOLOR =  'rgba(0,0,0,0.05)';
const RIPPLE_FILL_TRANSITION = '1000ms';
const RIPPLE_SPLASH_TRANSITION = '150ms cubic-bezier(0.2,0.05,0.2,1)';
const RIPPLE_FADE_TRANSITION = '200ms linear';
const RIPPLE_ITEM_FILL_TRANSITION = '1500ms linear';
const RIPPLE_ITEM_SPLASH_TRANSITION = '180ms cubic-bezier(0.2,0.05,0.2,1)';
const RIPPLE_ITEM_BGCOLOR = 'rgba(0,0,0,0.05)';
const RIPPLE_ITEM_ACTIVE_BGCOLOR = 'rgba(0,0,0,0.035)';
const RIPPLE_HOST_ACTIVE_SPEED = '200ms';
const RIPPLE_HOST_INACTIVE_SPEED = '350ms';
const RIPPLE_REPEATING_EVENT_LIMIT = 700;
const RIPPLE_CLICK_FILL_AND_SPLASH = '250ms ease-out';
const RIPPLE_CLICK_EMIT_DELAY = '250ms';
const RIPPLE_TAP_LIMIT = 700;

export {
  RIPPLE_TO_CENTER_TRANSFORM,
  RIPPLE_LIGHT_BGCOLOR,
  RIPPLE_LIGHT_ACTIVE_BGCOLOR,
  RIPPLE_DARK_BGCOLOR,
  RIPPLE_DARK_ACTIVE_BGCOLOR,
  RIPPLE_FILL_TRANSITION,
  RIPPLE_SPLASH_TRANSITION,
  RIPPLE_FADE_TRANSITION,
  RIPPLE_ITEM_FILL_TRANSITION,
  RIPPLE_ITEM_SPLASH_TRANSITION,
  RIPPLE_ITEM_BGCOLOR,
  RIPPLE_ITEM_ACTIVE_BGCOLOR,
  RIPPLE_HOST_ACTIVE_SPEED,
  RIPPLE_HOST_INACTIVE_SPEED,
  RIPPLE_REPEATING_EVENT_LIMIT,
  RIPPLE_CLICK_FILL_AND_SPLASH,
  RIPPLE_CLICK_EMIT_DELAY,
  RIPPLE_TAP_LIMIT
}