/**
 * Selection manager constructor. This object defines which elements are selected.
 * @constructor
 */
function SelectionManager()
{
	this.selectedElements = new Array();
}
SelectionManager.prototype.constructor = SelectionManager;

/**
 * Set the given resources as selected ones.
 * 
 * @param {Array.<InterfaceResource>} interfaceResourceArray - An array with resources to be selected.
 * @param {boolean} isAdditiveSelection - If this one is false, then all selection must be canceled before doing this selection.
 */
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

/**
 * Checks if a given resource is selected.
 * 
 * @param {InterfaceResource} interfaceResource -  Any interface resource.
 * @return {boolean} True if the resource has been selected, otherwise false.
 */
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

/**
 * Cancel a selection from a set of passed resources.
 * 
 * @param {Array.<InterfaceResource>} interfaceResourceArray - An array with resources to be unselected.
 * @return {int} The number of unselected elements. 
 */
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

/**
 * Set all resources as unselected. 
 */
SelectionManager.prototype.eraseSelection = function()
{
	this.selectedElements = new Array();
}

SelectionManager.prototype.getSelectedElements = function()
{
	return this.selectedElements;
}



/******** Graphic Mediator functions **********/
//TODO: Separate the sideMenu controller from this object (or not?)
/**
 * EventKey: ResourceSelected.
 * Sent when a group of resources are selected on the canvas.
 *
 * @param {Array} resourceArray - An array with the selected elements
 */
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

/**
 * EventKey: ResourceSelectCanceled.
 * Sent when a group of selected resources are unselected.
 *
 * @param {Array} resourceArray - An array with the unselected elements
 */
SelectionManager.prototype.onResourceSelectCanceled = function( resourceArray )
{
	if( this.getSelectedElements.length == 0 )
	{
		sideMenu.removeResourceBasicSection();
	}
}

/******** Internal Mediator functions **********/

/**
 * EventKey: ActiveVersionChanged.
 * Sent when a project has its active version number changed
 *
 * @param {int} oldVersionNumber - Project's last version
 * @param {Sketch} sketchProject - Project's object with the version changed
 */
SelectionManager.prototype.onActiveVersionChanged = function( oldVersionNumber, sketchProject )
{
	sideMenu.updateVersionChangers();
	var versionNumber = sketchProject.getActiveVersionNumber();
	sideMenu.updateValue( DOMglobals.PROJECT_VERSION_ID,  versionNumber );
}

/**
 * EventKey: ProjectCreated.
 * Sent when a project is created 
 *
 * @param {String} projectName - New project's name
 * @param {String} authorName - New project's author
 * @param {Sketch} sketchProject - New project's object
 */
SelectionManager.prototype.onProjectCreated = function( projectName, authorName, sketchProject )
{
	sideMenu.removeResourceBasicSection();
	sideMenu.createProjectSection( sketchProject );
}

/**
 * EventKey: InterfaceResourceMoved.
 * Sent when a interface resource is moved
 *
 * @param {InterfaceResource} interfaceResource - The object that contains the data from an interface resource.
 * @param {int} oldX - The last X position from the resource.
 * @param {int} oldY - The last Y position from the resource.
 */
SelectionManager.prototype.onInterfaceResourceMoved = function( interfaceResource, oldX, oldY )
{
	if( sideMenu.containsId(DOMglobals.BASIC_RESOURCE_ID ) )
	{
		sideMenu.updateValue( DOMglobals.X_TEXT_ID, interfaceResource.getX() );
		sideMenu.updateValue( DOMglobals.Y_TEXT_ID, interfaceResource.getY() );
	}		
}

/**
 * EventKey: InterfaceResourceResized.
 * Sent when a interface resource is resized
 *
 * @param {InterfaceResource} interfaceResource - The object that contains the data from an interface resource.
 * @param {int} oldX - The old X position from the resource.
 * @param {int} oldY - The old Y position from the resource.
 * @param {int} oldWidth - old resource width.
 * @param {int} oldHeight - old resource height.
 */
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

 /**
 * EventKey: ResourceFormatted.
 * Sent when an interface resource have its text formatted
 *
 * @param {InterfaceResource} interfaceResource - The object that contains the data from an interface resource.
 */
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

 /**
 * EventKey: ResourceNameChanged
 * Sent when a interface resource name's changed
 *
 * @param {InterfaceResource} interfaceResource - The data object from the shape which has been clicked
 * @param {String} newNameStr - The new name's String
 */
SelectionManager.prototype.onResourceNameChanged = function( interfaceResource, newNameStr )
{
	if( sideMenu.containsId(DOMglobals.BASIC_RESOURCE_ID ) )
	{
		sideMenu.updateValue( DOMglobals.NAME_ID, newNameStr );
	}
}

/**
 * EventKey: InterfaceResourceZChanged.
 * Sent when an interface resource have its Z-index changed.
 *
 * @param {InterfaceResource} interfaceResource - The object that contains the data from an interface resource.
 * @param {int} oldZ - The last Z value.
 */
SelectionManager.prototype.onInterfaceResourceZChanged = function( interfaceResource, oldZ )
{
	if( sideMenu.containsId(DOMglobals.BASIC_RESOURCE_ID ) )
	{
		sideMenu.updateValue( DOMglobals.Z_TEXT_ID, interfaceResource.getZ() );
	}
}

/**
 * EventKey: ResourceHistoryDeleted.
 * Sent when an entire resource history is deleted
 *
 * @param {InterfaceResource} interfaceResourceHistory - The object that contains the data from an interface resource history.
 */
SelectionManager.prototype.onResourceHistoryDeleted = function( interfaceResourceHistory )
{
	sideMenu.updateVersionChangers();
}

/**
 * EventKey: ResourceVersionAdded.
 * Sent when some resource have a version added
 *
 * @param {InterfaceResource} resourceTimeSlotObj - The added element in the resouce's history object.
 * @param {ResourceHistory} resourceHistory - The resource's history without the removed element
 * @param {int} sketchActiveVersion - A number indicating project's active version when this operation has been done
 */
SelectionManager.prototype.onResourceVersionAdded = function( resourceTimeSlotObj, resourceHistory, sketchActiveVersion  )
{
	sideMenu.updateVersionChangers();
}

/**
 * EventKey: ResourceVersionRemoved.
 * Sent when some resource have a version removed
 *
 * @param {InterfaceResource} removedResource - The removed element from the resouce's history object.
 * @param {ResourceHistory} resourceHistory - The resource's history without the removed element
 * @param {int} sketchActiveVersion - A number indicating project's active version when this operation has been done
 */
SelectionManager.prototype.onResourceVersionRemoved = function( removedResource, resourceHistory, sketchActiveVersion )
{
	sideMenu.updateVersionChangers();
}

/**
 * EventKey: ResourceVersionCloned.
 * Sent when some resource have a version cloned.
 *
 * @param {InterfaceResource} clonedObj - The clone object from the new version.
 * @param {int} baseVersion - A number indicating the base version from the clone.
 * @param {ResourceHistory} resourceHistory - The resource's history with the new clone
 * @param {int} sketchActiveVersion - A number indicating project's active version when this clone was made
 */
SelectionManager.prototype.onResourceVersionCloned = function( clonedObj, baseVersion, resourceHistory, sketchActiveVersion )
{
	sideMenu.updateVersionChangers();
}