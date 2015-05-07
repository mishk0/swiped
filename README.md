# Swiped.js
[![license](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://raw.githubusercontent.com/mishk0/Swiped/master/LICENSE)
[![npm](http://img.shields.io/npm/v/swiped.svg?style=flat)](https://www.npmjs.com/package/swiped)


<img src="https://i.imgur.com/wcZFgGu.png" alt="swiped.js qrcode">

[Demo](http://mishk0.github.io/swiped/) (use mobile or emulate touches mode on your browser)

<img src="https://i.imgur.com/EUT9r0U.gif" alt="swiped.js">

## Features

- Dependency-free.
- Short & long swipe.
- Swipe to delete.
- Easy to use.
- CSS transforms & transitions.

## Installation

```
npm install swiped
bower install swiped
```

## API

### Swiped(options)

- `options` (object) - Options to configure a new instance of Swiped.
- `[options.query]` (string) - Query selector.
- `[options.duration]` (number) - The time (milliseconds) to open/close the element. Default: `200`.
- `[options.tolerance]` (number) - Default: `150`.
- `[options.time]` (number) - Time for short swipe. Default: `200`.
- `[options.left]` (number) - Distance for swipe from left to right. Default: `0`.
- `[options.right]` (number) - Distance for swipe from right to left. Default: `0`.
- `[options.list]` (boolean) - Elements depend on each other. Default: `false`.
- `[options.onOpen]` (function).
- `[options.onClose]` (function).


```js
var s = Swiped.init(options);

s.open();
s.close();
s.toggle();
s.destroy([isRemoveNode])
```

## Usage

Example of the html markup for single element:
```html
<div class="foo">
    elem1
</div>
```
for multiple:
```html
<ul class="bar">
    <li>
        elem3
    </li>
    <li>
        elem4
    </li>
    <li>
        elem5
    </li>
</ul>
```
for switch:
```html
<div class="foo"><span></span>element 16</div>
```

initialization for single element:
```js
var s1 = Swiped.init({
    query: '.foo',
    right: 300
});
```
for multiple:
```js
var s2 = Swiped.init({
    query: '.bar li',
    list: true,
    left: 200,
    right: 200
});
```

for switch:
```js
var s3 = Swiped.init({
    query: '.foo',
    left: 400
});

document.querySelector('.foo span').addEventListener('touchstart', function() {
    s3.toggle();
});
```

#### Implementation for "swipe to delete"

```js
Swiped.init({
    query: '.baz',
    right: 400,
    onOpen: function() {
        this.destroy(true)
    }
});
```
