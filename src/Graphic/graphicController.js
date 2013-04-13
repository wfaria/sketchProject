// This class is dependent from the KineticJS library

var graphicControllerGlobals = {};
graphicControllerGlobals.MAX_DEPTH = 15;
graphicControllerGlobals.CANVAS_WIDTH = 800;
graphicControllerGlobals.CANVAS_HEIGHT = 600;
graphicControllerGlobals.stylesEnum = { DEFAULT : 0, ANDROID : 1, WINDOWS8: 2, LINUX: 3 };
graphicControllerGlobals.currentStyle = graphicControllerGlobals.stylesEnum.DEFAULT;
graphicControllerGlobals.styleChangers = {};
graphicControllerGlobals.defaultNames = {};
graphicControllerGlobals.defaultNames.NAME = "_NAME";


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
    this.initializeVariables();
}

GraphicController.prototype.constructor = GraphicController;

GraphicController.prototype.initializeVariables = function()
{
	this.layers = new Array();
	var i = 0;
	for( i = 0; i < graphicControllerGlobals.MAX_DEPTH; i++ )
	{
		this.layers[i] = new Kinetic.Layer();
		this.stage.add( this.layers[i] );
	}
	this.eventManagers = new Array();
	
	graphicControllerGlobals.styleChangers[ graphicControllerGlobals.stylesEnum.DEFAULT ] = new KineticStyleChanger();
	graphicControllerGlobals.styleChangers[ graphicControllerGlobals.stylesEnum.ANDROID ] = new AndroidStyleChanger();
	graphicControllerGlobals.styleChangers[ graphicControllerGlobals.stylesEnum.WINDOWS8 ] = new KineticStyleChanger();
	graphicControllerGlobals.styleChangers[ graphicControllerGlobals.stylesEnum.LINUX ] = new KineticStyleChanger();
}

/**
 * Subscribe the graphic controller to the convinient mediators
 *
 */
GraphicController.prototype.subscribeToMediators = function ( )
{
	globalMediators.internalMediator.subscribe( "graphicController", true, 
		this ); //end mediator.subscribe( compName, true, ...
}


/**
 * This function will draw all elements from the current screen of a sketch project.
 * If there is already a screen drew, it will be erased from the canvas.
 *
 * @param {!Object} sketchObject - An object which represents the sketch project.
 */
GraphicController.prototype.renderScreen = function ( sketchObject )
{
	this.stage.clear();
	this.stage.draw();

	this.initializeVariables();
	
	var currentScreen = sketchObject.getCurrentScreen();
	if( currentScreen == null )
		return;
	var resources = currentScreen.getResources();
	var length = resources.length;
	var activeVersion = sketchObject.getActiveVersionNumber();
	var i;
	for ( i = 0;  i < length; i++ )
	{
		interfaceResource = resources[i].getResourceBeforeVersion( activeVersion );
		this.addInterfaceResource( interfaceResource );
	}
}


GraphicController.prototype.addInterfaceResource = function ( interfaceRes )
{
	var ks = this.createGraphicObject( interfaceRes );
	this.layers[ interfaceRes.getZ() ].add( ks );
	this.layers[ interfaceRes.getZ() ].draw();
	
	
	// TODO: Call this from a mediator to isolate the graphic part from the event handler
	if( interfaceRes.getResourceType() == resourceTypeEnum.IR_BUTTON )
	{
		var componentBaseObj = { 
			layer : 		this.layers[ interfaceRes.getZ() ],
			kineticShape : 	ks,
			interfaceResource: interfaceRes
		};
	
		this.eventManagers.push( new GenericKineticEventManager( componentBaseObj ) );
	}
	else if( interfaceRes.getResourceType() == resourceTypeEnum.IR_GROUP )
	{
		// TODO
	}
	else
	{
		alert("ERRO");
	}
}

GraphicController.prototype.getKineticObjectById = function ( interfaceResource )
{
	for( i = 0; i < graphicControllerGlobals.MAX_DEPTH; i++ )
	{
		var kineticObjectArray = this.layers[i].get( "#"+interfaceResource.getId() );
		if( kineticObjectArray != null )
		{
			if( kineticObjectArray.length > 1 || kineticObjectArray.length == 0 )
			{
				alert("There are elements using the same id on graphicController, getKineticObjectById function");
				return null;
			}
			else
			{
				return kineticObjectArray[0];
			}
		}
	}
	return null;
}

GraphicController.prototype.createGraphicObject = function ( interfaceResource )
{
	var kineticShape = this.defaultKineticFactory( interfaceResource );
	kineticShape = this.extendKineticShape( interfaceResource, kineticShape );
	return kineticShape;
}


