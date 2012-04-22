/*
 * skepViewArguments.js
 * Description: Code responsibile for displaying all information 
 * about current page loaded to the user, such as any arguments
 * and the bias and source of the page, also lists argument rebuttals
 * along with a link to a full description of the argument.
 * @author Cameron Bradley, Michael Gillies 24/9/2010
 * Change History:
 * Who When Description
 * ------------------------------------------------------------------
 * Michael.G 24/09/10  <<Initial version>>
 * Michael.G 29/09/10  <<Added ability to display html in argument descriptions>>
 * Michael.G 29/09/10  <<coding review changes CR-SKEPFF-33>>
 * Michael.G 29/09/10  <<fix for SKEPFF-76>>
 * Michael.G 30/09/10  <<SKEPFF-80 button added to copy rebuttal url to clipboard>>
 * Michael.G 30/09/10  <<SKEPFF-78 fixed failing search in show arguments interface>>
 * Michael.G 30/09/10  <<SKEPFF-80 full rebuttal url displayed>>
 * Michael.G 1/10/10   <<SKEPFF-82 fixed interface not clearing on invalid web page>>
 * Michael.G 1/10/10   <<SKEPFF-84 automatically select argument when there is only one listed>>
 * Michael.G 5/10/10   <<added more url consts>>
 * Michael.G 7/10/10   <<SKEPFF-90 added code to automatically resize science says iframe>>
 * Michael.G 8/10/10   <<SKEPFF-91 interface now downsizes correctly clearRebuttalUI function modified>>
 * Michael.G 8/10/10   <<SKEPFF-90 iframe now only resizes to its maxheight instead of beyond>>
 * Michael.G 11/10/10  <<SKEPFF-92 iframe font style now consistent with rest of UI>>
 * Michael.G 11/10/10  <<SKEPFF-93 resolved extension throwing error into the firefox console. >>
 * Michael.G 12/10/10  <<SKEPFF-97 switched to nsITimer instead of setTimeout>>
 * Michael.G 13/10/10  <<SKEPFF-94 argument automatically selected in case of single argument>>
 * Michael.G 13/10/10  <<SKEPFF-98 added message to be displayed when an argument has no rebuttal>>
 * Michael.G 13/10/10  <<SKEPFF-100 removed unnessecary paragraph from skeptic argument >>
 * Michael.G 14/10/10  <<SKEPFF-101 copy url button changed to display when the url was present and when it was unavailable>>
 * Michael.G 18/10/10  <<SKEPFF-113 changed event to update icon on page change>>
 * Michael.G 19/10/10  <<Code review changes (comments and coding style changes)>>
 * Michael.G 28/10/10  <<Code review Changes>>
 * Michael.G 28/10/10  <<SKEPFF-118 now add url target into descriptions without it>>
 * Michael.G 3/11/10   <<SKEPFF-121 Changed the request for icon colour to be asynchronous >>
 * Michael.G 29/11/10  <<CR-SKEPFF-66 Tooltip changed to use the optional tooltip if present>>
 * Michael.G 29/11/10  <<CR-SKEPFF-67 added check to regex to make it safer as per code review>>
 * Michael.G 6/12/10   <<changed apps loose variables to be wrapped in our objects>>
 */

//If function undefined (naming convention)
//- Overlay = attach Skeptical - to browserOverlay eg. (Skeptical.BrowserOverlay).
if ("undefined" == typeof(Skeptical)) {
	var Skeptical = {};
};

//Add an event listerner to determine when firefox is loaded.
window.addEventListener("load", function() { Skeptical.ViewOverlay.init(); }, false);

//is the class constructor
com_shinetech_skepff.ViewState = function() {
	//strings
	this.userInputedArgument = "";
	
	//last selected tree index
	this.lastTreeIndex = -1;
	
	//flag to ignore onselect fireing while clearing ui
	this.isClearingTreeUi = false;
	
	//cache of retrieved argument rebuttals
	this.argumentRebuttals = new Array;
	
	//the rebuttal url for the currently selected argument
	this.currentArgumentRebuttalUrl = "";
	
};

com_shinetech_skepff.ViewState.prototype.getCurrentRebuttalUrl = function() {
	
	return this.currentArgumentRebuttalUrl;
};

