var LocalPersistence = {};

//TODO: Test Crockford's json2.js. 
//TODO: Add file sanity check

LocalPersistence.getUploadedProject = function( fileString )
{
	return LocalPersistence.convertToObject( fileString );
}

LocalPersistence.downloadProject = function( sketchObject )
{
	return LocalPersistence.convertToString( sketchObject );
}

LocalPersistence.convertToString = function ( sketchObject )
{
	var JSONString = JSON.stringify( sketchObject );
	alert( "@#@#@"+ JSONString);
	return JSONString;
}

LocalPersistence.convertToObject = function( fileString )
{
	// Recreating the objects
	var sketchObject = JSON.parse( fileString );
	
	//alert( JSON.stringify( sketchObject ) ) ;
	
	var i = 0;
	var j = 0;
	var k = 0;
	var screens = null;
	var histories = null;
	var resources = null;
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
		histories =  screens[i].getResources();
		
		for( j = 0; j < histories.length; j++ )
		{
			histories[j].__proto__ = ResourceHistory.prototype;
			resources =  histories[j].getResources();
			
			for( k = 0; k < resources.length; k++ )
			{
				resources[k].__proto__ = window[ resources[k].prototypeName ].prototype;
			}
		}
	}
	
	return sketchObject;
	
}
