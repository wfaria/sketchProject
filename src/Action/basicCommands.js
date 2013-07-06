var basicCommandsGlobals = {};

/**
 * An enumerator of command types
 * @enum {number}
 *  
 */
basicCommandsGlobals.commandTypeEnum = { CMD_UNDEFINED: -1, CMD_DRAG: 0, 
	CMD_KINETIC_DRAG: 1, CMD_RENAME_RES: 2, CMD_SELECT_RES: 3, CMD_CANC_SELECT_RES: 4,
	CMD_CREATE_RES: 5, CMD_DELETE_RES: 6, CMD_RESTORE_RES: 7, CMD_GROUP_EXEC: 8,
	CMD_RESIZE_RES: 9, CMD_FORMAT_RES: 10, CMD_CLONE_VERSION: 11, 
	CMD_REMOVE_VERSION: 12, CMD_ADD_VERSION: 13, CMD_DELETE_VERSION: 14,
	CMD_CHANGE_ACTIVE_VERSION: 15, CMD_SET_HIST_EXTRA_IMG: 16, CMD_CHANGE_RES_Z: 17 };
	
/**
 * An enumerator of command modes
 * @enum {number}
 *  
 */
basicCommandsGlobals.executionTypeEnum = { CMEX_UNDEFINED: -1, CMEX_EDITION: 0, CMEX_SIMULATION: 1 };


/**
 * Generic command constructor.
 * @constructor
 */
function Command()
{
	this.argObject = null;
	this.commandCode = basicCommandsGlobals.commandTypeEnum.CMD_UNDEFINED;
	this.executionMode = basicCommandsGlobals.executionTypeEnum.CMEX_UNDEFINED;
}
Command.prototype.constructor = Command;


/**
 * Execute the command
 *
 * @param {Object} commandObject - A command object, generally it is itself.
 * @return {int} A number that indicates if the command has been executed succcessfully or not
 * 
 */
Command.prototype.execute = function( commandObject )
{
	console.error( "This command object does not have an execute function:\n" +
	 commandObject.toString() );
	return actionGlobals.COMMAND_OK;
}

/**
 * Return a reverse command
 * 
 * @param {Object} commandObject - A command object, generally it is itself.
 * @return {Object} the undo command for this command or null if there is some error.
 * 
 */
Command.prototype.undo = function( commandObject )
{
	console.error( "This command object does not have an undo function:\n" +
	 commandObject.toString() );
	 return null;
}

/**
 * Get the code from the command
 *
 * @return {int} A number that indicates the command type
 * 
 */
Command.prototype.getCode = function()
{
	return this.commandCode;
}

/**
 * Get the execution mode from the command, for while it is a legacy function, 
 * in the future it may be useful to restore the execution context (mode) before starting the command.
 *
 * @return {int} A number that indicates the command mode.
 * 
 */
Command.prototype.getMode = function()
{
	return this.executionMode;
}

/**
 * Set the command intern parameters, it can be any kind of object.
 * 
 * @param {?} objects - A generic object with sufficient parameters to be executed by a command.
 * 
 */
Command.prototype.setArgs = function( objects )
{
	this.argObject = objects;
}

/**
 * Get the execution mode from the command, for while it is a legacy function, 
 * in the future it may be useful to restore the execution context (mode) before starting the command
 *
 * @return {int} A number that indicates the command type
 * 
 */
Command.prototype.toString = function()
{
	return "Command code: " + this.commandCode  + ", mode: " + this.executionMode;
}

/**
 * //TODO: Finish this command commentaries
 * @constructor
 * @extends Command
 * 
 * @param {int} executionMode - A number that indicates the command execution mode.
 */
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


/**
 * //TODO: Finish this command commentaries
 * @constructor
 * @extends Command
 * 
 * @param {int} executionMode - A number that indicates the command execution mode.
 */
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

/**
 * //TODO: Finish this command commentaries
 * @constructor
 * @extends Command
 * 
 * @param {int} executionMode - A number that indicates the command execution mode.
 */
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

/**
 * //TODO: Finish this command commentaries
 * @constructor
 * @extends Command
 * 
 * @param {int} executionMode - A number that indicates the command execution mode.
 */
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

