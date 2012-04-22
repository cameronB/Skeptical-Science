/*
 * skepticalOverlay.js
 * Description: Main javascript file containing all code for functionality
 * of the main interface.
 * @author Cameron Bradley, Michael Gillies 22/9/2010
 * Change History:
 * Who When Description
 * ------------------------------------------------------------------
 * Michael.G 23/09/10 CR-SKEPFF-26 <<coding standards changes>>
 * Michael.G 30/09/10 <<SKEPFF-81 fix of plugin displaying error on successfull report>>
 * Michael.G 30/09/10 <<SKEPFF-73 removal of code related to radio butons>>
 * Michael.G 30/09/10 <<SKEPFF-79 fixed argument list filling out incorrectly>>
 * Michael.G 5/10/10  <<changed several urls to constants in skepConfig>>
 * Michael.G 13/10/10 <<SKEPFF-69 added aragument description popup>>
 * Michael.G 13/10/10 <<SKEPFF-100 added autosizeing iframe to eliminate unwanted whitespace>>
 * Michael.G 14/10/10 <<SKEPFF-93 added return to halt unneeded attempt at xml parsing>>
 * Michael.G 28/10/10  <<Code review Changes>>
 * Michael.G 6/12/10   <<changed apps loose variables to be wrapped in our objects>>
 */

//If function undefined (naming convention)
//- Overlay = attach Skeptical - to browserOverlay eg. (Skeptical.BrowserOverlay).
if ("undefined" == typeof(Skeptical)) {
	var Skeptical = {};
};

//Add an event listerner to determine when firefox is loaded.
window.addEventListener("load", function() { Skeptical.BrowserOverlay.init(); }, false);


//is the class constructor
com_shinetech_skepff.State = function() {
	//booleans
	this.isBrowserLoadedOnce = false;
	this.isArrayListFilled = false;
	this.isExistingArguments = false;
	this.isThisAWebPage = false;
	
	//strings
	this.userInputedArgument = "";
	this.saveLinkArgumentId = "";
	this.saveLinkUserName = "";
	this.saveLinkURL = "";
	this.saveLinkArticleTitle = ""; 
	this.saveLinkArticleType = "";
	this.saveLinkArticleBias = "";
	this.saveLinkUserPassword = "";
	this.saveArticlePublishingDate ="";
	
	//store argument headings loaded at runtime..
	this.argumentHeadingsArray = new Array; 
	//store argument id loaded at runtime.
	this.argumentIdsArray = new Array; 
	
	//store existing arguments XML
	this.existingArgumentsXML;
	
};

/*given an arguments heading description, return its matching ID. return -1 on failure*/
com_shinetech_skepff.State.prototype.getArgumentIdByDescription = function(anArgumentDescription) {
	var i;
	var len = this.argumentHeadingsArray.length;
	
	for(i=0; i < len; i++) {
		if(anArgumentDescription.indexOf(this.argumentHeadingsArray[i]) > -1){
			return this.argumentIdsArray[i];
		}
	}
	
	return -1;
};

//set true if the webpage is either a local file or invalid webpage ex(about:config) 
com_shinetech_skepff.State.prototype.setIsWebPage = function(_isWebPage) {
	this.isThisAWebPage = _isWebPage;
};

com_shinetech_skepff.State.prototype.isWebPage = function() {
	return this.isThisAWebPage;
};

//set if the current page already has entries in the system
com_shinetech_skepff.State.prototype.setIsExistingArguments = function(_isExistingArguments) {
	this.isExistingArguments = _isExistingArguments;
};

//get if the current page already has entries in the system
com_shinetech_skepff.State.prototype.isExistingArguementsPresent = function() {
	return this.isExistingArguments;
};

//stores any existing arguments for the queried page
com_shinetech_skepff.State.prototype.setExistingArgumentsXML = function(_argumentsXML) {
	
	this.existingArgumentsXML = _argumentsXML;
};

//returns the existing arguments for the queried page
com_shinetech_skepff.State.prototype.getExistingArgumentsXML = function() {
	
	return this.existingArgumentsXML;
};

//this is to set the value (for argumentHeadingsArray)
com_shinetech_skepff.State.prototype.setArgumentHeadingsArray = function(_isArgumentHeadingsArray) {
	
	this.argumentHeadingsArray = _isArgumentHeadingsArray;
};

//this is to get the value (for argumentHeadingsArray)
com_shinetech_skepff.State.prototype.getArgumentHeadingsArray = function() {
	
	return this.argumentHeadingsArray;
};


//this is to set the value (for argumentIdsArray)
com_shinetech_skepff.State.prototype.setArgumentIdsArray = function(_isArgumentIdsArray) {
	
	this.argumentIdsArray = _isArgumentIdsArray;
};

//this is to get the value (for argumentIdsArray)
com_shinetech_skepff.State.prototype.getArgumentIdsArray = function() {
	
	return this.argumentIdsArray;
};


//this one you can switch the value (for browserLoadedOnce / arrayListFilled / userHasInputedArgument)
com_shinetech_skepff.State.prototype.switchState = function() {
	this.isBrowserLoadedOnce = !this.isBrowserLoadedOnce;
	this.isArrayListFilled = !this.isArrayListFilled;
};

//this is to set the value (for browserLoadedOnce)
com_shinetech_skepff.State.prototype.setBrowserLoadedOnce = function(_isBrowserLoadedOnce) {
	
	this.isBrowserLoadedOnce = _isBrowserLoadedOnce;
};

//this is to retrieve the value (for browserLoadedOnce)
com_shinetech_skepff.State.prototype.FOOisBrowserLoadedOnce = function() {
    return this.isBrowserLoadedOnce;
};

//this is to set the value (for arrayListFilled)
com_shinetech_skepff.State.prototype.setArrayListFilled = function(_isArrayListFilled) {
	
	this.isArrayListFilled = _isArrayListFilled;
};

//this is to retrieve the value (for arrayListFilled)
com_shinetech_skepff.State.prototype.FOOisArrayListFilled = function() {
    return this.isArrayListFilled;
};

//this is to set the value (for userInputedArgument)
com_shinetech_skepff.State.prototype.setUserInputedArgument = function(_isUserInputedArgument) {
	
	this.userInputedArgument = _isUserInputedArgument;
};

//this is to get the value (for userInputedArgument)
com_shinetech_skepff.State.prototype.getUserInputedArgument = function() {
	
	return this.userInputedArgument;
};

//this is to set the value (for saveLinkArgumentId)
com_shinetech_skepff.State.prototype.setSaveLinkArgumentId = function(_isSaveLinkArgumentId) {
	
	this.saveLinkArgumentId = _isSaveLinkArgumentId;
};

com_shinetech_skepff.State.prototype.getSaveArticlePublishingDate = function() {
	
	return this.saveArticlePublishingDate;
};

com_shinetech_skepff.State.prototype.setSaveArticlePublishingDate = function(_saveArticlePublishingDate) {
	
	this.saveArticlePublishingDate = _saveArticlePublishingDate;
};

//this is to get the value (for saveLinkArgumentId)
com_shinetech_skepff.State.prototype.getSaveLinkArgumentId = function() {
	
	return this.saveLinkArgumentId;
};

//this is to set the value (for saveLinkUserName)
com_shinetech_skepff.State.prototype.setSaveLinkUserName = function(_isSaveLinkUserName) {
	
	this.saveLinkUserName = _isSaveLinkUserName;
};

//this is to get the value (for saveLinkUserName)
com_shinetech_skepff.State.prototype.getSaveLinkUserName = function() {
	
	return this.saveLinkUserName;
};