com_shinetech_skepff.ViewState.prototype.setCurrentRebuttalUrl = function(aUrl) {
	
	this.currentArgumentRebuttalUrl = aUrl;
};

com_shinetech_skepff.ViewState.prototype.isClearingUi = function() {
	
	return this.isClearingTreeUi;
};

com_shinetech_skepff.ViewState.prototype.setIsClearingUi = function (isClearingUi) {
	
	this.isClearingTreeUi = isClearingUi;
};

com_shinetech_skepff.ViewState.prototype.setLastTreeIndex = function(aTreeIndex) {
	
	this.lastTreeIndex = aTreeIndex;
};

com_shinetech_skepff.ViewState.prototype.getLastTreeIndex = function() {
	
	return this.lastTreeIndex;
};

com_shinetech_skepff.ViewState.prototype.setUserArgumentSearch = function(aUserArgumentSearch){
	
	this.userInputedArgument = aUserArgumentSearch;	
};

com_shinetech_skepff.ViewState.prototype.getUserArgumentSearch = function(){
	
	return this.userInputedArgument;
};

/*function to check to see if a specific argument has already been downloaded*/
com_shinetech_skepff.ViewState.prototype.isArgumentCached = function (argumentID) {
	for(var i = 0; i < this.argumentRebuttals.length; i++) {
		if( argumentID == this.argumentRebuttals[i].getArgumentID() ) {
			return true;
		}
	}
	return false;
};

/*function to search for and return specific argument rebuttal*/
com_shinetech_skepff.ViewState.prototype.getArgumentRebuttalByID = function (argumentID) {
	for(var i = 0; i < this.argumentRebuttals.length; i++) {
		if( argumentID == this.argumentRebuttals[i].getArgumentID() ) {
			return this.argumentRebuttals[i];
		}
	}
	return null;
};

/* pushes a new argument rebuttal object onto the array
 * also handles logic so it does not add the same argument more than once */
com_shinetech_skepff.ViewState.prototype.addArgumentRebuttal = function(aNewArgument) {
	
	for(var i = 0; i < this.argumentRebuttals.length; i++) {
		if( aNewArgument.getArgumentID() == this.argumentRebuttals[i].getArgumentID() ) {
			return;
		}
	}
	this.argumentRebuttals.push(aNewArgument);
};

/*event class to handle resizeing iframe.*/
com_shinetech_skepff.ResizeEvent = function() { };  

com_shinetech_skepff.ResizeEvent.prototype.notify = function(timer) {
  	Skeptical.ViewOverlay.autoSizeIFrame();
};

//var viewState = new com_shinetech_skepff.ViewState();

/*event handler for resizeing iframe*/
//var resizeEvent = new com_shinetech_skepff.ResizeEvent();

Skeptical.ViewOverlay = {

viewState : new com_shinetech_skepff.ViewState(),

resizeEvent : new com_shinetech_skepff.ResizeEvent(),
		
		//Determine when browser is loaded.
init: function() {
	//Get the firefox page element.
	var appcontent = document.getElementById("appcontent");
	
	// During initialisation  
	var container = gBrowser.tabContainer;  
	container.addEventListener("TabSelect", Skeptical.ViewOverlay.onPageLoad, false);  
			
	if(appcontent){ //add an event listerner for when a firefox page is loaded 
			//call onPageLoad.
			appcontent.addEventListener("DOMContentLoaded", Skeptical.ViewOverlay.onPageLoad, true);
	}
			
},	

onPageUnload : function(aEvent) {
	/*here to stop page being cached and allow load events to be fired*/
},

/*Function loaded on page load one time and beings the process of retrieving the XML from Skeptical Science.*/
onPageLoad : function(aEvent) {
	//Firebug.Console.log("ViewOverlay: onPageLoad");
	Skeptical.ViewOverlay.determineIconColor();
	Skeptical.ViewOverlay.viewState.setLastTreeIndex('-1');
	
},

/*copies the full rebuttal url to the clipboard*/
copyUrlToClipboard : function(e) {
	const gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].  
	getService(Components.interfaces.nsIClipboardHelper); 
	gClipboardHelper.copyString(Skeptical.ViewOverlay.viewState.getCurrentRebuttalUrl());

},


