// This class is dependent from the KineticJS library

var graphicControllerGlobals = {};
graphicControllerGlobals.MAX_DEPTH = 2;
graphicControllerGlobals.CANVAS_WIDTH = 800;
graphicControllerGlobals.CANVAS_HEIGHT = 600;
graphicControllerGlobals.stylesEnum = { DEFAULT : 0, ANDROID : 1, WINDOWS8: 2, LINUX: 3 };
graphicControllerGlobals.currentStyle = graphicControllerGlobals.stylesEnum.DEFAULT;
graphicControllerGlobals.styleChangers = {};
graphicControllerGlobals.defaultNames = {};
graphicControllerGlobals.defaultNames.NAME = "_NAME";
graphicControllerGlobals.defaultNames.NAMELESS = "_";
graphicControllerGlobals.defaultNames.MAIN_SHAPE = "_MAIN_ELEMENT";
graphicControllerGlobals.defaultNames.SECONDARY_SHAPE = "_SEC_ELEMENT";
graphicControllerGlobals.defaultNames.NOT_RESIZE = "_NO_RZ";

graphicControllerGlobals.COMMON_CANVAS = 0;
graphicControllerGlobals.META_CANVAS = 1;

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
    this.initializeVariables( null );
    this.sketchObject = null;
}

GraphicController.prototype.constructor = GraphicController;

GraphicController.prototype.initializeVariables = function( sketchObj )
{
	this.sketchObject = sketchObj;
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
	
	if( sketchObj != null )
	{
		this.metaGraphicController = new MetaGraphicController( this.layers[graphicControllerGlobals.META_CANVAS] );
		globalMediators.subscribeToMediators( this.metaGraphicController, "MetaGraphicController" );
	}
	else
	{
		this.metaGraphicController = null;
	}
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
	this.stage.removeChildren();
	this.stage.draw();

	this.initializeVariables( sketchObject );
	
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
		/*
		 * It is null when there is no suitable version of this resource from the current version
		 * It is deleted when it's flag is turned on
		 */
		if( interfaceResource != null && interfaceResource.getDeleted() == false )
		{
			this.addInterfaceResource( interfaceResource );
		}
	}
}

GraphicController.prototype.fixZIndexes = function()
{
	var renderedResources = new Array();
	var length = this.eventManagers.length;
	var i;
	
	for ( i = 0;  i < length; i ++ )
	{
		renderedResources.push( this.eventManagers[i].getInterfaceResource() );
	}
	
	renderedResources.sort( 
		function(a,b){ 
			if( a.getZ() != b.getZ() )
				return a.getZ()-b.getZ();
			else
				return a.getId()-b.getId(); 
		}
	);
	
	for ( i = 0;  i < length; i ++ )
	{
		var kineticObj = this.getKineticObjectById( renderedResources[i] );
		if( kineticObj == null )
		{
			console.error("Error while ordering elements' Z-index, trying to order an inexistente element");
			return; 
		}
		kineticObj.moveToTop();
	}
	
}

// This function should be used for events that can manipulate resources in different points of time
// It checks if a resource is already rendered on the canvas
GraphicController.prototype.existEventManagerFor = function( interfaceResource )
{
	var id = interfaceResource.getId();
	var version = interfaceResource.getVersion();
	var length = this.eventManagers.length;
	var i;
	
	for ( i = 0;  i < length; i ++ )
	{
		if( this.eventManagers[i].getId() == id && this.eventManagers[i].getVersion() == version )
		{
			return true;
		}
	}
	return false;
}

GraphicController.prototype.getVersionFromRenderedResource = function( resourceId )
{
	var length = this.eventManagers.length;
	var i;
	for ( i = 0;  i < length; i ++ )
	{
		if( this.eventManagers[i].getId() == resourceId )
		{
			return this.eventManagers[i].getVersion();
		}
	}
	return -1;
}

