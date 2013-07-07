//http://www.html5canvastutorials.com/labs/html5-canvas-drag-and-drop-resize-and-invert-images/

var metaGraphicGlobals = {};
metaGraphicGlobals.idPrefix = "_MT_" ;
metaGraphicGlobals.TR = 0;
metaGraphicGlobals.TL = 1;
metaGraphicGlobals.BL = 2;
metaGraphicGlobals.BR = 3;

/**
 * MetaGraphic Controller constructor. It is called "Meta graphic"
 * because it is supposed to manipulate graphics that describe other graphics.
 * @constructor
 * 
 * @param {Kinetic.Layer} l - A layer to render the meta graphic elements, it should be over the common layers.
 */
function MetaGraphicController( l )
{
	this.layer = l;
	this.selectionKineticShapes = [];
	this.selectionIndicatedResources = [];
	this.anchorShapes = [];	
}
MetaGraphicController.prototype.constructor = MetaGraphicController;

/**
 * It generate a string with a prefix that indicate ids used by this class.
 * 
 * @param {string} str - Any string.
 * @return {string} a name with this class's prefix.
 */
MetaGraphicController.prototype.generatePrefix = function( str )
{
	return metaGraphicGlobals.idPrefix+str;
}

/**
 * Remove all anchors that shows an indicated resource.
 *  
 */
MetaGraphicController.prototype.removeAnchors = function()
{
	var i = 0;
	for( i = 0; i < this.anchorShapes.length; i ++ )
	{
		this.anchorShapes[i].remove();
	}
	this.anchorShapes = [];	
	this.layer.draw();
}

/**
 * Remove the rectangle that shows an indicated resource.
 *  
 * @param {InterfaceResource} interfaceResource - A selected resource.
 * @return {Kinetic.Rect} A kinetic object that represents the removed rectangle or null if it doesn't exit.
 */
MetaGraphicController.prototype.removeSelectionKineticRect = function( interfaceResource ) 
{
	var kineticRectIndex = this.getSelectionKineticRectIndex( interfaceResource );
	if( kineticRectIndex == -1 ) return null;
	
	
	var kineticRect = this.selectionKineticShapes[ kineticRectIndex ];
	if( kineticRect != null )
	{
		this.selectionKineticShapes.splice( kineticRectIndex, 1 );
		this.selectionIndicatedResources.splice( kineticRectIndex, 1 );
		kineticRect.remove();
		this.layer.draw();
	}
	return kineticRect;
}

/**
 * Get the index that indicates a selected resource. Inside this object
 *  
 * @param {InterfaceResource} interfaceResource - A interface resource.
 * @return {int} A number greater than 0 that indicates the index of a resource or -1 if it doesn't exist.
 */
MetaGraphicController.prototype.getSelectionKineticRectIndex = function( interfaceResource ) 
{
	var idStr = this.generatePrefix(interfaceResource.getId());
	var i = 0;
	var length = this.selectionKineticShapes.length;
	
	for( i = 0; i < length; i++ )
	{
		if( this.selectionKineticShapes[i].getId() == this.generatePrefix(interfaceResource.getId()+"") )
		{
			return i;
		}
	}
	
	return -1;
}

/**
 * Create a selection contour for a passed resource.
 * Also it stores this object as a selected element inside this object.
 *   
 * @param {InterfaceResource} interfaceResource - A interface resource.
 */
MetaGraphicController.prototype.createSelectionCountour = function( interfaceResource ) 
{

	var rect = new Kinetic.Rect({
		x : interfaceResource.getX(),
		y : interfaceResource.getY(),
		width : interfaceResource.getWidth(),
		height : interfaceResource.getHeight(),
		stroke : 'blue',
		fill: 'white',
		dashArray: [5, 2, 0.001, 5],
		draggable: false,
		dragOnTop: false,
		id : this.generatePrefix(interfaceResource.getId()+""),
		strokeWidth : 4
	});
	
	rect.disableFill();
	
	this.selectionKineticShapes.push( rect );
	this.selectionIndicatedResources.push( interfaceResource );
	
	this.layer.add( rect );
	this.layer.draw();
}

/**
 * Apply the changes made on the selection anchors to the model object (the resource)
 * using mediators. 
 */
