function Stack( maxSize )
{
	this.maxSize = maxSize;
	this.elements = new Array();
}

Stack.prototype.push = function( elem )
{
	this.elements.push( elem );
	if( this.elements.length > this.maxSize )
	{
		this.elements.splice(0,1);
	}
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
