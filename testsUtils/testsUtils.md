# Tests utils

## Simulate

Provides utility functions for simulating events:

* mouseDown
* mouseMove
* mouseUp
* mouseWheel
* dblclick
* touchstart
* touchmove
* touchend
* touchdrag
* sendTouchEvents
* click

Usage

```js
var simulate = window.simulate;
simulate.click(eventHolder, 10, 20);
```

## Colors

Provides utility functions for testing the color of a pixel from a canvas:

* getPixelColor
* getScaledPixelColor
* rgba
* isClose

A Jasmine matcher to test a particular pixel color of a plot is also provided:

```js
beforeEach(function() {
    jasmine.addMatchers(colors.jasmineMatchers);
});

it('should draw a red pixel at x = 10 and y = 11', function() {
    // the plot offset and pixel ratio are took into account under the hood
    expect(rgba(255,0,0,1)).toFillPixel(plot, 10, 11);
});
```
