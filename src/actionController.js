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

function ActionController()
{
	this.undoStack = new Stack();
	this.doStack = new Stack();
}

ActionController.prototype.generateUndoCommmand = function( commandObject )
{
	// TODO:
	return null;
}

ActionController.prototype.pushUndoCommand = function( undoCommandObject )
{
	undoStack.push( undoCommandObject );
}

ActionController.prototype.doCommand = function( commandObject )
{
	var undoCommand  =  this.generateUndoCommmand( commandObject );
	commandFactory( commandObject );
	return true;
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


function CommandFunctionFactory()
{
	this.commandMatrix = new Array();
	this.commandMatrix[commandTypeEnum.CMD_DRAG] = dragResourceFunctions;
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
		}
	}
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