/**
 * //TODO: Finish this command commentaries
 * @constructor
 * @extends Command
 * 
 * @param {int} executionMode - A number that indicates the command execution mode.
 */
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

/**
 * //TODO: Finish this command commentaries
 * @constructor
 * @extends Command
 * 
 * @param {int} executionMode - A number that indicates the command execution mode.
 */
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
		case resourceTypeEnum.IR_WINDOW:
		{
			newResource = new WindowResource( 0,0,0,400, 300, "Window Title", newId, activeVersionNum );
			break;
		}
		case resourceTypeEnum.IR_IMAGE:
		{
			newResource = new ImageResource( 0,0,0,100, 100, "Image", newId, activeVersionNum );
			break;
		}
		default:
		{
			console.error( "There is no available function to create a resource with type " +  resourceCode );
			return actionGlobals.IGNORE_COMMAND;
		}
	}
	
	if( newResource != null )
	{
		sketchProject.increaseMaxId();
		currentScreen.addResourceHistory( newResource );
		globalMediators.internalMediator.publish( "InterfaceResourceCreated", [ newResource ] );
	}
	
	return actionGlobals.COMMAND_OK;
}

CreateResourceCommand.prototype.undo = function( commandObject )
{
	var resourceCode = this.argObject.newResourceCode;
	var sketchProject = this.argObject.sketchObject;
	var newId = this.argObject.newResId;
	
	return new DeleteResourceCommand( 
		basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, newId, sketchProject );
}

/**
 * //TODO: Finish this command commentaries
 * @constructor
 * @extends Command
 * 
 * @param {int} executionMode - A number that indicates the command execution mode.
 */
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
	var sketchProject = this.argObject.sketchObject;
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
		globalMediators.internalMediator.publish( "ResourceHistoryDeleted", [ deletedResource ] );
	}
	else
	{
		console.error( "Failure while deleting interface resource with id " + interfaceResourceId );
		return actionGlobals.IGNORE_COMMAND;
	}
	return actionGlobals.COMMAND_OK;
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

/**
 * //TODO: Finish this command commentaries
 * @constructor
 * @extends Command
 * 
 * @param {int} executionMode - A number that indicates the command execution mode.
 */
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
			return actionGlobals.COMMAND_OK;
		}
	}
	console.error( "Error while trying to restore resource history" );
	return actionGlobals.IGNORE_COMMAND;
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

/**
 * //TODO: Finish this command commentaries
 * @constructor
 * @extends Command
 * 
 * @param {int} executionMode - A number that indicates the command execution mode.
 */
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
	else
	{
		console.error("Error while executing a group of commands");
		return actionGlobals.IGNORE_COMMAND;
	}
	
	return actionGlobals.COMMAND_OK;
}

CommandGroup.prototype.undo = function( commandObject )
{
	var commandArray = this.argObject.commands;
	var commandExplanationStr = this.argObject.commandExplanation;
	var actionController = this.argObject.internalActionController;

	return new CommandGroup( basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, 
	commandArray, commandExplanationStr, actionController );
}

/**
 * //TODO: Finish this command commentaries
 * @constructor
 * @extends Command
 * 
 * @param {int} executionMode - A number that indicates the command execution mode.
 */
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
	return actionGlobals.COMMAND_OK;
}

ResizeResizeCommand.prototype.undo = function( commandObject )
{
	var interfaceResource = this.argObject.resource;
	return new ResizeResizeCommand( basicCommandsGlobals.executionTypeEnum.CMEX_EDITION,
		interfaceResource, interfaceResource.getX(), interfaceResource.getY(), 
		interfaceResource.getWidth(), interfaceResource.getHeight() );
}

/**
 * //TODO: Finish this command commentaries
 * @constructor
 * @extends Command
 * 
 * @param {int} executionMode - A number that indicates the command execution mode.
 */		
function FormatResourceCommand( executionMode, interfaceResource, fontSize, fontFamilyStr, xPadding, yPadding )
{
	Command.call(this);
	this.commandCode = basicCommandsGlobals.commandTypeEnum.CMD_FORMAT_RES;
	this.executionMode = executionMode;
	this.setArgs(
		{
			resource: interfaceResource,
			size: fontSize,
			family: fontFamilyStr,
			xPad: xPadding,
			yPad: yPadding
		}
	);
}

