/**  MenuBar functions **/

var DOMglobals = {};
DOMglobals.SIDE_BAR_ID = "sideBar";
DOMglobals.BASIC_RESOURCE_ID = "basic resource";
DOMglobals.SIDE_SECTION_CLASS = "sideMenuSection";
DOMglobals.SECTION_PART_CLASS = "sectionPart";

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


/** Side menu functions **/
var sideMenu = {};


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


// TODO: Create a way to associate a sideMenu with an interface resource
// Maybe associate the section with one ID
sideMenu.createResourceBasicSection = function( interfaceResource )
{
	sideMenu.removeSideMenuSection( DOMglobals.BASIC_RESOURCE_ID );
	var newSideSection = sideMenu.createSideMenuSection ( DOMglobals.BASIC_RESOURCE_ID );
	var newSectionPart = sideMenu.createSectionPart( "namePart" );
	var a = 1111;
	// A closure is needed here to be able to find the variables onkeyup event
	(function(){
		ir = interfaceResource;
		newSectionPart.innerHTML = 'Name: <input type=\"text\" size =\"10\" value="' + ir.getName() +
		'" onkeyup=\"globalMediators.internalMediator.publish( \'RenameElement\', [ ir, this.value ] ) \">';
	}());
	newSideSection.appendChild(newSectionPart);
}
