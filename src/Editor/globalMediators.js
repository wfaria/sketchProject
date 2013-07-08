globalMediators = {};
globalMediators.graphicMediator = null;
globalMediators.internalMediator = null;

/**
 * This function erase all listeners and prepare the mediators to be used as
 * they are being used for the first time. 
 */
globalMediators.start = function()
{
	globalMediators.graphicMediator = new Mediator( "graphicMediator" );;
	globalMediators.internalMediator = new Mediator( "internalMediator" );;
}

/**
 * Subscribe an object in the mediators.
 * @see {Mediator}  
 * 
 * @param {?} componentObject - An object that can listen events sent by mediators, please read the mediator class for more details.
 * @param {string} componentIdStr - A string that represents this component, if it exist on the mediator, it will override the old one.
 */
globalMediators.subscribeToMediators = function( componentObject, componentIdStr )
{
	//TODO: Not allow it to override components and rise an error, it is more secure.
	globalMediators.internalMediator.subscribe( componentIdStr, true, 
		componentObject ); 
	globalMediators.graphicMediator.subscribe( componentIdStr, true, 
		componentObject );
}
