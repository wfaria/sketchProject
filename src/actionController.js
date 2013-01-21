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
	commandFactory( commandObject );
	var undoCommand  =  this.generateUndoCommmand( commandObject );
	return true;
}


/****** command factyory test *********/

function commandFactorrry()
{
	var commandMatrix = new Array();
	
	commandObject[CMD_DRAG] = new Array();
	
	commandObject[CMD_DRAG][CMEX_EDITION] = function( commandObject )
	{
		//TODO
	}
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
						alert("bleh");
			/* nothing to do */
		};
	}
}

function commandFactory( commandObject )
{
	var code = commandObject.getCode();
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
	}
}