//this is to set the value (for saveLinkURL)
com_shinetech_skepff.State.prototype.setSaveLinkURL = function(_isSaveLinkURL) {
	
	this.saveLinkURL = _isSaveLinkURL;
};

//this is to get the value (for saveLinkURL)
com_shinetech_skepff.State.prototype.getSaveLinkURL = function() {
	
	return this.saveLinkURL;
};

//this is to set the value (for saveLinkArticleTitle)
com_shinetech_skepff.State.prototype.setSaveLinkArticleTitle = function(_isSaveLinkArticleTitle) {
	
	this.saveLinkArticleTitle = _isSaveLinkArticleTitle;
};

//this is to get the value (for saveLinkArticleTitle)
com_shinetech_skepff.State.prototype.getSaveLinkArticleTitle = function() {
	
	return this.saveLinkArticleTitle;
};

//this is to set the value (for saveLinkArticleType)
com_shinetech_skepff.State.prototype.setSaveLinkArticleType = function(_isSaveLinkArticleType) {
	
	this.saveLinkArticleType = _isSaveLinkArticleType;
};

//this is to get the value (for saveLinkArticleType)
com_shinetech_skepff.State.prototype.getSaveLinkArticleType = function() {
	
	return this.saveLinkArticleType;
};

//this is to set the value (for saveLinkArticleBias)
com_shinetech_skepff.State.prototype.setSaveLinkArticleBias = function(_isSaveLinkArticleBias) {
	
	this.saveLinkArticleBias = _isSaveLinkArticleBias;
};

//this is to get the value (for saveLinkArticleBias)
com_shinetech_skepff.State.prototype.getSaveLinkArticleBias = function() {
	
	return this.saveLinkArticleBias;
};

//this is to set the value (for saveLinkUserPassword)
com_shinetech_skepff.State.prototype.setSaveLinkUserPassword = function(_isSaveLinkUserPassword) {
	
	this.saveLinkUserPassword = _isSaveLinkUserPassword;
};

//this is to get the value (for saveLinkUserPassword)
com_shinetech_skepff.State.prototype.getSaveLinkUserPassword = function() {
	
	return this.saveLinkUserPassword;
};

/*event class to handle selecting list element.*/
com_shinetech_skepff.AutoSelectEvent = function() { };

com_shinetech_skepff.AutoSelectEvent.prototype.notify = function() {
	Skeptical.BrowserOverlay.selectFirstListElement();
};

/*event class to handle resizeing iframe.*/
com_shinetech_skepff.AutoResizeEvent = function() { };

com_shinetech_skepff.AutoResizeEvent.prototype.notify = function() {
	Skeptical.BrowserOverlay.autoSizeIFrame();
};


//var my_state = new com_shinetech_skepff.State();
//var selectListElement = new com_shinetech_skepff.AutoSelectEvent();
//var autoResizeEvent = new com_shinetech_skepff.AutoResizeEvent();


