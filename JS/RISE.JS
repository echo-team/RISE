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
        previous = undefined,
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
     * Shows tab on userscreen
     *
     * @param name - id of new tab;
     */
    this.showTab = function(name)
    {
        if (DOM.tabs[name])
        {
            if (previous != undefined)
            {
                DOM.tabs[previous].setCSS(CSS.hidden);
            }

            previous = current;
            current = name;
            DOM.tabs[name].removeCSS(CSS.hidden);
            DOM.container.style.left = - DOM.tabs[name].offsetLeft + "PX";
        }
        else
        {
            console.warn("ERROR: no tab called " + name);
        }
    };

    /*this.closeTab = function(name)
    {
        if (DOM.tabs[name])
        {
            if (previous)
            {
                DOM.tabs[previous].removeCSS(CSS.hidden);
                DOM.container.style.left = DOM.tabs[previous].clientLeft + "PX";
            }
            else
            {
                DOM.container.style.left = "0PX";
            }
            DOM.container.removeChildren(DOM.tabs[name]);
            current = previous;
            previous = undefined;
        }
        else
        {
            console.warn("ERROR: no tab called " + name);
        }
    }*/

    /**
     * Creating a base block
    */
    DOM.container = parent.newChildElement("div", {classList: [CSS.container.normal]});
};
