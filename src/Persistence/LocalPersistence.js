LocalPersistence = {};

//TODO: Test Crockford's json2.js. 
//TODO: Add file sanity check

LocalPersistence.downloadProject = function( sketchObject )
{
	var JSONString = JSON.stringify( sketchObject );
	
	return JSONString;
}


LocalPersistence.uploadProject = function( fileString )
{
	// Recreating the objects
	var sketchObject = JSON.parse( fileString );
	
	//alert( JSON.stringify( sketchObject ) ) ;
	
	var i = 0;
	var screens = null;
	/*
	 * Fixing their prototypes, if you got some
	 * mysterious error about missing functions after loading a project,
	 * this can be the error's origin.
	 */
	sketchObject.__proto__ = Sketch.prototype;
	
	screens = sketchObject.getScreens();
	for( i = 0; i < screens.length; i++ )
	{
		screens[i].__proto__ = Screen.prototype;
	}
	
	return sketchObject;
	
}