onRebuttalButtonClick : function(e) {
	var rebuttalUrl = Skeptical.ViewOverlay.viewState.getCurrentRebuttalUrl();
	if(rebuttalUrl !== ""){
		gBrowser.selectedTab = gBrowser.addTab(rebuttalUrl);
	}
},

checkInternet: function() {
	var xhttp=new XMLHttpRequest();
	//Send a GET to the link to test if internet is up
	xhttp.open("GET",Skeptical.CONFIG.SKEPTICAL_URL,true);
	xhttp.onreadystatechange = function(){
		if (xhttp.readyState == 4) {
			// Request finished and response ready
     		if(xhttp.status == 200){
    			// Status ok
 				Skeptical.ViewOverlay.loadSiteInfo();
     		} else {
     			// Status other than ok (notify user)
				Skeptical.ViewOverlay.showError();
     		}
		}
	}
	xhttp.send();

},

showError : function() {
	var statusBar = document.getElementById("status-viewTxtBox");
	statusBar.value = Skeptical.CONFIG.ERROR_NO_INTERNET;
	statusBar.style.color = 'red';
	Skeptical.ViewOverlay.clearUI();
},

switchInterface : function(e) {
	
	Skeptical.BrowserOverlay.addSwitchInterface();

	var popup = document.getElementById("skep-popup-view");
	
	popup.hidePopup();
	
},

addSwitchInterface : function(e) {
	
	
	var popup = document.getElementById("skep-popup-view");
	
	var toolbarButton = document.getElementById("skep-viewButton");
	
	popup.openPopup( toolbarButton , "after_start", 0 , 0  , false, false);

	Skeptical.ViewOverlay.checkInternet();
},

/* function that retrieves the info about the current page and starts
 * presenting this information to the user
 */
loadSiteInfo : function() {
	
	var statusBar = document.getElementById("status-viewTxtBox");
	statusBar.value = "Status:";
	statusBar.style.color = 'green';

	var hasExistingArguments = false;
	var isWebPage = true;
	
	var smallHeader = document.getElementById("skep-header-smallLogo");
	var bigHeader = document.getElementById("skep-header-bigLogo");

	//Get XUL element.
	var titleURL = document.getElementById("skep-view-title");

	var urlHost = "";
	var urlPath = "";
	var newPath = "";
	
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
		Skeptical.ViewOverlay.getExistingArguments(urlPath);
	}else{
		Skeptical.ViewOverlay.clearUI();
		statusBar.value = Skeptical.CONFIG.ERROR_INVALID_PAGE;
		statusBar.style.color = 'blue';
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
	var articleType = document.getElementById("articleTypeList");
	var articleBias = document.getElementById("articleBiasList");
	
	urlRequestString = Skeptical.CONFIG.ARTICLE_EXISTING_ARGUMENTS_URL + aURL;
	
	//Get request for xml
	xUrlHttp.open("GET", urlRequestString, true);
	xUrlHttp.onreadystatechange = function(){
		if (xUrlHttp.readyState == 4) {
			// Request finished and response ready
     		if(xUrlHttp.status == 200){
    			// Status ok
 				xmlResponse = xUrlHttp.responseText;
 				//Firebug.Console.log(xmlResponse);
				//validate xml by checking
				if(xmlResponse != Skeptical.CONFIG.ERROR_NO_ARTICLE_FOUND)
				{
	 				//Firebug.Console.log("We have received some arguments");
					xmlDoc=parser.parseFromString(xmlResponse,"text/xml");
					Skeptical.BrowserOverlay.my_state.setExistingArgumentsXML(xmlDoc);
					Skeptical.BrowserOverlay.my_state.setIsExistingArguments(true);
					Skeptical.ViewOverlay.populateUI();
				}else{
					Skeptical.BrowserOverlay.my_state.setIsExistingArguments(false);
					statusBar.value = Skeptical.CONFIG.ERROR_NO_INFORMATION;
					statusBar.style.color = 'blue';
				}
     		} else {
     			// Status other than ok (notify user)
				Skeptical.BrowserOverlay.my_state.setIsExistingArguments(false);
				Skeptical.BrowserOverlay.showError();
     		}
		}
	};
	Skeptical.ViewOverlay.clearUI();
	xUrlHttp.send();
},

