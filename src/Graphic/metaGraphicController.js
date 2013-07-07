//http://www.html5canvastutorials.com/labs/html5-canvas-drag-and-drop-resize-and-invert-images/

var metaGraphicGlobals = {};
metaGraphicGlobals.idPrefix = "_MT_" ;
metaGraphicGlobals.TR = 0;
metaGraphicGlobals.TL = 1;
metaGraphicGlobals.BL = 2;
metaGraphicGlobals.BR = 3;

function MetaGraphicController( l )
{
	this.layer = l;
	this.selectionKineticShapes = [];
	this.selectionIndicatedResources = [];
	this.anchorShapes = [];	
}

MetaGraphicController.prototype.constructor = MetaGraphicController;

MetaGraphicController.prototype.generatePrefix = function( idNum )
{
	return metaGraphicGlobals.idPrefix+idNum;
}

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

MetaGraphicController.prototype.getSelectionKineticRectIndex = function( interfaceResource ) 
{
	var idStr = this.generatePrefix(interfaceResource.getId());
	var i = 0;
	var length = this.selectionKineticShapes.length;
	
	for( i = 0; i < length; i++ )
	{
		if( this.selectionKineticShapes[i].getId() == this.generatePrefix(interfaceResource.getId()) )
		{
			return i;
		}
	}
	
	return -1;
}

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
		id : this.generatePrefix(interfaceResource.getId()),
		strokeWidth : 4
	});
	
	rect.disableFill();
	
	this.selectionKineticShapes.push( rect );
	this.selectionIndicatedResources.push( interfaceResource );
	
	this.layer.add( rect );
	this.layer.draw();
}

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



MetaGraphicController.prototype.createSelectionAnchors = function(interfaceResource) 
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

MetaGraphicController.prototype.onResourceSelectCanceled = function( resourceArray )
{
	var i;
	for( i = 0; i < resourceArray.length; i++ )
	{
		this.removeSelectionKineticRect( resourceArray[i] );
	}
	this.removeAnchors();
}


MetaGraphicController.prototype.onInterfaceResourceMoved = function( interfaceResource, oldX, oldY )
{
	var kineticShapeIndex = this.getSelectionKineticRectIndex( interfaceResource );
	if( this.getSelectionKineticRectIndex( interfaceResource ) != -1 )
	{
		this.fixSelectionKineticShape( interfaceResource );
	}
}


MetaGraphicController.prototype.onInterfaceResourceResized = function( interfaceResource, oldX, oldY, oldWidth, oldHeight )
{
	var kineticShapeIndex = this.getSelectionKineticRectIndex( interfaceResource );
	if( this.getSelectionKineticRectIndex( interfaceResource ) != -1 )
	{
		this.fixSelectionKineticShape( interfaceResource );
	}
}
