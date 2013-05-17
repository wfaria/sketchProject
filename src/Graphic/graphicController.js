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
graphicControllerGlobals.defaultNames.MAIN_SHAPE = "_MAIN_ELEMENT";


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
		this ); 
	globalMediators.graphicMediator.subscribe( "graphicController", true, 
		this );
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
	if( this.deleteInterfaceResource( interfaceRes ) != null )
	{
		console.error("Error while adding element on canvas, it already exists.");
	}
	
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

GraphicController.prototype.deleteEventManager =  function ( interfaceResource )
{
	var length = this.eventManagers.length;
	var i;
	
	for ( i = 0;  i < length; i ++ )
	{
		if( this.eventManagers[i].getId() == interfaceResource.getId()  )
		{
			var ret = this.eventManagers[i];
			this.eventManagers.splice(i,1);
			return ret;
		} 
	}
	return null;
}

GraphicController.prototype.deleteInterfaceResource = function ( interfaceResource )
{
	var deletedResource = this.getKineticObjectById( interfaceResource );
	if( deletedResource != null )
	{
		var parentLayer = deletedResource.getLayer();
		if( this.deleteEventManager( deletedResource ) == null )
		{
			console.error( "Internal error while deleting object (inexistent event listener)." );
		}
		else
		{
			deletedResource.remove();
			parentLayer.draw();
			return deletedResource;
		}
	}
	else
	{
		return null;
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

/**
 * The Kinetic library identifies it objects by IDs and names.
 * The ID must be unique, but the names must not be, so they can be used as a class specifier.
 * This function returns an array with all children with this name. 
 *
 * @param {string} event - The event that has been published
 * @param {...[?]} args -  A variable number of variables of different types that the event can use
 * @param {string} source - The object where the callback function will be called, 
 * if it is undefined, then it will be called in the component itself (the object which contains the callback function)
 */
GraphicController.prototype.getKineticChildrenByName = function ( kineticObject, nameStr )
{
	return kineticObject.get( "." + nameStr); 
}

GraphicController.prototype.createGraphicObject = function ( interfaceResource )
{
	var kineticShape = this.defaultKineticFactory( interfaceResource );
	kineticShape = this.extendKineticShape( interfaceResource, kineticShape );
	return kineticShape;
}

GraphicController.prototype.resizeKineticObject = function( kineticObject, newX, newY, newWidth, newHeight ) 
{
	var mainElementArray = this.getKineticChildrenByName( kineticObject,
		graphicControllerGlobals.defaultNames.MAIN_SHAPE );
	if( mainElementArray == null || mainElementArray.length != 1  )
	{
		console.error( "Internal error while resizing object." );
		return;
	}
	var mainElement = mainElementArray[0];
	var resizeXFactor = newWidth/mainElement.getWidth();
	var resizeYFactor = newHeight/mainElement.getHeight();
	
	var elementArray = kineticObject.getChildren();
	var length = elementArray.length;
	var i = 0;
	
	for( i = 0; i < length; i++ )
	{
		if( elementArray[i].getName() != ( graphicControllerGlobals.defaultNames.MAIN_SHAPE ) )
		{
			// Scaling the distance between the parent and its children
			elementArray[i].setX( resizeXFactor*( elementArray[i].getX() ) );
			elementArray[i].setY( resizeYFactor*( elementArray[i].getY() ) );
			if( elementArray[i].getName() != ( graphicControllerGlobals.defaultNames.NAME ) )
				elementArray[i].setSize( resizeXFactor*elementArray[i].getWidth(), resizeYFactor*elementArray[i].getHeight() );
		}
	}
	
	kineticObject.setX( newX );
	kineticObject.setY( newY );
	mainElement.setSize( newWidth, newHeight );
	
	var layer = mainElement.getLayer();
	if( layer == null  )
	{
		console.error( "Internal error while resizing object." );
		return;
	}
	layer.draw();
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
			var kinectGroup = new Kinetic.Group(  { 
				x:interfaceResource.getX(), y:interfaceResource.getY(), 
				draggable:true, dragOnTop: false,
				id:interfaceResource.getId(), name:interfaceResource.getName() });

			var square1 = new Kinetic.Rect({
			  fill: "#669933",
			  stroke: "#003333",
			  strokeWidth: 2,
			  name: graphicControllerGlobals.defaultNames.MAIN_SHAPE,
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
	var externSquare = kineticShape.get( graphicControllerGlobals.defaultNames.MAIN_SHAPE )[0]; 
	var internSquare = kineticShape.get( "._INTERN_SQUARE" )[0]; 
	var text = kineticShape.get( "."+graphicControllerGlobals.defaultNames.NAME )[0]; 
	externSquare.setFill( "#666666" );
	externSquare.setStroke( "#99CCFF" );
	internSquare.setFill( "#666666" );
	text.setFill( "#FFFFFF" );
	return kineticShape;
}



/******** Internal Mediator functions **********/
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

GraphicController.prototype.onInterfaceResourceDeleted = function( interfaceResource )
{
	if( this.deleteInterfaceResource( interfaceResource ) == null )
	{
		console.error( "Trying to delete an unexistent element on the graphic canvas." );
	}
}

GraphicController.prototype.onInterfaceResourceMoved = function( interfaceResource, oldX, oldY )
{
	var kineticObject = this.getKineticObjectById( interfaceResource );
	if( kineticObject == null )
	{
		console.error( "onInterfaceResourceMoved there is no kinetic object with the give ID" );
		return;
	}
	else
	{
		var parentLayer = kineticObject.getParent();
		kineticObject.setX( interfaceResource.getX() );
		kineticObject.setY( interfaceResource.getY() );
		parentLayer.draw();
	}
}

GraphicController.prototype.onInterfaceResourceResized = function( interfaceResource, oldX, oldY, oldWidth, oldHeight )
{
	var kineticObject = this.getKineticObjectById( interfaceResource );
	if( kineticObject == null )
	{
		console.error( "onInterfaceResourceResized there is no kinetic object with the give ID" );
		return;
	}
	else
	{
		this.resizeKineticObject( kineticObject, 
			interfaceResource.getX(), interfaceResource.getY(),
			interfaceResource.getWidth(), interfaceResource.getHeight() );
	}
}

/******** Graphic Mediator functions **********/

GraphicController.prototype.onResourceNameChanged = function( interfaceResource, newNameStr )
{
	var kineticObject = this.getKineticObjectById( interfaceResource );
	//TODO
	if( kineticObject == null )
	{
		console.error( "onResourceNameChange there is no kinetic object with the give ID" );
		return;
	}
	else
	{
		kineticTextObjArray = this.getKineticChildrenByName( kineticObject, graphicControllerGlobals.defaultNames.NAME );
		if( kineticTextObjArray == null || kineticTextObjArray.length != 1 )
		{
			console.error( "onResourceNameChange there is no name child on the kinetic object with the name changed" );
			return;
		}
		else
		{
			// The returned array is supposed to have only one element
			kineticTextObjArray[0].setText( newNameStr );
			kineticTextObjArray[0].getLayer().draw();
		}
	}
}

