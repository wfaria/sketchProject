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