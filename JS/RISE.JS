/**
 * Checkes if is this tab in DOM;
 *
 * @param {Element} parent - link to DOMElement where interface will be created;
 * @return {Interface}
 */
function Interface(parent)
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

    /**
     * Checkes orientation of DOM;
     *
     * @return {Bool} - 1 if orientation is portret, 0 if orientation is album;
     */
    function isPortrait()
    {
        return parent.clientWidth/parent.clientHeight < 1.5;
    };

    function resize()
    {
        if (isPortrait())
        {
            DOM.container.removeCSS(CSS.container.album);
            DOM.container.setCSS(CSS.container.portrait);
        }
    }

    var current = undefined,
        stack = [],
        DOM =
        {
            "parent": parent,
            "container": undefined,
            "tabs": {},
        },
        CSS =
        {
            "hidden": "RISE__HIDDEN",
            "container":
            {
                "normal": "RISE__CONTAINER",
                "portrait": "RISE__CONTAINER--PORTRAIT",
                "album": "RISE__CONTAINER--PORTRAIT"
            },
            "tab": "RISE__CONTAINER__TAB"
        };

    /**
     * Creates a new tab and appends it to DOM;
     *
     * @param name - id of new tab;
     * @return {Element} link to created tab;
     */
    this.createTab = function(name)
    {
        DOM.tabs[name] = DOM.container.newChildElement("div", {classList: [CSS.tab, CSS.hidden]});
        return DOM.tabs[name];
    };

    /**
     * Returns a current tab
     *
     * @return {Elewment} - current tab
     */
    this.getCurrentTab = function()
    {
        return current ? DOM.tabs[current] : null;
    };

    /**
     * Shows tab on DOM
     *
     * @param name - id of tab to show;
     */
    this.showTab = function(name)
    {
        if (DOM.tabs[name])
        {
            var previous = stack[stack.length - 2];

            if (previous != undefined)
            {
                DOM.tabs[previous].setCSS(CSS.hidden);
            }

            stack.push(name);
            DOM.tabs[name].removeCSS(CSS.hidden);
            DOM.container.style.left = - DOM.tabs[name].offsetLeft + "PX";
            console.log(stack);
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
        if (DOM.tabs[name])
        {
            var current = stack.pop(),
                previous = stack[stack.length - 1];

            DOM.tabs[current].setCSS(CSS.hidden);
            if (previous != undefined)
            {
                DOM.tabs[previous].removeCSS(CSS.hidden);
                DOM.container.style.left = DOM.tabs[previous].offsetLeft + "PX";
            }
            else
            {
                DOM.container.style.left = "0PX";
            }
        }
        else
        {
            console.warn("ERROR: no tab called " + name);
        }
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
            this.hideTab(name);
            DOM.container.removeChildren(DOM.tabs[name]);
            delete DOM.tabs[name];
        }
        else
        {
            console.warn("ERROR: no tab called " + name);
        }
    };

    /**
     * Creating a base block
    */
    DOM.container = parent.newChildElement("div", {classList: [CSS.container.normal]});
};