FormatResourceCommand.prototype = new Command;
FormatResourceCommand.prototype.constructor = FormatResourceCommand;

FormatResourceCommand.prototype.toString = function()
{
	var interfaceResource = this.argObject.resource;
	var fontSize = this.argObject.size;
	var fontFamilyStr = this.argObject.family;
	var xPadding = this.argObject.xPad;
	var yPadding = this.argObject.yPad;
	return 		"Format Resource " + Command.prototype.toString.call( this ) + "\n" +
		"Parameters: fontSize = " + fontSize + " font family = " + fontFamilyStr +
		" x padding = " + xPadding + " y padding = " + yPadding +
		"\ninterface resource: " + interfaceResource ;
}


FormatResourceCommand.prototype.execute = function( commandObject )
{

	var interfaceResource = this.argObject.resource;
	var fontSize = this.argObject.size;
	var fontFamilyStr = this.argObject.family;
	var xPadding = this.argObject.xPad;
	var yPadding = this.argObject.yPad;
	interfaceResource.setExtraAttribute( iResGlobals.defaultKeys.FONTSIZE_KEY, fontSize );
	interfaceResource.setExtraAttribute( iResGlobals.defaultKeys.FONTTYPE_KEY, fontFamilyStr );
	interfaceResource.setExtraAttribute( iResGlobals.defaultKeys.FONT_X_PADDING_KEY, xPadding );
	interfaceResource.setExtraAttribute( iResGlobals.defaultKeys.FONT_Y_PADDING_KEY, yPadding );
				
	globalMediators.internalMediator.publish( "ResourceFormatted", [ interfaceResource ] );
	
	return actionGlobals.COMMAND_OK;
}

FormatResourceCommand.prototype.undo = function( commandObject )
{
	var interfaceResource = this.argObject.resource;
	return new FormatResourceCommand( basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, interfaceResource,
		parseInt( interfaceResource.getExtraAttribute( iResGlobals.defaultKeys.FONTSIZE_KEY ) ),
		interfaceResource.getExtraAttribute( iResGlobals.defaultKeys.FONTTYPE_KEY ),
		parseInt( interfaceResource.getExtraAttribute( iResGlobals.defaultKeys.FONT_X_PADDING_KEY ), 10 ),
		parseInt( interfaceResource.getExtraAttribute( iResGlobals.defaultKeys.FONT_X_PADDING_KEY ), 10  )
	);
}

/**
 * //TODO: Finish this command commentaries
 * @constructor
 * @extends Command
 * 
 * @param {int} executionMode - A number that indicates the command execution mode.
 */
function CloneResourceVersionCommand( executionMode, resourceId, baseVersion, targetVersion, sketchObj )
{
	Command.call(this);
	this.commandCode = basicCommandsGlobals.commandTypeEnum.CMD_CLONE_VERSION;
	this.executionMode = executionMode;
	this.setArgs(
		{
			sketchObject: sketchObj,
			baseVers: baseVersion,
			targetVers: targetVersion,
			id: resourceId
		}
	);
}

CloneResourceVersionCommand.prototype = new Command;
CloneResourceVersionCommand.prototype.constructor = CloneResourceVersionCommand;

CloneResourceVersionCommand.prototype.toString = function()
{
	var baseVersion = this.argObject.baseVers;
	var targetVersion = this.argObject.targetVers;
	var resourceId = this.argObject.id;
	var sketchObj = this.argObject.sketchObject;
	return 		"Clone resource " + Command.prototype.toString.call( this ) + "\n" +
		"Parameters: from version " +baseVersion+ " to version " +targetVersion +
		"\n based on resource with id " + resourceId + " from the sketch project " + sketchObj;
}