MetaGraphicController.prototype.saveAnchorModification = function()
{
	//This function only works with one element
	if( this.selectionIndicatedResources.length != 1 )
	{
		console.log( "Graphic error, this application can only resize one element per time" );
		return;
	}
	
	var topLeft = this.anchorShapes[ metaGraphicGlobals.TL ];
	var topRight = this.anchorShapes[ metaGraphicGlobals.TR ];
	var bottomRight = this.anchorShapes[ metaGraphicGlobals.BR ];
	var bottomLeft = this.anchorShapes[ metaGraphicGlobals.BL ];
	var newX = topLeft.getX();
	var newY = topLeft.getY();
	var newWidth = topRight.getX() - topLeft.getX();
	var newHeight = bottomLeft.getY() - topLeft.getY();
	
	// the width and the height can't be negative here
	if( newWidth < 0 )
	{
		newX = newX+newWidth;
		newWidth = -1*newWidth;
	}
	if( newHeight < 0 )
	{
		newY = newY+newHeight;
		newHeight = -1*newHeight;
	}
	
	if( newWidth < 20 ) newWidth = 20;
	if( newHeight < 20 ) newHeight = 20;
	
	globalMediators.internalMediator.publish( 'ResizeInterfaceResource', 
		[ this.selectionIndicatedResources[0],
			 newX, newY, newWidth, newHeight ]);
}

/**
 * Create an anchor in a specific position.
 * Also it attach events to this anchor.
 *  
 * @param {int} x - X position.
 * @param {int} y - Y position.
 * @param {int} index - This number indicates which anchor should be created (top-left, bottom-right, etc...).
 */
MetaGraphicController.prototype.createAnchor = function(x, y, index) 
{
	var anchor = new Kinetic.Circle({
		x : x,
		y : y,
		stroke : '#666',
		fill : '#ddd',
		strokeWidth : 2,
		radius : 8,
		name : name,
		draggable : true,
		dragOnTop : false
	});
	
	// to avoid to create a closure, throw the metaGraphicController inside of a new variable
	var controller = this;
	
	anchor.on('dragmove', function() {
       controller.updateAnchors(index);
    });
    
	anchor.on('dragend', function() {
		controller.saveAnchorModification();	
    });
    
	anchor.on('mouseover', function() {
	  document.body.style.cursor = 'pointer';
	  this.setStrokeWidth(4);
	  controller.layer.draw();
	});
	
	anchor.on('mouseout', function() {
	  document.body.style.cursor = 'default';
	  this.setStrokeWidth(2);
	  controller.layer.draw();
	});

	this.anchorShapes[index] = anchor;

	this.layer.add(anchor);

}

/**
 * This function creation 4 anchors to a given resource.
 * 
 * @param {InterfaceResource} interfaceResource - A interface resource.
 */
MetaGraphicController.prototype.createSelectionAnchors = function( interfaceResource ) 
{
	if (this.selectionKineticShapes.length != 1) {
		console.error("Only one object can have an active selection");
	}

	var x = interfaceResource.getX();
	var y = interfaceResource.getY();
	var width = interfaceResource.getWidth();
	var height = interfaceResource.getHeight();
	this.createAnchor(x, y, metaGraphicGlobals.TL);
	this.createAnchor(x + width, y, metaGraphicGlobals.TR);
	this.createAnchor(x, y + height, metaGraphicGlobals.BL);
	this.createAnchor(x + width, y + height, metaGraphicGlobals.BR);

	this.layer.draw();
}

/**
 * Fix all anchor's positions to keep the selection rectangle consistent.
 *  
 * @param {int} anchorIndex - A number that indicates which anchor will be used as base.
 */
