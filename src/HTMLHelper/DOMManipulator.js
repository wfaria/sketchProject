/**  MenuBar functions **/

var DOMglobals = {};
DOMglobals.SIDE_BAR_ID = "sideBar";
DOMglobals.BASIC_RESOURCE_ID = "basic resource";
DOMglobals.NAME_ID = "_resource_name";
DOMglobals.X_TEXT_ID = "_basic_x_input";
DOMglobals.Y_TEXT_ID = "_basic_y_input";
DOMglobals.WIDTH_TEXT_ID = "basic resource";
DOMglobals.HEIGHT_TEXT_ID = "basic resource";
DOMglobals.FONTSIZE_TEXT_ID = "font size";
DOMglobals.FONTSTYLE_TEXT_ID = "font style";
DOMglobals.SIDE_SECTION_CLASS = "sideMenuSection";
DOMglobals.SECTION_PART_CLASS = "sectionPart";

DOMglobals.DELETE_VERSION_ID = "del_version_btn";
DOMglobals.REMOVE_VERSION_ID = "rem_version_btn";
DOMglobals.DELETE_RESOURCE_ID = "del_history_btn";
DOMglobals.CLONE_VERSION_ID = "clone_version_btn";
DOMglobals.CHANGE_IMG_ID = "change_img_btn";

DOMglobals.PROJECT_SECTION_ID = "project_section";
DOMglobals.PROJECT_VERSION_ID = "project_version_btn";

DOMglobals.MEDIA_PATH = "../media/img/";

function $( idStr )
{
	return document.getElementById( idStr );
}

function getULId( parentId )
{
	return parentId+"ul";
}

function getLIId( liTextValue )
{
	return liTextValue+"li";
}

function createInnerUL( parentId, classStr )
{
	var innerUL = document.createElement( "ul" );
	innerUL.id = getULId( parentId );
	innerUL.className = classStr;
	return innerUL;
}

function createMenuBar( newMenuBarIdStr )
{
	var newDOM = document.createElement( "div" );
	newDOM.id = newMenuBarIdStr;
	var innerUL = createInnerUL( newMenuBarIdStr, "nav" );
	newDOM.appendChild( innerUL );
	return newDOM;
}

function createMenuButtonGroup( parentId, buttonStr )
{
	var realParent = null;
	if( document.getElementById( getULId( parentId ) ) != null ) // The real parent is inside of the fake parent
		realParent = document.getElementById( getULId( parentId ) ); 
	else
	{
		alert("There is no button parent with id " + parentId );
		return null;
	}

	var newLi = document.createElement( "li" );
	var newA = document.createElement( "a" );
	newLi.id = getLIId( buttonStr );
	newA.className = "fly";
	newA.setAttribute( "href", "#" );
	newA.setAttribute( "tabindex", "1" );
	newA.innerHTML =  buttonStr;
	newLi.appendChild( newA );
	
	realParent.appendChild( newLi );
		
	var newUL = createInnerUL( buttonStr, "dd" );
	newLi.appendChild( newUL );
	return newLi;
}

function createMenuButton( parentId, buttonStr, onClickString )
{
	var realParent = null;
	if( document.getElementById( getULId( parentId ) ) != null ) // The real parent is inside of the fake parent
		realParent = document.getElementById( getULId( parentId ) ); 
	else
	{
		alert(" Error while creating menu button, there is no button parent with id " + parentId );
		return null;
	}

	var newLi = document.createElement( "li" );
	var newA = document.createElement( "a" );
	newLi.id = getLIId( buttonStr );
	newA.setAttribute( "href", "#" );
	newA.setAttribute( "onclick", onClickString );
	newA.innerHTML =  buttonStr;
	newLi.appendChild( newA );
	realParent.appendChild( newLi );
	return newLi;
}

/** HTML code generators **/
var htmlGen = {};

htmlGen.numberCheckEvent = function( eventStr )
{
	//Test if the value from the input is a number
	return 'if( /^\\d+$/.test( this.value ){ ' +eventStr+'; } else { alert(\"aaahh\"); this.value=\"0\";}';
}