CloneResourceVersionCommand.prototype.execute = function( commandObject )
{
	var baseVersion = this.argObject.baseVers;
	var targetVersion = this.argObject.targetVers;
	var resourceId = this.argObject.id;
	var sketchObj = this.argObject.sketchObject;
	
	var currentScreen = sketchObj.getCurrentScreen();
	
	var resourceHistory = currentScreen.getResourceHistory( resourceId );
	if( resourceHistory != null )
	{
		var clonedObj = resourceHistory.cloneVersion( baseVersion, targetVersion );
		if( clonedObj != null )
		{
			globalMediators.internalMediator.publish( "ResourceVersionCloned", 
				[ clonedObj, baseVersion, resourceHistory, sketchObj.getActiveVersionNumber() ] );
			return actionGlobals.COMMAND_OK;
		}
		else
		{
			console.error("Error while clonning version in the clone command");
		}
	}
	else
	{
		console.error( "There is no element with id  " + resourceId + " on this project " );
	}
	return actionGlobals.IGNORE_COMMAND;
}

CloneResourceVersionCommand.prototype.undo = function( commandObject )
{
	var targetVersion = this.argObject.targetVers;
	var resourceId = this.argObject.id;
	var sketchObj = this.argObject.sketchObject;
	
	return new RemoveResourceVersionCommand( basicCommandsGlobals.executionTypeEnum.CMEX_EDITION,
		resourceId, targetVersion, sketchObj );
}

/**
 * //TODO: Finish this command commentaries
 * @constructor
 * @extends Command
 * 
 * @param {int} executionMode - A number that indicates the command execution mode.
 */
function RemoveResourceVersionCommand( executionMode, resourceId, versionNum, sketchObj )
{
	Command.call(this);
	this.commandCode = basicCommandsGlobals.commandTypeEnum.CMD_REMOVE_VERSION;
	this.executionMode = executionMode;
	this.setArgs(
		{
			sketchObject: sketchObj,
			targetVers: versionNum,
			id: resourceId
		}
	);
}

RemoveResourceVersionCommand.prototype = new Command;
RemoveResourceVersionCommand.prototype.constructor = RemoveResourceVersionCommand;

RemoveResourceVersionCommand.prototype.toString = function()
{
	var resourceId = this.argObject.id;
	var versionNum = this.argObject.targetVers;
	var sketchObj = this.argObject.sketchObject;
	return 		"Remove resource version " + Command.prototype.toString.call( this ) + "\n" +
		"Parameters: version " +versionNum+  +
		"\n based on resource with id " + resourceId + " from the sketch project " + sketchObj;
}


RemoveResourceVersionCommand.prototype.execute = function( commandObject )
{
	var resourceId = this.argObject.id;
	var versionNum = this.argObject.targetVers;
	var sketchObj = this.argObject.sketchObject;
	
	var currentScreen = sketchObj.getCurrentScreen();
	
	var resourceHistory = currentScreen.getResourceHistory( resourceId );
	if( resourceHistory != null )
	{
		var removedResource = resourceHistory.removeVersion( versionNum );
		if(  removedResource != null )
		{
			globalMediators.internalMediator.publish( "ResourceVersionRemoved", 
				[ removedResource, resourceHistory, sketchObj.getActiveVersionNumber() ] );
			return actionGlobals.COMMAND_OK;
		}
		else
		{
			console.error("Error while removing version");
		}
	}
	else
	{
		console.error( "There is no element with id  " + resourceId + " on this project " );
	}
	
	return actionGlobals.IGNORE_COMMAND;
}

RemoveResourceVersionCommand.prototype.undo = function( commandObject )
{
	var targetVersion = this.argObject.targetVers;
	var resourceId = this.argObject.id;
	var sketchObj = this.argObject.sketchObject;
	
	var currentScreen = sketchObj.getCurrentScreen();
	
	var resourceHistory = currentScreen.getResourceHistory( resourceId );
	if( resourceHistory != null )
	{
		var savedResource = resourceHistory.getResourceFromVersion( targetVersion );
		return new AddResourceTimeSlotCommand( basicCommandsGlobals.executionTypeEnum.CMEX_EDITION,
			savedResource, sketchObj );
	}
	else
	{
		console.error( "There is no version " + targetVersion + " in the resource with id " + resourceId );
		return null;
	}
}

/**
 * //TODO: Finish this command commentaries
 * @constructor
 * @extends Command
 * 
 * @param {int} executionMode - A number that indicates the command execution mode.
 */