GraphicController.prototype.addInterfaceResource = function ( interfaceRes )
{
	if( this.deleteInterfaceResource( interfaceRes ) != null )
	{
		console.error("Error while adding element on canvas, it already exists.");
	}
	
	var ks = this.createGraphicObject( interfaceRes );	
	
	// TODO: Call this from a mediator to isolate the graphic part from the event handler
	if( interfaceRes.getResourceType() == resourceTypeEnum.IR_BUTTON ||
		interfaceRes.getResourceType() == resourceTypeEnum.IR_WINDOW ||
		interfaceRes.getResourceType() == resourceTypeEnum.IR_IMAGE )
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
		console.error( "Groups not supported in this version" ); 
	}
	else
	{
		console.error("Error while attaching evenet managers to the created element");
	}
	
	this.layers[ graphicControllerGlobals.COMMON_CANVAS ].add( ks );
	this.fixZIndexes();
	this.layers[ graphicControllerGlobals.COMMON_CANVAS ].draw();
	
	if( interfaceRes.getResourceType() == resourceTypeEnum.IR_IMAGE )
	{
		//TODO: temporary fix, when inserting an image it doesn't appear until you click on the canvas
		this.stage.draw();
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
	//TODO: Decide if will use this function kineticShape = this.extendKineticShape( interfaceResource, kineticShape );
	return kineticShape;
}

GraphicController.prototype.createKineticVersionTag = function( interfaceResource )
{
	var kineticGroup = new Kinetic.Group(  { 
	x:0, y:0, 
	draggable:false, dragOnTop: false,
	name: graphicControllerGlobals.defaultNames.NOT_RESIZE,
	id:interfaceResource.getId()+"version_Tag"});
	
	var backRect = new Kinetic.Rect({
	  fill: "#FFCC99",
	  stroke: "#330000",
	  name: graphicControllerGlobals.defaultNames.NOT_RESIZE,
	  strokeWidth: 1,
	  draggable: false,
	  dragOnTop: false,
	  width: 16, height: 16
	});
	
	var simpleText = new Kinetic.Text({
	    x: 0,
	    y: 0,
	    text: 'V'+interfaceResource.getVersion(),
	   	name: graphicControllerGlobals.defaultNames.NOT_RESIZE,
		fontSize: 12,
		fontFamily: 'Calibri',
		fill: 'black'
	});
	kineticGroup.add(backRect);
	kineticGroup.add(simpleText);
	return kineticGroup;
}

