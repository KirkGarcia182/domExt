# domExt - Extending DOM functions
domExt extends the DOM prototype and has similarity with jQuery but without the wrapper. The aim for this library is to help you in making rich [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components). Some of the content of this library is just **Sugarcoat** for the real thing just to make your coding life easier. While some functions where inspired by jQuery (I used jQuery since it's function naming is great and it makes sense).

### Browser compatibility?

This library was made with ES6 rich features, and almost all browsers have supported ES6 already so I'm pretty sure it will work in most browsers, except for the ever elusive Internet Explorer

### Other developers say that extending DOM or Native Objects is a bad idea

Yes, I do agree but it's not bad in all use-cases. This library only contains few functions that will help makine Web Components a lot easier.

# Project Contents

This projects contains 3 major contents

- Extending `document` with a Sugarcoat syntax for `createElement` and `createDocumentFragment` - the reason for this is simple, I really hate typing those very long function names which I hope you do too.
- Extending EventTarget with a Sugarcoat syntax for `addEventListener` and `dispatchEvent` - the reason for this is that the `window` object's prototype is EventTarget, without this you can't use ```window.on('click', e => console.log('Hellow World') );```
- Extending Node with very useful jQuery like functions like `addClass(), attr(), on(), trigger(), css()` and etc.

# API

## Document extensions