function ChangeResourceZCommand( executionMode, interfaceResource, toZ )
{
	Command.call(this);
	this.commandCode = basicCommandsGlobals.commandTypeEnum.CMD_CHANGE_RES_Z;
	this.executionMode = executionMode;
	this.setArgs(
		{
			resource: interfaceResource,
			z: toZ
		}
	);
}

ChangeResourceZCommand.prototype = new Command;
ChangeResourceZCommand.prototype.constructor = ChangeResourceZCommand;

ChangeResourceZCommand.prototype.toString = function()
{
	var interfaceResource = this.argObject.resource;
	var toZ = this.argObject.z;
	return 		"Change Resource Z position" + Command.prototype.toString.call( this ) + "\n" +
		"Parameters: new Z position = " + toZ ++
		"\ninterface resource: " + interfaceResource ;
}


ChangeResourceZCommand.prototype.execute = function( commandObject )
{
	var interfaceResource = this.argObject.resource;
	var toZ = this.argObject.z;
	var oldZ = interfaceResource.getZ();
	interfaceResource.setZ( toZ );
	globalMediators.internalMediator.publish( "InterfaceResourceZChanged", 
		[ interfaceResource, oldZ ] );
	return actionGlobals.COMMAND_OK;
}

ChangeResourceZCommand.prototype.undo = function( commandObject )
{
	var interfaceResource = this.argObject.resource;
	return new ChangeResourceZCommand( basicCommandsGlobals.executionTypeEnum.CMEX_EDITION,
		interfaceResource, interfaceResource.getZ() );
}


/**
 * //TODO: Finish this command commentaries
 * @constructor
 * @extends Command
 * 
 * @param {int} executionMode - A number that indicates the command execution mode.
 */
function AddResourceTimeSlotCommand( executionMode, resourceTimeSlotObj, sketchObj )
{
	Command.call(this);
	this.commandCode = basicCommandsGlobals.commandTypeEnum.CMD_ADD_VERSION;
	this.executionMode = executionMode;
	this.setArgs(
		{
			sketchObject: sketchObj,
			res: resourceTimeSlotObj,
		}
	);
}

AddResourceTimeSlotCommand.prototype = new Command;
AddResourceTimeSlotCommand.prototype.constructor = AddResourceTimeSlotCommand;

AddResourceTimeSlotCommand.prototype.toString = function()
{
	var resourceTimeSlotObj = this.argObject.res;
	var sketchObj = this.argObject.sketchObject;
	return 		"Add Time Slot Command " + Command.prototype.toString.call( this ) + "\n" +
		"Parameters: time slot resource: " +resourceTimeSlotObj+  +
		"\nfrom the sketch project " + sketchObj;
}

AddResourceTimeSlotCommand.prototype.execute = function( commandObject )
{
	var resourceTimeSlotObj = this.argObject.res;
	var sketchObj = this.argObject.sketchObject;
	
	var currentScreen = sketchObj.getCurrentScreen();
	
	var resourceHistory = currentScreen.getResourceHistory( resourceTimeSlotObj.getId() );
	if( resourceHistory != null )
	{
		// This function will overwrite any object with the same version
		resourceHistory.addVersion( resourceTimeSlotObj );
		globalMediators.internalMediator.publish( "ResourceVersionAdded", 
			[ resourceTimeSlotObj, resourceHistory, sketchObj.getActiveVersionNumber() ] );
		return actionGlobals.COMMAND_OK;
	}
	else
	{
		console.error( "There is no element with id  " + resourceTimeSlotObj.getId() + " on this project " );
	}
	
	return actionGlobals.IGNORE_COMMAND;
}

AddResourceTimeSlotCommand.prototype.undo = function( commandObject )
{
	var resourceTimeSlotObj = this.argObject.res;
	var sketchObj = this.argObject.sketchObject;
	
	return new RemoveResourceVersionCommand( basicCommandsGlobals.executionTypeEnum.CMEX_EDITION,
		 resourceTimeSlotObj.getId(), resourceTimeSlotObj.getVersion(), sketchObj );
}

/**
 * //TODO: Finish this command commentaries
 * @constructor
 * @extends Command
 * 
 * @param {int} executionMode - A number that indicates the command execution mode.
 */
