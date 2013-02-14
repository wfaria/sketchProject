/***
Source: 
- http://arguments.callee.info/2009/05/18/javascript-design-patterns--mediator/
- http://addyosmani.com/largescalejavascript/
- https://developers.google.com/closure/compiler/docs/js-for-compiler
- http://www.oodesign.com/mediator-pattern.html
***/

//TODO: Remove throw exception if the program become too slow because of the mediator

/*** Mediator base-prototype and other objects definition ***/
// look more at http://phrogz.net/JS/classes/OOPinJS2.html

/**
 * The Mediator object, it acts as mediator between objects actions by the functions subscribe and publish.
 * @constructor
 *
 * @param {string} idString - The id to identify the mediator in the case of use more than one of this
 */
function Mediator( idString )
{
	// Array of components, each component is an object that wants to listen a variable number of channels
	this.components = [];
	this.id = idString;
}

Mediator.prototype.constructor = Mediator;
Mediator.prototype.toString = function() { return "Mediator with ID: " + this.id; }

Mediator.prototype.debugAlert = function(text) {
	//alert( text );
	console.log( text );
}
		
/**
 * Publish an event with args to the source channel 
 *
 * @param {string} event - The event that has been published
 * @param {...[?]} args -  A variable number of variables of different types that the event can use
 * @param {string} source - The object where the callback function will be called, 
 * if it is undefined, then it will be called in the component itself (the object which contains the callback function)
 */
Mediator.prototype.publish = function(event, args, source) {
	var reachCount = 0;
	if (!event) {
		return reachCount;
	}
	// Checking publish arguments
	args = args || [];
	//debugAlert(["Mediator received", event, args].join(' '));
	try {
		for (var c in this.components) {
			if (typeof this.components[c]["on" + event] == "function") {
					//this.debugAlert("Mediator calling " + event + " on " + c); // using this because of the try-catch scope
					source = /*source ||*/ this.components[c]; // TODO: What the "or" does here?
					this.components[c]["on" + event].apply(source, args);
					reachCount++;
				
			}
		}
	} catch (err) {
				var errMsg = ["Mediator error.", event, args, source, err].join(' ');
				this.debugAlert(errMsg);
				throw new Error(errMsg);
	}
	return reachCount;
}


/**
 * Subscribe a component to receive information about updates in a channel 
 *
 * @param {string} name - An unique name to identify the component that wants to be notified by this mediator
 * @param {boolean} replaceDuplicate - If a new component can replace an old with the same name in the case that it`s already subscribed
 * @param {?} component -  The component object with the callback functions to subscribe
 */
Mediator.prototype.subscribe = function(name, replaceDuplicate, component ) {
	if (name in this.components) {
		if (replaceDuplicate) {
			this.removeComponent(name);
		} else {
			console.log( 'Mediator name conflict: ' + name );
			throw new Error('Mediator name conflict: ' + name);
		}
	}
	this.components[name] = component;
}

Mediator.prototype.removeComponent = function(name) {
	if (name in this.components) {
		delete this.components[name];
	}
}

Mediator.prototype.getComponent = function(name) 
{
	return this.components[name]; // undefined if component has not been added
}
