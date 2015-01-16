backbone-dom-view
=================

Better View class for Backbone

Main idea of this view class is in configuration template object which looks like this
```javascript
var View = Backbone.DOMView.extend({
    template: {
        "jquery-selector": {
            "helper-name": {
                "first-option": "value",
                "second-option": {
                    "model-event #view-event": function () {
                        //..
                    }
                }
            }
        }
    }
});
```
For example view for Todo model
```javascript
var TodoView = Backbone.DOMView.extend({
    template: {
        ".title": {
            text: "@title"
        },
        ".state": {
            'class': {
                "done": "@is_done",

                "selected": {
                    "change:selected": function () {
                        return this.model.get('selected');
                    }
                }
            }
        }
    }
});
```
Which means:
* Change `.title` text to model's `title` field value and listen `change:title` for future changes
* Add to `.state` class `done` when model's `is_done` field will be equal truthy value
* Add to `.state` class `selected` when model will trigger `change:selected` event and callback will return truthy value

In `examples/todomvc` directory you can find rewritten version of [TodoMVC](https://github.com/tastejs/todomvc/tree/gh-pages/examples/backbone)

## Installation

Bower:
`bower install backbone-dom-view`

**RequireJS ready** module name is `backbone-dom-view`

## Methods

### find()

Same as view's `.$(selector)` but it can accept empty value and return `.$el` it self. This method used with `template:` option to select root element with empty string like `"": {class: {done: '@done'}}`

### bind()

Same as `.on()` method but with it you can bind callback to model and to view in same time

**Arguments:**
* `{String} event` - space separated events names
* `{Function} callback`

## Helpers

* [class](#class)
* [attr](#attr-and-prop)
* [prop](#attr-and-prop)
* [style](#style)
* [html](#html)
* [text](#text)
* [on](#on)
* [connect](#connect)
* [each](#each)

You can define your own helpers, just add them to `Backbone.DOMView.helpers` object.
Arguments passed to helpers are `selector` and `options`.

### class

This helper takes object where keys are space separated css classes and values are space separated model events.
First argument of event will be passed to jquery `toggleClass`.

[Example](test/class-prop-attr-style-html.coffee#L10-L40)

To change number of argument you can use `|arg(number)` after event name

[Example](test/class-prop-attr-style-html.coffee#L42-L72)

To bind class with model field you can use `@fieldName` notation

[Example](test/class-prop-attr-style-html.coffee#L74-L106)

To handle view events just add `#` before event name

[Example](test/class-prop-attr-style-html.coffee#L108-L138)

To do some calculation before passing event value, use object where keys are events and values are functions

[Example](test/class-prop-attr-style-html.coffee#L140-L172)

### attr and prop

Works just like `class` helper only they set values of events to attributes and properties.

### style

Set css style to element, works just like `class`.

### html

Works just like `class` helper only difference that it not takes names of classes.

### text

Works just like `html` helper only difference that it uses `text()` method of jQuery.

### on

Helper for jquery `.on()` method.
Takes object where keys are events and values are functions

[Example](test/on.coffee)

### connect

Simply binds field of model with property of element by some event (default is `change`).
To set event just add `|eventName` after property name.

[Example](test/connect.coffee)

### each

Helper for collections.
It has three options: view, addHandler and delHandler.

`view:` is view class for added model

[Example](test/each.coffee#L9-L34)

or you can set function which should return view class.

[Example](test/each.coffee#L36-L56)

`addHandler:` is a function which takes two arguments: jquery element and view object of added model.
In this function you should add element of model view to jquery element.
By default `each` will use `append` method.
Also you you can set this option as string name of predefined method:

* append
* prepend
* fadeIn
* slideDown

To add more methods just add them to `Backbone.DOMView.helpers.each.addHandlers` object

`delHandler:` is the same as `addHandler` only for removing elements. Default is `remove`.
Predefined methods:

* remove
* fadeOut
* slideUp

To add more methods just add them to `Backbone.DOMView.helpers.each.delHandlers` object

[Example](test/each.coffee#L58-L83)

`el:` selector for elements which will be detached to use as `el` for `view` class

[Example](test/each.coffee#L85-L108)

Each generated sub view will have field `parent` which points to view generated them.
If sub view already have field `parent` then it will not be overwritten.

[Example](test/each.coffee#L110-L128)

`field:` use name of model field to iterate over it

## Empty selector

You can use empty string to pointing to $el itself.
```javascript
var View = Backbone.DOMView.extend({
    template: {
        "": {
            class: {
                "tested": "@tested"
            }
        }
    }
});

var view = new View({
    model: new Backbone.Model({tested: true})
});

view.$el.hasClass('tested'); // true
```

## Extending views

Each new extended view class will extend `template:` option from parent view class

[Example](test/constructor.coffee#L9-L29)
