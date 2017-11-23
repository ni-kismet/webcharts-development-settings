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

Provides utility functions for testing the color of a pixel or area from a canvas:

* getPixelColor
* getScaledPixelColor
* rgba
* isClose
* canvasData;
* getEntireCanvasData;
* hexToRgb;

A Jasmine matcher to test a particular pixel color of a plot is also provided:

```js
var rgba = window.colors.rgba,
    getEntireCanvasData = window.colors.getEntireCanvasData,
    canvasData = window.colors.canvasData;

beforeEach(function() {
    jasmine.addMatchers(colors.jasmineMatchers);
});

it('should draw a red pixel at x = 10 and y = 11', function() {
    // the plot offset and pixel ratio are took into account under the hood
    expect(rgba(255,0,0,1)).toFillPixel(plot, 10, 11);
});

it('should draw a canvas area on another canvas', function() {
    expect(getEntireCanvasData(destinationCanvas)).toContainPixelColor([123, 21, 0, 255]);
    expect(canvasData(destinationCanvas, 10, 10, 1, 1)).toMatchPixelColor([0, 0, 0, 0]);

    expect(canvasData(destinationCanvas, 79, 102, 1, 1))
        .toMatchPixelColorWithError([10, 150, 46, 255, 15]);

    expect(canvasData(originalCanvas1, 0, 0, 20, 20))
        .toMatchCanvasArea(canvasData(destinationCanvas, 0, 0, 20, 20));
});
```
