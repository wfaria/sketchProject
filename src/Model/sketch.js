
function createArrayIterator( arrayObj )
{
	return {
		i : 0,
	    array: arrayObj, 
	    hasNext: function() {
	        return this.i < this.array.length;
	    },
	    next:   function() {
	        return this.array[this.i++];
	    },
	    getLength: function() {
	    	return this.array.length - this.i;
	    }
 	};
}



function ResourceHistory( resource )
{
	this.resourceId = resource.getId() ;
	this.timeSlots = new Array();
	this.timeSlots.push( resource );
}

ResourceHistory.prototype.getId = function()
{
	return this.resourceId;
}

ResourceHistory.prototype.getHistoryLength = function()
{
	return this.timeSlots.length;
}

ResourceHistory.prototype.toString = function()
{
	var s = "Resource history from object with id " + this.resourceId + "\n";
	for (var i = 0; i < this.timeSlots.length; i++) 
	{
		s = s + this.timeSlots[i].toString() + "\n";
	}
	return s;
}


ResourceHistory.prototype.removeVersion = function ( versionNum  )
{
	for (var i = 0; i < this.timeSlots.length; i++) 
    {
    	if( this.timeSlots[i].getVersion() == versionNum )
    	{
    		var obj = this.timeSlots[i];
    		this.timeSlots.splice(i,1);
    		return obj;
    	}
    }
    return null;
}

ResourceHistory.prototype.deleteVersion = function( versionNum )
{
	//TODO: Decide if addVersion will remove double elements and remove this line or not
	var objToDel = this.removeVersion( versionNum );
	if( objToDel != null )
	{
		var deletedObj = new DeletedResource( 0,0,0,0,0,
			objToDel.getName(), objToDel.getId(), objToDel.getVersion()  );
		this.addVersion( deletedObj );
		return deletedObj;
	}
	else
	{
		return null;
	}
}

ResourceHistory.prototype.addVersion = function ( resource )
{
	this.removeVersion( resource.getVersion() );
	this.timeSlots.push( resource );
	// Sorting by version
	this.timeSlots.sort( function(a,b){ return a.getVersion()-b.getVersion() });
}

ResourceHistory.prototype.getResourceFromVersion = function ( versionNum  )
{
	for (var i = 0; i < this.timeSlots.length; i++) 
    {
    	if( this.timeSlots[i].getVersion() == versionNum )
    	{
    		return this.timeSlots[i];
    	}
    }
    return null;
}

function cloneObject(obj) 
{
        var clone = {};
        for(var i in obj) 
        {
            if(typeof(obj[i])=="object")
                clone[i] = cloneObject(obj[i]);
            else
                clone[i] = obj[i];
        }
        return clone;
}

ResourceHistory.prototype.cloneVersion = function( numFrom, numTo )
{
	var obj = this.getResourceFromVersion( numFrom );
	if( obj != null )
	{
		var clone = cloneObject(obj);
		clone.setVersion( numTo );
		this.addVersion( clone );
		return clone;
	}
	else
	{
		return null;
	}
}

ResourceHistory.prototype.getResourceBeforeVersion = function ( versionNum  )
{
	if( this.timeSlots.length < 1 )
	{
		return null;
	} 
	else if( this.timeSlots[0].getVersion() > versionNum ) 
	{
		// If this occurs, all elements from this history are newer than the version that
		// we want, so they don't exist in this version
		return null;
	}
	else
	{
		//TODO: See if a binary search is good here, I don't think this way because this array should be pretty small 
		var resourceIndex = -1;
		for (var i = 0; i < this.timeSlots.length; i++) 
	    {
	    	if( this.timeSlots[i].getVersion() > versionNum )
	    	{
	    		return this.timeSlots[resourceIndex];
	    	}
	    	else
	    	{
	    		resourceIndex = i;
	    	}
	    }
	    if( resourceIndex == -1 )
	    	return null;
	    else
	    	return this.timeSlots[resourceIndex];
   	}
}


function Screen( name )
{
	this.name = name;
	this.resourceHistories = new Array();
	this.lastAccessedResource = null;
}

Screen.prototype.getResources = function()
{
	return this.resourceHistories;
}

Screen.prototype.getName = function()
{
	return this.name;
}

Screen.prototype.addResourceHistory = function( resource )
{
	this.resourceHistories.push( new ResourceHistory( resource ) ); 
}

Screen.prototype.getResourceHistory = function( resourceId )
{
	/*TODO: Check if it's better to check the last accessed resource to optimize here or
	 * in the screen controller method */
	var i;
	for( i = 0; i < this.resourceHistories; i++ )
	{
		if( this.resourceHistories[i].getId() == resourceId )
		{
			return this.resourceHistories[i];
		}
	}
	return null;
}

function Sketch( name, author )
{
	this.name = name;
	this.author = author;
	this.currentScreenName = "Default Screen" ;
	this.versionNum = 0;
	this.activeVersion = 0;
	this.maxIdCount = 0;
	this.screens = new Array();
	
	var firstScreen = new Screen( "Default Screen");
	this.addScreen( firstScreen );
	firstScreen.id = 0;
	/*
	 * this.targetResolutionX = 1024;
	 * this.targetResolutionY = 800;
	 */
}

Sketch.prototype.getActiveVersionNumber = function()
{
	return this.activeVersion;
}
Sketch.prototype.addScreen = function ( screenObj )
{
	if( this.getScreen( screenObj.getName() ) != null )
		return false;
	var id = this.screens.push( screenObj );
	return true;
}

Sketch.prototype.deleteScreen = function( screenName )
{
	var i;
	for( i = 0; i < this.screens.length; i++ )
	{ 
		if ( this.screens[i].getName() == screenName)
		{
			var screenObj = this.screens[i];
			if( this.currentScreenName == screenName )
			{
				this.currentScreenName = null;
			}
			this.screens.splice(i,1);
			return screenObj;
		}
	}
	return null;
}

Sketch.prototype.setScreen = function( screenName )
{
	var screenObj = this.getScreen( screenName );
	if( screenObj != null )
		this.currentScreenName = screenName;
	return screenObj;
}

Sketch.prototype.getMaxId = function()
{
	return this.maxIdCount;
}

Sketch.prototype.increaseMaxId = function()
{
	this.maxIdCount++;
}

Sketch.prototype.getScreenIterator = function()
{
	return createArrayIterator(this.screens);
}

Sketch.prototype.getCurrentScreen = function()
{
	if( this.currentScreenName == null )
		return null;
	return this.getScreen( this.currentScreenName );
}


Sketch.prototype.getScreen = function( screenName )
{
	var i;
	for( i = 0; i < this.screens.length; i++ )
	{ 
		if ( this.screens[i].getName() == screenName)
			return this.screens[i];
	}
	return null;
}