htmlGen.createSectionLine = function()
{
	return '<hr class = "sectionLine">';
}

htmlGen.createTextButton = function( idStr, labelStr, valueStr, onClickEventStr )
{
	return '<a class="sectionTextButton" id ="'+idStr+'container" onclick="'+onClickEventStr+
		'"> '+labelStr+' <input type="text" id ="'+idStr+'" value="'+valueStr+'" disabled="disabled"/></a>';
}

/**
 * Creates a string that represents a text input.
 *
 * @param {string} labelStr - The element's label
 * @param {string} idStr - The element's id
 * @param {int} sizeNum - The element's value attribute
 * @param {int} initialValue - The element's value attribute initial value
 * @param {string} onKeyUpEventStr - A string with the code of the 'onkeyup' event to be activated
 * 
 * @return {string} An innerHTML string of this input element
 */
htmlGen.createTextInputString = function( labelStr, idStr, sizeNum, initialValue, onKeyUpEventStr )
{
	return labelStr + ': <input type=\"text\"  id = \"'+idStr+
		'\" class=\"sectionTextInput\" size =\"'+sizeNum+'\" value="' + initialValue +
		'" onkeyup=\"'+onKeyUpEventStr+'\" /> <br\>';
}

/**
 * Creates a string that represents a text input.
 * This function also adds an extra check for integer
 *
 * @param {string} labelStr - The element's label
 * @param {string} idStr - The element's id
 * @param {int} sizeNum - The element's value attribute
 * @param {int} initialValue - The element's value attribute initial value
 * @param {string} onKeyUpEventStr - A string with the code of the 'onkeyup' event to be activated
 * 
 * @return {string} An innerHTML string of this input element
 */
htmlGen.createNumberInputString = function( labelStr, idStr, sizeNum, initialValue, onKeyUpEventStr )
{
	return labelStr + ': <input type=\"text\"  id = \"'+idStr+
		'\" size =\"'+sizeNum+'\" value="' + initialValue +
		'" onkeyup=\"'+htmlGen.numberCheckEvent(onKeyUpEventStr)+'\" > <br\>';
}

/**
 * Call internalMediator's publish function only if the passed
 * argument represents a valid number
 *
 * @param {string} numToCheck - The string to check
 * @param {int} min - Minimum valid value from the number
 * @param {int} initialValue - Maximum valid value from the number
 * @param {string} eventKey - A string with the event key
 * @param {...[?]} parameterArray -  A variable number of variables of different types that the event can use,
 * be careful, if you are planning to use the checked number as a parameters, using parseInt before sending it
 */
htmlGen.numberEventToInterMediator = function( numToCheck, min, max, eventKey,  parameterArray )
{
	if( /^\d+$/.test( numToCheck ) )
	{
		var num = parseInt( numToCheck, 10 );
		if( !isNaN(num) && num >= min && num <= max )
		{
			globalMediators.internalMediator.publish( eventKey, parameterArray );
		}
	}
}


htmlGen.createSelectInput = function( labelStr, idStr, optionStrArray, onChangeEventStr )
{
	var retStr = labelStr + ' <select id = "'+idStr+'" onchange= "'+onChangeEventStr+'" >'
	var i = 0;
	var length = optionStrArray.length;
	for( i = 0; i < length; i++ )
	{
		retStr += '<option value ="' +optionStrArray[i]+ '"> '+optionStrArray[i]+ '</option>';
	}
	retStr += '</select>';
	return retStr;
}

htmlGen.createSmallButton = function( idStr, tooltipStr, onClickEventFunction ) 
{
	var retStr = '<a class="sectionSmallButton" title="'+tooltipStr+'" id="'+idStr+
		'" onclick = "'+onClickEventFunction+'" > <img src="'+
		DOMglobals.MEDIA_PATH+idStr+'.png" alt="'+idStr+'"/> </a>';
	return retStr;
}

/** Side menu functions **/
var sideMenu = {};
sideMenu.singleResource = null; // This one is setted when a single element is selected
sideMenu.currentSketchProject = null;
sideMenu.multipleResources = {};

