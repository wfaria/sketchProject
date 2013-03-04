// This class is dependent from the KineticJS library

var graphicControllerGlobals = {};
graphicControllerGlobals.MAX_DEPTH = 15;
graphicControllerGlobals.CANVAS_WIDTH = 800;
graphicControllerGlobals.CANVAS_HEIGHT = 600;

/**
 * The GraphicController object, it will control the graphic part that uses the kinetic stage to draw and manipulate shapes.
 * @constructor
 *
 * @param {string} containerDOMID - The id of the DOM Object which will contain the Kinetic stage.
 */
function GraphicController( containerDOMID )
{
	this.stage = new Kinetic.Stage({
      container: containerDOMID,
      width: graphicControllerGlobals.CANVAS_WIDTH,
      height: graphicControllerGlobals.CANVAS_HEIGHT
    }); 
	this.layers = new Array();
	var i = 0;
	for( i = 0; i < graphicControllerGlobals.MAX_DEPTH; i++ )
	{
		this.layers[i] = new Kinetic.Layer();
		this.stage.add( this.layers[i] );
	}
}

GraphicController.prototype.constructor = GraphicController;


GraphicController.prototype.createGraphicObject = function ( interfaceResource )
{
	var kinectGroup = new Kinetic.Group(  { x:0, y:0, draggable:true, id:interfaceResource.getId });
	
	switch( interfaceResource.getResourceType )
	{
		
	}
}
