function isFunction(element)
{
    return element instanceof Function;
}

function isArray(element)
{
    return element instanceof Array;
}

function isObject(element)
{
    return element instanceof Object;
}

function isElement(element)
{
    return element instanceof Element;
}

function isText(element)
{
    return element instanceof Text;
}

function isString(element)
{
    return typeof element == "string";
}

/*
 * Sets event listeners to DOM-Element
 *
 * @param {Object} eventListeners - a mass of event listeners
 */
Element.prototype.setEventListeners = function(eventListeners)
{
    if (!eventListeners || !isObject(eventListeners))
    {
        console.warn("ERROR: argument passed to setEventListeners method is not an Object. Skipping.");
        return;
    }

	for (var event in eventListeners)
	{
        if (!isArray(eventListeners[event]))
        {
            eventListeners[event] = [eventListeners[event]];
        }

		eventListeners[event].forEach
		(
			(function(eventListener)
			{
                if (!isFunction(eventListener))
                {
                    console.warn("ERROR: cannot set something except Function as an event listener to event, called \"" + event + "\". Skipping.");
                    return;
                }
				this.addEventListener(event, eventListener);
			}).bind(this)
		);
	}
};

Element.prototype.removeCSS = function()
{
    Array.from(arguments).forEach
	(
		(function(CSSclass)
		{
            if (isString(CSSclass))
			{
                this.classList.remove(CSSclass);
            }
            else if (isArray(CSSclass))
            {
                this.setCSS.apply(this, CSSclass);
            }
            else
            {
                console.warn("ERROR: cannot remove something except String as an CSS-class. Skipping.");
            }
		}).bind(this)
	);
}

Element.prototype.setCSS = function()
{
	Array.from(arguments).forEach
	(
		(function(CSSclass)
		{
            if (isString(CSSclass))
			{
                this.classList.add(CSSclass);
            }
            else if (isArray(CSSclass))
            {
                this.setCSS.apply(this, CSSclass);
            }
            else
            {
                console.warn("ERROR: cannot set something except String as an CSS-class. Skipping.");
            }
		}).bind(this)
	);
};

Element.prototype.setAttributes = function(attributes)
{
    if (!isObject(attributes))
    {
        console.warn("ERROR: argument passed to setAttributes method is not an Object. Skipping.");
        return;
    }

	for (var attribute in attributes)
	{
		attributes[attribute] ? this.setAttribute(attribute, attributes[attribute]) : this.removeAttribute(attribute);
	}
};

Element.prototype.removeAttributes = function()
{
    Array.from(arguments).forEach
    (
        (function(attribute)
        {
            if (isString(attribute))
            {
                this.removeAttribute(attribute);
            }
            else if (isArray(attribute))
            {
                this.removeAttributes.apply(this, attribute);
            }
            else
            {
                console.warn("ERROR: cannot remove attribute because given id is not a String. Skipping.");
            }
        }).bind(this)
    );
};

/*
 * Sets properties (attributes, classes and event listeners) to DOM-Element
 *
 * @param {Object} properties - a mass of properties
 */
Element.prototype.setProperties = function(properties)
{
    if (isObject(properties.eventListeners))
    {
        this.setEventListeners(properties.eventListeners);
    }
    else if (properties.eventListeners)
    {
        console.warn("ERROR: argument passed to setEventListeners method is not an Object. Skipping");
    }

    if (isArray(properties.classList) || isString(properties.classList))
    {
        this.setCSS(properties.classList);
    }
    else if (properties.classList)
    {
        console.warn("ERROR: cannot set something except String or Array as an CSS-class. Skipping.");
    }

	delete properties.eventListeners;
	delete properties.classList;

	this.setAttributes(properties);
};

/*
 * Appends a mass of children to DOM-Element
 *
 * @param {Element|Text|Array} - children to append
 */
Element.prototype.appendChildren = function()
{
	Array.from(arguments).forEach
	(
		(function (child)
		{
			if (isElement(child))
			{
				this.appendChild(child);
            }
            else if (isText(child) || isString(child))
            {
                this.innerHTML += child;
            }
            else if (isArray(child) && !isString(child))
            {
                this.appendChildren.apply(this, child);
            }
            else
            {
                console.log(child);
                console.warn("ERROR: cannot append something except String, Text or Element as an DOMElement. Skipping.");
            }
		}).bind(this)
	);
};

/*
 * Removes a mass of children to DOM-Element
 *
 * @param {Element|Text|Array} - children to remove
 */
Element.prototype.removeChildren = function()
{
	Array.from(arguments).forEach
	(
		(function (child)
		{
			if (isElement(child) || isText(child))
			{
				this.removeChild(child);
            }
            else if (isArray(child) && !isString(child))
            {
                this.removeChildren.apply(this, child);
            }
            else
            {
                console.warn("ERROR: cannot remove something except Text or Element as an DOMElement. Skipping.");
            }
		}).bind(this)
	);
};

/*
 * Creates a DOM-Element, may take different params
 *
 * @param {String} type - string with tag
 * @param {Object} attributes - a mass of attributes, classes and event listeners of element
 * @param {Array} children - array of children of element
 */
Document.prototype.newElement = function()
{
    arguments = Array.from(arguments);
    if (typeof arguments[0] != "string")
	{
        console.warn("ERROR: first argument passed to newElement method is not an String. Skipping.");
		return null;
	}

	var element = document.createElement(arguments[0]);
    arguments = arguments.slice(1);

	if (arguments[0] && !isArray(arguments[0]) && !isElement(arguments[0]) && !isString(arguments[0]))
	{
		element.setProperties(arguments[0]);
        arguments = arguments.slice(1);
	}

    if (arguments[0] && (isArray(arguments[0]) || isElement(arguments[0]) || isString(arguments[0])))
    {
        element.appendChildren.apply(element, arguments);
    }

	return element;
};

Element.prototype.newChildElement = function()
{
    var element = document.newElement.apply(null, arguments);
    if (element)
    {
        this.appendChild(element);
    }

    return element;
};


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

