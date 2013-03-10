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
	graphicControllerGlobals.styleChangers[ graphicControllerGlobals.stylesEnum.ANDROID ] = new KineticStyleChanger();
	graphicControllerGlobals.styleChangers[ graphicControllerGlobals.stylesEnum.WINDOWS8 ] = new KineticStyleChanger();
	graphicControllerGlobals.styleChangers[ graphicControllerGlobals.stylesEnum.LINUX ] = new KineticStyleChanger();
}

GraphicController.prototype.constructor = GraphicController;

GraphicController.prototype.renderScreen = function ( screenObject )
{
	
}


GraphicController.prototype.addInterfaceResource = function ( interfaceResource )
{
	var kineticShape = this.createGraphicObject( interfaceResource );
	this.layers[ interfaceResource.getZ() ].add( kineticShape );
	this.layers[ interfaceResource.getZ() ].draw();
}

GraphicController.prototype.createGraphicObject = function ( interfaceResource )
{
	var kineticShape = this.defaultKineticFactory( interfaceResource );
	kineticShape = this.extendKineticShape( interfaceResource, kineticShape );
	return kineticShape;
}


GraphicController.prototype.defaultKineticFactory = function( interfaceResource )
{
	switch( interfaceResource.getResourceType() )
	{
		case( resourceTypeEnum.IR_BUTTON ):
		{
			var kinectGroup = new Kinetic.Group(  { x:interfaceResource.getX(), y:interfaceResource.getY(), draggable:true, id:"_button", name:interfaceResource.getName() });

			var square1 = new Kinetic.Rect({
			  fill: "#669933",
			  stroke: "#003333",
			  strokeWidth: 2,
			  name: "_EXTERN_SQUARE",
			  //draggable: true,
			  dragOnTop: false,
			  width: interfaceResource.getWidth(),
			  height: interfaceResource.getHeight()
			});
			var square2 = new Kinetic.Rect({
			  fill: "#99CC66",
			  /*stroke: "black",
			  strokeWidth: 4,*/
			  //draggable: true,
			  dragOnTop: false,
			  name: "_INTERN_SQUARE",
			  x:0.1*interfaceResource.getWidth(),
			  y:0.1*interfaceResource.getHeight(),
			  width: 0.8*interfaceResource.getWidth(),
			  height: 0.8*interfaceResource.getHeight()
			});
			
			var simpleText = new Kinetic.Text({
			 	x:0.5*interfaceResource.getWidth(),
			  	y:0.5*interfaceResource.getHeight(),
		        text: interfaceResource.getName(),
		        fontSize: 30,
		        fontFamily: 'Calibri',
		        fill: 'black',
		        align: 'center'
		      });
			
			kinectGroup.add( square1 );
			kinectGroup.add( square2 );
			kinectGroup.add( simpleText );
			return kinectGroup;
			break;
		}
		default:
		{
			alert("OOHHIIHI");
			break;
		}
	}
}

GraphicController.prototype.extendKineticShape = function( interfaceResource, kineticShape )
{
	var extendedKineticShape;
	switch( interfaceResource.getResourceType() )
	{
		case( resourceTypeEnum.IR_BUTTON ):
		{
			extendedKineticShape = graphicControllerGlobals.styleChangers[ graphicControllerGlobals.currentStyle ].modifyButton( kineticShape );
		}
	}
	
	return extendedKineticShape;
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

