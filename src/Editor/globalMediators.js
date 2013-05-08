globalMediators = {};
globalMediators.graphicMediator = null;
globalMediators.internalMediator = null;

globalMediators.start = function()
{
	globalMediators.graphicMediator = new Mediator( "graphicMediator" );;
	globalMediators.internalMediator = new Mediator( "internalMediator" );;
}

globalMediators.subscribeToMediators = function( componentObject, componentIdStr )
{
	globalMediators.internalMediator.subscribe( componentIdStr, true, 
		componentObject ); 
	globalMediators.graphicMediator.subscribe( componentIdStr, true, 
		componentObject );
}
