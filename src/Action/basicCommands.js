var basicCommandsGlobals = {};

basicCommandsGlobals.commandTypeEnum = { CMD_UNDEFINED: -1, CMD_DRAG: 0, 
	CMD_KINETIC_DRAG: 1, CMD_RENAME_RES: 2, CMD_SELECT_RES: 3, CMD_CANC_SELECT_RES: 4,
	CMD_CREATE_RES: 5, CMD_DELETE_RES: 6, CMD_RESTORE_RES: 7, CMD_GROUP_EXEC: 8,
	CMD_RESIZE_RES: 9 };
basicCommandsGlobals.executionTypeEnum = { CMEX_UNDEFINED: -1, CMEX_EDITION: 0, CMEX_SIMULATION: 1 };

function Command()
{
	this.argObject = null;
	this.commandCode = basicCommandsGlobals.commandTypeEnum.CMD_UNDEFINED;
	this.executionMode = basicCommandsGlobals.executionTypeEnum.CMEX_UNDEFINED;
}
Command.prototype.constructor = Command;

Command.prototype.execute = function( commandObject )
{
	console.error( "This command object does not have an execute function:\n" +
	 commandObject.toString() );
}

Command.prototype.undo = function( commandObject )
{
	console.error( "This command object does not have an undo function:\n" +
	 commandObject.toString() );
}

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

function SelectResourceCommand( executionMode, resourceObjArray, isAdditive, selectManager )
{
	Command.call(this);
	this.commandCode = basicCommandsGlobals.commandTypeEnum.CMD_SELECT_RES;
	this.executionMode = executionMode;
	this.setArgs(
		{
			resourceArrays : resourceObjArray,
			isAdditiveSelection: isAdditive,
			selectionManager: selectManager
		}
	);
}
SelectResourceCommand.prototype = new Command;
SelectResourceCommand.prototype.constructor = SelectResourceCommand;
SelectResourceCommand.prototype.toString = function()
{
	var resourceArrays = this.argObject.resourceArrays;
	var isAdditiveSelection = this.argObject.isAdditiveSelection;
	var selectionManager = this.argObject.selectionManager;
	return 		"Select Resource " + Command.prototype.toString.call( this ) + "\n" +
		"Parameters:\n" +  resourceArrays.toString() + "\n" +
		"is this selection additive: " + isAdditiveSelection + "\n" +
		"selection Manager: " + selectionManager.toString() ;
}

function CancelSelectResourceCommand( executionMode, resourceObjArray, isAdditive, selectManager )
{
	Command.call(this);
	this.commandCode = basicCommandsGlobals.commandTypeEnum.CMD_CANC_SELECT_RES;
	this.executionMode = executionMode;
	this.setArgs(
		{
			resourceArrays : resourceObjArray,
			isAdditiveSelection: isAdditive,
			selectionManager: selectManager
		}
	);
}
CancelSelectResourceCommand.prototype = new Command;
CancelSelectResourceCommand.prototype.constructor = CancelSelectResourceCommand;
CancelSelectResourceCommand.prototype.toString = function()
{
	var resourceArrays = this.argObject.resourceArrays;
	var isAdditiveSelection = this.argObject.isAdditiveSelection;
	var selectionManager = this.argObject.selectionManager;
	return 		"Cancel Select Resource " + Command.prototype.toString.call( this ) + "\n" +
		"Parameters:\n" +  resourceArrays.toString() + "\n" +
		"is this selection additive: " + isAdditiveSelection + "\n" +
		"selection Manager: " + selectionManager.toString() ;
}

