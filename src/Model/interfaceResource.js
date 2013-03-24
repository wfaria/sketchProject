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

InterfaceResource.prototype.setVersion = function( versionNum ) 
{	
	this.createdInVersion = versionNum; 
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
	this.childrenIds = [];
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

GroupResource.prototype.addChild = function( interfaceResource )
{
	// TODO: Do check to avoid circular reference
	this.childrenIds.push( interfaceResource.getId );
	this.childrenObjects.push( interfaceResource );
	interfaceResource.setParentId( this.getId() );
}
