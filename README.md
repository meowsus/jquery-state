# jQuery State

PubSub jQuery State Management

## Overview

jQuery does not ship with State Management out of the box. We are required to use `$.data()` to manage state within our modules.

When a module becomes too complex to rely on `$.data()` we only have one option, to adopt a JavaScript MVC. For some projects this makes sense. For others this is like shooting a fly with a shotgun.

This plugin attempts to be the middle ground, allowing you to handle state without having to drastically re-architect your application

## Features

### Setting State

You set state on collections. Your collections can obviously reference 1+ elements.

Consider the HTML:
```html
<button type="button" class="btn">Button 1</button>
<button type="button" class="btn">Button 2</button>
<button type="button" class="btn">Button 3</button>
```

and the JavaScript:
```javascript
$('.btn')
.state({ active: false  }, 'buttonActivation')
.on('click', function (event) {
    event.preventDefault();
    $(event.currentTarget).state({ active: true }, 'buttonActivation');
});
```

We can see that each `.btn` starts out in the `{ active: false }` state, which is subscribed to the `buttonActivation` namespace.

On click of any button, we will apply the state of `{ active: true }`.

This operation is naturally paranoid, meaning that the state is _accrued_ rather than _replaced_.

Each of these objects are also stored in a global [state history](#recalling-a-pages-state-history) array.

### State Change Announcement

When the state of an element changes, it announces the change as an event triggered on the element. By listening for these changes we can allow other modules to respond to state change:

```javascript
$('.btn').on('state:buttonActivation', function (event, fullState, currentState) {
    if (currentState.active) {
        $(event.currentTarget).addClass('btn--active');
    }
});
```

Passed to the event handler are the following arguments:

1. the jQuery Event object,
2. the full, accumulated state object for the element,
3. an object representing the state change that just occurred


### Recalling an element's state

To return the state of an element:

```javascript
$('.btn:last').state();
```

If you pass a collection of 1+ elements to the `state` method, it will return the first element's state.

```javascript
$('.btn').state();
```

### Recalling a page's state history

To retrieve all of the state applied to all of the elements on a page, use:

```javascript
$.state()
```

### Destroying a page's state history

Though you probably wouldn't want to, unless you knew exactly what you were doing, you are able to destroy the page's global history by calling:

```javascript
$.state('destroy');
```

_Note:_ this destroys the global array, not state that has already been set on individual elements. This was mostly added for testing purposes.

### Querying stateful elements by namespace

You can use:

```javascript
$.state('elementsIn', 'buttonActivation');
```

to return a collection of all elements that have state subscribed to the given namespace.

## Disclaimer

This software carries with it an MIT license. Please use at your own risk.

## Contributions

If you find this library useful, please submit pull-requests to make it better!

## Roadmap

* v0.3.0
    - `$.state('destroy')` to truly deconstruct plugin
    - clean `$.state()` output to be more useful