function CreateResourceCommand( executionMode, newResCode, sketchObj )
{
	Command.call(this);
	this.commandCode = basicCommandsGlobals.commandTypeEnum.CMD_CREATE_RES;
	this.executionMode = executionMode;
	
	 // This id is needed to create and to delete the resource with the undo function
	var maxId = sketchObj.getMaxId();
	this.setArgs(
		{
			newResourceCode: newResCode,
			sketchObject: sketchObj,
			newResId: maxId
		}
	);
}
CreateResourceCommand.prototype = new Command;
CreateResourceCommand.prototype.constructor = CreateResourceCommand;
CreateResourceCommand.prototype.toString = function()
{
	var resourceCode = this.argObject.newResourceCode;
	var sketchProject = this.argObject.sketchObject;
	var newId = this.argObject.newResId;
	return 		"Create Resource " + Command.prototype.toString.call( this ) + "\n" +
		"Parameters: Resource to be created with type " +  resourceCode +"\n" +
		"using the id " + newId + "\n" +
		"sketch project: " + sketchProject ;
}

CreateResourceCommand.prototype.execute = function( commandObject )
{
	var resourceCode = this.argObject.newResourceCode;
	var sketchProject = this.argObject.sketchObject;
	var newId = this.argObject.newResId;
	
	var currentScreen = sketchProject.getCurrentScreen();
	var activeVersionNum = sketchProject.getActiveVersionNumber();

	
	var newResource = null;
	
	switch( resourceCode )
	{
		case resourceTypeEnum.IR_BUTTON:
		{
			newResource = new ButtonResource( 0,0,0,100, 50, "Button", newId, activeVersionNum );
			break;
		}
		default:
		{
			console.error( "There is no available function to create a resource with type " +  resourceCode );
			return;
		}
	}
	
	if( newResource != null )
	{
		sketchProject.increaseMaxId();
		currentScreen.addResourceHistory( newResource );
		globalMediators.internalMediator.publish( "InterfaceResourceCreated", [ newResource ] );
	}
	
}

CreateResourceCommand.prototype.undo = function( commandObject )
{
	var resourceCode = this.argObject.newResourceCode;
	var sketchProject = this.argObject.sketchObject;
	var newId = this.argObject.newResId;
	
	return new DeleteResourceCommand( 
		basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, newId, sketchProject );
}

function DeleteResourceCommand( executionMode, resourceObjId, sketchObj )
{
	Command.call(this);
	this.commandCode = basicCommandsGlobals.commandTypeEnum.CMD_DELETE_RES;
	this.executionMode = executionMode;
	this.setArgs(
		{
			resourceId: resourceObjId,
			sketchObject: sketchObj
		}
	);
}
DeleteResourceCommand.prototype = new Command;
DeleteResourceCommand.prototype.constructor = DeleteResourceCommand;

DeleteResourceCommand.prototype.toString = function()
{
	var interfaceResourceId = this.argObject.resourceId;
	var sketchProject = this.argObject.newResourceCode;
	return 		"Delete Resource " + Command.prototype.toString.call( this ) + "\n" +
		"Parameters: Resource to be deleted with id" +  interfaceResourceId +"\n" +
		"sketch project: " + sketchProject ;
}

DeleteResourceCommand.prototype.execute = function( commandObject )
{
	var interfaceResourceId = this.argObject.resourceId;
	var sketchProject = this.argObject.sketchObject;
	
	var currentScreen = sketchProject.getCurrentScreen();
	var deletedResource = currentScreen.deleteResourceHistory( interfaceResourceId );
	
	if( deletedResource != null )
	{
		globalMediators.internalMediator.publish( "InterfaceResourceDeleted", [ deletedResource ] );
	}
	else
	{
		console.error( "Failure while deleting interface resource with id " + interfaceResourceId );
	}
}

DeleteResourceCommand.prototype.undo = function( commandObject )
{
	var interfaceResourceId = this.argObject.resourceId;
	var sketchProject = this.argObject.sketchObject;
	
	var currentScreen = sketchProject.getCurrentScreen();
	
	var resourceHistory = currentScreen.getResourceHistory( interfaceResourceId );
	if( resourceHistory != null )
	{
		return new RestoreResHistCommand( 
			basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, resourceHistory, sketchProject );
	}
	else
	{
		console.error("Error while creating the delete resource undo object" );
		return null;
	}
}