function DeleteResourceVersionCommand( executionMode, resourceId, versionNum, sketchObj )
{
	Command.call(this);
	this.commandCode = basicCommandsGlobals.commandTypeEnum.CMD_DELETE_VERSION;
	this.executionMode = executionMode;
	this.setArgs(
		{
			sketchObject: sketchObj,
			targetVers: versionNum,
			id: resourceId
		}
	);
}

DeleteResourceVersionCommand.prototype = new Command;
DeleteResourceVersionCommand.prototype.constructor = DeleteResourceVersionCommand;

DeleteResourceVersionCommand.prototype.toString = function()
{
	var resourceId = this.argObject.id;
	var versionNum = this.argObject.targetVers;
	var sketchObj = this.argObject.sketchObject;
	return 		"Delete resource version command " + Command.prototype.toString.call( this ) + "\n" +
		"Parameters: version " +versionNum+  +
		"\n based on resource with id " + resourceId + " from the sketch project " + sketchObj;
}

DeleteResourceVersionCommand.prototype.execute = function( commandObject )
{
	var resourceId = this.argObject.id;
	var versionNum = this.argObject.targetVers;
	var sketchObj = this.argObject.sketchObject;
	
	var currentScreen = sketchObj.getCurrentScreen();
	
	var resourceHistory = currentScreen.getResourceHistory( resourceId );
	if( resourceHistory != null )
	{
		var deletedResource = resourceHistory.changeDeletedFlag( versionNum );
		if( deletedResource != null )
		{
			globalMediators.internalMediator.publish( "ResourceDeleteTagChanged", [ deletedResource ] );
			return actionGlobals.COMMAND_OK;
		}
		else
		{
			console.error("Error while deleting version");
		}
	}
	else
	{
		console.error( "There is no element with id  " + resourceId + " on this project " );
	}
	
	return actionGlobals.IGNORE_COMMAND;
}

DeleteResourceVersionCommand.prototype.undo = function( commandObject )
{
	var targetVersion = this.argObject.targetVers;
	var resourceId = this.argObject.id;
	var sketchObj = this.argObject.sketchObject;
	
	return new DeleteResourceVersionCommand( basicCommandsGlobals.executionTypeEnum.CMEX_EDITION,
  				 resourceId, targetVersion, sketchObj );
}

/**
 * //TODO: Finish this command commentaries
 * @constructor
 * @extends Command
 * 
 * @param {int} executionMode - A number that indicates the command execution mode.
 */	
function SetRestHistExtraImageCommand( executionMode, interfaceResource, sketchProject, imageSource )
{
	Command.call(this);
	this.commandCode = basicCommandsGlobals.commandTypeEnum.CMD_SET_HIST_EXTRA_IMG;
	this.executionMode = executionMode;
	this.setArgs(
		{
			resource: interfaceResource,
			sketchObject: sketchProject,
			imageSrc: imageSource
		}
	);
}

SetRestHistExtraImageCommand.prototype = new Command;
SetRestHistExtraImageCommand.prototype.constructor = SetRestHistExtraImageCommand;

SetRestHistExtraImageCommand.prototype.toString = function()
{
	var interfaceResource = this.argObject.resource;
	var sketchProject = this.argObject.sketchObject;
	var imageSource = this.argObject.imageSrc;
	return 		"Set Resource History's Extra Image" + Command.prototype.toString.call( this ) + "\n" +
		"Parameters: fontSize = " + sketchProject + 
		"\n image string length = " + imageSource.length +
		"\ninterface resource: " + interfaceResource ;
}


SetRestHistExtraImageCommand.prototype.execute = function( commandObject )
{
	var interfaceResource = this.argObject.resource;
	var sketchProject = this.argObject.sketchObject;
	var imageSource = this.argObject.imageSrc;
	
	var currentScreen = sketchProject.getCurrentScreen();
	
	var resourceHistory = currentScreen.getResourceHistory( interfaceResource.getId() );
	if( resourceHistory != null )
	{
		resourceHistory.setExtraAttribute( iResHistGlobals.defaultKeys.IMAGE_SRC, imageSource );
		globalMediators.internalMediator.publish( "ResHistExtraImgChanged", [ interfaceResource, resourceHistory ] );
	}
	else
	{
		console.error("Error while changing resource interface's extra image field" );
		return actionGlobals.IGNORE_COMMAND;
	}
	return actionGlobals.COMMAND_OK;
}

