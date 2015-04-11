(function() {
    var msPointer = window.navigator.msPointerEnabled;

    var touch = {
        start: msPointer ? 'MSPointerDown' : 'touchstart',
        move: msPointer ? 'MSPointerMove' : 'touchmove',
        end: msPointer ? 'MSPointerUp' : 'touchend'
    };

    var prefix = (function () {
        var styles = window.getComputedStyle(document.documentElement, '');
        var pre = (Array.prototype.slice
                .call(styles)
                .join('')
                .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
            )[1];

        return '-' + pre + '-';
    })();

    var cssProps = {
        'transition': prefix + 'transition',
        'transform': prefix + 'transform'
    };

    function delegate(event, cbName) {
        document.addEventListener(event, function(e) {
            Swiper._elems.forEach(function(swiper){
                if (e.target === swiper.elem) {
                    swiper[cbName](e);
                }

                return false;
            });

        });
    }

    function extend() {
        var current = [].shift.call(arguments);
        var options = arguments[0];

        for (i in options) {
            if (options.hasOwnProperty(i)) {
                current[i] = options[i];
            }
        }

        return current;
    }

    var Swiper = function(options) {
        var defaultOptions = {
            duration: 200,
            tolerance: 150,
            time: 200,
            width: 0,
            dir: 1,
            right: 0,
            left: 0
        };

        options = extend(defaultOptions, options || {});

        this.duration = options.duration;
        this.tolerance = options.tolerance;
        this.time = options.time;
        this.width = options.width;
        this.elem = options.elem;
        this.list = options.list;
        this.dir = options.dir;
        this.group = options.group;

        this.right = options.right;
        this.left = options.left;
    };

    Swiper._elems = [];
    Swiper.groupCounter = 0;

    Swiper.init = function(options) {
        Swiper.groupCounter++;

        var elems = document.querySelectorAll(options.query);
        var group = [];

        delete options.query;

        [].forEach.call(elems, function(elem){
            var option = extend({elem: elem, group: Swiper.groupCounter}, options);

            group.push(new Swiper(option));
        });

        Swiper._bindEvents();
        Swiper._elems = Swiper._elems.concat(group);

        if (group.length === 1) {
            return group[0];
        }

        return group;
    };

    Swiper._closeAll = function(groupNumber) {
        Swiper._elems.forEach(function(swiper) {
            if (swiper.group === groupNumber) {
                swiper.close();
            }
        });
    };

    /**
     * swipe.x - initial coordinate Х
     * swipe.y - initial coordinate Y
     * swipe.delta - distance
     * swipe.startSwipe - swipe is starting
     * swipe.startScroll - scroll is starting
     * swipe.startTime - necessary for the short swipe
     * swipe.touchId - ID of the first touch
     */

    Swiper.prototype.touchStart = function(e) {
        if (e.touches.length !== 1) {
            return;
        }

        this.resetValue(e);

        if (this.list) {
            Swiper._closeAll(this.group);
        } else {
            this.close();
        }
    };

    Swiper.prototype.touchMove = function(e) {
        var touch = e.changedTouches[0];

        // touch of the other finger
        if (!this.isValidTouch(e)) {
            return;
        }

        this.delta = touch.pageX - this.x;

        this.dir = this.delta < 0 ? -1 : 1;
        this.width = this.delta < 0 ? this.right : this.left;

        this.defineUserAction(touch);

        if (this.startSwipe) {
            this.move();

            //prevent scroll
            e.preventDefault();
        }
    };

    Swiper.prototype.touchEnd = function(e) {
        if (!this.isValidTouch(e, true) || !this.startSwipe) {
            return;
        }

        // if swipe is more then 150px or time is less then 150ms
        if (this.dir * this.delta > this.tolerance || new Date() - this.startTime < this.time) {
            this.open();
        } else {
            this.close();
        }

        e.stopPropagation();
        e.preventDefault();
    };

    /**
     * Animation of the opening
     */
    Swiper.prototype.open = function() {
        this.animation(this.dir * this.width);
        this.swiped = true;
    };

    /**
     * Animation of the closing
     */
    Swiper.prototype.close = function() {
        this.animation(0);
        this.swiped = false;
    };

    Swiper.prototype.toggle = function() {
        if (this.swiped) {
            this.close();
        } else {
            this.open();
        }
    };

    /**
     * reset to initial values
     * @param {object} e - event
     */
    Swiper.prototype.resetValue = function(e) {
        var touch = e.changedTouches[0];

        this.touchId = touch.identifier;
        this.startTime = new Date();
        this.startSwipe = false;
        this.startScroll = false;
        this.delta = 0;
        this.x = touch.pageX;
        this.y = touch.pageY;
    };

    Swiper._bindEvents = function() {
        if (Swiper.eventBinded) {
            return false;
        }

        delegate(touch.move, 'touchMove');
        delegate(touch.end, 'touchEnd');
        delegate(touch.start, 'touchStart');

        Swiper.eventBinded = true;
    };

    /**
     * detect of the user action: swipe or scroll
     */
    Swiper.prototype.defineUserAction = function(touch) {
        var DELTA_X = 10;
        var DELTA_Y = 10;

        if (Math.abs(this.y - touch.pageY) > DELTA_Y && !this.startSwipe) {
            this.startScroll = true;
        } else if (Math.abs(this.delta) > DELTA_X && !this.startScroll) {
            this.startSwipe = true;
        }
    };

    /**
     * Which of the touch was a first, if it's a multitouch
     * touchId saved on touchstart
     * @param {object} e - event
     * @returns {boolean}
     */
    Swiper.prototype.isValidTouch = function(e, isTouchEnd) {
        // take a targetTouches because need events on this node
        // targetTouches is empty in touchEnd, therefore take a changedTouches
        var touches = isTouchEnd ? 'changedTouches' : 'targetTouches';

        return e[touches][0].identifier === this.touchId;
    };

    Swiper.prototype.move = function() {
        console.log(this.dir, this.right, this.delta);
        if ((this.dir > 0 && (this.delta < 0 || this.left === 0)) || (this.dir < 0 && (this.delta > 0 || this.right === 0))) {
            return false;
        }

        var deltaAbs = Math.abs(this.delta);

        if (deltaAbs > this.width) {
            // linear deceleration
            this.delta = this.dir * (this.width + (deltaAbs - this.width) / 8);
        }

        this.animation(this.delta, 0);
    };

    Swiper.prototype.animation = function(x, duration) {
        duration = duration === undefined ? this.duration : duration;

        this.elem.style.cssText = cssProps['transition'] + ':' + cssProps['transform'] + ' ' + duration + 'ms; ' +
        cssProps['transform']  + ':' + 'translate3d(' + x + 'px, 0px, 0px)';
    };

    // expose Swiper
    window.Swiper = Swiper;
})();
