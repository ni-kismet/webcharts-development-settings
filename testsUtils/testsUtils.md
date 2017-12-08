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

* getPixelColor(ctx, x, y)

Returns the color of a pixel, specified by a canvas context and its xy position.

* getScaledPixelColor(ctx, r, x, y)

Returns the color of a pixel, specified by a canvas context and its xy position,
where x and y are multiplied by r, to account for scaling.

* rgba(r, g, b, a)

Returns an array, made of the 'r', 'g', 'b', 'a' arguments.
This is the same format as returned by a cnvCtxt.getImageData(x, y, 1, 1).data.

* isClose(c1, c2)

Returns true or false, depending on whether the two c1 and c2 colors are almost
identical, using an error of 5 when comparing color components. The two colors
are expected to be formatted as 4-element arrays (RGBA).

* canvasData(canvas, x, y, width, height)

Returns an array of pixels, where each pixel takes 4 elements of the array, using
the RGBA format. The returned area is defined by an offset (x/y) and a size
(width/height).

* getEntireCanvasData(canvas)

Returns an array of pixels, where each pixel takes 4 elements of the array, using
the RGBA format.

* hexToRgb(hex)

Returns an array of 3 elements, RGB (without alpha), using the '#RRGGBB' format
as argument.


## Jasmine matchers

* toFillPixel

This is a Jasmine matcher, used to test a particular pixel color of a
plot. It expects a particular pixel from a plot to have a desired color.
```js
var rgba = window.colors.rgba;

beforeEach(function() {
    jasmine.addMatchers(colors.jasmineMatchers);
});

it('should draw a red pixel at x = 10 and y = 11', function() {
    // the plot offset and pixel ratio are took into account under the hood
    expect(rgba(255,0,0,1)).toFillPixel(plot, 10, 11);
});
```


* toMatchPixelColor
* toMatchPixelColorWithError

The "other way around" approach of **toFillPixel**, is to use **toMatchPixelColor**
and **toMatchPixelColorWithError** matchers. They are used to compare a pixel
color returned by *canvasData* function, against a given color.
When using these two matchers, the width and height of the extracted canvas area
must be both 1, on calling *canvasData* function.
Colors are specified as a 4-element array, representing the RGBA components.
The **toMatchPixelColorWithError** matcher expects a 5th element, which accounts
for the color error given by antialiasing. The color difference between the actual
and expected values must be less than or equal to this error (absolute value).

```js
var canvasData = window.colors.canvasData;

beforeEach(function() {
    jasmine.addMatchers(colors.jasmineMatchers);
});

it('should draw a canvas area on another canvas', function() {
    expect(canvasData(destinationCanvas, 10, 10, 1, 1)).toMatchPixelColor([0, 0, 0, 0]);
    expect(canvasData(destinationCanvas, 79, 102, 1, 1)).toMatchPixelColorWithError([10, 150, 46, 255, 15]);
});
```


* toContainPixelColor

When there are chances that a particular tested canvas area, will slightly change
in future versions, it may not be practical to specify a fixed pixel to verify
its color. One approach is to look for an expected color in a given area or in
the whole canvas. For this, use the **toContainPixelColor** matcher. It works in
the same way as the **toMatchPixelColor** and **toMatchPixelColorWithError**
matchers.

```js
var getEntireCanvasData = window.colors.getEntireCanvasData,
    canvasData = window.colors.canvasData;

beforeEach(function() {
    jasmine.addMatchers(colors.jasmineMatchers);
});

it('should draw a canvas area on another canvas', function() {
    expect(getEntireCanvasData(destinationCanvas)).toContainPixelColor([123, 21, 0, 255]);
    expect(canvasData(debugCanvas, 79, 102, 10, 30)).toContainPixelColor([12, 210, 50, 255]);
});
```


* toMatchCanvasArea
There is also a matcher, **toMatchCanvasArea**, which allows comparing two canvas
areas, pixel by pixel. It uses data returned by canvasData function. As seen in
the example below, both calls to canvasData are made using the same canvas size.
If the two canvas sizes do not match, the expect statement fails.

```js
var canvasData = window.colors.canvasData;

beforeEach(function() {
    jasmine.addMatchers(colors.jasmineMatchers);
});

it('should draw a canvas area on another canvas', function() {
    expect(canvasData(originalCanvas, 0, 0, 20, 20)).toMatchCanvasArea(canvasData(destinationCanvas, 0, 0, 20, 20));
});
```
