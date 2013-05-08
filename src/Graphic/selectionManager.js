function SelectionManager()
{
	var selectedElements = new Array();
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
			removeElement( [iR] );
		}
		this.selectedElements.push( iR );
	}
}

SelectionManager.prototype.removeElement = function( interfaceResourceArray )
{
	var length = interfaceResourceArray.length;
	var iR;
	var i;
	for( i = 0; i < length; i++ )
	{
		iR = interfaceResourceArray[i];
		for (var j = 0; j < this.selectedElements.length; j++) 
	    {
	    	if( this.selectedElements[j].getId() == iR.getId() )
	    	{
	    		this.selectedElements.splice(j,1);
	    		return;
	    	}
	    }
	}
}

SelectionManager.prototype.eraseSelection = function()
{
	this.selectedElements = new Array();
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
	if( resourceArray.length == 1)
	{
		
	}
}