//Skeptical BrowserOverlay naming convention.
Skeptical.BrowserOverlay = {
		
my_state : new com_shinetech_skepff.State(),
		
autoResizeEvent : new com_shinetech_skepff.AutoResizeEvent(),
		
selectListElement : new com_shinetech_skepff.AutoSelectEvent(),
		
getLoginManager : function() {
	var loginManager = 
		Components.classes["@mozilla.org/login-manager;1"]
	                                      .getService(Components.interfaces.nsILoginManager);
	
	return loginManager;
},

//Determine when browser is loaded.
init: function() {
	//Get the firefox page element.
	var appcontent = document.getElementById("appcontent");  
	
	// During initialisation  
	var container = gBrowser.tabContainer;  
	container.addEventListener("TabSelect", Skeptical.BrowserOverlay.onPageLoad, false);  
	
	if(appcontent){ //add an event listerner for when a firefox page is loaded 
		//call onPageLoad.
		
		appcontent.addEventListener("DOMContentLoaded", Skeptical.BrowserOverlay.onPageLoad, true);
	}
	
},	

/*Function loaded on page load one time and beings the process of retrieving the XML from Skeptical Science.*/
onPageLoad : function(aEvent) {
	Skeptical.BrowserOverlay.argumentsFirstLoad();
},

argumentsFirstLoad : function() {
	//Firebug.Console.log("BrowserOverlay:argumentsFirstLoad");

	if(!Skeptical.BrowserOverlay.my_state.FOOisBrowserLoadedOnce())
	{
		//Retrieve Send Button element and store..
		var sendButton = document.getElementById("sendReport");

		//Retrieve status textbox element and store..
		var statusMessage = document.getElementById("status-txtBox");
		var userNameTxtBox = document.getElementById("userName-txtBox");
		var userNameLabel = document.getElementById("userNameLabel-txtBox");

		var statusLabel = "Status:";
	
		var toolbarId = document.getElementById("skep-whiteButton");
		
		//Initialize state of tooltip..
		sendButton.setAttribute("tooltiptext", "-Type an article title -Select an argument to send report");

		//Initialize state of status label..
		statusMessage.value = statusLabel + " Login Please";

		//Initialize send button state..
		sendButton.disabled = "True";
		
		//load username and determine if a user is currently logged in
		Skeptical.BrowserOverlay.loadUserName();
		
		if (userNameTxtBox.value === "") {
			
		} else {
			statusMessage.value = "Status:";
			userNameLabel.value = "Logged in as:";
		}

		//Document loaded.
		///com_shinetech_skepff.STATES['browserLoadedOnce'] = true;
		Skeptical.BrowserOverlay.my_state.setBrowserLoadedOnce(true);
		
		//Get arguments for from website..
		Skeptical.BrowserOverlay.searchForArgumentByKeyword();
		
	}
},

/*disable the UI interface elements*/
disableElements : function() {	
	//disable the article title box
	var articleTitle = document.getElementById("article-txtBox");
	
	articleTitle.disabled = "True";
	
	//disable the article Type combobox
	var articleTypeList = document.getElementById("articleTypeList");
	
	articleTypeList.disabled = "True";
	
	//disable the article bias combobox
	var articleBiasList = document.getElementById("articleBiasList");
	
	articleBiasList.disabled = "True";
	
	//disable the argument box
	var argumentBox = document.getElementById("argument-txtBox");
	
	argumentBox.disabled = "True";
	
	//disable the XUL tree
	var xulTree = document.getElementById("myTodoListTree");
	
	xulTree.disabled = "True";
	
	var datePicker = document.getElementById("skep-article-publishing-date");
	datePicker.disabled="true";
},

/*Determines whether the program is running for the first time, 
and then gets the XML data from Skeptical Science, initiates the XUL Tree
and sends the data to arrays for storage.*/
retrieveXml : function() {
	//Firebug.Console.log("retrieveXml");

	//If array list contains argument (as loaded on first run).
	if (Skeptical.BrowserOverlay.my_state.FOOisArrayListFilled()) {
		//Process/populate XUL TREE via array LIST.
		Skeptical.BrowserOverlay.populateArgumentTree();
	} else {

		var retrieveArgumentHeadingXml = "";
		var retrieveArgumentIDXml = "";

		var xhttp=new XMLHttpRequest();

		//Send a GET to the link to retieve the XML response.
		xhttp.open("GET",Skeptical.CONFIG.RETRIEVE_ALL_ARGUMENTS_URL,true);
		xhttp.onreadystatechange = function(){
			//Firebug.Console.log(xhttp.readyState+" - " + xhttp.status);
			if (xhttp.readyState == 4) {
				// Request finished and response ready
	     		if(xhttp.status == 200){
	    			// Status ok
	 				var xmlDoc=xhttp.responseXML; 

					var xmlHeading=xmlDoc.getElementsByTagName("heading");
					var xmlId=xmlDoc.getElementsByTagName("argument-id");
			
					//Loop through total number of elements.
					var i;
					var len;
					for (i=0, len = xmlHeading.length; i < len; i++)
					{ 
						retrieveArgumentHeadingXml = (xmlHeading[i].childNodes[0].nodeValue);
						retrieveArgumentIDXml = (xmlId[i].childNodes[0].nodeValue);
			
						//Populate the XUL TREE with all arguments.
						Skeptical.BrowserOverlay.initiateTreeStructure(retrieveArgumentHeadingXml);
			
						//Populate argument data (including titles and id's).
						Skeptical.BrowserOverlay.populateArgumentsArray(retrieveArgumentHeadingXml, retrieveArgumentIDXml);
					}

	     		} else {
	     			// Status other than ok (notify user)
					Skeptical.BrowserOverlay.showError();
	     		}
			}
		}
		xhttp.send();
	}
},

/*Populates the argument tree. This function filters out arguments that do not match the input in the search box.
 * it also filters out any pre-existing arguments the article has so they are not displayed when adding arguments*/
populateArgumentTree : function() {
	var argumentDetails = "";
	var tempArgHeadings = Skeptical.BrowserOverlay.my_state.getArgumentHeadingsArray();
	var xulTree = document.getElementById("myTodoListTree");
	var searchArray = Skeptical.BrowserOverlay.my_state.getUserInputedArgument().split(" ");
	var argumentListMode = "";
	var existingArgumentsArray = new Array;
	var argumentTextbox = document.getElementById("argument-txtBox");
	var searchFields = "";
	var timer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);


	//if add arguments is selected and there is also pre-existing argumments, then fill the array with them
	if(Skeptical.BrowserOverlay.my_state.isExistingArguementsPresent()) {
		existingArgumentsArray = Skeptical.BrowserOverlay.getArticleArguments();
	}
	
	var displayedArgumentsCounter = 0;
	var argumentCountLabel = document.getElementById("skepArgumentsCount");

	//Loop through all items and pass each item to an array.
	for (var iCounter=0;iCounter<tempArgHeadings.length;iCounter++) 
	{
		argumentDetails = (tempArgHeadings[iCounter]);
		
		//If details contains any string of the user searched argument.
		
		var addToList = true;
		
		//determine how many items have been searched
		for (var i = 0; i < searchArray.length; i++) 
	      {
			   //store each seperate item as string
	           searchFields = (searchArray[i]);

	        //if any arguments match the search fields inputted by user then process into XUL tree  
	   		if (argumentDetails.toUpperCase().indexOf(searchFields.toUpperCase()) === -1 ) {
	   			addToList = false;
			}
	      }
		//determine if the argument has already been added, if so, do not add it to add arguments
		for(var i = 0; i < existingArgumentsArray.length; i++) {
	   		
			if (argumentDetails.toUpperCase().indexOf(existingArgumentsArray[i].toUpperCase()) != -1 ) {
	   			addToList = false;
			}
		}
	   		//if all search terms matched add to list-
	        if (addToList === true) {
	   		
	        	var rootTreeChild = document.getElementById("children_root");
	        	var item = document.createElement("treeitem");
	        	var row = document.createElement("treerow");
	        	var cell = document.createElement("treecell");
	        	
	        	displayedArgumentsCounter++;

	        	
	        	cell.setAttribute("label", argumentDetails);
	        	row.appendChild(cell);
	        	item.appendChild(row);
	        	rootTreeChild.appendChild(item);
	        }	      
	}
	argumentCountLabel.value = "Available arguments:"+displayedArgumentsCounter;
	if( displayedArgumentsCounter === 1) {
		timer.initWithCallback(Skeptical.BrowserOverlay.selectListElement, 0, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
	}
},

/*function to select the first argument listed in tree
 * used instead of using a string of code with setTimeout*/
selectFirstListElement : function() {
	var tree = document.getElementById("myTodoListTree");
	tree.view.selection.select(0);
},

/* Pushes the new XML data into each designated array,
seperate arrays for arguments and for id's for storage.*/
populateArgumentsArray : function(retrieveArgumentHeadingXml, retrieveArgumentIDXml) {

	var tempArgHeading = Skeptical.BrowserOverlay.my_state.getArgumentHeadingsArray();
	var tempArgId = Skeptical.BrowserOverlay.my_state.getArgumentIdsArray();
	tempArgHeading.push(retrieveArgumentHeadingXml);
	Skeptical.BrowserOverlay.my_state.setArgumentHeadingsArray(tempArgHeading);
	//Push all Headings of arguments into an Array.
	
	tempArgId.push(retrieveArgumentIDXml);
	Skeptical.BrowserOverlay.my_state.setArgumentIdsArray(tempArgId);
	//Push all id's of arguments of arguments into an Array. 
},


/* Initiates the population of the XUL tree for the first time.*/
initiateTreeStructure : function(retrieveArgumentHeadingXml) {
	
	var rootTreeChild = document.getElementById("children_root");
	var item = document.createElement("treeitem");
	var row = document.createElement("treerow");
	var cell = document.createElement("treecell");

	cell.setAttribute("label", retrieveArgumentHeadingXml);
	row.appendChild(cell);
	item.appendChild(row);
	rootTreeChild.appendChild(item);
	
	
	Skeptical.BrowserOverlay.my_state.setArrayListFilled(true); //ArrayList is now populated.

},

/*Load Skeptical Sciecnce homepage in tab.*/
loadHomePage : function(e) {
	gBrowser.selectedTab = gBrowser.addTab("www.skepticalscience.com");

},

/*Hides the main pop-up window.*/
hidePopUp : function(e) {
	var popup = document.getElementById("skep-popup");
	var argumentPopup = document.getElementById("explainPopup");
	popup.hidePopup();
	argumentPopup.hidePopup();
},

/*Load facebook page in new tab.*/
loadFaceBook : function(e) {
	gBrowser.selectedTab = gBrowser.addTab("http://www.facebook.com/SkepticalScience");

},

switchInterface : function(e) {
	

	Skeptical.ViewOverlay.addSwitchInterface();

	Skeptical.BrowserOverlay.hidePopUp();
	
},

addSwitchInterface : function(e) {
	
	var popup = document.getElementById("skep-popup");
	
	var toolbarButton = document.getElementById("skep-addButton");
	
	popup.openPopup( toolbarButton , "after_start", 0 , 0  , false, false);
	
	Skeptical.BrowserOverlay.loadSiteInfo();
	Skeptical.BrowserOverlay.changedArticleTitle();
},

/*Load twitter page in new tab.*/
loadTwitter : function(e) {
	gBrowser.selectedTab = gBrowser.addTab("http://twitter.com/skepticscience");

},

/*Load register page in new.*/
loadRegister : function(address) {
	gBrowser.selectedTab = gBrowser.addTab(address);
},

/*load Forgot password page.*/
loadForgotPassword : function(address) {
	gBrowser.selectedTab = gBrowser.addTab(address);
},

/*Load iphone page in new tab.*/
loadIphone : function(e) {
	gBrowser.selectedTab = gBrowser.addTab("http://www.skepticalscience.com/iphone.shtml");
},

/*Clear all the tree children from the XUL tree.*/
clearChilds : function() {
	//Assign XUL children to variable.
	treeChildren = document.getElementById("children_root");

	//Clear all treeChildren.
	while(treeChildren.firstChild) {
		treeChildren.removeChild(treeChildren.firstChild);
	}

},

/*enable the UI interface elements*/
enableElements : function() {
	
	var articleInfoBox = document.getElementById("articleInfo");
	
	articleInfoBox.removeAttribute("hidden"); 
	
	//enable the article title box
	var articleTitle = document.getElementById("article-txtBox");
	
	articleTitle.removeAttribute('disabled'); 
	
	//enable the article type combobox
	var articleTypeList = document.getElementById("articleTypeList");
	
	articleTypeList.removeAttribute('disabled');
	
	//enable the article bias combobox
	var articleBiasList = document.getElementById("articleBiasList");
	
	articleBiasList.removeAttribute('disabled');
	
	//enable the argument box
	var argumentBox = document.getElementById("argument-txtBox");
	
	argumentBox.removeAttribute('disabled');
	
	//enable the XUL tree
	var xulTree = document.getElementById("myTodoListTree");
	
	xulTree.removeAttribute('disabled');
	
	var datePicker = document.getElementById("skep-article-publishing-date");
	datePicker.removeAttribute('disabled');

},

/*Determines the users search argument and then gets 
the arguments that are relative to that search.*/
searchForArgumentByKeyword : function(e) {
	//Get XUL elements
	//Argument Textbox.
	var argumentTextbox = document.getElementById('argument-txtBox'); 
	//Send Report Button.
	var sendButton = document.getElementById("sendReport"); 
		
	//keep disabled.
	sendButton.disabled = "True"; 
	
	//clear tree children
	Skeptical.BrowserOverlay.clearChilds();
	
	//Set user argument as the value present in..
	Skeptical.BrowserOverlay.my_state.setUserInputedArgument(argumentTextbox.value);

	//Get arguments..
	Skeptical.BrowserOverlay.retrieveXml();

	//remove tree selection
	Skeptical.BrowserOverlay.removeTreeSelection();
	
	//Validate form..
	Skeptical.BrowserOverlay.validateForm();
	
},

checkInternet: function() {
	var xhttp=new XMLHttpRequest();
	//Send a GET to the link to test if internet is up
	xhttp.open("GET",Skeptical.CONFIG.RETRIEVE_ALL_ARGUMENTS_URL,true);
	xhttp.onreadystatechange = function(){
		if (xhttp.readyState == 4) {
			// Request finished and response ready
     		if(xhttp.status == 200){
    			// Status ok
 				Skeptical.BrowserOverlay.loadSiteInfo();
     		} else {
     			// Status other than ok (notify user)
				Skeptical.BrowserOverlay.showError();
     		}
		}
	};
	xhttp.send();

},

showError : function() {
	var statusBar = document.getElementById("status-txtBox");
	statusBar.value = Skeptical.CONFIG.ERROR_NO_INTERNET;
	statusBar.style.color = 'red';
},

/*function to return the array of existing arguments for the currently loaded article*/
getArticleArguments : function(){
	var xmlArgs = Skeptical.BrowserOverlay.my_state.getExistingArgumentsXML();
	var argumentsHeading = xmlArgs.getElementsByTagName("heading");
	var argumentsArray = new Array;
	
	for(var i=0;i<argumentsHeading.length;i++){
		argumentsArray.push(argumentsHeading[i].childNodes[0].nodeValue);
		
	}
	return argumentsArray;
},

/*Function to assist in removing \ replacing characters the interfere with our comparisons
 * such as leading and trailing whitespace and non blocking spaces etc
 * return empty string if for some reason is called without an argument*/
trimString : function(str){
    if(str)
    {
    	return str.replace(/^\s*/, '').replace(/\s*$/, '').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&');
    }
    return "";
},

/*if obtained details from skepticalscience.com
 * automatically fill out article title \ type \ bias
 * also prevent user from altering these values*/
autoCompleteForm : function() {
	var articleTitleText = document.getElementById("article-txtBox");
	var articleBias = document.getElementById("articleBiasList");
	var articleType = document.getElementById("articleTypeList");
	var articlePublishingDate = document.getElementById("skep-article-publishing-date");
	var xmlDoc = Skeptical.BrowserOverlay.my_state.getExistingArgumentsXML();
	var existingTitle = xmlDoc.getElementsByTagName("article-title");
	var existingBias = xmlDoc.getElementsByTagName("article-bias");
	var existingType = xmlDoc.getElementsByTagName("article-type");
	var existingArticlePublishingDate = xmlDoc.getElementsByTagName("article-publishing-date");

	existingBias = existingBias[0].childNodes[0].nodeValue;
	existingType = existingType[0].childNodes[0].nodeValue;
	
	
	articleTitleText.value = existingTitle[0].childNodes[0].nodeValue;
	
	//Determine article type value returned from system and update menulist
	switch (existingType)
	{
	case "1":
		articleType.selectedIndex = 0;
		break;
	case "2":
		articleType.selectedIndex = 1;
		break;
	case "3":
		articleType.selectedIndex = 2;
		break;
	case "4":
		articleType.selectedIndex = 3;
		break;
	case "5":
		articleType.selectedIndex = 4;
		break;
	default:
		break;
	}
	//Determine article bias value returned from system and update menulist
	switch (existingBias)
	{
	case "1":
		articleBias.selectedIndex = 0;
		break;
	case "2":
		articleBias.selectedIndex = 1;
		break;
	case "3":
		articleBias.selectedIndex = 2;
		break;
	default:
		break;
	}
	articleType.disabled = "true";
	articleBias.disabled = "true";
	articlePublishingDate.disabled = "true";
	
	articlePublishingDate.value = existingArticlePublishingDate[0].childNodes[0].nodeValue;
},

/*function to fill out the tree list with arguments that already exist for the current url*/
populateExistingArguments : function() {
	var xmlDoc = Skeptical.BrowserOverlay.my_state.getExistingArgumentsXML();
	var xmlHeading=xmlDoc.getElementsByTagName("heading");
	var articleCountText = document.getElementById("skepArgumentsCount");
	var retrieveArgumentHeadingXml;
	//clear tree children
	Skeptical.BrowserOverlay.clearChilds();
	//deselect previous argument
	Skeptical.BrowserOverlay.removeTreeSelection();

	//Loop through total number of elements.
	for (i=0;i<xmlHeading.length;i++)
	{ 
		retrieveArgumentHeadingXml = (xmlHeading[i].childNodes[0].nodeValue);
		//Populate the XUL TREE with all arguments.
		Skeptical.BrowserOverlay.initiateTreeStructure(retrieveArgumentHeadingXml);
	}
	Skeptical.BrowserOverlay.searchForArgumentByKeyword();
},

/*returns title if found in specified tag, otherwise returns null
 * searchDepth indicates how many tags you want to inspect
 * 1 for the first tag only, 2 for 2 tags etc*/
findTitleInTag : function(tag, searchDepth) {
	var aDocument = gBrowser.contentDocument;
	var articleTags = aDocument.getElementsByTagName(tag); 
	var pageTitle = Skeptical.BrowserOverlay.trimString(aDocument.title);
	var potentialTitle = "";
	var i;
	
	if(searchDepth > articleTags.length)
	{
		searchDepth = articleTags.length;
	}
	for( i=0; i < searchDepth; i++)
	{
		potentialTitle = articleTags[i].textContent;
		potentialTitle = Skeptical.BrowserOverlay.trimString(potentialTitle);
		
		if(potentialTitle && pageTitle.toLowerCase().indexOf(potentialTitle.toLowerCase()) > -1 )
		{
			return potentialTitle;
		}
	}
	
	return null;
	
},

/*Attempt to automatically retrieve article title
 * first by inspecting <h3> then <h2> then <h1> and finally the <title> tag*/
retriveArticleTitle : function() {
	var title = "";
	//entry text box for article title
	var titleTxt = document.getElementById("article-txtBox");
	// this is the document of the currently opened tab 
	var aDocument = gBrowser.contentDocument;

		
		title = Skeptical.BrowserOverlay.findTitleInTag("h3",1);
		if(title === null)
		{
			title = Skeptical.BrowserOverlay.findTitleInTag("h2",2);
		}
		if(title === null)
		{
			title = Skeptical.BrowserOverlay.findTitleInTag("h1",2);
		}
		if(title === null)
		{
			title = aDocument.title;
		}
	
	//set text fields entry to the grabbed title and auto focus it
	titleTxt.value = title;
	titleTxt.focus();
},

/*Retrieve the current URL of the site visited.
 * also used to start checks for existing arguments, and extraction of article title*/
loadSiteInfo : function() {
	//Firebug.Console.log("BrowserOverlay: loadSiteInfo");
	var statusBar = document.getElementById("status-txtBox");
	var sendButton = document.getElementById("sendReport");
	var isAlreadyExisting = false;
	var isWebPage = true;
	
	statusBar.value = "Status:";
	statusBar.style.color = 'green';
	
	//remove attribute
	Skeptical.BrowserOverlay.removeArticleTitle();
	
	//Get XUL element.
	var titleURL = document.getElementById("title-txtBox");

	var urlHost = "";
	var urlPath = "";
	var newPath = "";

	//disable button
	sendButton.disabled = "True"; 
	//type an article title
	sendButton.setAttribute("tooltiptext", "-Type an article title -Select an argument to send report");
	
	//Get Spec of current site eg /options.php.
	try{
		urlPath = getWebNavigation().currentURI.spec;
	}catch(e){
		urlPath = "";
	}
	
	//Get host of current site eg /www.google.com.
	try{
		urlHost = getWebNavigation().currentURI.host;
	}catch(e){
		isWebPage = false;
	}
	if( urlHost === ""){
		isWebPage = false;
	}
	Skeptical.BrowserOverlay.my_state.setIsWebPage(isWebPage);
	//If url is greater than 200chars... slice..
	
	if (urlPath.length > 40) {
		//Slice string show characters from 40 characters max om titlebar.
		newPath = urlPath.slice(0, 40); 
		titleURL.value = ("Article URL: " + newPath + "...");	
		titleURL.setAttribute("tooltiptext", urlPath);
		//If URL string length less than 40 then show full URL in titlebar.
	} else { 
		newPath = urlPath; 
		titleURL.value = ("Article URL: " + newPath);
		titleURL.setAttribute("tooltiptext", urlPath);
	}

	if(isWebPage) {
		Skeptical.BrowserOverlay.getExistingArguments(urlPath);
	}else{
		Skeptical.BrowserOverlay.disableElements();
	}
},

/*query skepticalscience.com for the arguments for aURL
 * then pull down the xml containing them, and populate the second arguments tree
 * also use the article title and bias \ source obtained to automatically set them.
 * Return true if succesfull, false if not*/
getExistingArguments : function(aURL) {
	//Firebug.Console.log("ViewOverlay: getExistingArguments");
	var urlRequestString;
	var xUrlHttp=new XMLHttpRequest();
	var xmlResponse;
	var xmlDoc;
	var parser=new DOMParser();
	
	urlRequestString = Skeptical.CONFIG.ARTICLE_EXISTING_ARGUMENTS_URL + aURL;
	
	//Get request for xml
	xUrlHttp.open("GET", urlRequestString, true);
	xUrlHttp.onreadystatechange = function(){
		if (xUrlHttp.readyState == 4) {
			// Request finished and response ready
     		if(xUrlHttp.status == 200){
    			// Status ok
 				xmlResponse = xUrlHttp.responseText;
				//validate xml by checking
				//Firebug.Console.log(xmlResponse);
				if(xmlResponse != Skeptical.CONFIG.ERROR_NO_ARTICLE_FOUND)
				{
					xmlDoc=parser.parseFromString(xmlResponse,"text/xml");
					Skeptical.BrowserOverlay.my_state.setExistingArgumentsXML(xmlDoc);
					Skeptical.BrowserOverlay.my_state.setIsExistingArguments(true);
					Skeptical.BrowserOverlay.enableElements();
					Skeptical.BrowserOverlay.hideArticleInfo();
					Skeptical.BrowserOverlay.searchForArgumentByKeyword();
					Skeptical.BrowserOverlay.autoCompleteForm();
				}else{
					Skeptical.BrowserOverlay.my_state.setIsExistingArguments(false);
					var articleType = document.getElementById("articleTypeList");
					articleType.removeAttribute('disabled');
					var articleBias = document.getElementById("articleBiasList");
					articleBias.removeAttribute('disabled');
					var datePicker = document.getElementById("skep-article-publishing-date");
					datePicker.removeAttribute('disabled');

					Skeptical.BrowserOverlay.clearChilds();
					Skeptical.BrowserOverlay.populateArgumentTree();
					Skeptical.BrowserOverlay.retriveArticleTitle();
					Skeptical.BrowserOverlay.enableElements();
				}
     		} else {
     			// Status other than ok (notify user)
				Skeptical.BrowserOverlay.my_state.setIsExistingArguments(false);
				Skeptical.BrowserOverlay.showError();
     		}
		}
	};
	xUrlHttp.send();
},

/*hide the article title and its bias \ type dropdowns*/
hideArticleInfo : function() {
	var articleInfoBox = document.getElementById("articleInfo");
	
	articleInfoBox.hidden = "True";
},

/*Determine if the users, username and password is valid for login into the application.*/			
storeLoggedInUser : function(userNameValid, userNameValue, userPassword) {

	//Set userPassword Value.
	Skeptical.BrowserOverlay.my_state.setSaveLinkUserPassword(encodeURIComponent(userPassword));
	
	//Set userName Value.
	Skeptical.BrowserOverlay.my_state.setSaveLinkUserName(userNameValue);

	//If user is valid..
	if (userNameValid === true) {
		Skeptical.BrowserOverlay.logInValid(userNameValid, userNameValue, userPassword);
		//If user is not valid.
	} else if (userNameValid === false) {
		Skeptical.BrowserOverlay.logInInValid(userNameValid, userNameValue, userPassword);
	} else {

	}

},

/*The log in username - passward was valid.*/
logInValid : function(userNameValid, userNameValue, userPassword) {
	//get XUL elements 
	var userNameTextbox = document.getElementById("userName-txtBox");
	var statusMessage = document.getElementById("status-txtBox");
	var userNameLabel = document.getElementById("userNameLabel-txtBox");
	var sendButton = document.getElementById("sendReport");
	
	var statusLabel = "Status:";

	sendButton.removeAttribute('disabled'); 
	sendButton.setAttribute("tooltiptext", "Send Report");
	userNameLabel.value = "Logged in as:";
	userNameTextbox.value = userNameValue;
	statusMessage.style.color = 'green';
	statusMessage.setAttribute("value", statusLabel + "");

},

/*The log in username - password was invalid.*/
logInInValid : function(userNameValid, userNameValue, userPassword) {
	//get XUL elements 
	var userNameTextbox = document.getElementById("userName-txtBox");
	var statusMessage = document.getElementById("status-txtBox");
	var userNameLabel = document.getElementById("userNameLabel-txtBox");
	var sendButton = document.getElementById("sendReport");
	
	var statusLabel = "Status:";
	
	sendButton.disabled = "True";
	sendButton.setAttribute("tooltiptext", "Login Please");
	userNameLabel.value = Skeptical.CONFIG.ERROR_INCORRECT_LOGIN;
	userNameTextbox.value = "";
	statusMessage.style.color = 'red';
	statusMessage.setAttribute("value", statusLabel + " Login Please");
},

/*Determine and validate, if the article textbox contains data.*/
validateForm : function() {
	//Firebug.Console.log("validateForm");
	//Get send report button / element.
	var sendButton = document.getElementById("sendReport");
	var articleTitle = document.getElementById("article-txtBox");
	//trim leading and trailing whitespace so user can't enter all spaces
	var articleTitleTrimed = Skeptical.BrowserOverlay.trimString(articleTitle.value);
	
	//argument selected boolean
	var articleTitleBool = null;
	//If the article title textbox is empty.
	if (!articleTitleTrimed || articleTitleTrimed === "") {
		//article title empty
		articleTitleBool = false;
	} else {
		//article title contains
		articleTitleBool = true;
	}
	
	Skeptical.BrowserOverlay.validateArgumentSelected(articleTitleBool);
},

/*Function called on command to determine if the article title inputed is valid.
 * also starts of sequence of calls to validate argument selected, and set send button status*/
changedArticleTitle : function() {
	Skeptical.BrowserOverlay.validateForm();
},

selectedArgument : function(e) {
	var skepGroup = document.getElementById("explainPopup");
	var tree = document.getElementById("myTodoListTree");
	var treeIndex = tree.currentIndex;
	var col;
	
	if(treeIndex >= 0){
		col = tree.columns ? tree.columns["0"] : "0";
	}else{
		skepGroup.hidePopup();
		return;
	}
	var selectedArgument = tree.view.getCellText(treeIndex,col);
	if(selectedArgument === "") {
		return;
	}
	Skeptical.BrowserOverlay.showArgumentInformation(selectedArgument);
},

/*method to retrieve argument rebuttals from either the cached store of argument or from skeptical science*/
showArgumentInformation : function(anArgumentDescription) {
	//Firebug.Console.log("showArgumentInformation");
	var skepGroup = document.getElementById("explainPopup");
	var tree = document.getElementById("myTodoListTree");
	var xmlArguments;
	var selectedArgumentID;
	
	//getArgumentIdByDescription returns -1 if no argument is found
	selectedArgumentID = Skeptical.BrowserOverlay.my_state.getArgumentIdByDescription(anArgumentDescription);
	//valid argument id's are greater than 0
	if(selectedArgumentID > 0) {
		//check to see if argument already cached
		var isArgumentCached = Skeptical.ViewOverlay.viewState.isArgumentCached(selectedArgumentID);
		//if argument not cached then request it and store it
		if(isArgumentCached === false) {
			Skeptical.BrowserOverlay.requestArgumentInformation(selectedArgumentID);
		} else {
			// Retrieve the argument cached in the viewState
			var argumentInformation = Skeptical.ViewOverlay.viewState.getArgumentRebuttalByID(selectedArgumentID);
			Skeptical.BrowserOverlay.displayArgumentInformation(argumentInformation);
		}
	}
},

/* Method responsible for requesting and receiving information related to
 * a particular argument id (anID), this method will also cache the results*/
requestArgumentInformation : function(anID) {
	//get StatusBar Element
	var statusBar = document.getElementById("status-txtBox");
	var xhttp=new XMLHttpRequest();
	var parser=new DOMParser();
	var responseText = "";
	var xmlDoc;
	var argumentInformation;
	var requestString = Skeptical.CONFIG.ARGUMENT_DETAILS_URL+anID;
	
	statusBar.value = "Status: Fetching argument details...";
	statusBar.style.color = 'blue';
	
	xhttp.open("GET",requestString,true);
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4) {
			// Request finished and response ready
     		if(xhttp.status == 200){
    			// Status ok
     			var xmlArguments = xhttp.responseText;
			 	if(xmlArguments != Skeptical.CONFIG.ERROR_NO_ARGUMENT) {
					statusBar.value = "Status: Argument details received";
					statusBar.style.color = 'green';
	   				// Parse xml and store arguments in cache	
     				xmlDoc=parser.parseFromString(xmlArguments,"text/xml");
     				argumentInformation = Skeptical.BrowserOverlay.createArgumentDetails(xmlDoc);
					// Display argument details
					Skeptical.BrowserOverlay.displayArgumentInformation(argumentInformation);
				}else{
					statusBar.value = "Status: No details available";
					statusBar.style.color = 'blue';
				}
     		} else {
     			// Status other than ok (notify user)
				Skeptical.BrowserOverlay.showError();
     		}
		}
	}
	xhttp.send();
},