sideMenu.containsId = function( idStr )
{
	return $(idStr)!=null;
}

sideMenu.createDiv = function( divId, divClass )
{
	var newDOM = document.createElement( "div" );
	newDOM.id = divId;
	newDOM.className = divClass;
	return newDOM;
}

sideMenu.removeSideMenuSection = function( divId )
{
	var removedDiv = $(divId);
	if( removedDiv == null )
	{
		return;
	}
	else
	{
		var parentDiv = removedDiv.parentNode;
		parentDiv.removeChild( removedDiv );
	}
}

sideMenu.createSideMenuSection = function( divId )
{
	var newSectionDOM = sideMenu.createDiv( divId, DOMglobals.SIDE_SECTION_CLASS );
	var sideBarDOM = $(DOMglobals.SIDE_BAR_ID); 
	if( sideBarDOM == null )
	{
		// TODO: Create console class and use mediators to send error messages
		alert("no sidebar");
		return;
	}
	sideBarDOM.appendChild( newSectionDOM );
	return newSectionDOM; 
}

sideMenu.createSectionPart = function ( divId )
{
	var newPartDom = sideMenu.createDiv( divId, DOMglobals.SECTION_PART_CLASS );
	return newPartDom;
}

sideMenu.createProjectSection = function( sketchObj )
{
	sideMenu.removeSideMenuSection( DOMglobals.PROJECT_SECTION_ID );
	sideMenu.currentSketchProject = sketchObj;
	var projectSectionDOM = sideMenu.createSideMenuSection( DOMglobals.PROJECT_SECTION_ID );
	var projectSectionPartDom = sideMenu.createSectionPart( "project_info" );
	
	projectSectionPartDom.innerHTML += htmlGen.createTextButton( "aaa", "Project Name:", sideMenu.currentSketchProject.getName(), 
		"alert('aaaaa')" );
	projectSectionPartDom.innerHTML += htmlGen.createTextButton( DOMglobals.PROJECT_VERSION_ID, "Version:", sideMenu.currentSketchProject.getActiveVersionNumber(),
		 "sideMenu.changeVersionAction( sideMenu.currentSketchProject )" );
	projectSectionPartDom.innerHTML += htmlGen.createTextButton( "ccc", "Screen:", sideMenu.currentSketchProject.getCurrentScreenName(),
		 "alert('aaaaa')" );

	projectSectionDOM.appendChild(projectSectionPartDom);
}

