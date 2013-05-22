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
	generalGlobals.manager.graphicController.subscribeToMediators();
	globalMediators.subscribeToMediators( this.selectionManager, "SelectionManager" );
	
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
  					onUploadProject: function()
  					{
						var innerHTMLText = '<h2>Open Sketch Project<\/h2>\n<input type=\"file\" id=\"files\" name=\"files[]\" multiple onchange=\"DataHandler.handleFileSelect(event)\" \/>';
						Popup.showPopupDiv( innerHTMLText, 10 , 10 ) ;
  					},
  					onProjectUploaded : function( JSONString )
  					{
  						try
  						{
  							var sketchObj = LocalPersistence.getUploadedProject( JSONString );
  							generalGlobals.openProject( sketchObj );
  							Popup.closePopupDiv( ) ;
  						}
  						catch(err)
  						{
  							alert(err);
  							alert( "Error while opening uploaded project" );
  						}
  						
  					},
  					onDownloadProject: function( )
  					{
  						try
  						{
							var JSONString = LocalPersistence.downloadProject( generalGlobals.manager.sketchProject );
							var uriContent = "data:application/octet-stream," + encodeURIComponent( JSONString );
							var newWindow=window.open(uriContent, 'neuesDokument');
  						}
  						catch(err)
  						{
  							alert(err);
  							alert( "Error while downloading project" );
  						}

  					},
  					onEditorStageChange: function( newState )
  					{
  						this.editorStage = newState;
  						//TODO: call this for the graphic part
  					},
  					onCreateButton: function( )
  					{
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
  					},
  					onMoveInterfaceResource: function( interfaceResource, toX, toY )
  					{
						var dragCommand = new DragResourceCommand( 
  							basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, interfaceResource, 
  							toX, toY 
  						);
  						generalGlobals.manager.actionController.doCommand( dragCommand );
  					},
  					onResizeInterfaceResource: function( interfaceResource, toX, toY, newWidth, newHeight )
  					{
  						var resizeCommand = new ResizeResizeCommand( basicCommandsGlobals.executionTypeEnum.CMEX_EDITION,
							interfaceResource, toX, toY, newWidth, newHeight );
						generalGlobals.manager.actionController.doCommand( resizeCommand );
  					},
  					onFormatInterfaceResource: function( interfaceResource, fontSize, fontFamily, xPadding, yPadding )
  					{
  						var formatCmd = new FormatResourceCommand( basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, 
  							interfaceResource, fontSize, fontFamily, xPadding, yPadding );
  						generalGlobals.manager.actionController.doCommand( formatCmd );
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
  						var commands = [];
  						if( generalGlobals.manager.selectionManager.isSelected( interfaceResource ) )
  						{
							/* do nothing */
							return;
  						}
  						else if( !isAdditiveSelection )
  						{
  							//NEVER send a reference that can be changed in other place to a command
  							var removedSelection = [];
  							var selection = generalGlobals.manager.selectionManager.getSelectedElements();
  							for( var i = 0 ; i < selection.length; i++ )
  							{
  								removedSelection[i] = selection[i];
  							}
  							commands.push ( new CancelSelectResourceCommand( basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, 
  								removedSelection, isAdditiveSelection, generalGlobals.manager.selectionManager ) );
						}

  						commands.push( new SelectResourceCommand( 
  							basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, [interfaceResource],
		 					isAdditiveSelection, generalGlobals.manager.selectionManager ) );
		 					
		 				var groupCommand = new CommandGroup( basicCommandsGlobals.executionTypeEnum.CMEX_EDITION, 
							commands, "Selecting a single element", null );
		 					
		 				generalGlobals.manager.actionController.doCommand( groupCommand );

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

generalGlobals.openProject = function( sketchObject )
{
	if( generalGlobals.manager != null )
	{
		globalMediators.internalMediator.publish( "ProjectClosed", [ ] );
	}
	globalMediators.start();
	generalGlobals.manager = new GeneralManager();
	generalGlobals.manager.sketchProject = sketchObject;
	generalGlobals.manager.subscribeToMediators();
   	globalMediators.internalMediator.publish( "ProjectCreated", 
   		[ sketchObject.getName(), sketchObject.getAuthor(), sketchObject ] );
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
   	globalMediators.internalMediator.publish( "ProjectCreated", [ nameStr, authorStr, generalGlobals.manager.sketchProject ] );
}
