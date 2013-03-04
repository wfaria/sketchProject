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

function componentKineticAssembler( componentObject, kineticShape )
{
	componentObject.on("dragmove", function() {
				shapeComponent.callFunction( "dragmove", [] );
            });
    // TODO: Define how the components function will work and finish this function
}
