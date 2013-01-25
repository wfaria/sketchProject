// TODO: Maybe create a matrix using these numbers as index
var commandTypeEnum = { CMD_UNDEFINED: -1, CMD_DRAG: 0 };
var executionTypeEnum = { CMEX_UNDEFINED: -1, CMEX_EDITION: 0, CMEX_SIMULATION: 1 };

function Command()
{
	this.argObject = null;
	this.commandCode = commandTypeEnum.CMD_UNDEFINED;
	this.executionMode = executionTypeEnum.CMEX_UNDEFINED;
}
Command.prototype.constructor = Command;

Command.prototype.getCode = function()
{
	return this.commandCode;
}

Command.prototype.getMode = function()
{
	return this.executionMode;
}

Command.prototype.setArgs = function( objects )
{
	this.argObject = objects;
}

Command.prototype.toString = function()
{
	return "Command code: " + this.commandCode  + ", mode: " + this.executionMode;
}

function DragResourceCommand( executionMode, resourceObj, toX, toY )
{
	Command.call(this);
	this.commandCode = commandTypeEnum.CMD_DRAG;
	this.executionMode =  executionTypeEnum.CMEX_EDITION;
	this.setArgs( 
		{
			resource : resourceObj,
			x : toX,
			y : toY
		}
	);
}
DragResourceCommand.prototype = new Command;
DragResourceCommand.prototype.constructor = Command;

DragResourceCommand.prototype.toString = function()
{
	var interfaceResource = this.argObject.resource;
	var x = this.argObject.x;
	var y = this.argObject.y;
	return 		"Drag Resource " + Command.prototype.toString.call( this ) + "\n" +
		"Parameters:\n" +  interfaceResource.toString() + "\n" +
		"x: " + x + ",y: " + y;

}


function ActionController()
{
	this.undoStack = new Stack();
	this.doStack = new Stack();
}

ActionController.prototype.generateUndoCommmand = function( commandObject )
{
	var undoObject = undoFactory( commandObject )
	return undoObject;
}

ActionController.prototype.pushUndoCommand = function( undoCommandObject )
{
	this.undoStack.push( undoCommandObject );
}

ActionController.prototype.doCommand = function( commandObject )
{
	if( commandObject == null ) return false;
	var undoCommand  =  this.generateUndoCommmand( commandObject );
	if( undoCommand != null )
	{
		this.pushUndoCommand( undoCommand );
	}
	commandFactory( commandObject );
	return true;
}

ActionController.prototype.undo = function()
{
	if( !this.undoStack.isEmpty() )
	{
		var undoObject = this.undoStack.pop();
		commandFactory( undoObject ); //TODO: Throw command to the redo stack
		return undoObject;
	}
	else
	{
		return null;
	}
}

/****** command factyory test *********/
var dragResourceFunctions = new Array();
dragResourceFunctions[executionTypeEnum.CMEX_EDITION] = function( commandObject )
{
	var interfaceResource = commandObject.argObject.resource;
	var x = commandObject.argObject.x;
	var y = commandObject.argObject.y;
	interfaceResource.setX(x);
	interfaceResource.setY(y);
}

var dragResourceUndoFunctions = new Array();
dragResourceUndoFunctions[executionTypeEnum.CMEX_EDITION] = function( commandObject )
{
	var interfaceResource = commandObject.argObject.resource;
	var x = interfaceResource.getX();
	var y = interfaceResource.getY();
	return new DragResourceCommand( executionTypeEnum.CMEX_EDITION, interfaceResource, x, y );
}

function CommandFunctionFactory()
{
	this.commandMatrix = new Array();
	this.commandMatrix[commandTypeEnum.CMD_DRAG] = dragResourceFunctions;
	
	this.undoMatrix = new Array();
	this.undoMatrix[commandTypeEnum.CMD_DRAG] = dragResourceUndoFunctions;
}

function dragCommandFactory( commandObject )
{
	//TODO: Acho que não é garantido que o objeto sempre será este, tentar pegá-lo pelo ID sempre
	var interfaceResource = commandObject.argObject.resource;
	var x = commandObject.argObject.x;
	var y = commandObject.argObject.y;
	
	switch( commandObject.getMode() )
	{
		case( executionTypeEnum.CMEX_EDITION ):
		{
			interfaceResource.setX(x);
			interfaceResource.setY(y);
		};
		
		default:
		{
			/* nothing to do */
		};
	}
}

function undoFactory( commandObject )
{
	var code = commandObject.getCode();
	var mode = commandObject.getMode();
	var functionFactory = new CommandFunctionFactory();
	if( typeof functionFactory.undoMatrix[code] != 'undefined' )
	{
		if( typeof functionFactory.undoMatrix[code][mode] != 'undefined' )
		{
			return functionFactory.undoMatrix[code][mode]( commandObject );
		}
	}
}

function commandFactory( commandObject )
{
	var code = commandObject.getCode();
	var mode = commandObject.getMode();
	var functionFactory = new CommandFunctionFactory();
	if( typeof functionFactory.commandMatrix[code] != 'undefined' )
	{
		if( typeof functionFactory.commandMatrix[code][mode] != 'undefined' )
		{
			functionFactory.commandMatrix[code][mode]( commandObject );
			return true;
		}
	}
	return false;
	/*var code = commandObject.getCode();
	var mode = commandObject.getMode();
	switch( code )
	{
		case( commandTypeEnum.CMD_DRAG ):
		{
			dragCommandFactory( commandObject );
		};
		default:
		{
			
		}
	}*/
}
