// This class is dependent from the KineticJS library

var graphicControllerGlobals = {};
graphicControllerGlobals.MAX_DEPTH = 15;
graphicControllerGlobals.CANVAS_WIDTH = 800;
graphicControllerGlobals.CANVAS_HEIGHT = 600;
graphicControllerGlobals.stylesEnum = { DEFAULT : 0, ANDROID : 1, WINDOWS8: 2, LINUX: 3 };
graphicControllerGlobals.currentStyle = graphicControllerGlobals.stylesEnum.DEFAULT;
graphicControllerGlobals.styleChangers = {};


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
	
	graphicControllerGlobals.styleChangers[ graphicControllerGlobals.stylesEnum.DEFAULT ] = new KineticStyleChanger();
}

GraphicController.prototype.constructor = GraphicController;


GraphicController.prototype.createGraphicObject = function ( interfaceResource )
{
	var kineticShape = defaultKineticFactory( interfaceResource );
}


function defaultKineticFactory( interfaceResource )
{
	switch( interfaceResource.getResourceType )
	{
		case( resourceTypeEnum.IR_BUTTON ):
		{
			var kinectGroup = new Kinetic.Group(  { x:interfaceResource.getX(), y:interfaceResource.getY(), draggable:true, id:"_button_"+id_count, name:interfaceResource.getName() });

			var square1 = new Kinetic.Rect({
			  fill: "yellow",
			  stroke: "black",
			  strokeWidth: 4,
			  name: "_EXTERN_SQUARE",
			  //draggable: true,
			  width: interfaceResource.getWidth(),
			  height: interfaceResource.getHeight()
			});
			var square2 = new Kinetic.Rect({
			  fill: "blue",
			  stroke: "black",
			  strokeWidth: 4,
			  //draggable: true,
			  name: "_INTERN_SQUARE",
			  x:5,
			  y:5,
			  width: 0.9*interfaceResource.getWidth(),
			  height: 0.9*interfaceResource.getHeight()
			});
			
			var simpleText = new Kinetic.Text({
			  x: 25,
			  y: 15,
			  name: "_TEXT",
			  text: interfaceResource.getName(),
			  fontSize: 12,
			  fontFamily: 'Calibri',
			  textFill: 'black'
			});
			
			kinectGroup.add( square1 );
			kinectGroup.add( square2 );
			kinectGroup.add( simpleText );
			return kinectGroup;
			break;
		}
	}
}



function KineticStyleChanger()
{
}

KineticStyleChanger.prototype.constructor = KineticStyleChanger;


KineticStyleChanger.prototype.modifyButton = function ( kineticShape )
{
	return kineticShape;
}


KineticStyleChanger.prototype.modifyWindow = function ( kineticShape )
{
	return kineticShape;
}

