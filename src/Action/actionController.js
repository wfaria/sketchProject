actionGlobals = {};
actionGlobals.IGNORE_COMMAND = 0;
actionGlobals.COMMAND_OK = 1;
actionGlobals.MAX_STACK_SIZE = 20;

function ActionController()
{
	this.undoStack = new Stack( actionGlobals.MAX_STACK_SIZE ); // represents past
	this.redoStack = new Stack( actionGlobals.MAX_STACK_SIZE ); // represent future
}

ActionController.prototype.cancelLastCommand = function( targetStack )
{
	//Just throw the top away
	targetStack.pop();
}

ActionController.prototype.generateUndoCommmand = function( commandObject )
{
	var undoObject = undoFactory( commandObject );
	return undoObject;
}

ActionController.prototype.pushUndoCommand = function( undoCommandObject )
{
	this.undoStack.push( undoCommandObject );
}

ActionController.prototype.pushRedoCommand = function( undoCommandObject )
{
	this.redoStack.push( undoCommandObject );
}

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