GraphicController.prototype.defaultKineticFactory = function( interfaceResource )
{
	var kineticRet = null;
	switch( interfaceResource.getResourceType() )
	{
		case( resourceTypeEnum.IR_GROUP ):
		{
			var kineticGroup = new Kinetic.Group(  { x:0, y:0, draggable:true, 
				id:interfaceResource.getId(), name:interfaceResource.getName() });
			kineticRet = kineticGroup;
			break;
		}
		case( resourceTypeEnum.IR_BUTTON ):
		{
			var kinectGroup = new Kinetic.Group(  { x:interfaceResource.getX(), y:interfaceResource.getY(), draggable:true, id:interfaceResource.getId(), name:interfaceResource.getName() });

			var square1 = new Kinetic.Rect({
			  fill: "#669933",
			  stroke: "#003333",
			  strokeWidth: 2,
			  name: "_MAIN_ELEMENT",
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
				name: graphicControllerGlobals.defaultNames.NAME,
				dragOnTop: false,
			 	x:0.5*interfaceResource.getWidth(),
			  	y:0.5*interfaceResource.getHeight(),
		        text: interfaceResource.getName(),
		        fontSize: 30,
		        fontFamily: 'Calibri',
		        fill: 'black',
		        align: 'center'
		      });
		      
		   	simpleText.setOffset({
		        x: simpleText.getWidth() / 2,
		        y: simpleText.getHeight() / 2
		     });
			
			kinectGroup.add( square1 );
			kinectGroup.add( square2 );
			kinectGroup.add( simpleText );
			kineticRet = kinectGroup;
			break;
		}
		default:
		{
			alert("FACTORY_ERROR");
			break;
		}
	} // END switch( interfaceResource.getResourceType() )
	return kineticRet;
}

GraphicController.prototype.extendKineticShape = function( interfaceResource, kineticShape )
{
	var extendedKineticShape;
	switch( interfaceResource.getResourceType() )
	{
		case( resourceTypeEnum.IR_GROUP ):
		{
			var childrenArray = interfaceResource.getChildren();
			var length = childrenArray.length;
			for( var i = 0; i < length; i++ )
			{
				var newKineticShape = this.defaultKineticFactory( childrenArray[i] );
				newKineticShape = this.extendKineticShape( childrenArray[i], newKineticShape );
				newKineticShape.setDraggable( false ); // The root element from the group must be the unique draggable element
				kineticShape.add( newKineticShape );
			}
			extendedKineticShape = kineticShape;
			break;
		}
		case( resourceTypeEnum.IR_BUTTON ):
		{
			extendedKineticShape = graphicControllerGlobals.styleChangers[ graphicControllerGlobals.currentStyle ].modifyButton( kineticShape );
			break;
		}
		default:
		{
			alert("EXTEND_ERROR");
			break;
		}
	} // END switch( interfaceResource.getResourceType() )
	
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


/**
 * The AndroidStyleChanger object, it can change the following kinetic elements to have an Android outfit
 * @constructor
 * */
function AndroidStyleChanger()
{
}
AndroidStyleChanger.prototype = new KineticStyleChanger
AndroidStyleChanger.prototype.constructor = AndroidStyleChanger;


AndroidStyleChanger.prototype.modifyButton = function ( kineticShape )
{
	var externSquare = kineticShape.get( "._MAIN_ELEMENT" )[0]; 
	var internSquare = kineticShape.get( "._INTERN_SQUARE" )[0]; 
	var text = kineticShape.get( "."+graphicControllerGlobals.defaultNames.NAME )[0]; 
	externSquare.setFill( "#666666" );
	externSquare.setStroke( "#99CCFF" );
	internSquare.setFill( "#666666" );
	text.setFill( "#FFFFFF" );
	return kineticShape;
}



/******** Mediator functions **********/
GraphicController.prototype.onProjectCreated = function( projectName, authorName, sketchProject )
{
	this.renderScreen( sketchProject );
}
  			
GraphicController.prototype.onProjectClosed = function( )
{
	this.stage.clear();
	this.stage.removeChildren();
	this.stage.draw();
	this.stage.remove();
}
GraphicController.prototype.onSaveProject = function( )
{
	//TODO: this.sketch.Serialize
}
GraphicController.prototype.onEditorStageChange = function( newState )
{
	//TODO: call this for the graphic part
}
  					
GraphicController.prototype.onInterfaceResourceCreated = function( interfaceResource )
{
	this.addInterfaceResource( interfaceResource );
}


GraphicController.prototype.onResourceNameChange = function( interfaceResource, newNameStr )
{
	var kineticObject = this.getKineticObjectById( interfaceResource );
	
	//TODO
	if( kineticObject == null )
	{
		return;
	}
	else
	{
		return;
	}
}