function RestoreResHistCommand( executionMode, resHist, sketchObj )
{
	Command.call(this);
	this.commandCode = basicCommandsGlobals.commandTypeEnum.CMD_RESTORE_RES;
	this.executionMode = executionMode;
	this.setArgs(
		{
			resourceHist: resHist,
			sketchObject: sketchObj
		}
	);
}

RestoreResHistCommand.prototype = new Command;
RestoreResHistCommand.prototype.constructor = RestoreResHistCommand;

RestoreResHistCommand.prototype.toString = function()
{
	var resourceHistory = this.argObject.resourceHist;
	var sketchProject = this.argObject.newResourceCode;
	return 		"Restore Resource History" + Command.prototype.toString.call( this ) + "\n" +
		"Parameters: Resource History to be restored " +  resourceHistory +"\n"+
		"sketch project: " + sketchProject ;
}

RestoreResHistCommand.prototype.execute = function( commandObject )
{
	var resourceHistory = this.argObject.resourceHist;
	var sketchProject = this.argObject.sketchObject;

	var currentScreen = sketchProject.getCurrentScreen();
	
	currentScreen.restoreResourceHistory( resourceHistory );
	
	// Checking integrity and getting the resource from the active version
	resourceHistory = currentScreen.getResourceHistory( resourceHistory.getId() );
	if( resourceHistory != null )
	{
		var activeVersionNum = sketchProject.getActiveVersionNumber();
		var interfaceResource = resourceHistory.getResourceBeforeVersion( activeVersionNum ); 
		
		if( interfaceResource != null )
		{
			globalMediators.internalMediator.publish( "InterfaceResourceCreated", [ interfaceResource ] );
			return;
		}
	}
	console.error( "Error while trying to restore resource history" );
}

RestoreResHistCommand.prototype.undo = function( commandObject )
{
	var resourceHistory = this.argObject.resourceHist;
	var sketchProject = this.argObject.sketchObject;
	var activeVersionNum = sketchProject.getActiveVersionNumber();
	var interfaceResource = resourceHistory.getResourceBeforeVersion( activeVersionNum ); 
	return new DeleteResourceCommand( 
		basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, interfaceResource.getId(), sketchProject );
}

function CommandGroup( executionMode, commandArray, commandExplanationStr, actionController )
{
	Command.call(this);
	this.commandCode = basicCommandsGlobals.commandTypeEnum.CMD_GROUP_EXEC;
	this.executionMode = executionMode;
	if( actionController == null )
	{
		actionController = new ActionController();
	}
	this.setArgs(
		{
			commands: commandArray,
			commandExplanation: commandExplanationStr,
			internalActionController: actionController
		}
	);
}

CommandGroup.prototype = new Command;
CommandGroup.prototype.constructor = CommandGroup;

CommandGroup.prototype.toString = function()
{
	var commandArray = this.argObject.commands;
	var commandExplanationStr = this.argObject.commandExplanation;
	
	return "Command group with " + commandArray.length +
		"commands. These commands are about " + commandExplanationStr;
}

CommandGroup.prototype.execute = function( commandObject )
{
	var commandArray = this.argObject.commands;
	var commandExplanationStr = this.argObject.commandExplanation;
	var actionController = this.argObject.internalActionController;

	if( actionController.undoStack.isEmpty() && actionController.redoStack.isEmpty() )
	{
		var i;
		var length = commandArray.length;
		for( i = 0; i < length; i++ )
			actionController.doCommand( commandArray[i] );
	}
	else if( !actionController.undoStack.isEmpty() )
	{
		while( actionController.undo() != null )
		{ /* do nothing */ }
	}
	else if( !actionController.redoStack.isEmpty() )
	{
		while( actionController.redo() != null )
		{ /* do nothing */ }
	}
}

CommandGroup.prototype.undo = function( commandObject )
{
	var commandArray = this.argObject.commands;
	var commandExplanationStr = this.argObject.commandExplanation;
	var actionController = this.argObject.internalActionController;

	return new CommandGroup( basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, 
	commandArray, commandExplanationStr, actionController );
}

