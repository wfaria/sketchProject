function Component( baseObject )
{
	this.base = baseObject;
	this.funcArray = new Array();
}

Component.prototype.constructor = Component;

Component.prototype.addFunction = function ( funcKey, funcImp )
{
	this.funcArray[ funcKey ] = funcImp;
}

Component.prototype.callFunction = function( funcKey, funcParams )
{
	this.funcArray[funcKey].apply( this.base, funcParams );
} 

/*******************************************************/

function componentKineticPrepare( componentObject, kineticShape )
{
	componentObject.on("dragmove", function() {
				shapeComponent.callFunction( "dragmove", [] );
            });
    // TODO: Define how the components function will work and finish this function
}

/*********************************************************/

/* GenericKineticComponent component */
function click()
{
	alert("plim " + this.interfaceResource.getName() );
	generalGlobals.manager.graphicMediator.publish( "kineticClick", [this.kineticShape, this.interfaceResource] );
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

function dblClick( kineticShape )
{
	var layer = kineticShape.getLayer();
	kineticShape.remove();
    layer.draw();
}

function bindGenericComponent( kineticShape, componentObj )
{
	kineticShape.on( "click",
		function( evt )
		{
			componentObj.callFunction( "click", [] );
		}
	);
	kineticShape.on( "dragmove",
		function( evt )
		{
			componentObj.callFunction( "dragmove", [] );
		}
	);
	
	kineticShape.on( "mouseover",
		function( evt )
		{
			componentObj.callFunction( "mouseover", [] );
		}
	);
	
	kineticShape.on( "mouseout",
		function( evt )
		{
			componentObj.callFunction( "mouseout", [] );
		}
	);
	
	kineticShape.on( "dblclick",
		function( evt )
		{
			componentObj.callFunction( "dblclick", [kineticShape] );
		}
	);
}

/**
 * Create a generic component for a simple Kinetic shape.
 * This kinetic shape must be a simple image or a draggable kinetic group.
 * This function will associate the component functions with the kinetic events automatically.
 *
 * @param {?} baseObj - A specific object that will be used as the function caller.
 */
function GenericKineticComponent( baseObj )
{
	Component.call( this , baseObj );
	this.addFunction( "dragmove", dragMove );
	this.addFunction( "dblclick", dblClick );
	this.addFunction( "click", click );
	this.addFunction( "mouseover", mouseOver );
	this.addFunction( "mouseout", mouseOut );
	
	bindGenericComponent( baseObj.kineticShape, this );
}

GenericKineticComponent.prototype = new Component;
GenericKineticComponent.prototype.constructor = GenericKineticComponent;