/* Takes a retrieved xml from skeptical science and stores it into an argument object
 * containing skeptic description, and science description, as well as ID and url,
 * aHeading is the shortend version of the argument as selected in the display list
 */
createArgumentDetails : function(aXmlDoc) {
	var tempTestingXmlDoc;
	var parser=new DOMParser();
	var newArgument = new com_shinetech_skepff.ArgumentRebuttal();
	var newArgumentID;
	var scienceRebuttal;
	var skepticArgument;
	var rebuttalURL;
	
	scienceRebuttal = Skeptical.CONFIG.FONT_PREFIX;
	skepticArgument = Skeptical.CONFIG.FONT_PREFIX;
	newArgumentID = aXmlDoc.getElementsByTagName("argument-id")[0].childNodes[0].nodeValue;
	/*if either of the two following are less than 3 characters long, it means john has provided us with no description
	 * ie only " " in these cases we provide our own stating that no description was available*/
	
	if(aXmlDoc.getElementsByTagName("science-says")[0].childNodes[0].nodeValue.length > 3){
		scienceRebuttal += aXmlDoc.getElementsByTagName("science-says")[0].childNodes[0].nodeValue;
	}else{
		scienceRebuttal += "No rebuttal currently available";
	}
	
	if(aXmlDoc.getElementsByTagName("skeptics-say")[0].childNodes[0].nodeValue.length > 3){
		skepticArgument += aXmlDoc.getElementsByTagName("skeptics-say")[0].childNodes[0].nodeValue;
	}else{
		skepticArgument += "No argument description available";
	}
	rebuttalURL = aXmlDoc.getElementsByTagName("argument-url")[0].childNodes[0].nodeValue;
	
	rebuttalURL = Skeptical.BrowserOverlay.trimString(rebuttalURL);
	
	/*remove any unnessecary formating that occasionaly occurs causeing the description 
	 *to be displayed incorrectly, as well as ensureing any urls open in a new window*/
	if(skepticArgument.indexOf('target="_blank"') == -1) {
		skepticArgument.replace(/<a/g,'<a target="_blank"');
		
	}
	
	skepticArgument = skepticArgument.replace(/"<p>/g,'').replace(/<\/p>"/g,'').replace(/_self/g,'_blank');
	
	newArgument.setArgumentID(newArgumentID);
	newArgument.setScienceArgument(scienceRebuttal);
	newArgument.setSkepticArgument(skepticArgument);
	newArgument.setRebuttalUrl(rebuttalURL);

	return newArgument;
},
/*method to auto-size an iframe so that no scroll bars are present*/
autoSizeIFrame : function(){
	var skepticIFrame = document.getElementById("skepticDescHtml");
	var skepGroup = document.getElementById("skepGroup");
	var maxHeight = skepticIFrame.getAttribute('maxheight');
	//additional 17 added to ensure a scrollbar does not get displayed when we dont need one
	var newHeight = skepticIFrame.contentWindow.document.body.offsetHeight + 17;
	if(newHeight > maxHeight){
		newHeight = maxHeight;
	}
	newHeight += 'px';
	skepticIFrame.style.height = newHeight;
},

