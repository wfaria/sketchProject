generalGlobals = {};
generalGlobals.manager = null;
generalGlobals.CONTAINER_DOMID = "container";

function GeneralManager()
{
	this.editorState = 0;
	this.sketchProject = null;
	this.actionController = new ActionController();
	this.selectionManager = new SelectionManager();
	this.graphicController = new GraphicController( generalGlobals.CONTAINER_DOMID ); 
}


GeneralManager.prototype.constructor = GeneralManager;

GeneralManager.prototype.subscribeToMediators = function()
{
	globalMediators.internalMediator.subscribe( "generalManager", true, 
  			function() // Do this way if you want to create a closure to the component
  			{	
  				return	{ // The real object (mediator component) with callback functions

  					onProjectCreated: function( projectName, authorName, sketchProject )
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
  					},
  					onCreateButton: function( )
  					{
  						/* TODO: Put this inside of a command */
  						/*
  						 1- Pegar o ID certo do projeto
  						 2- Criar o objeto
  						 3- No futuro perguntar se é exclusão total do elemento ou apenas da versão dele
  						 4- 
  						 * */	
					/*	var btn = new ButtonResource( 0,0,0,100, 50, "Button", 0, generalGlobals.manager.sketchProject.getActiveVersionNumber() );
						var currentScreen = generalGlobals.manager.sketchProject.getCurrentScreen();
						currentScreen.addResourceHistory( btn );
						globalMediators.internalMediator.publish( "InterfaceResourceCreated", [ btn ] );
						* */
						/* End of TODO */
						var command = new CreateResourceCommand( 
							basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, 
							resourceTypeEnum.IR_BUTTON, generalGlobals.manager.sketchProject );
						generalGlobals.manager.actionController.doCommand( command );
						console.log("Temporary button creation, fix it");

  					},
  					onRenameElement: function( interfaceResource, newNameStr )
  					{
						var command = new RenameResourceCommand( 
							basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, 
							interfaceResource, newNameStr
						);
						generalGlobals.manager.actionController.doCommand( command );
						console.log("The button creation isn't setting the id properly yet, so this part can't be undone properly yet");

  					},
  					onUndo: function( )
  					{
  						generalGlobals.manager.actionController.undo();
  					},
  					onRedo: function( )
  					{
  						generalGlobals.manager.actionController.redo();
  					}
  				};
  			}()

		); //end mediator.subscribe( compName, true, ...
			
			
	globalMediators.graphicMediator.subscribe( "generalManager", true, 
  			function() // Do this way if you want to create a closure to the component
  			{	
  				return	{ // The real object (mediator component) with callback functions

  					onEditorDragEnd: function( evt, interfaceResource, kineticShape )
  					{
  						var dragCommand = new DragResourceCommand( 
  							basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, interfaceResource, 
  							kineticShape.getX(), kineticShape.getY() 
  						);
  						generalGlobals.manager.actionController.doCommand( dragCommand );
  					},
  					onResourceClicked: function( evt, interfaceResource )
  					{
  						var isAdditiveSelection = evt.ctrlKey;

  						var command = new SelectResourceCommand( 
  							basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, [interfaceResource],
		 					isAdditiveSelection, generalGlobals.manager.selectionManager );
		 				generalGlobals.manager.actionController.doCommand( command );
						console.log("The button creation isn't setting the id properly yet, so this part can't work properly yet");

  					},
  					onEditorStageChange: function( newState )
  					{
  						this.editorStage = newState; //TODO: It's state, not stage
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
	if( generalGlobals.manager != null )
	{
		globalMediators.internalMediator.publish( "ProjectClosed", [ ] );
	}
	globalMediators.start();
	generalGlobals.manager = new GeneralManager();
	generalGlobals.manager.sketchProject = new Sketch( nameStr , authorStr );
	generalGlobals.manager.subscribeToMediators();
	generalGlobals.manager.graphicController.subscribeToMediators();
   	globalMediators.internalMediator.publish( "ProjectCreated", [ nameStr, authorStr, generalGlobals.manager.sketchProject ] );

}