sideMenu.createResourceBasicSection = function( interfaceResource )
{
	sideMenu.removeSideMenuSection( DOMglobals.BASIC_RESOURCE_ID );
	
	sideMenu.singleResource = interfaceResource;
	
	var newSideSection = sideMenu.createSideMenuSection ( DOMglobals.BASIC_RESOURCE_ID );
	var newSectionPart = sideMenu.createSectionPart( "namePart" );
	var a = 1111;
	// A closure is needed here to be able to find the variables onkeyup event
	(function(){
		ir = interfaceResource;
		/*newSectionPart.innerHTML = 'Name: <input type=\"text\" size =\"10\" value="' + ir.getName() +
		'" onkeyup=\"globalMediators.internalMediator.publish( \'RenameElement\', [ ir, this.value ] ) \">';*/
		newSectionPart.innerHTML =	htmlGen.createSectionLine();
		newSectionPart.innerHTML += htmlGen.createTextInputString( "Name", DOMglobals.NAME_ID, 10, ir.getName(),
			"globalMediators.internalMediator.publish( \'RenameElement\', [ ir, this.value ] );"  );
		newSectionPart.innerHTML += htmlGen.createTextInputString( "Width", "change_width", 10, ir.getWidth(),
			"htmlGen.numberEventToInterMediator( this.value, 10, graphicControllerGlobals.CANVAS_WIDTH, "+
			" \'ResizeInterfaceResource\', [ ir, ir.getX(), ir.getY(), parseInt(this.value), ir.getHeight() ]);"  );
		newSectionPart.innerHTML += htmlGen.createTextInputString( "Height", "change_height", 10, ir.getHeight(),
			"htmlGen.numberEventToInterMediator( this.value, 10, graphicControllerGlobals.CANVAS_HEIGHT, "+
			" \'ResizeInterfaceResource\', [ ir, ir.getX(), ir.getY(), ir.getWidth(), parseInt(this.value) ] );"  );
		
		/*Be careful to not send strings to the mediator,
		 the following function guarantees that a value which isn't a number isn't sent to the mediator */
		newSectionPart.innerHTML += htmlGen.createTextInputString( "X Pos", DOMglobals.X_TEXT_ID, 10, ir.getX(),
			"htmlGen.numberEventToInterMediator( this.value, 0, graphicControllerGlobals.CANVAS_WIDTH, "+
			" \'MoveInterfaceResource\', [ ir, parseInt(this.value), ir.getY() ] );"  );
		newSectionPart.innerHTML += htmlGen.createTextInputString( "Y Pos", DOMglobals.Y_TEXT_ID, 10, ir.getY(),
			"htmlGen.numberEventToInterMediator( this.value, 0, graphicControllerGlobals.CANVAS_HEIGHT, "+
			" \'MoveInterfaceResource\', [ ir, ir.getX(), parseInt(this.value) ] );"  );
				
		if( interfaceResource.getResourceType() != resourceTypeEnum.IR_IMAGE  )
		{
			newSectionPart.innerHTML +=	htmlGen.createSectionLine();
			newSectionPart.innerHTML += htmlGen.createTextInputString( "Font Size", 
				DOMglobals.FONTSIZE_TEXT_ID, 10, ir.getExtraAttribute( iResGlobals.defaultKeys.FONTSIZE_KEY ),
				"htmlGen.numberEventToInterMediator( this.value, 10, 100, "+
				" \'FormatInterfaceResource\', " +
				"[ ir, parseInt( this.value ), "+
				" ir.getExtraAttribute( iResGlobals.defaultKeys.FONTTYPE_KEY ) , "+
				" parseInt( ir.getExtraAttribute( iResGlobals.defaultKeys.FONT_X_PADDING_KEY, 10 ) ), "+
				" parseInt( ir.getExtraAttribute( iResGlobals.defaultKeys.FONT_Y_PADDING_KEY, 10 ) ) ] ) ") ;
			newSectionPart.innerHTML +=  htmlGen.createSelectInput( "Font Family", DOMglobals.FONTSTYLE_TEXT_ID, 
				["calibri", "arial", "verdana"], 
				"globalMediators.internalMediator.publish( \'FormatInterfaceResource\', "+
				"[ ir, parseInt( ir.getExtraAttribute( iResGlobals.defaultKeys.FONTSIZE_KEY, 10 ) ), "+
				" this.options[this.selectedIndex].value , "+
				" parseInt( ir.getExtraAttribute( iResGlobals.defaultKeys.FONT_X_PADDING_KEY, 10 ) ), "+
				" parseInt( ir.getExtraAttribute( iResGlobals.defaultKeys.FONT_Y_PADDING_KEY, 10 ) ) ] ) ") ;
		}
		else if( interfaceResource.getResourceType() == resourceTypeEnum.IR_IMAGE )
		{
			newSectionPart.innerHTML +=	 htmlGen.createSmallButton(	DOMglobals.CHANGE_IMG_ID, 
			"Change image from ALL versions of this resource",
			"sideMenu.changeImageAction(sideMenu.singleResource)" );
		}
			
		/* time manipulation buttons */	
		newSectionPart.innerHTML +=	htmlGen.createSectionLine();
		newSectionPart.innerHTML +=	 htmlGen.createSmallButton(	DOMglobals.CLONE_VERSION_ID, 
			"Create a new version based on an existent one",
			"sideMenu.cloneVersionAction(sideMenu.singleResource, sideMenu.currentSketchProject)" );
		newSectionPart.innerHTML +=	 htmlGen.createSmallButton(	DOMglobals.DELETE_VERSION_ID, 
			"Set this resource's version as an inexistent element",
			"sideMenu.deleteVersionAction(sideMenu.singleResource)" );
		newSectionPart.innerHTML +=	 htmlGen.createSmallButton(	DOMglobals.REMOVE_VERSION_ID, 
			"Remove the current version in edition, going back to the last existent version",
			"sideMenu.removeVersionAction(sideMenu.singleResource)" );
		newSectionPart.innerHTML +=	 htmlGen.createSmallButton(	DOMglobals.DELETE_RESOURCE_ID, 
			"Erase all resource history from this project",
			"sideMenu.removeHistoryAction( sideMenu.singleResource )" );

	}());
	newSideSection.appendChild(newSectionPart);
}

