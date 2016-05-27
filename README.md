# jQuery State

PubSub jQuery State Management

## Overview

We've all written jQuery code that inevitably winds up storing a lot of state on it's affected elements.

Does any of this look familiar?

```javascript
$(element).data('active', true);
```

```javascript
$(element).data('elementState', {
    active: true,
    position: 10
});
```

```javascript
if ($(element).data('elementState')) {
    $.merge($(element).data('elementState'), { // idk whatever
        active: false
    });
}
```

This is fine for simple things, but you'll find yourself awake at night, sweating and shaking over the:

1. possibility of data namespace collisions,
2. total number of lines of code you're just jamming at the "state problem" in your system,
3. realization that to use an element's state in another module would require a lot more crappy code than you are comfortable with

I'm throwing up just thinking about it.

## Enter Something Completely Different

With __jQuery State__ you can just throw spaghetti at the wall. Don't worry. It will stick.

```javascript
$(button).state({ active: true }, 'menuButton');
```

This little line of code will do a lot of the heavy lifting for you, providing a stored data structure like so:

```javascript
{
    menuButton: [
        {
            active: true
        }
    ]
}
```

which is accessible via:

```javascript
$(button).state();
```

But why stop there? Jam some more state on the bastard!

```javascript
$(button).state({
    position: 10,
    literallyOnFire: true,
    active: 'not a chance'
}, 'menuButton')
```

Now when you call:

```javascript
$(button).state();
```

You'll get this:

```javascript
{
    menuButton: [
        {
            active: true
        },
        {
            position: 10,
            literallyOnFire: true,
            active: 'not a chance'
        }
    ]
}
```

That means that the object's current state is always in the last position of the returned array.

## What about other, curious modules?

Say you've set some state on your page footer:

```javascript
$('#page-footer').state({
    stuck: false,
    humongous: true
}, 'footerGettinBigger');
```

And your page header wants to disappear when the page footer becomes humongous. Well, in your page header module you can use:

```javascript
$('#page-footer').on('state:footerGettinBigger', function (event, state, current) {
    if (current.humongous) {
        $('#page-header').slideUp();
    } else {
        $('#page-header').slideDown();
    }
});
```

In addition to the `event` object being returned to the event handler, we also have `state`, which is the representation of _all_ of the state of the element, plus `current`, which is the most recent state change.

## Disclaimer

I just kind of farted this out. It would be great to get some contribution to this thing. It's licensed MIT and, please, use at your own risk.
