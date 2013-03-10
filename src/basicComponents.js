function Component( baseObject, bindingFunction )
{
	this.bindingFunc = bindingFunction;
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

/***********************************************************/

/* GenericKineticComponent component */
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
	alert( this.i++ );
    layer.draw();
}

function bindGenericComponent( kineticShape, componentObj )
{
	kineticShape.on( "dragmove",
		function( evt )
		{
			componentObj.callFunction( "dragmove", [] );
		}
	);
	
	kineticShape.on( "mouseover",
		function( evt )
		{
			componentObj.callFunction( "mouseOver", [] );
		}
	);
	
	kineticShape.on( "dragmove",
		function( evt )
		{
			componentObj.callFunction( "dragMove", [] );
		}
	);
	
	kineticShape.on( "dblclick",
		function( evt )
		{
			componentObj.callFunction( "dblClick", [kineticShape] );
		}
	);
}

function GenericKineticComponent( baseObj )
{
	var baseObj = { i :137, count : "a" };
	Component.call( this , baseObj, bindGenericComponent );
	this.addFunction( "dragmove", dragMove );
	this.addFunction( "dblclick", dblclick );
}