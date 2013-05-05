
var Popup = {};

Popup.POPUP_DIV_ID = "_POPUP_DIV_ID";
Popup.CHILD_DIV_ID = "_CHILD_DIV_ID";

Popup.showPopupDiv = function ( divInnerHTML, enableCancel, xPos, yPos )
{
	// It can only show one popup per time 
	if( document.getElementById( Popup.POPUP_DIV_ID ) != null )
	{
		return;
	}
	
	var dimmerDivDOM = 	document.createElement( "div" );
	dimmerDivDOM.className = "black_overlay";
	dimmerDivDOM.id = Popup.POPUP_DIV_ID;
	dimmerDivDOM.innerHTML = "";
	dimmerDivDOM.style.display='block';
	document.body.appendChild( dimmerDivDOM );
	
	if( enableCancel )
	{
		var goBackDOM = document.createElement( "div" );
		dimmerDivDOM.innerHTML = '<a class="closePopup" onclick = "Popup.closePopupDiv()">X<\/a>';
		document.body.appendChild( goBackDOM );
	}
	
	var  myDiv =document. createElement( "div" );
	myDiv.innerHTML = divInnerHTML;
	myDiv.id = Popup.CHILD_DIV_ID;
	myDiv.className = "white_content";
	myDiv.style.display='block';
	//myDiv.setAttribute( "onmouseup", "stopMoving()" );
	//myDiv.setAttribute( "onmousedown", "startMoving(event)" );
	myDiv.style.left = xPos+"px";
	myDiv.style.top = yPos+"px";
	document.body.appendChild( myDiv ); 
}

Popup.closePopupDiv = function()
{
	var div;
	while (div = document.getElementById( Popup.POPUP_DIV_ID )) {
		div.parentNode.removeChild(div);
	}
		while (div = document.getElementById( Popup.CHILD_DIV_ID )) {
		div.parentNode.removeChild(div);
	}
}