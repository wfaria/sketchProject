generalGlobals = {};
generalGlobals.manager = null;

function GeneralManager()
{
	this.editorState = 0;
	this.sketchProject = null;
	this.graphicMediator = new Mediator( "graphicMediator" );
	this.internalMediator = new Mediator( "internalMediator" );
}


GeneralManager.prototype.constructor = GeneralManager;

generalGlobals.openProject = function()
{
	manager = new GeneralManager();
}

generalGlobals.newProject = function()
{
	manager = new GeneralManager();
}
