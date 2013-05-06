/* Use this module to transfer files or pictures between the user and this application */

var DataHandler = {};

DataHandler.errorHandler =  function(evt) {
	switch(evt.target.error.code) {
	  case evt.target.error.NOT_FOUND_ERR:
		alert('File Not Found!');
		break;
	  case evt.target.error.NOT_READABLE_ERR:
		alert('File is not readable');
		break;
	  case evt.target.error.ABORT_ERR:
		break; // noop
	  default:
		alert('An error occurred reading this file.');
	};
  }

DataHandler.updateProgress =  function(evt) {
	// evt is an ProgressEvent.
	if (evt.lengthComputable) {
	  var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
	  // Increase the progress bar length.
	  if (percentLoaded < 100) {
		//$(textHere).innerHTML = percentLoaded + '%';
	  }
	}
	else
	{
		//$(textHere).innerHTML = "loading...";
	}
}

DataHandler.loadEnd =  function( evt ) 
{
	if (evt.target.readyState == FileReader.DONE)
	{
		var projStr = evt.target.result;
		globalMediators.internalMediator.publish( "ProjectUploaded", [ evt.target.result ] );
	}
	else
	{
		alert( "fatal error while openning file" );
	}
}

DataHandler.handleFileSelect = function(evt) 
{
	var files = evt.target.files; // FileList object
	
	if( files.length != 1 )
	{
		alert( "Please choose only one file.");
		return;				
	}
	
	DataHandler.readFile(  files[0] );
}


DataHandler.readFile = function(f)
{
	var reader = new FileReader();
		
	
	if( f.type != "text/plain" )
	{
		alert( "Please upload a text file" );
		return;
	}
	
	reader.onerror = DataHandler.errorHandler;
	reader.onprogress = DataHandler.updateProgress;
	reader.onabort = function(e) {
	  alert('File read cancelled');
	};
	reader.onloadstart = function(e) {

	};
	reader.onload = function(e) {
	};
	reader.onloadend = DataHandler.loadEnd;

	// Read in the image file as a data URL.
	reader.readAsText(f);

}