/*method to fill out and display argument rebuttal information*/
displayArgumentInformation : function(argumentInformation) {
	var skepticDescIframe = document.getElementById("skepticDescHtml");
	var skepticPopup = document.getElementById("explainPopup");
	var titleURL = document.getElementById("skep-popup");
	var skepticDoc;
	var timer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);  
	
	if(skepticDescIframe.contentDocument) {
		skepticDoc = skepticDescIframe.contentDocument;
	}
	skepticDescIframe.src = "about:blank";
	// Put the content in the iframe
	skepticDoc.open();
	skepticDoc.writeln(argumentInformation.getSkepticArgument());
	skepticDoc.close();
	
	skepticPopup.openPopup( titleURL , "end_before", 0 , "75"  , false, false);
	timer.initWithCallback(Skeptical.BrowserOverlay.autoResizeEvent, 0, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
},

/*Determines and sets relative attributes based on if a valid argument has been selected by the user.*/
validateArgumentSelected : function(articleTitleBool) {
	//Firebug.Console.log("validateArgumentSelected");
	
	//argument selected boolean
	var argumentSelectedBool = null;
	
	//Retrieve XUL elements
	//Send Report Button.
	var sendButton = document.getElementById("sendReport"); 
	var statusBar = document.getElementById("status-txtBox");
	
	//get the tree element
	var xulTree = document.getElementById("myTodoListTree");

	var start = new Object();
	var end = new Object();
	var numRanges = 0;
	if(xulTree.view){
		 numRanges = xulTree.view.selection.getRangeCount();
	}

	//determine the index of the selected item
	for (var t=0; t<numRanges; t++){
	  xulTree.view.selection.getRangeAt(t,start,end);
	  for (var v=start.value; v<=end.value; v++){
		  if (v == "-1") { //if an item of -1 is selected (for reset)
			  	//no argument selected
			  	argumentSelectedBool = false;
			} else { 
				//argument selected
				argumentSelectedBool = true;
			}
		}
	  
	  //update the status of the button
	  Skeptical.BrowserOverlay.updateButtonStatus(argumentSelectedBool, articleTitleBool);	
	
	}
},

