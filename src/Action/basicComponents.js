var EventManagerGlobals = {};

function EventManager( baseObject )
{
	this.id = 0;
	this.base = baseObject;
	this.funcArray = new Array();
}

EventManager.prototype.constructor = EventManager;

EventManager.prototype.addFunction = function ( funcKey, funcImp )
{
	this.funcArray[ funcKey ] = funcImp;
}

EventManager.prototype.callFunction = function( funcKey, funcParams )
{
	this.funcArray[funcKey].apply( this.base, funcParams );
} 

EventManager.prototype.getBaseObject = function( )
{
	return this.base;
} 

EventManager.prototype.getId = function( )
{
	return this.id;
} 

/*******************************************************/

function EventManagerKineticPrepare( eventManagerObject, kineticShape )
{
	eventManagerObject.on("dragmove", function() {
				shapeEventManager.callFunction( "dragmove", [] );
            });
    // TODO: Define how the EventManagers function will work and finish this function
}

/*********************************************************/

/* GenericKineticEventManager EventManager */
function mouseDown( evt , kineticShape )
{
	window.status = "Click over " + this.interfaceResource.getName() ;
	globalMediators.graphicMediator.publish( "ResourceClicked", [ evt,this.interfaceResource ] );
	//globalMediators.graphicMediator.publish( "kineticClick", [this.kineticShape, this.interfaceResource] );
}

function mouseOver() 
{
	document.body.style.cursor = "pointer";
}

function mouseOut() 
{
	document.body.style.cursor = "default";
}

function dragMove() 
{
     document.body.style.cursor = "pointer";
};

function dragEnd( evt, kineticShape ) 
{
	globalMediators.graphicMediator.publish( "EditorDragEnd", [evt,this.interfaceResource,kineticShape] );
    document.body.style.cursor = "default";
};

function dblClick( evt )
{
   	globalMediators.internalMediator.publish( "RenameElement", [ this.interfaceResource, "lol" ] );
}

/*********************************************************/
/* canvas events */
function canvasClick( evt , kineticShape )
{

}

function canvasMouseOver() 
{
}

function canvasMouseOut() 
{
}

function canvasDragMove() 
{
};

function canvasDragEnd( evt, kineticShape ) 
{
};

function canvasDblClick( evt )
{

}

function bindGenericEventManager( kineticShape, EventManagerObj )
{
	kineticShape.on( "mousedown",
		function( evt )
		{
			EventManagerObj.callFunction( "mousedown", [ evt,kineticShape ] );
		}
	);
	kineticShape.on( "dragmove",
		function( evt )
		{
			EventManagerObj.callFunction( "dragmove", [] );
		}
	);
	
	kineticShape.on( "mouseover",
		function( evt )
		{
			EventManagerObj.callFunction( "mouseover", [] );
		}
	);
	
	kineticShape.on( "mouseout",
		function( evt )
		{
			EventManagerObj.callFunction( "mouseout", [] );
		}
	);
	
	kineticShape.on( "dblclick",
		function( evt )
		{
			EventManagerObj.callFunction( "dblclick", [evt] );
		}
	);
	
	kineticShape.on( "dragend",
		function( evt )
		{
			EventManagerObj.callFunction( "dragend", [evt, kineticShape] );
		}
	);
}

/**
 * Create a generic EventManager for a simple Kinetic shape.
 * This kinetic shape must be a simple image or a draggable kinetic group.
 * This function will associate the EventManager functions with the kinetic events automatically.
 *
 * @param {?} baseObj - A specific object that will be used as the function caller.
 */
function GenericKineticEventManager( baseObj )
{
	EventManager.call( this , baseObj );
	this.addFunction( "dragmove", dragMove );
	this.addFunction( "dragend", dragEnd );
	this.addFunction( "dblclick", dblClick );
	this.addFunction( "mousedown", mouseDown );
	this.addFunction( "mouseover", mouseOver );
	this.addFunction( "mouseout", mouseOut );
	this.id = baseObj.interfaceResource.getId();
	bindGenericEventManager( baseObj.kineticShape, this );
}

GenericKineticEventManager.prototype = new EventManager;
GenericKineticEventManager.prototype.constructor = GenericKineticEventManager;


/**
 * Create a EventManager for the Kinetic stage.
 * This kinetic shape must be a simple image or a draggable kinetic group.
 * This function will associate the EventManager functions with the kinetic events automatically.
 *
 * @param {?} baseObj - A specific object that will be used as the function caller.
 */
/*
function GenericKineticEventManager( baseObj )
{
	EventManager.call( this , baseObj );
	this.addFunction( "dragmove", dragMove );
	this.addFunction( "dragend", dragEnd );
	this.addFunction( "dblclick", dblClick );
	this.addFunction( "click", click );
	this.addFunction( "mouseover", mouseOver );
	this.addFunction( "mouseout", mouseOut );
	
	bindGenericEventManager( baseObj.kineticShape, this );
}

GenericKineticEventManager.prototype = new EventManager;
GenericKineticEventManager.prototype.constructor = GenericKineticEventManager;

*/