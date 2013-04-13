function SelectionManager()
{
	var selectedElements = new Array();
}

SelectionManager.prototype.constructor = SelectionManager;

SelectionManager.prototype.addElement = function( interfaceResource )
{
	this.selectedElements.push( interfaceResource );
}

SelectionManager.prototype.removeElement = function( interfaceResource )
{
	for (var i = 0; i < this.selectedElements.length; i++) 
    {
    	if( this.selectedElements[i].getId() == interfaceResource.getId() )
    	{
    		var obj = this.selectedElements[i];
    		this.selectedElements.splice(i,1);
    		return obj;
    	}
    }
    return null;
}