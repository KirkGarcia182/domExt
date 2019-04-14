# domExt - Extending DOM functions
domExt extends the DOM prototype and has jQuery like syntax (This is greatly inspired by jQuery but without the wrapper)

# Project Content
## Extending Document prototype with a sugarCoat syntax for looking up HTML Elements
- getElementById( ) to byId( )
- getElementsByClassName( ) to byClass( )
- querySelector( ) to qs
- querySelectorAll( ) to qsa( )
You can name the `document` object anyway you want but I preper using `$` for easy typing.
First you need to initialize $ to reference the `document` object by `const $ = document;`
Then instead of using `document.getElementById('ElementIdHere')` you can use `$.byId('ElementIdHere')`
## Extending the Prototype of HTMLElement, Node, EventTarget
