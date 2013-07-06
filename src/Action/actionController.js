actionGlobals = {};
actionGlobals.IGNORE_COMMAND = 0;
actionGlobals.COMMAND_OK = 1;
actionGlobals.MAX_STACK_SIZE = 20;

/**
 * Action controller constructor.
 * @constructor
 */
function ActionController()
{
	this.undoStack = new Stack( actionGlobals.MAX_STACK_SIZE ); // represents past
	this.redoStack = new Stack( actionGlobals.MAX_STACK_SIZE ); // represent future
}

/**
 * Cancel a command from a command stack
 *
 * @param {Object} targetStack - A stack that will have it top command discarted
 * @return {Object} The removed command
 * 
 */ 
ActionController.prototype.cancelLastCommand = function( targetStack )
{
	//Just throw the top away
	targetStack.pop();
}

/**
 * Generate a command that undo the changed made by the parameter command.
 *
 * @param {Object} commandObject - The target command
 * @return {Object} The undo command
 * 
 */ 
ActionController.prototype.generateUndoCommmand = function( commandObject )
{
	var undoObject = undoFactory( commandObject );
	return undoObject;
}

/**
 * Push a command in the undo stack
 *
 * @param {Object} undoCommandObject - An undo command
 * 
 */ 
ActionController.prototype.pushUndoCommand = function( undoCommandObject )
{
	this.undoStack.push( undoCommandObject );
}

/**
 * Push a command in the redo stack
 *
 * @param {Object} undoCommandObject - A redo command.
 * 
 */ 
ActionController.prototype.pushRedoCommand = function( redoCommandObject )
{
	this.redoStack.push( redoCommandObject );
}

/**
 * Execute a command and prepare the appropriate stacks.
 *
 * @param {Object} commandObject - The target command.
 * @return {boolean} true if the command has been executed successful, otherwise returns false.
 * 
 */ 
ActionController.prototype.doCommand = function( commandObject )
{
	if( commandObject == null ) return false;
	var undoCommand  =  this.generateUndoCommmand( commandObject );
	if( undoCommand != null )
	{
		this.pushUndoCommand( undoCommand );
	}
	if( commandDigest( commandObject ) == actionGlobals.IGNORE_COMMAND )
	{
		this.cancelLastCommand( this.undoStack );
		return false;
	}
	
	// if the command is successful all command that represents the "future" are discarted
	this.redoStack = new Stack( actionGlobals.MAX_STACK_SIZE );
	return true;
}

/**
 * Undo a command executed before with this controller
 *
 * @return {Object} The executed undo object command or null if there is some error
 * 
 */ 
ActionController.prototype.undo = function()
{
	if( !this.undoStack.isEmpty() )
	{
		var undoObject = this.undoStack.pop();
		var redoObject = this.generateUndoCommmand( undoObject );
		if( redoObject != null )
		{
			this.pushRedoCommand( redoObject );
			if( commandDigest( undoObject ) == actionGlobals.IGNORE_COMMAND )
			{
				this.cancelLastCommand( this.redoStack );
				return null;
			}
			return undoObject;
		}
		else
		{
			return null;
		}
	}
	else
	{
		return null;
	}
}

/**
 * Redo a command undone before with this controller
 *
 * @return {Object} The executed redo object command or null if there is some error
 * 
 */ 
ActionController.prototype.redo = function()
{
	if( !this.redoStack.isEmpty() )
	{
		var redoObject = this.redoStack.pop();
		var undoObject = this.generateUndoCommmand( redoObject );
		if( undoObject != null )
		{
			this.pushUndoCommand( undoObject );
			if( commandDigest( redoObject ) == actionGlobals.IGNORE_COMMAND )
			{
				this.cancelLastCommand( this.undoStack );
				return null;
			}
			return redoObject;
		}
		else
		{
			return null;
		}
	}
	else
	{
		return null;
	}
}


