/**
 * Checkes if is this tab in DOM;
 *
 * @param {Element} parent            - link to DOMElement where interface will be created;
 * @param {Object} params             - properties of the Interface class
 * @param {Number} params.duration    - time of animation
 * @param {Number} params.orientation - direction of animation ('VERTICAL' or 'HORISONTAL')
 * @return {Interface}
 */
function Interface(parent, params)
{
    /**
     * Checkes if is this tab in DOM;
     *
     * @param {String} name - id of tab to check;
     * @return {Bool}       - 1 if tab is open, 0 if tab is not open;
     */
    function isOpened(name)
    {
        var answer = 0;
        tabs.forEach
        (
            (tab) =>
            {
                tab.id ? answer = 1 : null;
            }
        );

        return answer;
    };

    var timer = undefined,
        current = undefined,
        stack = [],
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
     *
     * @param name - id of new tab;
     * @return {Element} link to created tab;
     */
    this.createTab = function(name)
    {

        order.push(name);
        DOM.tabs[name] = DOM.container.newChildElement("div", {classList: [CSS.tab, CSS.hidden]});

        return DOM.tabs[name];
    };

    /**
     * Returns a current tab
     *
     * @return {Element} - current tab
     */
    this.getCurrentTab = function()
    {
        return current ? DOM.tabs[current] : null;
    };

    /**
     * Returns a tab name
     *
     * @param {Element}  - DOM-Element in tab
     * @return {Element} - name of the found tab
     */
    this.getTabName = function(element)
    {
        while (element.parentNode && element.parentNode != DOM.container)
        {
            element = element.parentNode;
        }

        for (let name in DOM.tabs)
        {
            if (DOM.tabs[name] == element)
            {
                return name;
            }
        }

        return undefined;
    }

    /**
     * Shows tab on DOM
     *
     * @param name - id of tab to show;
     */
    this.showTab = function(name)
    {
        if (DOM.tabs[name])
        {

            stack.push(name);
            DOM.tabs[name].removeCSS(CSS.hidden);
            DOM.container.removeCSS(CSS.noAnimation);
            DOM.container.style.left = - DOM.tabs[name].offsetLeft + "PX";
            DOM.container.style.top = - DOM.tabs[name].offsetTop + "PX";

            if (DOM.tabs[stack[stack.length - 2]])
            {
                setTimeout((function()
                            {
                                DOM.tabs[stack[stack.length - 2]].setCSS(CSS.hidden);
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
     *
     * @param name - id of tab to hide;
     */
    this.hideTab = function(name)
    {
        this.showTab(name);
    }

    /**
     * Removes tab from DOM;
     *
     * @param name - id of tab to remove;
     */
    this.removeTab = function(name)
    {
        if (DOM.tabs[name])
        {

            if (DOM.tabs[name].classList.contains(CSS.hidden))
            {
                DOM.container.removeChildren(DOM.tabs[name]);
                delete DOM.tabs[name];
            }
            else
            {
                /*this.hideTab(name);
                setTimeout((function()
                            {
                                DOM.container.removeChildren(DOM.tabs[name]);
                                delete DOM.tabs[name];

                            }).bind(this), properties.duration * 1000);*/
            }

            let indexInStack = stack.indexOf(name);

            order.splice(order.indexOf(name), 1);
            while (indexInStack != -1)
            {
                stack.splice(indexInStack, 1);
                indexInStack = stack.indexOf(name);
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
