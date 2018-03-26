# RISE
RISE is a library which can simply create a flat tabbed interface. You can find working build in the BUILD folder in repo.
RISE is working with another our project called BASIS (see its repo), so you have include two *.js library 
(BASIS.js and RISE.js) or use one RISE build file with *.full syffix.

#### Available versions:
- 0.1.js

#### Changelog:
- Added basic methods

#### FAQ:
Here is the basics for detailed information see comments in the non-builded js code <br/>
Firstly you have to create new object of the Interface class:

    /**
     * @param  {Element} parent            - link to DOMElement where interface will be created;
     * @param  {Object} params             - properties of the Interface class
     * @param  {Number} params.duration    - time of animation in seconds (if not given, then 1 second)
     * @param  {Number} params.orientation - direction of animation ("VERTICAL" or "HORISONTAL", if not given, then "HORISONTAL")
     * @return {Interface}                - class instance
    */
    let rise = new Rise(parent, {duration: 1, orientation: "VERTICAL"});

Methods to rule tabs:

    /**
     * Creates a new tab and appends it to DOM;
     * @param  {String} name - id of new tab;
     * @return {Element}     - link to created tab;
     */
    let tab = rise.createTab("name");
    
    /**
     * Swipes to pointed tab
     * @param {String} name - id of tab to show;
     */
    rise.showTab("name");
    
    /**
     * Removes tab from DOM, notice that you must unhide with show method another tab before this
     * @param {String} name - id of tab to remove;
     */
    rise.closeTab("name");

Methods to get information about tabs:

    /**
     * Returns a current tab
     * @return {Element} - current tab
     */
    rise.getCurrentTab();
    
    /**
     * Returns a tab name by the DOM element
     * @param  {Element} element - DOM element in tab
     * @return {String}          - name of the found tab
     */
    rise.getTabName(element);