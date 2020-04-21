$R.draw({
    "type": "container",
    "height": 700,
    "width": 1100,
});

/** Left side */
var rect1 = $R.draw({
    "type": "rect",
    "x": 20,
    "y": 20,
    "width": 345,
    "height": 648,
    "style": "stroke-dasharray: 5.5; stroke: #006600; fill: #fff"
});
var rect2 = $R.draw({
    "type": "rect",
    "x": 50,
    "y": 100,
    "width": 250,
    "height": 100,
    "text": {
        "position": "inside",
        "value": "I'm a text inside a rectangle"
    },
    "style": "stroke: #006600; fill: #fff"
});
var rect3 = $R.draw({
    "type": "rect",
    "x": 50,
    "y": 300,
    "width": 250,
    "height": 100,
    "text": {
        "position": "above",
        "value": "I'm a text above a rectangle"
    },
    "style": "stroke: #006600; fill: #fff"
});
var rect4 = $R.draw({
    "type": "rect",
    "x": 50,
    "y": 500,
    "width": 250,
    "height": 100,
    "text": {
        "position": "below",
        "value": "I'm a text below a rectangle"
    },
    "style": "stroke: #006600; fill: #fff"
});

/** Right side */
var rect5 = $R.draw({
    "type": "rect",
    "x": 700,
    "y": 20,
    "width": 345,
    "height": 648,
    "style": "stroke-dasharray: 20; stroke: #006600; fill: #fff"
});
var ellipse1 = $R.draw({
    "type": "ellipse",
    "cx": 870,
    "cy": 200,
    "rx": 150,
    "ry": 70,
    "text": {
        "position": "above",
        "value": "I'm a text above an ellipse"
    },
    "style": "stroke: #129cc9; fill: #b5e5f5"
});

var ellipse2 = $R.draw({
    "type": "ellipse",
    "cx": 860,
    "cy": 500,
    "rx": 100,
    "ry": 70,
    "text": {
        "position": "inside",
        "value": "I'm a text inside an ellipse"
    },
    "style": "stroke: #129cc9; fill: #b5e5f5"
});

/** Links */
$R.draw({
    "type": "link",
    "from": rect2,
    "to": ellipse2,
});
$R.draw({
    "type": "link",
    "from": rect3,
    "to": ellipse1,
});
$R.draw({
    "type": "link",
    "from": rect4,
    "to": ellipse1,
});