SetRestHistExtraImageCommand.prototype.undo = function( commandObject )
{
	var interfaceResource = this.argObject.resource;
	var sketchProject = this.argObject.sketchObject;
	
	var currentScreen = sketchProject.getCurrentScreen();
	
	var resourceHistory = currentScreen.getResourceHistory( interfaceResource.getId() );
	if( resourceHistory != null )
	{
		var imageSource = resourceHistory.getExtraAttribute( iResHistGlobals.defaultKeys.IMAGE_SRC );
		return new SetRestHistExtraImageCommand( basicCommandsGlobals.executionTypeEnum.CMEX_EDITION,
			interfaceResource, sketchProject, imageSource );
	}
	else
	{
		console.error("Error while creating an undo command for the resource interface's extra image field change" );
		return null;
	}
}

//TODO: It needs unitary tests
/**
 * //TODO: Finish this command commentaries
 * @constructor
 * @extends Command
 * 
 * @param {int} executionMode - A number that indicates the command execution mode.
 */
function ChangeActiveVersionCommand( executionMode, versionNumber, sketchObj )
{
	Command.call(this);
	this.commandCode = basicCommandsGlobals.commandTypeEnum.CMD_CHANGE_ACTIVE_VERSION;
	this.executionMode = executionMode;
	this.setArgs(
		{
			versionNum: versionNumber,
			sketchObject: sketchObj
		}
	);
}
ChangeActiveVersionCommand.prototype = new Command;
ChangeActiveVersionCommand.prototype.constructor = ChangeActiveVersionCommand;

ChangeActiveVersionCommand.prototype.toString = function()
{
	var versionNumber = this.argObject.versionNum;
	var sketchProject = this.argObject.newResourceCode;
	return 		"Change project's active version " + Command.prototype.toString.call( this ) + "\n" +
		"Parameters: New version number " +  versionNumber +"\n" +
		"sketch project: " + sketchProject ;
}

ChangeActiveVersionCommand.prototype.execute = function( commandObject )
{
	var versionNumber = this.argObject.versionNum;
	var sketchProject = this.argObject.sketchObject;
	var oldVersionNumber = sketchProject.getActiveVersionNumber();
	sketchProject.setActiveVersionNumber( versionNumber );
	globalMediators.internalMediator.publish( "ActiveVersionChanged", [ oldVersionNumber, sketchProject ] );
	return actionGlobals.COMMAND_OK;
}

ChangeActiveVersionCommand.prototype.undo = function( commandObject )
{
	var sketchProject = this.argObject.sketchObject;
	var versionNumber = sketchProject.getActiveVersionNumber()
	return new ChangeActiveVersionCommand( 
		basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, versionNumber, sketchProject );
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
	
	return actionGlobals.COMMAND_OK;
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
	
	return actionGlobals.COMMAND_OK;
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
	
	return actionGlobals.COMMAND_OK;
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
	
	return actionGlobals.COMMAND_OK;
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
	
	return actionGlobals.COMMAND_OK;
}

CancelSelectResourceCommand.prototype.undo = function( commandObject )
{
	var resourceArrays = commandObject.argObject.resourceArrays;
	var isAdditiveSelection = commandObject.argObject.isAdditiveSelection;
	var selectionManager = commandObject.argObject.selectionManager;
	return new SelectResourceCommand( basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, resourceArrays,
		 isAdditiveSelection, selectionManager );
}

/* TODO: See if this commented code will have no use, the same for the following factory functions
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

/**
 * Call the undo method from a command, before it was used to check the command mode and code,
 * it may be used in the future.
 *
 * @param {Object} commandObject - A command object, generally it is itself.
 * @return {Object} the undo command for this command or null if there is some error.
 * 
 */
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

/**
 * Call the execute method from a command, before it was used to check the command mode and code,
 * it may be used in the future.
 *
 * @return {int} A number that indicates if the command has been executed succcessfully or not
 * 
 */
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
	return commandObject.execute( commandObject );
}
