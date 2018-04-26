/**
 * Checkes if is this tab in DOM;
 * @param  {Element} parent            - link to DOMElement where interface will be created;
 * @param  {Object} params             - properties of the Interface class
 * @param  {Number} params.duration    - time of animation
 * @param  {Number} params.orientation - direction of animation ('VERTICAL' or 'HORISONTAL')
 * @return {Interface}
 */
function Rise(parent, params)
{

    var timer = undefined,
        current = undefined,
        order = [],
        properties =
        {
            "duration": (params != undefined && params.duration != undefined) ? params.duration : 1,
            "orientation": (params != undefined && (params.orientation == 'HORISONTAL' || params.orientation == 'VERTICAL')) ? params.orientation : 'HORISONTAL'
        },
        DOM =
        {
            "parent": parent,
            "container": undefined,
            "tabs": {},
        },
        CSS =
        {
            "hidden": "RISE--HIDDEN",
            "noAnimation": "RISE--NO-ANIMATION",
            "container":
            {
                "normal": "RISE__CONTAINER",
                "horisontal": "RISE__CONTAINER--HORISONTAL",
                "vertical": "RISE__CONTAINER--VERTICAL"
            },
            "tab": "RISE__TAB"
        };

    /**
     * Creates a new tab and appends it to DOM;
     * @param  {String} name - id of new tab;
     * @return {Element}     - link to created tab;
     */
    this.createTab = function(name)
    {

        order.push(name);
        DOM.tabs[name] = DOM.container.newChildElement("div", {classList: [CSS.tab, CSS.hidden]});

        return DOM.tabs[name];
    };

    /**
     * Returns a current tab
     * @return {Element} - current tab
     */
    this.getCurrentTab = function()
    {
        return current ? DOM.tabs[current] : null;
    };

    /**
     * Returns a tab name by the DOM element
     * @param  {Element} element - DOM element in tab
     * @return {String}          - name of the found tab
     */
    this.getTabName = function(element)
    {
        while (element.parentNode && element.parentNode != DOM.container)
        {
            element = element.parentNode;
        }

        for (var name in DOM.tabs)
        {
            if (DOM.tabs[name] == element)
            {
                return name;
            }
        }

        return undefined;
    }

    /**
     * Return a direction of swiping
     * @param {String} start - name of the tab where swipe starts
     * @param {String} end   - name of the tab where swipe ends
     * @return {Number}      - 1 if swipe is to right, 0 if start equals end, else -1
     */
    function getSwipeDirection(start, end)
    {
        if (DOM.tabs[start] && DOM.tabs[end])
        {
            if (order.indexOf(start) < order.indexOf(end))
            {
                return 1;
            }
            else if (start == end)
            {
                return 0;
            }
            else
            {
                return -1;
            }
        }
        else
        {
            console.warn("ERROR: no tab called " + start + " or " + end);
        }
    }

    /**
     * Swipes to pointed tab
     * @param {String} name - id of tab to show;
     */
    this.showTab = function(name)
    {
        if (name == current)
        {
            return;
        }

        if (DOM.tabs[name])
        {
            var previous = current,
                to = {x: undefined, y: undefined},
                from = {x: undefined, y: undefined},
                direction = getSwipeDirection(current, name);

            current = name;
            DOM.tabs[name].removeCSS(CSS.hidden);
            if (direction == 1)
            {
                to.x = - DOM.tabs[current].offsetLeft + "PX";
                to.y = - DOM.tabs[current].offsetTop + "PX";
                from.x = "0PX";
                from.y = "0PX";
            }
            else if (direction == -1)
            {
                from.x = - DOM.tabs[previous].offsetLeft + "PX";
                from.y = - DOM.tabs[previous].offsetTop + "PX";
                to.x = "0PX";
                to.y = "0PX";
            }

            DOM.container.style.left = from.x;
            DOM.container.style.top = from.y;
            var layoutTrigger = DOM.container.offsetHeight;
            DOM.container.removeCSS(CSS.noAnimation);
            DOM.container.style.left = to.x;
            DOM.container.style.top = to.y;

            if (DOM.tabs[current])
            {
                setTimeout((function()
                            {
                                if (DOM.tabs[previous])
                                {
                                    DOM.tabs[previous].setCSS(CSS.hidden);
                                }

                                DOM.container.setCSS(CSS.noAnimation);
                                DOM.container.style.left = "0PX";
                                DOM.container.style.top = "0PX";

                            }).bind(this), properties.duration * 1000);
            }
        }
        else
        {
            console.warn("ERROR: no tab called " + name);
        }
    };

    /**
     * Hides tab from DOM
     * @param name - id of tab to hide;
     */
    this.hideTab = function(name)
    {
        //ToDo
    }

    /**
     * Removes tab from DOM, notice that you must unhide with show method another tab before this
     * @param {String} name - id of tab to remove;
     */
    this.removeTab = function(name)
    {
        if (DOM.tabs[name])
        {

            if (DOM.tabs[name].classList.contains(CSS.hidden))
            {
                DOM.container.removeChildren(DOM.tabs[name]);
                order.splice(order.indexOf(name), 1);
                delete DOM.tabs[name];
            }
            else
            {
                console.warn("ERROR: you must open another tab before removing.");
            }

        }
        else
        {
            console.warn("ERROR: no tab called " + name);
        }
    };

    /**
     * Creating a base block
    */
    DOM.container = parent.newChildElement
    (
        "div",
        {
            classList:
            [
                CSS.container.normal,
                CSS.container[properties.orientation.toLowerCase()]
            ]
        }
    );
    DOM.container.style.transitionDuration = properties.duration + "s";
    parent.style.overflow = "hidden";
};