/*function to update the validation status on the button*/ //passes booleans for argument/article
updateButtonStatus : function(argumentSelectedBool, articleTitleBool) {
	
	//Send Report Button Element.
	var sendButton = document.getElementById("sendReport");
	var statusBar = document.getElementById("userNameLabel-txtBox");	
	
	if (argumentSelectedBool == true && articleTitleBool == false) { //if argument selected yes, article title no
		sendButton.disabled = "True";
		sendButton.setAttribute("tooltiptext", "-Type an article title to send report");
	} else if (argumentSelectedBool == false && articleTitleBool == true) { //if argument selected no, article title yes
		sendButton.disabled = "True";
		sendButton.setAttribute("tooltiptext", "-Select an argument to send report");
	} else if (argumentSelectedBool == false && articleTitleBool == false) { //if argument selected no, article title no
		sendButton.disabled = "True";
		sendButton.setAttribute("tooltiptext", "-Type an article title -Select an argument to send report");
	} else if (argumentSelectedBool == true && articleTitleBool == true){ //if argument selected yes, article title yes
		sendButton.removeAttribute('disabled'); 
		sendButton.setAttribute("tooltiptext", "Send Report");
	}
	
	//disable the button if Login status is not valid
	if (statusBar.value === Skeptical.CONFIG.ERROR_NO_LOGIN_DETAILS || statusBar.value === Skeptical.CONFIG.ERROR_INCORRECT_LOGIN) {
		sendButton.disabled = "True";
		sendButton.setAttribute("tooltiptext", "Login Please");
	}
	
	if(!Skeptical.BrowserOverlay.my_state.isWebPage()){
		sendButton.disabled = "True";
		sendButton.setAttribute("tooltiptext","Not a valid Website");
	}
},

