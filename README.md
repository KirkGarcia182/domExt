# domExt - Extending DOM functions
domExt extends the DOM prototype and has similarity with jQuery but without the wrapper

### Another jQuery wannabe?

No not really, jquery is just too big and has a lot of candies to offer. The aim for this library is to help you in making rich [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components). Most of the content of this library is just **Sugarcoat** for the real thing just to make your coding life easier. While some functions where inspired by jQuery (I used jQuery since it's function name is great and it makes sense)

# Project Contents

This projects contains multiple contents to help you manipulate the DOM in making your rich Web Components

- Extending `document` with a Sugarcoat syntax for `createElement` and `createDocumentFragment` - the reason for this is simple, I really hate typing those very long function names which I hope you do too.
- Extending HTMLElement with basic DOM manipulation functions similar to jQuery like `addClass, attr, on, trigger, hasClass` and etc.
- Extending EventTarget with a Sugarcoat syntax for `addEventListener` and `dispatchEvent` - hurray `on( )` and `trigger( )`
- Extending Node with a Sugarcoat for looking up elements in the DOM Tree - the reason for this is that shadowDOM is not under the HTMLElement Tree but is in the DocumentFragment Tree
- Extending Array with basic DOM manipulation functions similar to jQuery

### Extending the Prototype of HTMLElement