/*method to clear any information from the UI on loading a page with no details
 * entered into skeptical science*/
clearUI : function() {
	//Firebug.Console.log("clearUI");
	var articleTitleText = document.getElementById("skepTitle");
	var articleBias = document.getElementById("skepBias");
	var articleType = document.getElementById("skepType");
	var argumentCountLabel = document.getElementById("skepViewArgumentsCount");
	var articlePublishingDate = document.getElementById("skepArticlePublishingDate");
	
	argumentCountLabel.value = "Available arguments:0";
	
	articleTitleText.textContent = "";
	articleBias.value = "";
	articleType.value = "";
	articlePublishingDate.textContent = "";
	
	//clear tree children
	Skeptical.ViewOverlay.clearChilds();
	//deselect previous argument
	Skeptical.ViewOverlay.removeTreeSelection();
	Skeptical.ViewOverlay.clearRebuttalUI();
	
},

/*method to clear and hide the rebuttal ui*/
clearRebuttalUI : function () {
	var rebuttalUiPane = document.getElementById("explanationWindow");
	var skepticRebuttal = document.getElementById("skeptic-desc");
	var rebutalDetailButton = document.getElementById("rebuttal-button");
	var smallHeader = document.getElementById("skep-header-smallLogo");
	var bigHeader = document.getElementById("skep-header-bigLogo");

	rebuttalUiPane.hidden = "true";
	skepticRebuttal.textContent = "";
},

/*method to auto fill out all information about the current site into the 
 * extensions GUI, this includes article arguments and title \ type \ bias*/
populateUI : function() {
	//Firebug.Console.log("populateUI");
	var searchArguments = document.getElementById("argument-view-txtBox");
	var rebuttalPanel = document.getElementById("explanationWindow");
	Skeptical.ViewOverlay.viewState.setUserArgumentSearch(searchArguments.value);
	
	rebuttalPanel.hidden = "true";
	
	/*if no arguments exist for the current page or page is  invalid, then no need to populate ui*/
	if(!Skeptical.BrowserOverlay.my_state.isExistingArguementsPresent() || !Skeptical.BrowserOverlay.my_state.isWebPage()){
		return;
	}
	
	//clear tree children
	Skeptical.ViewOverlay.clearChilds();
	//deselect previous argument
	Skeptical.ViewOverlay.removeTreeSelection();

	Skeptical.ViewOverlay.populateArgumentTree();
	
	Skeptical.ViewOverlay.populateArticleInfo();
	
},

/*method to fill out the ui with information about the article provided by skepticalscience.com*/
populateArticleInfo : function() {
	//Firebug.Console.log("populateArticleInfo");
	var articleTitleText = document.getElementById("skepTitle");
	var articleBias = document.getElementById("skepBias");
	var articleType = document.getElementById("skepType");
	var articlePublishingDate = document.getElementById("skepArticlePublishingDate");
	var xmlDoc = Skeptical.BrowserOverlay.my_state.getExistingArgumentsXML();

	var existingTitle = xmlDoc.getElementsByTagName("article-title");
	var existingBias = xmlDoc.getElementsByTagName("article-bias");
	var existingType = xmlDoc.getElementsByTagName("article-type");
	var existingArticlePublishingDate = xmlDoc.getElementsByTagName("article-publishing-date");

	existingBias = existingBias[0].childNodes[0].nodeValue;
	existingType = existingType[0].childNodes[0].nodeValue;
	
	switch(existingBias)
	{
		case "1":
			articleBias.value = "Skeptical";
			break;
		case "2":
			articleBias.value = "Neutral";
			break;
		case "3":
			articleBias.value = "ProAGW";
			break;
		default:
			break;
	}
	
	switch(existingType)
	{
	case "1":
		articleType.value = "Blog";
		break;
	case "2":
		articleType.value = "Forum";
		break;
	case "3":
		articleType.value = "Mainstream Media";
		break;
	case "4":
		articleType.value = "Online Article";
		break;
	case "5":
		articleType.value = "Peer Review Study";
		break;
	default:
		break;
	}

	articlePublishingDate.textContent = Skeptical.ViewOverlay.formatDate(existingArticlePublishingDate[0].childNodes[0].nodeValue);
	articleTitleText.textContent = existingTitle[0].childNodes[0].nodeValue;
	//Firebug.Console.log("articlePublishingDate.textContent = "+articlePublishingDate.textContent);
},
	
