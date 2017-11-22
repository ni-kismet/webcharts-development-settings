/* eslint-disable */
(function() {
    'use strict';

    window.colors = {};

    var colors = window.colors;

    var jasmineMatchers = {
        toFillPixel: function(util, customEqualityTesters) {
            return {
                compare: function() {
                    var expected = arguments[0],
                        plot = arguments[1],
                        x = arguments[2], y = arguments[3],
                        ctx = plot.getCanvas().getContext('2d'),
                        plotOffset = plot.getPlotOffset(),
                        pixelRatio = plot.getSurface().pixelRatio,
                        cx = (plotOffset.left + x) * pixelRatio,
                        cy = (plotOffset.top + y) * pixelRatio,
                        actual = getPixelColor(ctx, cx, cy),
                        result = {};
                    result.pass = isClose(actual, expected);
                    if (!result.pass) {
                        result.message =
                          'Expected ' + printColor(expected) +
                          ' at ' + x + ',' + y +
                          ' / ' + cx + ',' + cy +
                          ' actual ' + printColor(actual);
                    }
                    return result;
                }
            };
        },

        toMatchPixelColor: function(util, customEqualityTesters) {
            return {
                compare: function(actual, expected) {
                    if (expected === undefined) {
                        expected = expected || [-1000, -1000, -999, -999]; //no color should match these values
                    }

                    var pixelData = actual,
                        r = expected[0],
                        g = expected[1],
                        b = expected[2],
                        a = expected[3],

                        result = {};
                    result.pass = matchPixelColor(pixelData, r, g, b, a);
                    if (!result.pass) {
                        result.message =
                          'Expected [' + pixelData +
                          '] to match [' + r + ',' + g + ',' + b + ',' + a + ']';
                    }
                    return result;
                }
            };
        },

        toContainPixelColor: function(util, customEqualityTesters) {
            return {
                compare: function(actual, expected) {
                    if (expected === undefined) {
                        expected = expected || [-1000, -1000, -999, -999]; //no color should match these values
                    }

                    var result = {};
                    var i, i4, pixelData, r, g, b, a, actualLength;
                    r = expected[0];
                    g = expected[1];
                    b = expected[2];
                    a = expected[3];
                    actualLength = actual.length >> 2; //fast divide by 4

                    result.pass = false;
                    pixelData = [];
                    for (i = 0; i < actualLength; i = i + 4) {
                        i4 = i * 4;
                        pixelData[0] = actual[i4 + 0];
                        pixelData[1] = actual[i4 + 1];
                        pixelData[2] = actual[i4 + 2];
                        pixelData[3] = actual[i4 + 3];
                        result.pass = result.pass || matchPixelColor(pixelData, r, g, b, a);
                        if (result.pass) {
                            break;
                        }
                    }

                    if (!result.pass) {
                        result.message =
                          'Expected pixelData[...' +
                          '] to contain pixel color: [' + r + ',' + g + ',' + b + ',' + a + ']. Pixel index is: ' + i;
                    }
                    return result;
                }
            };
        }
    };

    function printColor(c) {
        if (c) {
            c = (c instanceof Array) ? c : [c[0], c[1], c[2], c[3]];
            return 'rgba(' + c.join() + ')';
        } else {
            return 'undefined';
        }
    }

    function matchPixelColor(pixelData, r, g, b, a) {
        return (pixelData[0] === r) && (pixelData[1] === g) && (pixelData[2] === b) && (pixelData[3] === a);
    }

    function getPixelColor(ctx, x, y) {
        return ctx.getImageData(x, y, 1, 1).data;
    }

    function getScaledPixelColor(ctx, r, x, y) {
        return getPixelColor(ctx, x * r, y * r);
    }

    function rgba(r, g, b, a) {
        return [r, g, b, a * 255];
    }

    function isClose(c1, c2) {
        var tolerance = 5,
            close = c2
                .map(function(v, i) { return Math.abs(v - c1[i]); })
                .every(function(d) { return d <= tolerance; });
        return close;
    }

    colors.jasmineMatchers = jasmineMatchers;
    colors.getPixelColor = getPixelColor;
    colors.getScaledPixelColor = getScaledPixelColor;
    colors.rgba = rgba;
    colors.isClose = isClose;

})();
