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

    let interface = new Interface(application);

After that you can use methods such as:

    // this will create and show tab on the screen
    let tab = interface.createTab("name");
    interface.showTab("name");
    
    // this will show nother tab on the screen
    interface.showTab("another_name");
    
    // this will close tab, notice that in this version you must open another tab before close this one
    interface.showTab("another_name");
    interface.closeTab("name");
