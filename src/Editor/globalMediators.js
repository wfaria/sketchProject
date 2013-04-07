globalMediators = {};
globalMediators.graphicMediator = null;
globalMediators.internalMediator = null;

globalMediators.start = function()
{
	globalMediators.graphicMediator = new Mediator( "graphicMediator" );;
	globalMediators.internalMediator = new Mediator( "internalMediator" );;
}