function ResizeResizeCommand( executionMode, interfaceResource, toX, toY, newWidth, newHeight )
{
	Command.call(this);
	this.commandCode = basicCommandsGlobals.commandTypeEnum.CMD_RESIZE_RES;
	this.executionMode = executionMode;
	this.setArgs(
		{
			resource: interfaceResource,
			x: toX,
			y: toY,
			width: newWidth,
			height: newHeight
		}
	);
}

ResizeResizeCommand.prototype = new Command;
ResizeResizeCommand.prototype.constructor = ResizeResizeCommand;

ResizeResizeCommand.prototype.toString = function()
{
	var interfaceResource = this.argObject.resource;
	var toX = this.argObject.x;
	var toY = this.argObject.y;
	var newWidth = this.argObject.width;
	var newHeight = this.argObject.height;
	return 		"Resize Resource History" + Command.prototype.toString.call( this ) + "\n" +
		"Parameters: X = " + toX + " Y = " + toY +
		" newWidth = " + newWidth + " newWidth = " + newWidth +
		"\ninterface resource: " + interfaceResource ;
}


ResizeResizeCommand.prototype.execute = function( commandObject )
{
	var interfaceResource = this.argObject.resource;
	var toX = this.argObject.x;
	var toY = this.argObject.y;
	var newWidth = this.argObject.width;
	var newHeight = this.argObject.height;
	var oldX = interfaceResource.getX();
	var oldY = interfaceResource.getY();
	var oldWidth = interfaceResource.getWidth();
	var oldHeight = interfaceResource.getHeight();
	interfaceResource.setX( toX );
	interfaceResource.setY( toY );
	interfaceResource.setWidth( newWidth );
	interfaceResource.setHeight( newHeight );
	globalMediators.internalMediator.publish( "InterfaceResourceResized", 
		[ interfaceResource, oldX, oldY, oldWidth, oldHeight ] );
}

ResizeResizeCommand.prototype.undo = function( commandObject )
{
	var interfaceResource = this.argObject.resource
	return new ResizeResizeCommand( basicCommandsGlobals.executionTypeEnum.CMEX_EDITION,
		interfaceResource, interfaceResource.getX(), interfaceResource.getY(), 
		interfaceResource.getWidth(), interfaceResource.getHeight() );
}
		

/****** command factory test *********/
DragResourceCommand.prototype.execute = function( commandObject )
{
	var interfaceResource = commandObject.argObject.resource;
	var oldX = interfaceResource.getX();
	var oldY = interfaceResource.getY();
	var x = commandObject.argObject.x;
	var y = commandObject.argObject.y;
	interfaceResource.setX(x);
	interfaceResource.setY(y);
	globalMediators.internalMediator.publish( "InterfaceResourceMoved", [ interfaceResource, oldX, oldY ] );
}

DragResourceCommand.prototype.undo = function( commandObject )
{
	var interfaceResource = commandObject.argObject.resource;
	var x = interfaceResource.getX();
	var y = interfaceResource.getY();
	return new DragResourceCommand( basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, interfaceResource, x, y );
}


/**/
KineticDragCommand.prototype.execute = function( commandObject )
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

KineticDragCommand.prototype.undo = function( commandObject )
{
	var interfaceResource = commandObject.argObject.resource;
	var kineticShape = commandObject.argObject.kineticShape;
	var x = interfaceResource.getX();
	var y = interfaceResource.getY();
	return new KineticDragCommand( basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, interfaceResource, kineticShape, x, y );
}

/**/
RenameResourceCommand.prototype.execute = function( commandObject )
{
	// Model handling
	var interfaceResource = commandObject.argObject.resource;
	var newName = commandObject.argObject.newName;
	interfaceResource.setName( newName );
	globalMediators.graphicMediator.publish( "ResourceNameChanged", [ interfaceResource, newName ] );
}

RenameResourceCommand.prototype.undo = function( commandObject )
{
	var interfaceResource = commandObject.argObject.resource;
	var oldName = interfaceResource.getName();
	return new RenameResourceCommand( basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, interfaceResource, oldName );
}

