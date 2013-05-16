function SelectionManager()
{
	this.selectedElements = new Array();
}

SelectionManager.prototype.constructor = SelectionManager;

SelectionManager.prototype.addElement = function( interfaceResourceArray, isAdditiveSelection )
{
	var length = interfaceResourceArray.length;
	var iR;
	var i;
	
	if( !isAdditiveSelection )
	{
		this.eraseSelection();
	}
	
	for( i = 0; i < length; i++ )
	{
		iR = interfaceResourceArray[i];

		if( isAdditiveSelection )
		{
			this.removeElement( [iR] );
		}
		this.selectedElements.push( iR );
	}
}

SelectionManager.prototype.removeElement = function( interfaceResourceArray )
{
	var length = interfaceResourceArray.length;
	var iR;
	var i;
	var remNum = 0;
	for( i = 0; i < length; i++ )
	{
		iR = interfaceResourceArray[i];
		for (var j = 0; j < this.selectedElements.length; j++) 
	    {
	    	if( this.selectedElements[j].getId() == iR.getId() )
	    	{
	    		this.selectedElements.splice(j,1);
	    		remNum++;
	    	}
	    }
	}
	return remNum;
}

SelectionManager.prototype.eraseSelection = function()
{
	this.selectedElements = new Array();
}

SelectionManager.prototype.getSelectedElements = function()
{
	return this.selectedElements;
}



/******** Graphic Mediator functions **********/

SelectionManager.prototype.onResourceSelected = function( resourceArray )
{
	if( resourceArray.length == 1)
	{
		sideMenu.createResourceBasicSection(resourceArray[0]);
	}
	else
	{
		alert("Multiple selection isn't working");
	}
}

SelectionManager.prototype.onResourceSelectCanceled = function( resourceArray )
{
	if( this.getSelectedElements.length == 0 )
	{
		sideMenu.removeResourceBasicSection();
	}
}

SelectionManager.prototype.onProjectCreated = function( projectName, authorName, sketchProject )
{
	sideMenu.removeResourceBasicSection();
}

SelectionManager.prototype.onInterfaceResourceMoved = function( interfaceResource, oldX, oldY )
{
	sideMenu.updateValue( DOMglobals.X_TEXT_ID, interfaceResource.getX() );
	sideMenu.updateValue( DOMglobals.Y_TEXT_ID, interfaceResource.getY() );		
}
