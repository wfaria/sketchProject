var resourceTypeEnum = { IR_UNDEFINED: -1, IR_DELETED: 0, IR_BUTTON: 1, IR_WINDOW: 2, IR_TEXTLABEL: 3, IR_GROUP: 4 };

var iResGlobals = {};
iResGlobals.PARENTLESS = -1;

// This is the object that the other objects will inherit
function InterfaceResource( posX,posY,posZ,widthVal, heightVal, name, id, initialVersion )
{
	this.x = posX;
	this.y = posY;
	this.z = posZ;
	this.width = widthVal;
	this.height = heightVal;
	this.name = name;
	this.resourceType = resourceTypeEnum.IR_UNDEFINED;
	this.createdInVersion = initialVersion;
	this.id = id;
	this.parentId = iResGlobals.PARENTLESS;
	this.extra = {};
}
InterfaceResource.prototype.constructor = InterfaceResource;

InterfaceResource.prototype.toString = function()
{
	return this.getName() + ' at position ('+this.x+','+this.y+') created at the version ' + this.getVersion() +
		' with id (' + this.getId() + ')' ;	
}
InterfaceResource.prototype.getX = function() {	return this.x; }
InterfaceResource.prototype.getY = function() {	return this.y; }
InterfaceResource.prototype.getZ = function() {	return this.z; }
InterfaceResource.prototype.getHeight = function() {	return this.height; }
InterfaceResource.prototype.getWidth = function() {	return this.width; }
InterfaceResource.prototype.getId = function() {	return this.id; }
InterfaceResource.prototype.getParentId = function() {	return this.parentId; }
InterfaceResource.prototype.getName = function() {	return this.name; }
InterfaceResource.prototype.getResourceType = function() {	return this.resourceType; }
InterfaceResource.prototype.getVersion = function() {	return this.createdInVersion; }

InterfaceResource.prototype.setX = function(num) { this.x = num; }
InterfaceResource.prototype.setY = function(num) { this.y = num; }
InterfaceResource.prototype.setParentId = function(num) { this.parentId = num; }
InterfaceResource.prototype.setName = function( nameStr ) { this.name = nameStr; }

InterfaceResource.prototype.setVersion = function( versionNum ) 
{	
	this.createdInVersion = versionNum; 
}

/**
 * Get the value from an extra attribute.
 *
 * @param {string} attributeKey - The key from the desired attribute.
 * 
 * @return {string} The value from this attribute, if it does not exist
 * it returns null.
 */
InterfaceResource.prototype.getExtraAtrribute = function( attributeKey ) 
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

InterfaceResource.prototype.setExtraAtrribute = function( attributeKey, attributeValue ) 
{	
	this.extra[attributeKey] = attributeValue; 
}


function ButtonResource( posX,posY,posZ,widthVal, heightVal, name, id, initialVersion )
{
	// the function call is used to simulate the super(...) call function, you will get SYNTAX_ERR if you miss the parameter number
	InterfaceResource.call(this, posX,posY,posZ,widthVal, heightVal, name, id, initialVersion);
	this.resourceType = resourceTypeEnum.IR_BUTTON;
	this.buttonString = "Button" + id;
}
ButtonResource.prototype = new InterfaceResource;
ButtonResource.prototype.constructor = ButtonResource;
ButtonResource.prototype.toString = function()
{
	//TODO: Corrigir
	return "Button Resource: "+InterfaceResource.prototype.toString.call( this );
}


function DeletedResource( posX,posY,posZ,widthVal, heightVal, name, id, initialVersion )
{
	// the function call is used to simulate the super(...) call function, you will get SYNTAX_ERR if you miss the parameter number
	InterfaceResource.call(this, posX,posY,posZ,widthVal, heightVal, name, id, initialVersion);
	this.resourceType = resourceTypeEnum.IR_DELETED;
}
DeletedResource.prototype = new InterfaceResource;
DeletedResource.prototype.constructor = DeletedResource;
DeletedResource.prototype.toString = function()
{
	return "Deleted Resource: "+InterfaceResource.prototype.toString.call( this );
}

function GroupResource( posX,posY,posZ,widthVal, heightVal, name, id, initialVersion )
{
	// the function call is used to simulate the super(...) call function, you will get SYNTAX_ERR if you miss the parameter number
	InterfaceResource.call(this, posX,posY,posZ,widthVal, heightVal, name, id, initialVersion);
	this.resourceType = resourceTypeEnum.IR_GROUP;
	// The children are only the resources which have as parent this resource
	this.childrenObjects = [];
}
GroupResource.prototype = new InterfaceResource;
GroupResource.prototype.constructor = GroupResource;
GroupResource.prototype.toString = function()
{
	var sep = '';
	if( this.getParentId() != iResGlobals.PARENTLESS )
	{
		sep = "->";
	}
	
	var retStr = sep+"Group Resource: "+InterfaceResource.prototype.toString.call( this );
	var length = this.childrenObjects.length;

	retStr = retStr + "\n" + sep + "Children: {\n";
	for( var i = 0; i < length; i++ )
	{
		retStr = retStr + "\n" + sep + this.childrenObjects[i].toString();
	}
	retStr = retStr + "\n}\n";
	
	return retStr;
}

GroupResource.prototype.getChildren = function( )
{
	return this.childrenObjects;
}

GroupResource.prototype.findChildRecursive = function( idNum )
{
	var length = this.childrenObjects.length;
	var res;
	var obj;
	for( var i = 0; i < length; i++ )
	{
		res = this.childrenObjects[i];
		if( res.getId() == idNum )
		{
			return res;
		}
		else if( res.getResourceType() == resourceTypeEnum.IR_GROUP )
		{
			obj = res.findChildRecursive( idNum );
			if( obj != null )
			{
				return obj;
			}
		}
	}
	return null;
}

GroupResource.prototype.addChild = function( interfaceResource )
{
	// Do not allow to insert a resource already grouped
	if( interfaceResource.getParentId() != iResGlobals.PARENTLESS )
	{
		return false;
	}
	// Do not allow circular references
	if( interfaceResource.getResourceType() == resourceTypeEnum.IR_GROUP && 
		interfaceResource.findChildRecursive( this.getId() ) != null )
	{
		return false;
	}
	this.childrenObjects.push( interfaceResource );
	interfaceResource.setParentId( this.getId() );
	return true;
}

GroupResource.prototype.removeChild = function( interfaceResource )
{
	var id = interfaceResource.getId();
	var length = this.childrenObjects.length;
	for( var i = 0; i < length; i++ )
	{
		if( this.childrenObjects[i].getId() == id )
		{
			var ret = this.childrenObjects[i];
			this.childrenObjects.splice( i, 1 );
			ret.setParentId( iResGlobals.PARENTLESS );
			return ret;
		}
	}
	return null;
}
