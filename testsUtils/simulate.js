/* eslint-disable */
(function() {
    'use strict';

    window.simulate = {};

    var simulate = window.simulate;
    const noButton = 0;
    const leftButton = 1;
    const buttonsToWhichMap = { 0: 0, 1: 1, 4: 2, 8: 3 };
    const buttonsToButtonMap = { 0: undefined, 1: 0, 2: 1, 4: 2 };

    function mouseEvent(type, sx, sy, cx, cy, buttons, detail, key) {
        buttons = (buttons != null) ? buttons : noButton;
        var which = buttonsToWhichMap[buttons],
            button = buttonsToButtonMap[buttons],
            e = {
                bubbles: true,
                cancelable: (type !== "mousemove"),
                view: window,
                detail: detail,
                screenX: sx,
                screenY: sy,
                clientX: cx,
                clientY: cy,
                pageX: cx,
                pageY: cy,
                ctrlKey: false,
                altKey: false,
                shiftKey: false,
                metaKey: false,
                button: button,
                buttons: buttons,
                which: which,
                relatedTarget: undefined
            };

        if (key === "ctrlKey") {
            e.ctrlKey = true;
        } else if (key === "altKey") {
            e.altKey = true;
        } else if (key === "shiftKey") {
            e.shiftKey = true;
        } else if (key === "shiftKey") {
            e.shiftKey = true;
        } else if (key === "metaKey") {
            e.metaKey = true;
        }

        var evt;

        // These methods of creating events are obsolete.
        // Note that the new CustomEvent is not playing well with jQuery.
        if (typeof (document.createEvent) === "function") {
            evt = document.createEvent("MouseEvents");
            /*evt.initMouseEvent(type,
                e.bubbles, e.cancelable, e.view, e.detail,
                e.screenX, e.screenY, e.clientX, e.clientY,
                e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                e.button, document.body.parentNode);*/
            evt = new MouseEvent(type, e);
        } else if (document.createEventObject) {
            evt = document.createEventObject();
            for (var prop in e) {
                evt[prop] = e[prop];
            }
            evt.buttons = {
                0: 1,
                1: 4,
                2: 2
            }[evt.buttons] || evt.buttons;
        }

        // Setting properties that can't be set via initMouseEvent or createEventObject.
        /*for (var prop in e) {
            var propertyNotSetViaCustomEventConstructor = evt[prop] == null && e[prop] != null;
            if (propertyNotSetViaCustomEventConstructor) {
                evt[prop] = e[prop];
            }
        }*/

        return evt;
    }

    function wheelEvent(type, sx, sy, cx, cy, buttons, detail, key, deltaX, deltaY) {
        buttons = (buttons != null) ? buttons : noButton;
        var which = buttonsToWhichMap[buttons],
            button = buttonsToButtonMap[buttons],
            e = {
                bubbles: true,
                cancelable: (type !== "mousemove"),
                view: window,
                deltaX: deltaX,
                deltaY: deltaY,
                detail: detail,
                screenX: sx,
                screenY: sy,
                clientX: cx,
                clientY: cy,
                pageX: cx,
                pageY: cy,
                ctrlKey: false,
                altKey: false,
                shiftKey: false,
                metaKey: false,
                button: button,
                buttons: buttons,
                which: which,
                relatedTarget: undefined
            };

        var evt = new WheelEvent(type, e);

        return evt;
    }

    function dispatchEvent(el, evt) {
        if (el.dispatchEvent) {
            el.dispatchEvent(evt);
        }
        return evt;
    }

    function simulateMouseDown(el, x, y, buttons) {
        var bBox = el.getBoundingClientRect();

        var clickX = bBox.left + x;
        var clickY = bBox.top + y;

        buttons = (buttons != null) ? buttons : leftButton;
        var evt = mouseEvent("mousedown", clickX, clickY, clickX, clickY, buttons);
        dispatchEvent(el, evt);
    }

    function simulateMouseMove(el, x, y, buttons) {
        var bBox = el.getBoundingClientRect();

        var clickX = bBox.left + x;
        var clickY = bBox.top + y;

        buttons = (buttons != null) ? buttons : leftButton;
        var evt = mouseEvent("mousemove", clickX, clickY, clickX, clickY, buttons);
        dispatchEvent(el, evt);
    }

    function simulateMouseUp(el, x, y, buttons) {
        var bBox = el.getBoundingClientRect();

        var clickX = bBox.left + x;
        var clickY = bBox.top + y;

        var evt = mouseEvent("mouseup", clickX, clickY, clickX, clickY, buttons);
        dispatchEvent(el, evt);
    }

    function simulateMouseWheel(el, x, y, deltaX, deltaY) {
        var bBox = el.getBoundingClientRect();

        var clickX = bBox.left + x;
        var clickY = bBox.top + y;

        // Different browsers or OSes are passing information about the scroll delta differently.
        // Passing a numeric value to 'detail' is one of them. On MacOS the deltaY counts.
        var detail = deltaY;

        var evt = wheelEvent("DOMMouseScroll", clickX, clickY, clickX, clickY, 0, detail, undefined, deltaX, deltaY);
        dispatchEvent(el, evt);
    }

    function simulateDblclick(el, x, y, buttons) {
        var bBox = el.getBoundingClientRect();
        var clickX = bBox.left + x;
        var clickY = bBox.top + y;

        var evt = mouseEvent("dblclick", clickX, clickY, clickX, clickY, buttons);
        dispatchEvent(el, evt);
    }

    function simulateClick(el, x, y, buttons, key) {
        var bBox = el.getBoundingClientRect();
        var clickX = bBox.left + x;
        var clickY = bBox.top + y;

        var evt = mouseEvent("click", clickX, clickY, clickX, clickY, buttons, undefined, key);
        dispatchEvent(el, evt);
    }

    function simulateTouchStart(el, x, y) {
        sendTouchEvent(x, y, el, "touchstart");
    }

    function simulateTouchMove(el, x, y) {
        sendTouchEvent(x, y, el, "touchmove");
    }

    function simulateTouchEnd(el, x, y) {
        sendTouchEvent(x, y, el, "touchend");
    }

    function simulateTouchDrag(el, x,  y, deltaX, deltaY) {
        simulateTouchStart(el, x, y);
        simulateTouchMove(el, x + deltaX, y + deltaY);
        simulateTouchEnd(el, x + deltaX, y + deltaY);
    }

    function sendTouchEvent(x, y, element, eventType) {
        var touchObj = {
            identifier: Date.now(),
            target: element,
            pageX: x,
            pageY: y,
            radiusX: 2.5,
            radiusY: 2.5,
            rotationAngle: 10,
            force: 0.5,
        };

        var event;
        if (typeof UIEvent === "function") {
            event = new UIEvent(eventType)

        } else {
            event = document.createEvent('UIEvent');
            event.initUIEvent(eventType, true, true);
        }

        event.touches = [touchObj];
        event.targetTouches = [];
        event.changedTouches = [touchObj];
        event.shiftKey = true;

        element.dispatchEvent(event);

    }

    function sendTouchEvents(coords, element, eventType) {
        var touchObjects = [];

        for(var i = 0; i < coords.length; i++) {
            touchObjects[i] = {
                identifier: Date.now(),
                target: element,
                pageX: coords[i].x,
                pageY: coords[i].y,
                radiusX: 2.5,
                radiusY: 2.5,
                rotationAngle: 10,
                force: 0.5,
            };
        }

        var event;
        if (typeof UIEvent === "function") {
            event = new UIEvent(eventType)

        } else {
            event = document.createEvent('UIEvent');
            event.initUIEvent(eventType, true, true);
        }

        event.touches = touchObjects;
        event.targetTouches = [];
        event.changedTouches = touchObjects;
        event.shiftKey = true;

        element.dispatchEvent(event);
    }

    simulate.mouseDown = simulateMouseDown;
    simulate.mouseMove = simulateMouseMove;
    simulate.mouseUp = simulateMouseUp;
    simulate.mouseWheel = simulateMouseWheel;
    simulate.dblclick = simulateDblclick;
    simulate.touchstart = simulateTouchStart;
    simulate.touchmove = simulateTouchMove;
    simulate.touchend = simulateTouchEnd;
    simulate.touchdrag = simulateTouchDrag;
    simulate.sendTouchEvents = sendTouchEvents;
    simulate.click = simulateClick;
})();
