var basicCommandsGlobals = {};

basicCommandsGlobals.commandTypeEnum = { CMD_UNDEFINED: -1, CMD_DRAG: 0 };
basicCommandsGlobals.executionTypeEnum = { CMEX_UNDEFINED: -1, CMEX_EDITION: 0, CMEX_SIMULATION: 1 };

function Command()
{
	this.argObject = null;
	this.commandCode = basicCommandsGlobals.commandTypeEnum.CMD_UNDEFINED;
	this.executionMode = basicCommandsGlobals.executionTypeEnum.CMEX_UNDEFINED;
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
	this.commandCode = basicCommandsGlobals.commandTypeEnum.CMD_DRAG;
	this.executionMode =  basicCommandsGlobals.executionTypeEnum.CMEX_EDITION;
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

/****** command factyory test *********/
var dragResourceFunctions = new Array();
dragResourceFunctions[basicCommandsGlobals.executionTypeEnum.CMEX_EDITION] = function( commandObject )
{
	var interfaceResource = commandObject.argObject.resource;
	var x = commandObject.argObject.x;
	var y = commandObject.argObject.y;
	interfaceResource.setX(x);
	interfaceResource.setY(y);
}

var dragResourceUndoFunctions = new Array();
dragResourceUndoFunctions[basicCommandsGlobals.executionTypeEnum.CMEX_EDITION] = function( commandObject )
{
	var interfaceResource = commandObject.argObject.resource;
	var x = interfaceResource.getX();
	var y = interfaceResource.getY();
	return new DragResourceCommand( basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, interfaceResource, x, y );
}

function CommandFunctionFactory()
{
	this.commandMatrix = new Array();
	this.commandMatrix[basicCommandsGlobals.commandTypeEnum.CMD_DRAG] = dragResourceFunctions;
	
	this.undoMatrix = new Array();
	this.undoMatrix[basicCommandsGlobals.commandTypeEnum.CMD_DRAG] = dragResourceUndoFunctions;
}

// This one creates a command to be executed
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
	return null;
}

// This one executes a command
function commandDigest( commandObject )
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
}