formatDate : function (input) {
  var datePart = input.match(/\d+/g);
  var year = datePart[0]; 
  var month = datePart[1]; 
  var day = datePart[2];
  
  var formatedDate = day+'.'+month+'.'+year;
//  Firebug.Console.log("formatedDate: "+formatedDate);

  return formatedDate;
},

/*Populates the argument tree. This function filters out arguments that do not match the input in the search box.*/
populateArgumentTree : function() {
	var argumentDetails = "";
	var xulTree = document.getElementById("myTodoListTreeView");
	var tempArgHeadings = Skeptical.BrowserOverlay.getArticleArguments();
	var searchArray = Skeptical.ViewOverlay.viewState.getUserArgumentSearch().split(" ");
	var searchFields = "";
	var displayedArgumentsCounter = 0;
	var argumentCountLabel = document.getElementById("skepViewArgumentsCount");
	

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
	   		//if all search terms matched add to list-
	        if (addToList === true) {
	   		
	        	var rootTreeChild = document.getElementById("children_root_view");
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
	if( displayedArgumentsCounter == 1) {
		xulTree.view.selection.select(0);
	}
},

/*function called when request for icon information is being received*/
iconChangeReady : function(evt){
		var toolbar = document.getElementById("skep-viewButton");
		var parser=new DOMParser();
		var responseText = "";
		var xmlDoc;
		var isWebPage = true;
		
		responseText = evt.responseText;
		
	    //Get host of current site eg /www.google.com.
	    try{
	        url = getWebNavigation().currentURI.host;
	    }catch(e){
	        isWebPage = false;
	    }
	    
	    //no article found
	    if (responseText === "ERROR: No article found") {
	    	
		   	//icon is grey
		    document.getElementById("main-window").setAttribute("skep-status", "4");
		    toolbar.setAttribute("tooltiptext", "No arguments submitted yet");
		    skep_prefs.setupdateui();
		    //return from function so we dont attempt to parse the error response as xml
		    return;
	    
	    }
	    
	    
	    //set the state of the website
	    Skeptical.BrowserOverlay.my_state.setIsWebPage(isWebPage);
	
		xmlDoc=parser.parseFromString(responseText,"text/xml");
		
		//retrieve the colour and the number of arguments
		var colour = xmlDoc.getElementsByTagName("colour")[0].childNodes[0].nodeValue;
		
		var argumentsCount = xmlDoc.getElementsByTagName("existing-arguments-count")[0].childNodes[0].nodeValue;
		
		var tooltip = xmlDoc.getElementsByTagName("tooltip-text");
		
		
	   //if a webpage does not exist
		   if(!Skeptical.BrowserOverlay.my_state.isWebPage()){
			   
		   	//icon is white
			    document.getElementById("main-window").setAttribute("skep-status", "4");
			    toolbar.setAttribute("tooltiptext", "No website found!");
			    skep_prefs.setupdateui();

		   } else if (colour === "GREEN") {

		   		//icon is green
			    Skeptical.ViewOverlay.determineGreenIconArguments(argumentsCount);
			    skep_prefs.setupdateui();
			    
			//if a webpage has more than 5 arguments submitted
			} else if (colour === "RED") {
				
				//icon is red
				Skeptical.ViewOverlay.determineRedIconArguments(argumentsCount);	
			    skep_prefs.setupdateui();
			    
			//if a webpage has 1 or more arguments submitted    
			} else if (colour === "YELLOW") {
				
				//icon is yellow
				Skeptical.ViewOverlay.determineYellowIconArguments(argumentsCount);
			    skep_prefs.setupdateui();
			    
			}
		   if(tooltip[0].childNodes[0] == null){
			   toolbar.setAttribute("tooltiptext", argumentsCount + " arguments currently submitted");
		   }else{
			   toolbar.setAttribute("tooltiptext", tooltip);
		   }
},

/*determines the color the Skeptical Science icon needs to be based on,
the return text of the URL*/
determineIconColor : function() {
	
	//get the element for the toolbar
	var toolbar = document.getElementById("skep-viewButton");
	var isWebPage = true;
	
	//Get host of current site eg /www.google.com.
	var urlHost = getWebNavigation().currentURI.spec;
	
	//creat the URL
	var iconURL = Skeptical.CONFIG.ARTICLE_COLOUR_DETAILS_URL + urlHost;

	//New XMLHttpRequest.
	var xmlHttpRequest=new XMLHttpRequest();
	var parser=new DOMParser();
	var responseText = "";
	var xmlDoc;
	
	//Get the XML source.
	//asynchronous request so switching between tabs doesnt cause odd flickering in some cases
	xmlHttpRequest.open("GET",iconURL, true);
	xmlHttpRequest.onreadystatechange = function(){
		if (xmlHttpRequest.readyState == 4) {
			// Request finished and response ready
     		if(xmlHttpRequest.status == 200){
    			// Status ok
				Skeptical.ViewOverlay.iconChangeReady(xmlHttpRequest);
     		} else {
     			// Status other than ok (notify user)
				Skeptical.ViewOverlay.showError();
     		}
		}

	};

	//send the xmlHttpRequest
	xmlHttpRequest.send();
},

/*determine how many arguments and which notification icon is relevant*/
determineGreenIconArguments : function(arguments) {
	
	if (arguments == 0) {
		document.getElementById("main-window").setAttribute("skep-status", "3");
	} else if (arguments == 1) {
		document.getElementById("main-window").setAttribute("skep-status", "3.1");
	} else if (arguments == 2) {
		document.getElementById("main-window").setAttribute("skep-status", "3.2");
	} else if (arguments == 3) {
		document.getElementById("main-window").setAttribute("skep-status", "3.3");
	} else if (arguments == 4) {
		document.getElementById("main-window").setAttribute("skep-status", "3.4");
	} else {
		document.getElementById("main-window").setAttribute("skep-status", "3.5");
	}
	
},

/*determine how many arguments and which notification icon is relevant*/
determineRedIconArguments : function(arguments) {
	
	
	if (arguments == 0) {
		document.getElementById("main-window").setAttribute("skep-status", "2");
	} else if (arguments == 1) {
		document.getElementById("main-window").setAttribute("skep-status", "2.1");
	} else if (arguments == 2) {
		document.getElementById("main-window").setAttribute("skep-status", "2.2");
	} else if (arguments == 3) {
		document.getElementById("main-window").setAttribute("skep-status", "2.3");
	} else if (arguments == 4) {
		document.getElementById("main-window").setAttribute("skep-status", "2.4");
	} else {
		document.getElementById("main-window").setAttribute("skep-status", "2.5");
	}
	
},

/*determine how many arguments and which notification icon is relevant*/
determineYellowIconArguments : function(arguments) {

	if (arguments == 0) {
		document.getElementById("main-window").setAttribute("skep-status", "1");
	} else if (arguments == 1) {
		document.getElementById("main-window").setAttribute("skep-status", "1.1");
	} else if (arguments == 2) {
		document.getElementById("main-window").setAttribute("skep-status", "1.2");
	} else if (arguments == 3) {
		document.getElementById("main-window").setAttribute("skep-status", "1.3");
	} else if (arguments == 4) {
		document.getElementById("main-window").setAttribute("skep-status", "1.4");
	} else {
		document.getElementById("main-window").setAttribute("skep-status", "1.5");
	}
	
},

/*method called when user selects an argument from the tree view.
 *it will then fire off a request for the argument information \ rebuttals.*/
selectedArgument : function() {
	var tree = document.getElementById("myTodoListTreeView");
	var treeIndex = tree.currentIndex;
	var isArgumentCached;
	var selectedArgumentRebuttal;
	var selectedArgument = "";
	var selectedArgumentID;
	var xmlArguments;
	var col;
	
	
	/*ignore onselect event if the ui is clearing*/
	if(Skeptical.ViewOverlay.viewState.isClearingUi()){
		return;
	}
	/*since the event also gets fired on deselection we must check that the index is 0 or greater
	 * also do not bother if the treeindex is the same as the last request*/
	if(treeIndex >= 0){
		Skeptical.ViewOverlay.viewState.setLastTreeIndex(treeIndex);
		col = tree.columns ? tree.columns["0"] : "0";
	}else{
		Skeptical.ViewOverlay.clearRebuttalUI();
		return;
	}

	
	selectedArgument = tree.view.getCellText(treeIndex,col);
	selectedArgumentID = Skeptical.ViewOverlay.findArgumentID(selectedArgument);
	/*if the argument id returned is valid*/
	if(selectedArgumentID > 0) {
		//check to see if argument already cached
		isArgumentCached = Skeptical.ViewOverlay.viewState.isArgumentCached(selectedArgumentID);
		//if argument not cached then request it and store it
		if(isArgumentCached === false) {
			Skeptical.ViewOverlay.requestArgumentInformation(selectedArgumentID);
		} else {
			selectedArgumentRebuttal = Skeptical.ViewOverlay.viewState.getArgumentRebuttalByID(selectedArgumentID);
			Skeptical.ViewOverlay.displayRebuttals(selectedArgumentRebuttal);
		}
	}
},

/*method to auto-size an iframe so that no scroll bars are present*/
autoSizeIFrame : function(){
	var scienceIFrame = document.getElementById("scienceDescHtml");
	var maxHeight = scienceIFrame.getAttribute('maxheight');
	//additional 17 added to ensure a scrollbar does not get displayed when we dont need one
	var newHeight = scienceIFrame.contentWindow.document.body.offsetHeight + 17;
	if(newHeight > maxHeight){
		newHeight = maxHeight;
	}
	newHeight += 'px';
	scienceIFrame.style.height = newHeight;
},

/*method responsible for displaying argument descriptions inside aRebuttal object.
 *information is displayed on the right hand side of the extension*/
displayRebuttals : function(aRebuttal) {
	var skepticsRebuttal = document.getElementById("skeptic-desc");
	var scienceSays = document.getElementById("science-desc");
	var scienceDescHtml = document.getElementById("scienceDescHtml");
	var rebuttalUrlLink = document.getElementById("rebuttalURL");
	var rebuttalUiPane = document.getElementById("explanationWindow");
	var copyLinkButton = document.getElementById("rebuttal-button");
	var fullRebuttalUrl = aRebuttal.getRebuttalUrl();
	//var skepDoc = skepDescHtml.document;
	var scienceDoc = scienceDescHtml.document;
	var detailedRebuttalURL = aRebuttal.getRebuttalUrl();
	var trimedURL;
	var timer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);  
	
	var smallHeader = document.getElementById("skep-header-smallLogo");
	var bigHeader = document.getElementById("skep-header-bigLogo");
	
	
	if (detailedRebuttalURL.length > 57) {
		//Slice string show characters from 57 characters max om titlebar.
		trimedURL = detailedRebuttalURL.slice(0, 57); 
		rebuttalUrlLink.value = (trimedURL + "...");	
		//If URL string length less than 57 then show full URL in titlebar.
	} else { 
		trimedURL = detailedRebuttalURL; 
		rebuttalUrlLink.value = trimedURL;
	}
	
	rebuttalUrlLink.setAttribute("tooltiptext", detailedRebuttalURL);
	
	skepticsRebuttal.textContent = aRebuttal.getSkepticHeading();
	
	if(scienceDescHtml.contentDocument){
		scienceDoc = scienceDescHtml.contentDocument; // For NS6
	}
	// Put the content in the iframe
	scienceDoc.open();
	scienceDoc.writeln(aRebuttal.getScienceArgument());
	scienceDoc.close();
	
	timer.initWithCallback(Skeptical.ViewOverlay.resizeEvent, 0, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
	
	if(aRebuttal.getRebuttalUrl() === ""){
		copyLinkButton.value = "No rebuttal URL available";
		copyLinkButton.setAttribute("tooltiptext","No rebuttal URL available");
		rebuttalUrlLink.disabled = "true";
	}else{
		Skeptical.ViewOverlay.viewState.setCurrentRebuttalUrl(aRebuttal.getRebuttalUrl());
		rebuttalUrlLink.removeAttribute('disabled');
		copyLinkButton.value = "Copy URL to clipboard";
		copyLinkButton.setAttribute("tooltiptext","Copy full rebuttal link to clipboard");
	}
	rebuttalUiPane.removeAttribute('hidden');
},

/*given an existing arguments string this method will return its matching unique ID
 * valid ID's are > 0. -1 is returned on failure to find an ID*/
findArgumentID : function(aString) {
	var xmlArgs = Skeptical.BrowserOverlay.my_state.getExistingArgumentsXML();
	var argumentsList = xmlArgs.getElementsByTagName("heading");
	var argumentIDList = xmlArgs.getElementsByTagName("argument-id");
	var i;
	var  len = argumentsList.length;
	
	for (i=0; i < len;i++)
	{
		if( aString.indexOf(argumentsList[i].childNodes[0].nodeValue) > -1 )
		{
			return argumentIDList[i].childNodes[0].nodeValue;
		}
	}
	return -1;
},

findArgumentDescriptionByID : function(anID) {
	var xmlArgs = Skeptical.BrowserOverlay.my_state.getExistingArgumentsXML();
	var argumentsList = xmlArgs.getElementsByTagName("heading");
	var argumentIDList = xmlArgs.getElementsByTagName("argument-id");
	
	for (var i=0; i < argumentIDList.length;i++)
	{
		if( anID.indexOf(argumentIDList[i].childNodes[0].nodeValue) > -1 )
		{
			return argumentsList[i].childNodes[0].nodeValue;
		}
	}
	return "";
},

/* Method responsible for requesting and receiving information related to
 * a particular argument id (anID), this method will also cache the results*/
requestArgumentInformation : function(anID) {
	//get StatusBar Element
	var statusBar = document.getElementById("status-viewTxtBox");
	var xhttp=new XMLHttpRequest();
	var parser=new DOMParser();
	var responseText = "";
	var xmlDoc;
	var argumentDetails;
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
					argumentDetails = Skeptical.ViewOverlay.storeArgumentDetails(xmlDoc);
					// Display argument details
					Skeptical.ViewOverlay.displayRebuttals(argumentDetails);
				}else{
					statusBar.value = "Status: No details available";
					statusBar.style.color = 'blue';
				}
     		} else {
     			// Status other than ok (notify user)
				Skeptical.ViewOverlay.showError();
     		}
		}
	}
	xhttp.send();
},