MetaGraphicController.prototype.updateAnchors = function( anchorIndex  )
{
	var activeAnchor = this.anchorShapes[ anchorIndex ];
	var anchorX = activeAnchor.getX();
	var anchorY = activeAnchor.getY();

	var topLeft = this.anchorShapes[ metaGraphicGlobals.TL ];
	var topRight = this.anchorShapes[ metaGraphicGlobals.TR ];
	var bottomRight = this.anchorShapes[ metaGraphicGlobals.BR ];
	var bottomLeft = this.anchorShapes[ metaGraphicGlobals.BL ];
	
	switch( anchorIndex )
	{
	  case ( metaGraphicGlobals.TL ):
	  {
            topRight.setY(anchorY);
            bottomLeft.setX(anchorX);
            break;
	  }
      case ( metaGraphicGlobals.TR ):
            topLeft.setY(anchorY);
            bottomRight.setX(anchorX);
            break;
      case ( metaGraphicGlobals.BR ):
	  {
            bottomLeft.setY(anchorY);
            topRight.setX(anchorX); 
            break;
	  }
	  case ( metaGraphicGlobals.BL ):
	  {
            bottomRight.setY(anchorY);
            topLeft.setX(anchorX); 
            break;
	  }
	  default:
	  {
		  console.error("Invalid type of anchor while resizing element");
		  return;
	  }
	}

	var newX = topLeft.getX();
	var newY = topLeft.getY();
	var newWidth = topRight.getX() - topLeft.getX();
	var newHeight = bottomLeft.getY() - topLeft.getY();

	// Updating selection indicator size
	if( this.selectionKineticShapes.length != 1 )
	{
		console.error("Graphic error while reszing object");
	}
	else
	{
		var selectionRect = this.selectionKineticShapes[ 0 ];
		selectionRect.setX( newX );
		selectionRect.setY( newY );
		selectionRect.setWidth( newWidth );
		selectionRect.setHeight( newHeight );
	}

	this.layer.draw();
}

/**
 * Make the selection graphic consistent with changes on the given resource.
 * 
 * @param {InterfaceResource} interfaceResource - A resource with some change, it must be a selected element.
 */
MetaGraphicController.prototype.fixSelectionKineticShape = function( interfaceResource )
{
	if( this.selectionKineticShapes.length != 1 )
	{
		console.error("Graphic error while reszing object");
	}
	else
	{
		this.removeAnchors();
		this.removeSelectionKineticRect( interfaceResource );
		this.createSelectionCountour( interfaceResource );
		this.createSelectionAnchors( interfaceResource );
	}
}

/******** Internal Mediator functions **********/

/**
 * EventKey: ResourceSelected.
 * Sent when a group of resources are selected on the canvas.
 *
 * @param {Array} resourceArray - An array with the selected elements
 */
MetaGraphicController.prototype.onResourceSelected = function( resourceArray )
{
	if( resourceArray.length == 1 )
	{
		this.createSelectionCountour( resourceArray[0] );
		this.createSelectionAnchors( resourceArray[0] );
	}
	else if( resourceArray.length > 0 )
	{
		alert("Multiple selection isn't working");
	}
}

/**
 * EventKey: ResourceSelectCanceled.
 * Sent when a group of selected resources are unselected.
 *
 * @param {Array} resourceArray - An array with the unselected elements
 */
MetaGraphicController.prototype.onResourceSelectCanceled = function( resourceArray )
{
	var i;
	for( i = 0; i < resourceArray.length; i++ )
	{
		this.removeSelectionKineticRect( resourceArray[i] );
	}
	this.removeAnchors();
}

/**
 * EventKey: InterfaceResourceMoved.
 * Sent when a interface resource is moved
 *
 * @param {InterfaceResource} interfaceResource - The object that contains the data from an interface resource.
 * @param {int} oldX - The last X position from the resource.
 * @param {int} oldY - The last Y position from the resource.
 */
MetaGraphicController.prototype.onInterfaceResourceMoved = function( interfaceResource, oldX, oldY )
{
	var kineticShapeIndex = this.getSelectionKineticRectIndex( interfaceResource );
	if( this.getSelectionKineticRectIndex( interfaceResource ) != -1 )
	{
		this.fixSelectionKineticShape( interfaceResource );
	}
}

/**
 * EventKey: InterfaceResourceResized.
 * Sent when a interface resource is resized
 *
 * @param {InterfaceResource} interfaceResource - The object that contains the data from an interface resource.
 * @param {int} oldX - The old X position from the resource.
 * @param {int} oldY - The old Y position from the resource.
 * @param {int} oldWidth - old resource width.
 * @param {int} oldHeight - old resource height.
 */
MetaGraphicController.prototype.onInterfaceResourceResized = function( interfaceResource, oldX, oldY, oldWidth, oldHeight )
{
	var kineticShapeIndex = this.getSelectionKineticRectIndex( interfaceResource );
	if( this.getSelectionKineticRectIndex( interfaceResource ) != -1 )
	{
		this.fixSelectionKineticShape( interfaceResource );
	}
}