/*remove the article title and call to remove the tree selection*/
removeArticleTitle : function() {
	
	//get the article title element
	var articleTitle = document.getElementById("article-txtBox");
	
	//clear out the articleTitle
	articleTitle.value = "";
	
	Skeptical.BrowserOverlay.removeTreeSelection();
},


/*Remove the current article title and argument selection to refresh form*/
removeTreeSelection : function() {;

	//get the tree element
	var xulTree = document.getElementById("myTodoListTree");

	//set the selection to -1 so nothing is selected
	if(xulTree.view){
		xulTree.view.selection.select(-1); 
	}
},

/*Open the options popup and pass the Skeptical browser overlay. */ 
openOptionsDialog : function(e) {
	//Open the preferences popup.
	var winPosX = window.screenX + 50;
	var winPosY = window.screenY + 50;
	var featuresString = 'resizable=no, titlebar="no", left='+winPosX+', top='+winPosY+'';
	window.openDialog("chrome://skep/content/options.xul", null,featuresString , this);
	document.getElementById("skep-popup").hidePopup();
},

/*Get the current URL of the site visited and store it.*/
saveWebsite : function () {
	//Web site address.
	var path = getWebNavigation().currentURI.spec;

	Skeptical.BrowserOverlay.my_state.setSaveLinkURL(encodeURIComponent(path));

},

/*Save the current username of the user logged in.*/
saveUserName : function () {

	//username Textbox XUL element
	var userNameTextBox = document.getElementById("userName-txtBox");

	Skeptical.BrowserOverlay.my_state.setSaveLinkUserName(encodeURIComponent(userNameTextBox.value));
},

/*Save the current article title inputted by the user.*/
saveArticleTitle : function () {
	var articleTitleTxtBox = "";
	//Article Title.
	articleTitleTxtBox = document.getElementById("article-txtBox");

	Skeptical.BrowserOverlay.my_state.setSaveLinkArticleTitle(encodeURIComponent(articleTitleTxtBox.value));

},

/*Save the current article type selected by the user.*/
saveArticleType : function () {
	var articleTypeTxtbox = "";

	//get the string bundle element (skep.properties)
	var stringBundle = document.getElementById("xs-hw-string-bundle");

	//Get articleType XUL element.
	var articleTypeTxtbox = document.getElementById("articleTypeList");

	//Get the index of the value selected.
	var articleTypeTxtboxValue = articleTypeTxtbox.value;
	
	//Determine article type value selected by the user.
	switch (articleTypeTxtboxValue)
	{

	case "1":
		Skeptical.BrowserOverlay.my_state.setSaveLinkArticleType(stringBundle.getString("xs.hw.menuBlog.label"));
		break;
	case "2":
		Skeptical.BrowserOverlay.my_state.setSaveLinkArticleType(stringBundle.getString("xs.hw.menuForum.label"));
		break;
	case "3":
		Skeptical.BrowserOverlay.my_state.setSaveLinkArticleType(stringBundle.getString("xs.hw.menuMainstreamMedia.label"));
		break;
	case "4":
		Skeptical.BrowserOverlay.my_state.setSaveLinkArticleType(stringBundle.getString("xs.hw.menuOnlineArticle.label"));
		break;
	case "5":
		Skeptical.BrowserOverlay.my_state.setSaveLinkArticleType(stringBundle.getString("xs.hw.menuPeerReviewStudy.label"));
		break;
	}
},

