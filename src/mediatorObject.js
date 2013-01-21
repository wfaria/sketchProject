/***
Source: 
- http://arguments.callee.info/2009/05/18/javascript-design-patterns--mediator/
- http://addyosmani.com/largescalejavascript/
- https://developers.google.com/closure/compiler/docs/js-for-compiler
***/

//TODO: Anonymous function to control global variables

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
Mediator.prototype.toString = function() { return this.id; }

Mediator.prototype.debugAlert = function(text) {
	alert( text );
}
		
/**
 * Publish an event with args to the source channel 
 *
 * @param {string} event - The event that has been published
 * @param {...[?]} args -  A variable number of variables of different types that the event can use
 * @param {string} source - The channel to which the event is going to be send
 */
Mediator.prototype.publish = function(event, args, source) {
	if (!event) {
		return;
	}
	// Checking publish arguments
	args = args || [];
	//debugAlert(["Mediator received", event, args].join(' '));
	for (var c in this.components) {
		if (typeof this.components[c]["on" + event] == "function") {
			try {
				//this.debugAlert("Mediator calling " + event + " on " + c); // using this because of the try-catch scope
				source = source || this.components[c];
				this.components[c]["on" + event].apply(source, args);
			} catch (err) {
				this.debugAlert(["Mediator error.", event, args, source, err].join(' '));
			}
		}
	}
}


/**
 * Subscribe a component to receive information about updates in a channel 
 *
 * @param {string} name - An unique name to identify the component that wants to be notified by this mediator
 * @param {?} component -  The component object with the callback functions to subscribe
 * @param {boolean} replaceDuplicate - If a new component can replace an old with the same name in the case that it`s already subscribed
 */
Mediator.prototype.subscribe = function(name, replaceDuplicate, component ) {
	if (name in this.components) {
		if (replaceDuplicate) {
			removeComponent(name);
		} else {
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
