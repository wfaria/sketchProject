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

SelectionManager.prototype.isSelected = function( interfaceResource )
{
	for (var j = 0; j < this.selectedElements.length; j++) 
    {
    	if( this.selectedElements[j].getId() == interfaceResource.getId() )
    	{
    		return true;
    	}
    }
    return false;
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
	else if( resourceArray.length > 0 )
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

/******** Internal Mediator functions **********/

SelectionManager.prototype.onActiveVersionChanged = function( oldVersionNumber, sketchProject )
{
	var versionNumber = sketchProject.getActiveVersionNumber();
	sideMenu.updateValue( DOMglobals.PROJECT_VERSION_ID,  versionNumber );
}

SelectionManager.prototype.onProjectCreated = function( projectName, authorName, sketchProject )
{
	sideMenu.removeResourceBasicSection();
	sideMenu.createProjectSection( sketchProject );
}

SelectionManager.prototype.onInterfaceResourceMoved = function( interfaceResource, oldX, oldY )
{
	if( sideMenu.containsId(DOMglobals.BASIC_RESOURCE_ID ) )
	{
		sideMenu.updateValue( DOMglobals.X_TEXT_ID, interfaceResource.getX() );
		sideMenu.updateValue( DOMglobals.Y_TEXT_ID, interfaceResource.getY() );
	}		
}

SelectionManager.prototype.onInterfaceResourceResized = function( interfaceResource, oldX, oldY, oldWidth, oldHeight )
{
	if( sideMenu.containsId(DOMglobals.BASIC_RESOURCE_ID ) )
	{
		sideMenu.updateValue( DOMglobals.X_TEXT_ID, interfaceResource.getX() );
		sideMenu.updateValue( DOMglobals.Y_TEXT_ID, interfaceResource.getY() );
		sideMenu.updateValue( DOMglobals.WIDTH_TEXT_ID, interfaceResource.getWidth() );
		sideMenu.updateValue( DOMglobals.HEIGHT_TEXT_ID, interfaceResource.getHeight() );
	}	
}

SelectionManager.prototype.onResourceFormatted = function( interfaceResource )
{
	//TODO: ADD the rest of the changed elements
	if( sideMenu.containsId(DOMglobals.BASIC_RESOURCE_ID ) )
	{
		var fontSize = interfaceResource.getIntExtraAttribute( iResGlobals.defaultKeys.FONTSIZE_KEY );
		var fontFamily = interfaceResource.getExtraAttribute( iResGlobals.defaultKeys.FONTTYPE_KEY );
		
		sideMenu.updateValue( DOMglobals.FONTSIZE_TEXT_ID, fontSize );
		
		sideMenu.updateSelectValue( DOMglobals.FONTSTYLE_TEXT_ID, fontFamily );
	}
}

SelectionManager.prototype.onResourceNameChanged = function( interfaceResource, newNameStr )
{
	if( sideMenu.containsId(DOMglobals.BASIC_RESOURCE_ID ) )
	{
		sideMenu.updateValue( DOMglobals.NAME_ID, newNameStr );
	}
}