/*Save the current article bias selected by the user.*/
saveArticleBias : function () {
	var articleBiasTxtbox = "";

	//get the string bundle element (skep.properties)
	var stringBundle = document.getElementById("xs-hw-string-bundle");
	
	//Get articleBias XUL element.
	var articleBiasTxtbox = document.getElementById("articleBiasList");
	
	//Get the index of the value selected.
	var articleBiasTxtboxValue = articleBiasTxtbox.value;

	//Determine article bias value selected by the user.
	switch (articleBiasTxtboxValue)
	{
	
	case "1":
		Skeptical.BrowserOverlay.my_state.setSaveLinkArticleBias(stringBundle.getString("xs.hw.menuSkeptical.label"));
		break;
	case "2":
		Skeptical.BrowserOverlay.my_state.setSaveLinkArticleBias(stringBundle.getString("xs.hw.menuNeutral.label"));
		break;
	case "3":
		Skeptical.BrowserOverlay.my_state.setSaveLinkArticleBias(stringBundle.getString("xs.hw.menuProAGW.label"));
		break;
	}
},

saveArticlePublishingDate: function () {
	var dateField = document.getElementById("skep-article-publishing-date");
	
	Skeptical.BrowserOverlay.my_state.setSaveArticlePublishingDate(dateField.value);

},

/*Determine the index of the argument title selected.*/
saveArgumentSelected : function () {
	//Argument selected.
	var xulTree = document.getElementById('myTodoListTree'); 
	
	var argumentHeadingsArray = Skeptical.BrowserOverlay.my_state.getArgumentHeadingsArray();
	var argumentIdsArray = Skeptical.BrowserOverlay.my_state.getArgumentIdsArray();
	
	//declare cellIndex variable set as 0
	var cellIndex = 0;
	
	//get the value of the cell selected by the user eg. "Its the sun"
	var cellText = xulTree.view.getCellText(xulTree.currentIndex, xulTree.columns.getColumnAt(cellIndex));

	//get The index of where the argument is positioned within the array
	var argumentIndex = (argumentHeadingsArray.indexOf(cellText));	
	
	//Search Array list of argument IDs at index as given from the argument headings array (SET)
	Skeptical.BrowserOverlay.my_state.setSaveLinkArgumentId(argumentIdsArray[argumentIndex]);

},

loadUserName : function() {
	//get the XUL elements for username and Password
	var username = document.getElementById("userName-txtBox");
	
	//get the login manager
	var loginManager = Skeptical.BrowserOverlay.getLoginManager();
	
	//find logins
	//The ? has to be added to the VALIDATE_LOGIN_URL to retain compatibility with previous versions of the add-on
	var logins = loginManager.findLogins({}, Skeptical.CONFIG.SKEPTICAL_URL, Skeptical.CONFIG.VALIDATE_LOGIN_URL+"?", null);
	
	//if logins exist / process into username and password values!
	if (logins.length > 0) {
		username.value = logins[0].username;
		Skeptical.BrowserOverlay.my_state.setSaveLinkUserPassword(encodeURIComponent(logins[0].password)); 
	}
	
},

/*Post the save link to Skeptical Science.*/
submitSaveLink : function () {
	//Firebug.Console.log("submitSaveLink");
	var responseText;
	var statusMessage = document.getElementById("status-txtBox");
	var statusLabel = "Status:";	
	var xUrlHttp=new XMLHttpRequest();
	
	var articleDetails = "argument-id=" + Skeptical.BrowserOverlay.my_state.getSaveLinkArgumentId() + 
						 "&username=" + Skeptical.BrowserOverlay.my_state.getSaveLinkUserName() + 
						 "&password=" + Skeptical.BrowserOverlay.my_state.getSaveLinkUserPassword() + 
						 "&url=" + Skeptical.BrowserOverlay.my_state.getSaveLinkURL() + 
						 "&article-title=" + Skeptical.BrowserOverlay.my_state.getSaveLinkArticleTitle() + 
						 "&article-type=" + Skeptical.BrowserOverlay.my_state.getSaveLinkArticleType() + 
						 "&article-bias=" + Skeptical.BrowserOverlay.my_state.getSaveLinkArticleBias() +
						 "&article-publishing-date=" + Skeptical.BrowserOverlay.my_state.getSaveArticlePublishingDate();

	xUrlHttp.open("POST", Skeptical.CONFIG.SAVE_LINK_URL, true);

	//Send the proper header information along with the request
	xUrlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xUrlHttp.setRequestHeader("Content-length", articleDetails.length);
	xUrlHttp.setRequestHeader("Connection", "close");

	xUrlHttp.onreadystatechange = function(){
		//Firebug.Console.log(xUrlHttp.readyState+" - "+xUrlHttp.status);
		if (xUrlHttp.readyState == 4) {
			// Request finished and response ready
	 		if(xUrlHttp.status == 200){
				// Status ok
			 	responseText = xUrlHttp.responseText;
				//Pass the responseText.
				Skeptical.BrowserOverlay.validateResponseText(responseText);
			} else {
	 			// Status other than ok (notify user)
				Skeptical.BrowserOverlay.showError();
	 		}
			Skeptical.BrowserOverlay.loadSiteInfo(); 
		}
	}
	xUrlHttp.send(articleDetails);
},

/*Validate the response text.*/ 
validateResponseText : function (responseText) {
	//Firebug.Console.log("validateResponseText");
	//Get status xul element..
	var statusMessage = document.getElementById("status-txtBox");
	var statusLabel = "Status:";

	var errorMessage = "ERROR";

	//Determine responseText. 
	switch (responseText){
		case Skeptical.CONFIG.ARGUMENT_ADDED_OK:
			statusMessage.value = statusLabel + " Report Sent";
			statusMessage.style.color = 'green';
			//request toolbar icon update now
			Skeptical.ViewOverlay.determineIconColor();
			break;
		case Skeptical.CONFIG.ERROR_ARGUMENT_ALREADY_EXISTS:
			statusMessage.value = statusLabel + " Argument already recorded for this article";
			statusMessage.style.color = 'blue';
			break;
		default:
			statusMessage.value = statusLabel + " Error during save, please try again.";
			statusMessage.style.color = 'red';
	}

	Skeptical.BrowserOverlay.validateForm();
},

/*execute a report save!*/
saveReport : function() {
	//Firebug.Console.log("saveReport");
	
	var statusMessage = document.getElementById("status-txtBox");
	
	if (statusMessage.value === Skeptical.CONFIG.ERROR_NO_INTERNET) {
		statusMessage.value = "Status: No Internet Connection, Report not saved!";
	} else {
		
		//Save form (article details).
		Skeptical.BrowserOverlay.saveWebsite();
		Skeptical.BrowserOverlay.saveUserName();
		Skeptical.BrowserOverlay.saveArticleTitle();
		Skeptical.BrowserOverlay.saveArticleType();
		Skeptical.BrowserOverlay.saveArticleBias();
		Skeptical.BrowserOverlay.saveArgumentSelected();
		Skeptical.BrowserOverlay.saveArticlePublishingDate();
		
		//Post SaveLink.
		Skeptical.BrowserOverlay.submitSaveLink();
	}
},

/*When executed determines if a user is logged in then
executes the save functions relevant for creating the save link.*/
saveUserReport : function(e) {   
	//Firebug.Console.log("saveUserReport");
	
	//Get xul elements..
	var userNameLabel = document.getElementById("userNameLabel-txtBox");
	var statusMessage = document.getElementById("status-txtBox");
	var statusLabel = "Status:";
	
	//Determine if user is logged in...
	if (userNameLabel.value === Skeptical.CONFIG.ERROR_INCORRECT_LOGIN || userNameLabel.value === Skeptical.CONFIG.ERROR_NO_LOGIN_DETAILS) {

		statusMessage.setAttribute("value", statusLabel + " Login Please");
		statusMessage.style.color = 'brown';
		statusMessage.setAttribute("tooltiptext", "Login Please");

	} else {

		Skeptical.BrowserOverlay.saveReport();
	}


}

};


