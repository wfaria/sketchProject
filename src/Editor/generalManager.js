generalGlobals = {};
generalGlobals.manager = null;
generalGlobals.CONTAINER_DOMID = "container";

function GeneralManager()
{
	this.editorState = 0;
	this.sketchProject = null;
	this.graphicMediator = new Mediator( "graphicMediator" );
	this.internalMediator = new Mediator( "internalMediator" );
	this.actionController = new ActionController();
	// this.graphicController = new GraphicController( generalGlobals.CONTAINER_DOMID ); removed for test 
}


GeneralManager.prototype.constructor = GeneralManager;

GeneralManager.prototype.subscribeToMediators = function()
{
	this.internalMediator.subscribe( "generalManager", true, 
  			function() // Do this way if you want to create a closure to the component
  			{	
  				return	{ // The real object (mediator component) with callback functions

  					onCreateProject: function( projectName, authorName )
  					{
  						//TODO: kill the graphic canvas and free the manager object
  					},
  					onCloseProject: function( mustSave )
  					{
  						//TODO: kill the graphic canvas and free the manager object
  					},
  					onSaveProject: function( )
  					{
  						//TODO: this.sketch.Serialize
  					},
  					onEditorStageChange: function( newState )
  					{
  						this.editorStage = newState;
  						//TODO: call this for the graphic part
  					}
  				};
  			}()

		); //end mediator.subscribe( compName, true, ...
			
			
	this.graphicMediator.subscribe( "generalManager", true, 
  			function() // Do this way if you want to create a closure to the component
  			{	
  				return	{ // The real object (mediator component) with callback functions

  					onEditorDragEnd: function( evt, interfaceResource, kineticShape )
  					{
  						var dragCommand = new KineticDragCommand( 
  							basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, interfaceResource, 
  							kineticShape, kineticShape.getX(), kineticShape.getY() 
  						);
  						generalGlobals.manager.actionController.doCommand( dragCommand );
  					},
  					onEditorClick: function( evt, interfaceResource, kineticShape  )
  					{
  						generalGlobals.manager.actionController.undo();
  						//alert("undo");
  					},
  					onEditorStageChange: function( newState )
  					{
  						this.editorStage = newState;
  						//TODO: call this for the graphic part
  					}
  				};
  			}()

		); //end mediator.subscribe( compName, true, ...
}



generalGlobals.openProject = function()
{
	manager = new GeneralManager();
	generalGlobals.manager.subscribeToMediators();
}

generalGlobals.newProject = function(  nameStr , authorStr  )
{
	generalGlobals.manager = new GeneralManager();
	generalGlobals.manager.sketchProject = new Sketch( nameStr , authorStr );
	generalGlobals.manager.subscribeToMediators();
   	generalGlobals.manager.internalMediator.publish( "CreateProject", [ nameStr, authorStr ] );

}
