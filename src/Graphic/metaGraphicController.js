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
	this.anchorShapes = [];	
	

}

MetaGraphicController.prototype.constructor = MetaGraphicController;

MetaGraphicController.prototype.generatePrefix = function( idNum )
{
	return metaGraphicGlobals.idPrefix+idNum;
}


MetaGraphicController.prototype.createSelectionCountour = function( interfaceResource ) 
{

	var rect = new Kinetic.Rect({
		x : interfaceResource.getX(),
		y : interfaceResource.getY(),
		width : interfaceResource.getWidth(),
		height : interfaceResource.getHeight(),
		stroke : 'red',
		fill: 'white',
		draggable: false,
		dragOnTop: false,
		id : this.generatePrefix(interfaceResource.getId()),
		strokeWidth : 6
	});
	
	rect.disableFill();
	
	this.selectionKineticShapes.push( rect );
	
	
	this.layer.add( rect );
	this.layer.draw();
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
	this.createAnchor(x, y, MetaGraphicGlobals.TL);
	this.createAnchor(x + width, y, MetaGraphicGlobals.TR);
	this.createAnchor(x, y + height, MetaGraphicGlobals.BL);
	this.createAnchor(x + width, y + height, MetaGraphicGlobals.BR);

	//TODO: Add events here

	this.layer.draw();
}


MetaGraphicController.prototype.updateAnchors = function( anchorIndex  )
{
	var activeAnchor = this.anchorShapes[ anchorIndex ];
	var anchorX = activeAnchor.getX();
	var anchorY = activeAnchor.getY();

        var topLeft = this.anchorShapes[ MetaGraphicGlobals.TL ];
        var topRight = this.anchorShapes[ MetaGraphicGlobals.TR ];
        var bottomRight = this.anchorShapes[ MetaGraphicGlobals.BR ];
        var bottomLeft = this.anchorShapes[ MetaGraphicGlobals.BL ];
	

	switch( anchorIndex )
	{
	  case ( MetaGraphicGlobals.TL ):
	  {
            topRight.setY(anchorY);
            bottomLeft.setX(anchorX);
            break;
	  }
          case ( MetaGraphicGlobals.TR ):
            topLeft.setY(anchorY);
            bottomRight.setX(anchorX);
            break;
          case ( MetaGraphicGlobals.BR ):
	  {
            bottomLeft.setY(anchorY);
            topRight.setX(anchorX); 
            break;
	  }
	  case ( MetaGraphicGlobals.BL ):
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

	//TODO: Make the graphicController resize the selectedShape with these parameters
	//TODO: Update contour size

	this.layer.draw();
}

/******** Internal Mediator functions **********/

MetaGraphicController.prototype.onResourceSelected = function( resourceArray )
{
	if( resourceArray.length == 1 )
	{
		this.createSelectionCountour( resourceArray[0] );
	}
	else if( resourceArray.length > 0 )
	{
		alert("Multiple selection isn't working");
	}
}

MetaGraphicController.prototype.onResourceSelectCanceled = function( resourceArray )
{
}