sideMenu.updateValue = function( valueID, updatedValue )
{
	var DOMobj = $(valueID);
	if( DOMobj != null)
		DOMobj.value =  ""+updatedValue; // Always trying to use a string on the value
}

sideMenu.updateSelectValue = function( valueID, updatedValue )
{
	var sel = $( valueID );
    for(var i, j = 0; i = sel.options[j]; j++) {
        if( i.value == updatedValue ) {
            sel.selectedIndex = j;
            break;
        }
    }
}

sideMenu.removeResourceBasicSection = function()
{
	sideMenu.removeSideMenuSection( DOMglobals.BASIC_RESOURCE_ID );
	sideMenu.singleResource = null;
} 

/* Function to react to some events */
sideMenu.changeImageAction = function( interfaceResource )
{
	globalMediators.internalMediator.publish( "ChangeResHistExtraImg", [ interfaceResource ] );
}

sideMenu.removeHistoryAction = function( interfaceResource )
{
	globalMediators.internalMediator.publish( "RemoveResourceHistory", [ interfaceResource ] );
}

sideMenu.removeVersionAction = function( interfaceResource )
{
	globalMediators.internalMediator.publish( "RemoveResourceVersion", [ interfaceResource ] );
}

sideMenu.deleteVersionAction = function( interfaceResource )
{
	globalMediators.internalMediator.publish( "DeleteResourceVersion", [ interfaceResource ] );
}

sideMenu.cloneVersionAction = function( interfaceResource, sketchObj )
{
	//TODO: Create a cool popup showing all available versions
	var numToCheck = prompt("Enter the base version number", "Insert a number here");
	var baseVersion = myMath.isValidNumber( numToCheck );
	if( baseVersion == null )
	{
		alert("Please enter a valid number");
		return;
	}
	var currentScreen = sketchObj.getCurrentScreen();
	
	var resourceHistory = currentScreen.getResourceHistory( interfaceResource.getId() );
	if( resourceHistory != null )
	{
		if( resourceHistory.getResourceFromVersion( baseVersion ) == null )
		{
			alert("There is no resource in the version " +baseVersion+ ". Choose a valid number");
			return;
		}
		else
		{
			var targetToCheck = prompt("Enter the target version number", "Insert a number here");
			var newVersion = myMath.isValidNumber( targetToCheck );
			if( newVersion == null )
			{
				alert("Please enter a valid number");
				return;
			}
			else if( resourceHistory.getResourceFromVersion( newVersion ) != null )
			{
				alert("This version already exists, choose another target number");
				return;
			}
			else
			{
				globalMediators.internalMediator.publish( "CloneResourceVersion", [ interfaceResource, baseVersion, newVersion ] );
			}
		}
	}
	else
	{
		console.error("Error while cloning version");
		return;
	}
}

sideMenu.changeVersionAction = function( sketchObj )
{
	var numToCheck = prompt("Enter the version number where you want to go:", "Insert a number here");
	if(numToCheck == null)
	{
		return;
	}
	else if( /^\d+$/.test( numToCheck ) )
	{
		var num = parseInt( numToCheck, 10 );
		if( !isNaN(num) && num >= 0 )
		{
			if( num == sketchObj.getActiveVersionNumber() )
			{
				alert( "You are already on this version" );
				return;
			}
			else
			{
				globalMediators.internalMediator.publish( "ChangeActiveVersion", [ num ] );
				return;
			}
		}
	}
	alert("Please enter a valid number");
}
