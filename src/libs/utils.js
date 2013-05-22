function Stack()
{
	this.elements = new Array();
}

Stack.prototype.push = function( elem )
{
	this.elements.push( elem );
}

Stack.prototype.pop = function()
{
	return this.elements.pop();
}

Stack.prototype.isEmpty = function()
{
	return (this.elements.length == 0);
}

Stack.prototype.toString = function()
{
	var ret = "";
	for( var i = 0 ;  i < this.elements.length; i++ )
	{
		ret += this.elements[i].toString()+"\n";
	}
	return ret;
}
