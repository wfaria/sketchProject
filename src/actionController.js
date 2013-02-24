function ActionController()
{
	this.undoStack = new Stack();
	this.redoStack = new Stack();
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
	commandDigest( commandObject );
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
			commandDigest( undoObject ); 
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
			commandDigest( redoObject ); 
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


