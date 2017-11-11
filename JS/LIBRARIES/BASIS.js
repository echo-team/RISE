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

