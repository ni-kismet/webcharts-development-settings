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
