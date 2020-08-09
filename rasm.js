/**
 * Author: Rami Belgacem
 */

var modelController = function() {'use_strict';
    var createSVGElment = function(qualifiedName) {
        return document.createElementNS('http://www.w3.org/2000/svg', qualifiedName)
    };

    var Element = function(options) {
        this.element = null;
        this.style = options.style || '';
    };
    Element.prototype.buildElement = function() {
        this.element.setAttribute('style', this.style);
    };

    var Container = function(options) {
        Element.call(this, options);
        this.height = options.height || 700;
        this.width = options.width || 1200;
        this.element = createSVGElment('svg');
    };
    Container.prototype.buildElement = function() {
        Element.prototype.buildElement.call(this);
        this.element.setAttribute('width', this.width);
        this.element.setAttribute('height', this.height);
    };

    var Rectangle = function(options) {
        Element.call(this, options);
        this.height = options.height;
        this.width = options.width;
        this.x = options.x;
        this.y = options.y;
        this.text = options.text;
        this.element = createSVGElment('rect');
    };
    Rectangle.prototype.buildElement = function() {
        Element.prototype.buildElement.call(this);
        this.element.setAttribute('x', this.x);
        this.element.setAttribute('y', this.y);
        this.element.setAttribute('width', this.width);
        this.element.setAttribute('height', this.height);
    };

    var Ellipse = function(options) {
        Element.call(this, options);
        this.x = options.cx;
        this.y = options.cy;
        this.rx = options.rx;
        this.width = options.rx * 2;
        this.ry = options.ry;
        this.height = options.ry * 2;
        this.text = options.text;
        this.element = createSVGElment('ellipse');
    };
    Ellipse.prototype.buildElement = function() {
        Element.prototype.buildElement.call(this);
        this.element.setAttribute('cx', this.x);
        this.element.setAttribute('cy', this.y);
        this.element.setAttribute('rx', this.rx);
        this.element.setAttribute('ry', this.ry);
    };

    var Link = function(options) {
        Element.call(this, options);
        this.from = options.from;
        this.to = options.to;
        this.defsElement = createSVGElment('defs');
        this.element = createSVGElment('line');
        this.camputePath = function() {
            if (this.from instanceof Ellipse) {
                this.fromX = this.from.x + this.from.rx;
                this.fromY = this.from.y;
            } else {
                this.fromX = this.from.x + this.from.width;
                this.fromY = this.from.y + (this.from.height / 2);
            }

            if (this.to instanceof Ellipse) {
                this.toX = this.to.x - this.to.rx;
                this.toY = this.to.y;
            } else {
                this.toX = this.to.x;
                this.toY = this.to.y + (this.to.height / 2);
            }
        };
    };
    Link.prototype.buildElement = function() {
        var pathEelement = createSVGElment('path');
        pathEelement.setAttribute('d', 'M0,0 L0,6 L7,3 z');
        pathEelement.setAttribute('fill', '#000');

        var markerEelement = createSVGElment('marker');
        markerEelement.setAttribute('id', 'arrow');
        markerEelement.setAttribute('markerWidth', '10');
        markerEelement.setAttribute('markerHeight', '10');
        markerEelement.setAttribute('refX', '0');
        markerEelement.setAttribute('refY', '3');
        markerEelement.setAttribute('orient', 'auto');
        markerEelement.setAttribute('markerUnits', 'strokeWidth');

        markerEelement.appendChild(pathEelement);
        this.defsElement.appendChild(markerEelement);

        this.camputePath();
        this.element.setAttribute('x1', this.fromX);
        this.element.setAttribute('y1', this.fromY);
        this.element.setAttribute('x2', this.toX - 10);
        this.element.setAttribute('y2', this.toY);
        this.element.setAttribute('stroke', '#000');
        this.element.setAttribute('stroke-width', '2');
        this.element.setAttribute('marker-end', 'url(#arrow)');
    };

    var Text = function(options) {
        Element.call(this, options);
        this.x = options.x;
        this.y = options.y;
        this.value = options.value;
        this.element = createSVGElment('text');
    };
    Text.prototype.buildElement = function() {
        Element.prototype.buildElement.call(this);
        this.element.setAttribute('x', this.x);
        this.element.setAttribute('y', this.y);
        this.element.textContent = this.value;
    };

    // Element factory
    function ElementFactory() {};
    ElementFactory.prototype.createElement = function(o) {
        switch(o.type) {
            case 'container':
                this.elementClass = Container;
                break;
            case 'rect':
                this.elementClass = Rectangle;
                break;
            case 'ellipse':
                this.elementClass = Ellipse;
                break;
            case 'link':
                this.elementClass = Link;
                break;
            case 'text':
                this.elementClass = Text;
                break;
            default:
                throw 'Warning: the type ' + o.type + ' is invalid';
        }
        return new this.elementClass(o);
    };
    var elementFactory = new ElementFactory();

    // storing register
    var register = {
        eltSVG: null,
        elts: []
    };

    return {
        registerElement: function(options) {
            var el = elementFactory.createElement(options);
            if (options.type === 'container') {
                register.eltSVG = el;
            } else {
                register.elts.push(el);
            }
            return el;
        },

        getRegister: function() {
            return register;
        },
    };
}();

var viewController = function() {'use_strict';
    return {
        displayElement: function(el) {
            var selector = el.element.tagName === 'svg' ? 'body' : 'svg';
            el.buildElement();
            if (el.defsElement) { // for line element
                document.querySelector(selector).appendChild(el.defsElement);    
            }
            document.querySelector(selector).appendChild(el.element);
        },
    };
}();

(function(global, model, view) {'use_strict';
    function processText(el, o) {
        if (['above', 'inside', 'below'].indexOf(o.text.position) < 0) {
            throw "Text position must be: above, inside or below and not " + o.text.position;
        }
        var x, y;

        if (el.element.tagName === 'rect') {
            x = el.x + (el.width * 0.1) // 20% of the width
            if (o.text.position === 'above') {
                y = el.y - 5;
            } else if (o.text.position === 'inside') {
                y = el.y + (el.height / 2);
            } else if (o.text.position === 'below') {
                y = el.y + el.height + 20;
            }
        } else { // ellipse 
            x = el.x - (el.rx * 0.2)
            if (o.text.position === 'above') {
                y = el.y - el.ry - 5;
            } else if (o.text.position === 'inside') {
                y = el.y;
            } else if (o.text.position === 'below') {
                y = el.y + el.ry + 20;
            }
        }
 
        return {
            x: x,
            y: y,
        }
    };

    global.$R = global.Rasm = {
        draw: function(options) {
            if (options.type !== 'container' && !model.getRegister().eltSVG) {
                throw 'You must create an svg element first';
            }
            var el = model.registerElement(options);
            view.displayElement(el);

            // process text option
            if (options.text) {
                var textCoord = processText(el, options);
                var text = model.registerElement({
                    "type": "text",
                    "x": textCoord.x,
                    "y": textCoord.y,
                    "value": options.text.value,
                });
                view.displayElement(text);
            }
            return el;
        },
    };
})(window, modelController, viewController);