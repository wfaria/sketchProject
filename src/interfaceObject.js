var KINECTJS_SCRIPT_NAME = 'kinetic-v4.0.0.js';


var resourceTypeEnum = { FRAME: 0, BUTTON: 1, WINDOW: 2, TEXTLABEL: 3 };

/*** InterfaceResource base-prototype and other objects definition ***/
// look more at http://phrogz.net/JS/classes/OOPinJS2.html

// This is the object that the other objects will inherit
function InterfaceResource( posX,posY,widthVal, heightVal, name, resourceTypeString )
{
	this.x = posX;
	this.y = posY;
	this.width = widthVal;
	this.height = heightVal;
	this.name = name;
	this.actionListeners = new Array();
	this.resourceType = resourceTypeString;
}
InterfaceResource.prototype.constructor = InterfaceResource;
InterfaceResource.prototype.toString = function()
{
	return 'Interface Resource ' + this.name + ' at position ('+this.x+','+this.y+')';	
}
InterfaceResource.prototype.getX = function() {	return this.x; }
InterfaceResource.prototype.getY = function() {	return this.y; }
InterfaceResource.prototype.getName = function() {	return this.name; }

function ButtonResource( posX,posY,widthVal, heightVal, name, resourceTypeString )
{
	// the function call is used to simulate the super(...) call function, you will get SYNTAX_ERR if you miss the parameter number
	InterfaceResource.call(this, posX,posY,widthVal, heightVal, name, resourceTypeString );
}
ButtonResource.prototype = new InterfaceResource;
ButtonResource.prototype.constructor = ButtonResource;
ButtonResource.prototype.toString = function()
{
	//TODO: Corrigir
	alert( InterfaceResource.prototype.toString.call( this ) );
	return "b";
}

/*********************************************/

/*** SketchProject definition ***/
function SketchProject( name, author )
{
	this.name = name;
	this.author = author;
	this.versions = new Array();
	this.activeVersion = 0;
}

SketchProject.prototype.toString = function()
{
	return 'Sketch project ' + this.name + ' by ' + this.author + ' with ' + this.versions.length + ' versions';	
}


SketchProject.prototype.addVersion= function( version ) { return this.versions.push( version ); }

SketchProject.prototype.getVersions = function() { return this.versions; }
/*********************************************/

/*** Version definition ***/
function Version( num )
{
	this.number = num;
	this.layers = new Array();
}

Version.prototype.getLayers = function() { return this.layers; }
Version.prototype.addLayer= function( layer ) { return this.layers.push( layer ); }

/*********************************************/

/*** Layer definition ***/
function Layer( num )
{
	this.number = num;
	this.resources = new Array();
}

Layer.prototype.getResources = function() { return this.resources; }
Layer.prototype.addResource= function( resource ) { return this.resources.push( resource ); }
/*********************************************/

/*** Button drawing definition ***/

function ButtonDrawingObject( fillColor, isDraggable, widthVal, heightVal )
{
	var fill = fillColor;
	var isDraggable = isDraggable;
	var width = widthVal;
	var height = heightVal;
}

/*********************************************/

/*** Visual functions definition ***/
function getKinectConfigObject( interfaceResource )
{
	if( interfaceResource.resourceType == resourceTypeEnum.BUTTON )
	{
		return {
              x: interfaceResource.x,
              y: interfaceResource.y,
              fill: "gray",
              stroke: "black",
              strokeWidth: 4,
              draggable: true,
              width: interfaceResource.width,
              height: interfaceResource.height
           };
	}
}

function createKinectObject( interfaceResource, layer )
{
	if( interfaceResource.resourceType == resourceTypeEnum.BUTTON )
	{
 	   var box = new Kinetic.Rect( getKinectConfigObject( interfaceResource ) );

            box.on("dragstart", function() {
              layer.draw();
            });

            box.on("dragmove", function() {
              document.body.style.cursor = "pointer";
            });
            /*
             * dblclick to remove box for desktop app
             * and dbltap to remove box for mobile app
             */
            box.on("dblclick dbltap", function() {
              layer.remove(box);
              layer.draw();
            });

            box.on("mouseover", function() {
              document.body.style.cursor = "pointer";
            });
            box.on("mouseout", function() {
              document.body.style.cursor = "default";
            });

            layer.add(box);
   	}
}

function createSketchCanvas( sketchProject )
{
	var kinectStage = new Kinetic.Stage({
          container: "container",
          width: 500,
          height: 500
        });
        
        var versions = sketchProject.getVersions();
        
        for (var i = 0; i < versions.length; i++) 
        {
        	/* Drawing layers */
        	var layers = versions[i].getLayers();
        	var kinectLayer = new Kinetic.Layer();
        	for (var j = 0; j < layers.length; j++) 
        	{
        		var resources = layers[i].getResources();
        		// Drawing elements from the layer
        		for (var k = 0; k < resources.length; k++) 
        		{
        			createKinectObject( resources[k], kinectLayer );
        		}
        		kinectStage.add( kinectLayer );
        	}
        }
}
/*********************************************/


/*** Start data test ***/

function initData( n ) 
{
	var sketch = new SketchProject( 'Test', 'WVF' );
	var version = new Version ( 0 );
	var layer = new Layer( 0 );
	for( var i = 0; i < n; i ++ )
	{
		//var b =  new InterfaceResource(i*5 + 150, i*5 + 40, 
		//			100, 50, 'button_'+i, resourceTypeEnum.BUTTON  );
		var b =  new ButtonResource(i*1 + 150, i*1 + 40, 
				100, 50, 'button_'+i, resourceTypeEnum.BUTTON  );
		layer.addResource( b ); //TODO: Troquei aqui do Interface para ButtonResource
	}
	version.addLayer( layer );
	sketch.addVersion( version );

	return sketch;

}

/*********************************************/