GraphicController.prototype.containsNameElement = function( kineticObject, strToCheck )
{
	var name = kineticObject.getName();
	return ( name.indexOf( strToCheck ) != -1 );
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
			if( elementArray[i].getName() != ( graphicControllerGlobals.defaultNames.NAME ) 
				&& !this.containsNameElement( elementArray[i], graphicControllerGlobals.defaultNames.NOT_RESIZE ) )
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
		
		case( resourceTypeEnum.IR_WINDOW ):
		{
			var kinectGroup = new Kinetic.Group(  { 
				x:interfaceResource.getX(), y:interfaceResource.getY(), 
				draggable:true, dragOnTop: false,
				id:interfaceResource.getId(), name:interfaceResource.getName() });
			
			var xDesloc = 0;
			var yDesloc = 0;	
			
			var xBaseOffset = 0.02;
			var yBaseOffset = 0.02;
				
			var square1 = new Kinetic.Rect({
			  fill: "#669999",
			  stroke: "#003333",
			  strokeWidth: 2,
			  name: graphicControllerGlobals.defaultNames.MAIN_SHAPE,
			  //draggable: true,
			  dragOnTop: false,
			  width: interfaceResource.getWidth(),
			  height: interfaceResource.getHeight()
			});
			
			var titleBarHeight = 0.1*interfaceResource.getHeight();
			 
			var squareTitle = new Kinetic.Rect({
			  fill: "#003366",
			  stroke: "#006699",
			  strokeWidth: 2,
			  dragOnTop: false, 
			  name: graphicControllerGlobals.defaultNames.SECONDARY_SHAPE,
			  x:0,
			  y:0,
			  width: interfaceResource.getWidth(),
			  height: titleBarHeight
			});
			
			var btnSize = 2.5*xBaseOffset;
			
			var squareClose = new Kinetic.Rect({
			  fill: "#FF0000",
			  stroke: "#CC000",
			  strokeWidth: 2,
			  dragOnTop: false,
			  name: graphicControllerGlobals.defaultNames.NAMELESS, 
			  x:(1-(btnSize+xBaseOffset))*interfaceResource.getWidth(),
			  y:0.5*yBaseOffset*interfaceResource.getHeight(),
			  width: btnSize*interfaceResource.getWidth(),
			  height: btnSize*interfaceResource.getHeight()
			});
			
			var squareMaximize = new Kinetic.Rect({
			  fill: "#66CC00",
			  stroke: "#339900",
			  strokeWidth: 2,
			  dragOnTop: false,
			  name: graphicControllerGlobals.defaultNames.NAMELESS, 
			  x:(1-2*(btnSize+xBaseOffset))*interfaceResource.getWidth(),
			  y:0.5*yBaseOffset*interfaceResource.getHeight(),
			  width: btnSize*interfaceResource.getWidth(),
			  height: btnSize*interfaceResource.getHeight()
			});
			
			yDesloc = 0.1;
			
			var squareBody = new Kinetic.Rect({
			  fill: "#CCCCCC",
			  dragOnTop: false, 
			  name: graphicControllerGlobals.defaultNames.SECONDARY_SHAPE,
			  x:xBaseOffset*interfaceResource.getWidth(),
			  y:(yBaseOffset+yDesloc)*interfaceResource.getHeight(),
			  width: 0.96*interfaceResource.getWidth(),
			  height: ( 1 - (2*yBaseOffset+yDesloc))*interfaceResource.getHeight()
			});
			
			var simpleText = new Kinetic.Text({
				name: graphicControllerGlobals.defaultNames.NAME,
				dragOnTop: false,
			 	//x: yBaseOffset*interfaceResource.getWidth(),
			  	//y: titleBarHeight/2, // the title is always on the top
			  	x: 0,
			  	y: titleBarHeight/2,
		        text: interfaceResource.getName(),
		        fontSize: parseInt( interfaceResource.startWithExtraAttribute( iResGlobals.defaultKeys.FONTSIZE_KEY, 
		        	iResGlobals.defaultExtraValues.FONTSIZE_KEY ),10 ),
		        fontFamily: interfaceResource.startWithExtraAttribute( iResGlobals.defaultKeys.FONTTYPE_KEY, 
		        	iResGlobals.defaultExtraValues.FONTTYPE_KEY ),
		        fill: 'black',
		        align: 'right'
		      });
		      
		   	simpleText.setOffset({
		        x: 0,
		        y: simpleText.getHeight()/2
		     });
			
			kinectGroup.add( square1 );
			kinectGroup.add( squareTitle );
			kinectGroup.add( squareClose );
			kinectGroup.add( squareMaximize );
			kinectGroup.add( squareBody );
			kinectGroup.add( simpleText );
			kineticRet = kinectGroup;
			
			break;
		} //end 		case( resourceTypeEnum.IR_BUTTON ):
		case( resourceTypeEnum.IR_BUTTON ):
		{
			var kinectGroup = new Kinetic.Group(  { 
				x:interfaceResource.getX(), y:interfaceResource.getY(), 
				draggable:true, dragOnTop: false,
				id:interfaceResource.getId(), name:interfaceResource.getName() });

			var square1 = new Kinetic.Rect({
			  fill: "#669999",
			  stroke: "#003333",
			  strokeWidth: 2,
			  name: graphicControllerGlobals.defaultNames.MAIN_SHAPE,
			  //draggable: true,
			  dragOnTop: false,
			  width: interfaceResource.getWidth(),
			  height: interfaceResource.getHeight()
			});
			var square2 = new Kinetic.Rect({
			  fill: "#CCCCCC",
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
			 	x: parseInt( interfaceResource.startWithExtraAttribute( iResGlobals.defaultKeys.FONT_X_PADDING_KEY, 
		        	iResGlobals.defaultExtraValues.FONT_X_PADDING_KEY ), 10 )*interfaceResource.getWidth()/100,
			  	y: parseInt( interfaceResource.startWithExtraAttribute( iResGlobals.defaultKeys.FONT_Y_PADDING_KEY, 
		        	iResGlobals.defaultExtraValues.FONT_Y_PADDING_KEY ), 10 )*interfaceResource.getHeight()/100,
		        text: interfaceResource.getName(),
		        fontSize: parseInt( interfaceResource.startWithExtraAttribute( iResGlobals.defaultKeys.FONTSIZE_KEY, 
		        	iResGlobals.defaultExtraValues.FONTSIZE_KEY ),10 ),
		        fontFamily: interfaceResource.startWithExtraAttribute( iResGlobals.defaultKeys.FONTTYPE_KEY, 
		        	iResGlobals.defaultExtraValues.FONTTYPE_KEY ),
		        fill: 'black',
		        align: 'right'
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
		case( resourceTypeEnum.IR_IMAGE ):
		{
			var currentScreen = this.sketchObject.getCurrentScreen();
			var resourceHistory = currentScreen.getResourceHistory( interfaceResource.getId() );
			
			var imageObj = new Image();
			var imgSrc = resourceHistory.getExtraAttribute( iResHistGlobals.defaultKeys.IMAGE_SRC );
		
			
			if( imgSrc == null )
			{
				imageObj.src = "../media/img/no_image_loaded.jpg";
			}
			else
			{
				imageObj.src = imgSrc;
			}
			
			/*				
				if( !imageObj.complete || 
				imageObj.naturalWidth == 0 || imageObj.naturalWidth == "undefined" || 
				imageObj.naturalHeight == 0 || imageObj.naturalHeight == "undefined" )
				{
					alert("There is one resource with an image corrupted on the canvas");
					imageObj.src = "../media/img/no_image_loaded.jpg"; //TODO: Corrupted image here
				}*/

			
			var kineticGroup = new Kinetic.Group(  { 
				x:interfaceResource.getX(), y:interfaceResource.getY(), 
				draggable:true, dragOnTop: false,
				id:interfaceResource.getId(), name:interfaceResource.getName() });
			
			var kineticImage = new Kinetic.Image({
				x: 0,
				y: 0,
				image: imageObj,
				name: graphicControllerGlobals.defaultNames.MAIN_SHAPE,
				width: interfaceResource.getWidth(),
				height: interfaceResource.getHeight(),
				dragOnTop: false,
				draggable: false
			});
			
			
			imageObj.onload = function() {
				// This should be used to not let unloaded images on canvas until someone call the draw function
				var tempLayer = kineticImage.getLayer();
				if( tempLayer )
					tempLayer.draw();
			};
			
			kineticGroup.add( kineticImage );
			kineticRet = kineticGroup;
			break;
		} // END case( resourceTypeEnum.IR_IMAGE ):
		default:
		{
			alert("FACTORY_ERROR");
			break;
		}
	} // END switch( interfaceResource.getResourceType() )
	kineticRet.add( this.createKineticVersionTag( interfaceResource ) );
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
		case( resourceTypeEnum.IR_IMAGE ):
		{
			/* nothing to do */
			extendedKineticShape = kineticShape;
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

GraphicController.prototype.fixKineticTextOffset = function( interfaceResource, kineticShape )
{
	var textKineticObject = kineticShape;
	textKineticObject.setFontFamily( interfaceResource.getExtraAttribute( iResGlobals.defaultKeys.FONTTYPE_KEY ) );
	textKineticObject.setFontSize( interfaceResource.getIntExtraAttribute( iResGlobals.defaultKeys.FONTSIZE_KEY ) );
	switch( interfaceResource.getResourceType() )
	{
		case( resourceTypeEnum.IR_BUTTON ):
		{
			textKineticObject.setX( interfaceResource.getWidth()*interfaceResource.getIntExtraAttribute( iResGlobals.defaultKeys.FONT_X_PADDING_KEY )/100 );
			textKineticObject.setY( interfaceResource.getHeight()*interfaceResource.getIntExtraAttribute( iResGlobals.defaultKeys.FONT_Y_PADDING_KEY )/100 );
			textKineticObject.setOffset({
		        x: textKineticObject.getWidth() / 2,
		        y: textKineticObject.getHeight() / 2
		     });
		     break;
		}
		case( resourceTypeEnum.IR_WINDOW ):
		{
			var titleBarHeight = 0.1*interfaceResource.getHeight();
		  	textKineticObject.setX( 0 );
			textKineticObject.setY( titleBarHeight/2 );
		   	textKineticObject.setOffset({
		        x: 0,
		        y: textKineticObject.getHeight()/2
		     });
			break;
		}
		default:
		{
			break; //nothing to do
		}
	}
     
   return textKineticObject;
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
GraphicController.prototype.onResHistExtraImgChanged = function( interfaceResource, resourceHistory )
{
	this.deleteInterfaceResource( interfaceResource ) ;
	this.addInterfaceResource( interfaceResource );		
}

GraphicController.prototype.onProjectCreated = function( projectName, authorName, sketchProject )
{
	this.renderScreen( sketchProject );
}

GraphicController.prototype.onActiveVersionChanged = function( oldVersionNumber, sketchProject )
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

GraphicController.prototype.onResourceHistoryDeleted = function( interfaceResourceHistory )
{
	if( interfaceResourceHistory.getResources().length > 0 )
		this.deleteInterfaceResource( interfaceResourceHistory.getResources()[0] ) ;
}



GraphicController.prototype.onResourceDeleteTagChanged = function( interfaceResource )
{
	if( interfaceResource.getDeleted() == true ) 
	{
		if( this.existEventManagerFor(interfaceResource) )
		{
			if( this.deleteInterfaceResource( interfaceResource ) == null )
			{
				/*this is not an error anymore, in the future you may be able to delete resource from the
				 * past or future version without being the edition that you are editing
				 */
				console.alert( "Alert: Trying to delete an unexistent element on the graphic canvas." );
			}
		}
	}
	else
	{
		this.addInterfaceResource( interfaceResource );	
	}
}

GraphicController.prototype.onResourceVersionAdded = function( resourceTimeSlotObj, resourceHistory, sketchActiveVersion  )
{
	var actualResource = resourceHistory.getResourceBeforeVersion( sketchActiveVersion );
	var renderedVersion = this.getVersionFromRenderedResource( resourceTimeSlotObj.getId() );
	//see GraphicController.prototype.onResourceVersionCloned to understand this part
	if( actualResource.getVersion() > renderedVersion &&
		actualResource.getVersion() == resourceTimeSlotObj.getVersion() )
	{
		this.deleteInterfaceResource( actualResource ) ;
		this.addInterfaceResource( resourceTimeSlotObj );	
	}
	else if( actualResource.getVersion() > renderedVersion &&
			 actualResource.getVersion() != resourceTimeSlotObj.getVersion() )
	{
		console.error( "Graphic Internal inconsistency while restoring a resource version" );
	}
}

GraphicController.prototype.onResourceVersionRemoved = function( removedResource, resourceHistory, sketchActiveVersion )
{
	if( this.deleteInterfaceResource( removedResource ) != null )
	{
	/* A version removed doesn't mean that the resource disappeared.
	 * We must check if exists some older version that satisfies the version search condition.
	 */
		var actualResource = resourceHistory.getResourceBeforeVersion( sketchActiveVersion );
		if( actualResource != null )
		{
			this.addInterfaceResource( actualResource );	
		}
		else
		{
			/*
			 * There are no elements, so the resource doesn't exist anymore before the actual version
			 */
			return;
		}
	}
}

GraphicController.prototype.onResourceVersionCloned = function( clonedObj, baseVersion, resourceHistory, sketchActiveVersion )
{
	var actualResource = resourceHistory.getResourceBeforeVersion( sketchActiveVersion );
	var renderedVersion = this.getVersionFromRenderedResource( clonedObj.getId() );
	
	/* If the actual resource is newer than the rendered one and they are the same resource (same id, same version),
	  then the new clone is a newer version of this element, draw the new one*/
	if( actualResource.getVersion() > renderedVersion && 
		actualResource.getVersion() == clonedObj.getVersion()  )
	{
		//The delete function uses only the resource id to remove it, so it's fine to use the same argument in the both calls
		this.deleteInterfaceResource( clonedObj ) ;
		this.addInterfaceResource( clonedObj );	
	}
	else if( (actualResource.getVersion() > renderedVersion)
	 		 && actualResource.getVersion() != clonedObj.getVersion() )
	{
		/* internal error, it was supposed to be the same version, 
		 * if this happened then some change passed without being noticed */
		console.error( "Graphic Internal inconsistency while cloning a resource" );
	}
	/*var actualResource = resourceHistory.getResourceBeforeVersion( sketchActiveVersion );
	if( actualResource != null && 
		( clonedObj.getId() == actualResource.getId() ) &&
		( clonedObj.getVersion() <= actualResource.getVersion() || clonedObj.getVersion() > sketchActiveVersion ) )
	{
		//Nothing to do, the clone operation doesn't affect the actual version
		return;
	}
	else if( actualResource == null )
	{
		return;
	}
	else 
	{
	/* The cloned object is the newest active object from the resource at the current version,
	 * so we need to substitute this element in the canvas
	 */
/*
		var baseResource = resourceHistory.getResourceFromVersion( baseVersion );
		if( baseResource == null )
		{
			console.error("Error while updating canvas after cloning, it should be impossible to clone a resource if its base version doesn't exist'" );
			return;
		}
		this.deleteInterfaceResource( baseResource ) ;
		this.addInterfaceResource( clonedObj );	
	}*/
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
		console.error( "onInterfaceResourceResized there is no kinetic object with the given ID" );
		return;
	}
	else
	{
		this.resizeKineticObject( kineticObject, 
			interfaceResource.getX(), interfaceResource.getY(),
			interfaceResource.getWidth(), interfaceResource.getHeight() );
	}
}

GraphicController.prototype.onResourceFormatted = function( interfaceResource )
{
	var kineticObject = this.getKineticObjectById( interfaceResource );
	if( kineticObject == null )
	{
		console.error( "onResourceFormatted there is no kinetic object with the given ID" );
		return;
	}
	else
	{
		var textElementArray = this.getKineticChildrenByName( kineticObject,
			graphicControllerGlobals.defaultNames.NAME );
		//TODO: Add condition here for elements without text
		if( textElementArray == null || textElementArray.length != 1 )
		{
			console.error("Internal Error while formatting text" );
			return; 
		}
		this.fixKineticTextOffset( interfaceResource, textElementArray[0] );
		/*var textKineticObject = textElementArray[0];
		textKineticObject.setFontFamily( interfaceResource.getExtraAttribute( iResGlobals.defaultKeys.FONTTYPE_KEY ) );
		textKineticObject.setX( interfaceResource.getWidth()*interfaceResource.getIntExtraAttribute( iResGlobals.defaultKeys.FONT_X_PADDING_KEY )/100 );
		textKineticObject.setY( interfaceResource.getHeight()*interfaceResource.getIntExtraAttribute( iResGlobals.defaultKeys.FONT_Y_PADDING_KEY )/100 );
		textKineticObject.setFontSize( interfaceResource.getIntExtraAttribute( iResGlobals.defaultKeys.FONTSIZE_KEY ) );
		
		textKineticObject.setOffset({
	        x: textKineticObject.getWidth() / 2,
	        y: textKineticObject.getHeight() / 2
	     });
	     */
		textElementArray[0].getLayer().draw();
	}
}

GraphicController.prototype.onInterfaceResourceZChanged = function( interfaceResource, oldZ )
{
	this.fixZIndexes();
	var kineticObject = this.getKineticObjectById( interfaceResource );
	if( kineticObject == null )
	{
		console.error( "Graphic object from the resource with Z-index changed not found" );
		return;
	}
	kineticObject.getLayer().draw();
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
			/* There are elements without name elements */
			return;
		}
		else
		{
			// The returned array is supposed to have only one element
			kineticTextObjArray[0].setText( newNameStr );
			this.fixKineticTextOffset( interfaceResource, kineticTextObjArray[0] );
			kineticTextObjArray[0].getLayer().draw();
		}
	}
}

