/*! 
   Author: Kirk Garcia
   License: MIT
   GitHub: https://github.com/KirkGarcia182/s-alert,
*/
let template = $.ct`
<style>
    *{ box-sizing: border-box; }

    .bar{
        display: flex;
        width: 5px;
    }

    .wrapper{
        display: flex;
        flex-direction: column;
        background-color: rgba(0,0,0,0.5);
        color: var(--color);
        flex-grow: 1;
        max-width: 295px;
    }

    .header{
        display: flex;
        flex-direction: row;
        position: relative;
    }

    .name{
        flex-grow: 1;
        padding: 8px 16px 0px 16px;
        font-size: calc(var(--font-size) + 2px);
        font-weight: bold;
        margin-right: 40px;
    }

    .close{
        display: flex;
        position: absolute;
        width: 40px;
        height: 40px;
        justify-content: center;
        align-items: center;
        top: 0;
        right: 0;
        font-size: calc(var(--font-size) + 5px);
        cursor: pointer;
    }

    .close:hover{
        color: black;
    }

    hr{
        width: 95%;
        border-radius: 50%;
        border-color: var(--color);
    }

    .message{
        padding: 0px 16px 8px 16px;
        text-align: justify;
        font-size: calc(var(--font-size) - 1px);
    }

    .loading-bar{
        height: 7px;
        width: 100%;
        background-color: rgba(255,255,255,0.5);
        /*transition: all 10s linear;*/
    }

    .loading-bar .bar{
        width: 100%;
        height: inherit;
        background-color: var(--bar-bgColor);
    }

    :host {
        --bgColor: silver;
        --color: white;
        --bar-bgColor: white;

        display: flex;
        flex-direction: row;
        position: relative;
        background-color: var(--bgColor);
        color: var(--color);
        margin-top: 5px;
        opacity: 0;
        transition: all 0.5s;
        z-index: 500;
    }

    :host(.danger){ --bgColor: #ff1100; }
    :host(.warning){ --bgColor: #ffe600; }
    :host(.success){ --bgColor: #00ff08; }
    :host(.info){ --bgColor: #008cff; }
    :host(.remove){ opacity: 0; }
    :host(.add){ opacity: 1;}
</style>

<div class="wrapper">
    <div class="header">
        <div class="name"></div>
        <div class="close">&times;</div>
    </div>
    <hr>
    <div class="message"></div>
    <div class="loading-bar">
        <div class="bar"></div>
    </div>
</div>
<div class="bar"></div>

`;

class SimpleAlert extends HTMLElement {

    constructor() {
        // Always super() or else it won't work
        super();

        let _this = this;

        // Set up the root (shadowRoot)
        _this.root = _this.shadow({ 'mode': 'open' });
        _this.root.append(template.content.clone(true));

        // set
        _this.name = _this.root.qs('.name');
        _this.message = _this.root.qs('.message');
        _this.close = _this.root.qs('.close');
        _this.loadingBar = _this.root.qs('.loading-bar .bar');
        _this.hovering = false;
        _this.animationID;

        // Add click event on close button
        _this.close.on('click', e => {
            _this.changeClass('add','remove');
            setTimeout(() => {
                _this.remove();
            },500);
            cancelAnimationFrame(_this.animationID);
        });

        // Add mouseenter and mouseleave events to denote hovering
        _this.on('mouseenter', e => _this.hovering = true);
        _this.on('mouseleave', e => _this.hovering = false);
    }

    connectedCallback() {
        let _this = this,
        _class = _this._props.type,
        type = `${_class.charAt(0).toUpperCase()}${_class.substring(1, _class.length)}`,
        message = _this._props.message,
        
        time = parseInt(_this._props.time),
        
        then = Date.now(),
        elapsedTime,
        now,
        widthDeduction;
        
        _this.name.html(type);
        _this.message.html(message);
        _this.addClass(`${_class} add`);

        /*
            Add a setTimeout to make the animation from the css work
            also for some odd reason getting the offsetWidth of loadingBar
            doesn't work as expected if placed outside of the setTimeout
        */
        setTimeout(() => {
            _this.addClass(`${_class} add`);

            let originalWidth = _this.loadingBar.offsetWidth,
            width = originalWidth;

            function update() {

                now = Date.now();
                elapsedTime = now - then;
                /*
                    Calculate widthDeduction, formula explanation:

                    (elapsedTime / time) is to get what percentage
                    of the time (which the user has given) is the 
                    elapsedTime, which means if time = 10,000ms and
                    elapsedTime = 18ms, then 18/10000 = 0.0018, multiply
                    0.0018 to the originalWidth of the bar to get how
                    much width we should deduct from the bar. The formula
                    was made this way because each device has it's own frame rate
                    and each update is not always consistent
                */
                widthDeduction = originalWidth * (elapsedTime / time);

                /*
                    When width falls below or equal to zero trigger a click
                    to the close button
                */
                if(width <= 0) {
                    _this.loadingBar.css('width', '0px');
                    _this.close.trigger('click');
                } else {
                    /*
                        If the user is not hovering over the alertbox
                        it will pause the loading bar from moving
                    */
                    if(!_this.hovering) {
                        width-=widthDeduction;
                        _this.loadingBar.css('width', `${width}px`);
                    }

                    /*
                        Continously update then because the pause will make the
                        then and now far apart which will affect how we calculate
                        the widthDeduction, not updating the then will cause the 
                        width to suddenly jump because of the time gap
                    */
                    then = now;
                    _this.animationID = requestAnimationFrame(update);
                }
            }

            _this.animationID = requestAnimationFrame(update);

        }, 1);

    }

    props(obj) {
        let _this = this;
        _this._props = obj;
        return _this;
    }
}

dce('s-alert', SimpleAlert);
