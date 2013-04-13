var basicCommandsGlobals = {};

basicCommandsGlobals.commandTypeEnum = { CMD_UNDEFINED: -1, CMD_DRAG: 0, CMD_KINETIC_DRAG: 1, CMD_RENAME_RES: 2 };
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


function KineticDragCommand( executionMode, resourceObj, kineticObj, toX, toY )
{
	Command.call(this);
	this.commandCode = basicCommandsGlobals.commandTypeEnum.CMD_KINETIC_DRAG;
	this.executionMode = executionMode;
	this.setArgs( 
		{
			resource : resourceObj,
			kineticShape: kineticObj,
			x : toX,
			y : toY
		}
	);
}
KineticDragCommand.prototype = new Command;
KineticDragCommand.prototype.constructor = KineticDragCommand;

KineticDragCommand.prototype.toString = function()
{
	var interfaceResource = this.argObject.resource;
	var kineticShape = this.argObject.kineticShape;
	var x = this.argObject.x;
	var y = this.argObject.y;
	return 		"Kinetic Shape Drag  " + Command.prototype.toString.call( this ) + "\n" +
		"Parameters:\n" +  interfaceResource.toString() + "\n" +
		kineticShape.toString() + "\n" +
		"x: " + x + ",y: " + y;
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
DragResourceCommand.prototype.constructor = DragResourceCommand;

DragResourceCommand.prototype.toString = function()
{
	var interfaceResource = this.argObject.resource;
	var x = this.argObject.x;
	var y = this.argObject.y;
	return 		"Drag Resource " + Command.prototype.toString.call( this ) + "\n" +
		"Parameters:\n" +  interfaceResource.toString() + "\n" +
		"x: " + x + ",y: " + y;

}

function RenameResourceCommand( executionMode, resourceObj, newNameStr )
{
	Command.call(this);
	this.commandCode = basicCommandsGlobals.commandTypeEnum.CMD_RENAME_RES;
	this.executionMode = executionMode;
	this.setArgs(
		{
			resource : resourceObj,
			newName: newNameStr,
		}
	);
}
RenameResourceCommand.prototype = new Command;
RenameResourceCommand.prototype.constructor = RenameResourceCommand;
RenameResourceCommand.prototype.toString = function()
{
	var interfaceResource = this.argObject.resource;
	var newName = this.argObject.newName;
	return 		"Rename Resource " + Command.prototype.toString.call( this ) + "\n" +
		"Parameters:\n" +  interfaceResource.toString() + "\n" +
		"newName: " + newName;

}

/****** command factory test *********/
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


/**/
var kineticDragFunctions = new Array();
kineticDragFunctions[basicCommandsGlobals.executionTypeEnum.CMEX_EDITION] = function( commandObject )
{
	// Model handling
	var interfaceResource = commandObject.argObject.resource;
	var x = commandObject.argObject.x;
	var y = commandObject.argObject.y;
	interfaceResource.setX( x );
	interfaceResource.setY( y );
	
	// Graphic handling
	var kineticShape = commandObject.argObject.kineticShape;
	kineticShape.setX( x );
	kineticShape.setY( y );
	if( kineticShape.getLayer() != null )
	{
		kineticShape.getLayer().draw();
	}
}

var kineticDragUndoFunctions = new Array();
kineticDragUndoFunctions[basicCommandsGlobals.executionTypeEnum.CMEX_EDITION] = function( commandObject )
{
	var interfaceResource = commandObject.argObject.resource;
	var kineticShape = commandObject.argObject.kineticShape;
	var x = interfaceResource.getX();
	var y = interfaceResource.getY();
	return new KineticDragCommand( basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, interfaceResource, kineticShape, x, y );
}

/**/
var renameResourceFunctions= new Array();
renameResourceFunctions[basicCommandsGlobals.executionTypeEnum.CMEX_EDITION] = function( commandObject )
{
	// Model handling
	var interfaceResource = commandObject.argObject.resource;
	var newName = commandObject.argObject.newName;
	interfaceResource.setName( newName );
	globalMediators.graphicMediator.publish( "ResourceNameChanged", [ interfaceResource, newName ] );
}

var renameResourceUndoFunctions = new Array();
renameResourceUndoFunctions[basicCommandsGlobals.executionTypeEnum.CMEX_EDITION] = function( commandObject )
{
	var interfaceResource = commandObject.argObject.resource;
	var oldName = interfaceResource.getName();
	return new RenameResourceCommand( basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, interfaceResource, oldName );
}

function CommandFunctionFactory()
{
	this.commandMatrix = new Array();
	this.commandMatrix[basicCommandsGlobals.commandTypeEnum.CMD_DRAG] = dragResourceFunctions;
	this.commandMatrix[basicCommandsGlobals.commandTypeEnum.CMD_KINETIC_DRAG] = kineticDragFunctions;
	this.commandMatrix[basicCommandsGlobals.commandTypeEnum.CMD_RENAME_RES] = renameResourceFunctions;
	
	this.undoMatrix = new Array();
	this.undoMatrix[basicCommandsGlobals.commandTypeEnum.CMD_DRAG] = dragResourceUndoFunctions;
	this.undoMatrix[basicCommandsGlobals.commandTypeEnum.CMD_KINETIC_DRAG] = kineticDragUndoFunctions;
	this.undoMatrix[basicCommandsGlobals.commandTypeEnum.CMD_RENAME_RES] = renameResourceUndoFunctions;
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
