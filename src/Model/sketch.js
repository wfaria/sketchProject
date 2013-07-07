var iResHistGlobals = {};

iResHistGlobals.defaultKeys = {};
/** @define {string} */
iResHistGlobals.defaultKeys.IMAGE_SRC = "imgSrc";

iResHistGlobals.defaultExtraValues = {};

var SketchGlobals = {};
/** @define {int} */
SketchGlobals.MAX_VERSION_NUMBER = 999999;


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


/**
 * Resource History's constructor.
 * @constructor
 * 
 * @param {InterfaceResource} resource - The base resource from this history.
 */
function ResourceHistory( resource )
{
	this.resourceId = resource.getId() ;
	this.timeSlots = new Array();
	this.timeSlots.push( resource );
	this.extra = {}; //TODO: Try to use a real array or a hashmap here (be aware with problems with serialization)
}

/**
 * Get an extra value with the given key.
 * 
 * @param {string} attributeKey - The key with the desired value.
 * @return {string} A string with the value indicated by this key or null if it doesn't exist.
 */
ResourceHistory.prototype.getExtraAttribute = function( attributeKey ) 
{	
	var attrValue =  this.extra[attributeKey]; 
	if( typeof attrValue != 'undefined' )
	{
		return attrValue;
	}
	else
	{
		return null;
	}
}

/**
 * Insert a pair <key, value> in the extra value set.
 *  
 * @param {string} attributeKey - Value's key, it must be unique, if it exists it will be overwritten.
 * @param {string} attributeValue - Any value with the string type.
 */
ResourceHistory.prototype.setExtraAttribute = function( attributeKey, attributeValue ) 
{	
	if( attributeValue == null )
	{
		this.extra[attributeKey] = attributeValue;
	} 
	else
	{
		//force string conversion
		this.extra[attributeKey] = attributeValue+"";
	}
}

/**
 * Get the Id number from this object.
 *  
 * @return {int}
 */
ResourceHistory.prototype.getId = function()
{
	return this.resourceId;
}

/**
 * Get the number of different versions from this resource.
 *  
 * @return {int}
 */
ResourceHistory.prototype.getHistoryLength = function()
{
	return this.timeSlots.length;
}

/**
 * Get an array with different versions from this resource
 *  
 * @return {Array.<InterfaceResource>} An array with these objects, don't change this array.
 */
ResourceHistory.prototype.getResources = function()
{
	return this.timeSlots;
}

/**
 * To String
 * 
 * @return {string} 
 */
ResourceHistory.prototype.toString = function()
{
	var s = "Resource history from object with id " + this.resourceId + "\n";
	for (var i = 0; i < this.timeSlots.length; i++) 
	{
		s = s + this.timeSlots[i].toString() + "\n";
	}
	return s;
}

/**
 * Remove a version from the history.
 *  
 * @param {int} versionNum - The version number to be removed.
 * @return {InterfaceResource} the object removed or null if there is no version with the givem parameter.
 */
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

/**
 * Change the deleted flag from a resource in some version
 *  
 * @param {int} versionNum - The version number to be changed.
 * @return {InterfaceResource} the object with the 'deleted' flag after a logical negation.
 */
ResourceHistory.prototype.changeDeletedFlag = function( versionNum )
{
	var objToDel = this.getResourceFromVersion( versionNum );
	if( objToDel != null )
	{
		objToDel.setDeleted( !objToDel.getDeleted() );
	}
	return objToDel;
}

/**
 * Add a new version based in one resource object.
 * If there is another version with same version number it will be overwritten.
 * 
 * @param {InterfaceResource} resource - The object to be inserted in the history. 
 */
ResourceHistory.prototype.addVersion = function ( resource )
{
	this.removeVersion( resource.getVersion() );
	this.timeSlots.push( resource );
	// Sorting by version
	this.timeSlots.sort( function(a,b){ return a.getVersion()-b.getVersion() });
}

/**
 * Get a resource with the given version number.
 * 
 * @param {int} versionNum - The version number to be selected.
 * @return {InterfaceResource} the object with this version or null if it doesn't exist.
 */
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

/**
 * Clone an object.
 * 
 * @param {Object} obj - A base object.
 * @return {Object} An new object with the exact attributes from the old one. 
 */
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

/**
 * Create a clone from one version to another version.
 * If there is already another version with the same number of the target version
 * from this function it will be overwritten.
 *  
 * @param {int} numFrom - Base version.
 * @param {int} numTo - New version.
 * @return {InterfaceResource} The cloned object or null if the base version doesn't exist.
 */
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