/**/
SelectResourceCommand.prototype.execute = function( commandObject )
{
	// Model handling
	var resourceArrays = commandObject.argObject.resourceArrays;
	var isAdditiveSelection = commandObject.argObject.isAdditiveSelection;
	var selectionManager = commandObject.argObject.selectionManager;
	selectionManager.addElement( resourceArrays, isAdditiveSelection );
	globalMediators.graphicMediator.publish( "ResourceSelected", [ resourceArrays ] );
}

SelectResourceCommand.prototype.undo = function( commandObject )
{
	var resourceArrays = commandObject.argObject.resourceArrays;
	var isAdditiveSelection = commandObject.argObject.isAdditiveSelection;
	var selectionManager = commandObject.argObject.selectionManager;
	return new CancelSelectResourceCommand( basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, resourceArrays,
		 isAdditiveSelection, selectionManager );
}

/**/
CancelSelectResourceCommand.prototype.execute = function( commandObject )
{
	// Model handling
	var resourceArrays = commandObject.argObject.resourceArrays;
	var isAdditiveSelection = commandObject.argObject.isAdditiveSelection;
	var selectionManager = commandObject.argObject.selectionManager;
	selectionManager.removeElement( resourceArrays );
	globalMediators.graphicMediator.publish( "ResourceSelectCanceled", [ resourceArrays ] );
}

CancelSelectResourceCommand.prototype.undo = function( commandObject )
{
	var resourceArrays = commandObject.argObject.resourceArrays;
	var isAdditiveSelection = commandObject.argObject.isAdditiveSelection;
	var selectionManager = commandObject.argObject.selectionManager;
	return new SelectResourceCommand( basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, resourceArrays,
		 isAdditiveSelection, selectionManager );
}

/*
function CommandFunctionFactory()
{
	this.commandMatrix = new Array();
	this.commandMatrix[basicCommandsGlobals.commandTypeEnum.CMD_DRAG] = dragResourceFunctions;
	this.commandMatrix[basicCommandsGlobals.commandTypeEnum.CMD_KINETIC_DRAG] = kineticDragFunctions;
	this.commandMatrix[basicCommandsGlobals.commandTypeEnum.CMD_RENAME_RES] = renameResourceFunctions;
	this.commandMatrix[basicCommandsGlobals.commandTypeEnum.CMD_SELECT_RES] = selectResourceFunctions;
	this.commandMatrix[basicCommandsGlobals.commandTypeEnum.CMD_CANC_SELECT_RES] = cancelSelectResourceFunctions;
	
	this.undoMatrix = new Array();
	this.undoMatrix[basicCommandsGlobals.commandTypeEnum.CMD_DRAG] = dragResourceUndoFunctions;
	this.undoMatrix[basicCommandsGlobals.commandTypeEnum.CMD_KINETIC_DRAG] = kineticDragUndoFunctions;
	this.undoMatrix[basicCommandsGlobals.commandTypeEnum.CMD_RENAME_RES] = renameResourceUndoFunctions;
	this.undoMatrix[basicCommandsGlobals.commandTypeEnum.CMD_SELECT_RES] = selectResourceUndoFunctions;
	this.undoMatrix[basicCommandsGlobals.commandTypeEnum.CMD_CANC_SELECT_RES] = cancelSelectResourceUndoFunctions;
}
*/

// This one creates a command to be executed
function undoFactory( commandObject )
{
	var code = commandObject.getCode();
	var mode = commandObject.getMode();
	/*var functionFactory = new CommandFunctionFactory();
	if( typeof functionFactory.undoMatrix[code] != 'undefined' )
	{
		if( typeof functionFactory.undoMatrix[code][mode] != 'undefined' )
		{
			return functionFactory.undoMatrix[code][mode]( commandObject );
		}
	}
	return null;*/
	return commandObject.undo( commandObject );
	
}

// This one executes a command
function commandDigest( commandObject )
{
	var code = commandObject.getCode();
	var mode = commandObject.getMode();
	/*
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
	*/
	console.log( commandObject );
	commandObject.execute( commandObject );
	return true;
}