/* Takes a retrieved xml from skeptical science and stores it into an argument object
 * containing skeptic description, and science description, as well as ID and url,
 * aHeading is the shortend version of the argument as selected in the display list
 */
storeArgumentDetails : function(aXmlDoc) {
	var tempTestingXmlDoc;
	var parser=new DOMParser();
	var newArgument = new com_shinetech_skepff.ArgumentRebuttal();
	var newArgumentID;
	var scienceRebuttal;
	var skepticArgument;
	var rebuttalURL;
	var aHeading;
	
	scienceRebuttal = Skeptical.CONFIG.FONT_PREFIX;
	skepticArgument = Skeptical.CONFIG.FONT_PREFIX;
	newArgumentID = aXmlDoc.getElementsByTagName("argument-id")[0].childNodes[0].nodeValue;
	aHeading = Skeptical.ViewOverlay.findArgumentDescriptionByID(newArgumentID);
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
	newArgument.setSkepticHeading(aHeading);
	
	//cache argument into local Skeptical.ViewOverlay.viewState object
	Skeptical.ViewOverlay.viewState.addArgumentRebuttal(newArgument);
	
	Skeptical.ViewOverlay.viewState.setCurrentRebuttalUrl(rebuttalURL);
	return newArgument;
},

/*Remove the current article title and argument selection to refresh form*/
removeTreeSelection : function() {

	//get the tree element
	var xulTree = document.getElementById("myTodoListTreeView");

	//set the selection to -1 so nothing is selected
	if(xulTree.view){
		xulTree.view.selection.select(-1); 
	}
},

/*Clear all the tree children from the XUL tree.*/
clearChilds : function() {
	//Assign XUL children to variable.
	var treeChildren = document.getElementById("children_root_view");
	
	Skeptical.ViewOverlay.viewState.setIsClearingUi(true);
	//Clear all treeChildren.
	while(treeChildren.firstChild) {
		treeChildren.removeChild(treeChildren.firstChild);
	}
	Skeptical.ViewOverlay.viewState.setIsClearingUi(false);

}
		
};