/**
 * Get the oldest resource with creation version greater than the passed one.
 * 
 * @param {int} versionNum - The reference version.
 * @return {InterfaceResource} An object that satisfies that condition or null if it doesn't exist.
 */
ResourceHistory.prototype.getNextFutureResource = function ( versionNum  ) 
{
	if( this.timeSlots.length < 1 )
	{
		return null;
	} 
	else
	{
		for (var i = 0; i < this.timeSlots.length; i++)
		{
			if( this.timeSlots[i].getVersion() > versionNum )
			{
				return this.timeSlots[i];
			}
		}
		// If this occurs, all elements from this history are newer than the version that
		// we want, so they don't exist in this version
		return null;
	}
}

/**
 * Get the newest resource with creation version lesser or equal than the passed one.
 * 
 * @param {int} versionNum - The reference version.
 * @return {InterfaceResource} An object that satisfies that condition or null if it doesn't exist.
 */
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


/**
 * Screen object constructor.
 * @constructor
 * 
 * @param {string} name - Screen's name.
 */
function Screen( name )
{
	this.name = name;
	this.resourceHistories = new Array();
	this.lastAccessedResource = null;
}

/**
 * Return an array with all histories in the screen.
 * 
 * @return {Array.<ResourceHistory>} An array with those histories, don't change these elements.
 */
Screen.prototype.getResources = function()
{
	return this.resourceHistories;
}

/**
 * Get Screen's name.
 * 
 * @return {string} Screen's name. 
 */
Screen.prototype.getName = function()
{
	return this.name;
}

/**
 * Add a resource history in this screen. If exists
 * some history with same id, it will be overwritten.
 * 
 * @param {ResourceHistory} resource - The Resource History to be inserted.  
 */
Screen.prototype.addResourceHistory = function( resource )
{
	this.deleteResourceHistory( resource.getId() );
	this.resourceHistories.push( new ResourceHistory( resource ) ); 
}

/**
 * Get a Resource History that have the given id.
 * 
 * @param {int} resourceId - The id to be searched.
 * @return {ResourceHistory} Returns a Resource History with the given id or null if it doesn't exist. 
 */
Screen.prototype.getResourceHistory = function( resourceId )
{
	/*TODO: Check if it's better to check the last accessed resource to optimize here or
	 * in the screen controller method */
	var i;
	for( i = 0; i < this.resourceHistories.length; i++ )
	{
		if( this.resourceHistories[i].getId() == resourceId )
		{
			return this.resourceHistories[i];
		}
	}
	return null;
}

/**
 * Delete a Resource History that have the given id.
 * 
 * @param {int} resourceId - The id to be deleted.
 * @return {ResourceHistory} Returns the deleted Resource History or null if it doesn't exist. 
 */
Screen.prototype.deleteResourceHistory = function( resourceId )
{
	var i;
	for( i = 0; i < this.resourceHistories.length; i++ )
	{
		if( this.resourceHistories[i].getId() == resourceId )
		{
			var ret = this.resourceHistories[i];
			this.resourceHistories.splice(i,1);
			return ret;
		}
	}
	return null;
}

/**
 * It is like the addResourceHistory but it adds a resource history
 * that can be with various versions, it is useful 
 * to undo the deleteResourceHistory.
 * Like the common add function it will overwrite any resource with
 * same ID.
 * 
 * @param {ResourceHistory} resourceHistory - Any object that represents a resource historic.
 */
Screen.prototype.restoreResourceHistory = function( resourceHistory )
{
	if( resourceHistory.getHistoryLength() > 0 )
	{
		this.deleteResourceHistory( resourceHistory.getId() );
		this.resourceHistories.push( resourceHistory );
	} 
	else
	{
		console.error( "Trying to restore in the screen a resource history without versions");
	}
}

/**
 * Sketch object constructor.
 * It represents a project with screens and resources.
 * @constructor
 * 
 * @param {string} name - Sketch Project's name.
 * @param {string} author - Sketch Project's author.
 */
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

/**
 * Get the newest version with some different resource from the active version.
 * The returned version is smaller than the active version.
 * 
 * @return {int} The previous existent version or -1 
 * if there is no version that satisfy that condition. 
 */
Sketch.prototype.getPreviousAvailableVersion = function()
{
	var i = 0;
	var activeVersion = this.getActiveVersionNumber();
	var currentScreen = this.getCurrentScreen();
	if( currentScreen == null )
	{
		return -1;
	}
	
	var resourceHistories = currentScreen.getResources();
	if( resourceHistories.length == 0 )
	{
		return -1;
	}
	var ret = -1;
	for( i = 0; i < resourceHistories.length; i++ )
	{
		var prevResVersion = resourceHistories[i].getResourceBeforeVersion( activeVersion-1 );
		if( prevResVersion != null && prevResVersion.getVersion() < activeVersion &&
				prevResVersion.getVersion() > ret  )
		{
			ret = prevResVersion.getVersion();
		}
	}
	return ret;
}

/**
 * Get the oldest version with some different resource from the active version.
 * Also this version must be greater than the active version.
 * 
 * @return {int} The next existent version or -1 
 * if there is no version that satisfy that condition. 
 */
Sketch.prototype.getNextAvailableVersion = function()
{
	var i = 0;
	var activeVersion = this.getActiveVersionNumber();
	var currentScreen = this.getCurrentScreen();
	if( currentScreen == null )
	{
		return -1;
	}
	
	var resourceHistories = currentScreen.getResources();
	if( resourceHistories.length == 0 )
	{
		return -1;
	}
	var ret = SketchGlobals.MAX_VERSION_NUMBER;
	var validRet = false;
	
	for( i = 0; i < resourceHistories.length; i++ )
	{
		var nextResVersion = resourceHistories[i].getNextFutureResource( activeVersion );
		if( nextResVersion != null && nextResVersion.getVersion() < ret )
		{
			ret = nextResVersion.getVersion();
			validRet = true;
		}
	}
	if( validRet )
		return ret;
	else
		return -1;
}

/**
 * Change project's active version.
 * This number must be smaller than the max number and greater than -1.
 *  
 * @param {int} number
 */
Sketch.prototype.setActiveVersionNumber = function( number )
{
	if( number < 0 )
	{
		console.error( "FATAL error: You can't set the sketch project version as a negative number" );
		return;
	}
	if( number > SketchGlobals.MAX_VERSION_NUMBER )
	{
		console.error( "FATAL error: You can't set the sketch project version a number greater than " + SketchGlobals.MAX_VERSION_NUMBER );
		return;
	}
	this.activeVersion = number;
}

/**
 * Get the project's active version.
 * 
 * @return {int} 
 */
Sketch.prototype.getActiveVersionNumber = function()
{
	return this.activeVersion;
}

/**
 * Add a screen in the project.
 *  
 * @param {Screen} screenObj - The screen object.
 * @return {boolean} false if there is already a screen with same name, otherwise returns true. 
 */
Sketch.prototype.addScreen = function ( screenObj )
{
	if( this.getScreen( screenObj.getName() ) != null )
		return false;
	var id = this.screens.push( screenObj );
	return true;
}

/**
 * Delete a screen from this project.
 *  
 * @param {string} screenName - The name of the screen to be removed.
 * @return {Screen} The removed screen or null if there is no screen with the given name.
 */
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

/**
 * Change project's current screen.
 *  
 * @param {string} screenName - The name of the screen to be selected.
 * @return {Screen} The selected screen, if there is no screen with the given name it returns the old active screen.
 */
Sketch.prototype.setScreen = function( screenName )
{
	var screenObj = this.getScreen( screenName );
	if( screenObj != null )
		this.currentScreenName = screenName;
	return screenObj;
}

/**
 * Get project's maximum id number. This number
 * hasn't been used by any resource yet.
 * 
 * @return {int} 
 */
Sketch.prototype.getMaxId = function()
{
	return this.maxIdCount;
}

/**
 * Increase the maximum id number. 
 */
Sketch.prototype.increaseMaxId = function()
{
	this.maxIdCount++;
}

Sketch.prototype.getScreenIterator = function()
{
	return createArrayIterator(this.screens);
}

/**
 * Get the current screen or null if there isn't a current screen.
 * 
 * @return {Screen} 
 */
Sketch.prototype.getCurrentScreen = function()
{
	if( this.currentScreenName == null )
		return null;
	return this.getScreen( this.currentScreenName );
}

/**
 * Get the name of the current screen, it can be null.
 * 
 * @return {string} 
 */
Sketch.prototype.getCurrentScreenName = function()
{
	return this.currentScreenName;
}

/**
 * Get a screen with name equals of the given string. If 
 * this screen doesn't exist it returns null.
 *   
 * @param {string} screenName
 * @return {Screen}
 */
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

/**
 * Return an array with the screens from this object.
 * 
 * @return {Array.<Screen>} An array with screens, don't change this array. 
 */
Sketch.prototype.getScreens = function( )
{
	return this.screens;
}


/**
 * Get sketch project's name.
 * 
 * @return {string} 
 */
Sketch.prototype.getName = function( )
{
	return this.name;
}

/**
 * Get sketch project's author string.
 * 
 * @return {string} 
 */
Sketch.prototype.getAuthor = function( )
{
	return this.author;
}
