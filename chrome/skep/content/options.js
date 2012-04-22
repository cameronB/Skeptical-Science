/*
 * options.js
 * Description: Javascript file for handleing of login window
 * and its associated functionality
 * @author Cameron Bradley, Michael Gillies 22/9/2010
 * Change History:
 * Who When Description
 * ------------------------------------------------------------------
 * Michael.G 23/09/10 CR-SKEPFF-19 <<coding standards changes>>
 * Michael.G 6/12/10   <<changed apps loose variables to be wrapped in our objects>>
 * Michael.G 7/12/10  <<removed duplicate function for clickRegister>>
 */

//If function undefined (naming convention)
//- Overlay = attach Skeptical - to browserOverlay eg. (Skeptical.BrowserOverlay).
if ("undefined" == typeof(Skeptical)) {
	var Skeptical = {};
};

com_shinetech_skepff.optionsState = function() {
	//Global variable to store user inputed UsernameValue.
	this.userNameValue = "";
	this.userPasswordValue = "";
	this.userLogedIn = false;
};


//this is to set the value (for userNameValue)
com_shinetech_skepff.optionsState.prototype.setUserNameValue = function(_isUserNameValue) {
	
	this.userNameValue = _isUserNameValue;
};

//this is to get the value (for userNameValue)
com_shinetech_skepff.optionsState.prototype.getUserNameValue = function() {
	
	return this.userNameValue;
};

com_shinetech_skepff.optionsState.prototype.getUserPasswordValue = function() {
	
	return this.userPasswordValue;
};

com_shinetech_skepff.optionsState.prototype.setUserPasswordValue = function(_isUserPasswordValue) {
	
	this.userPasswordValue = _isUserPasswordValue;
};

com_shinetech_skepff.optionsState.prototype.getUserLogedIn = function() {
	
	return this.userLogedIn;
};

com_shinetech_skepff.optionsState.prototype.setUserLogedIn = function( _bIsLogedIn) {
	
	this.userLogedIn = _bIsLogedIn;
};

//var my_optionsState = new com_shinetech_skepff.optionsState();


//name convention
Skeptical.options = { 
		
my_optionsState : new com_shinetech_skepff.optionsState(),
		
		//get the loginManager
getLoginManager : function() {
	var loginManager = 
		Components.classes["@mozilla.org/login-manager;1"]
	                                      .getService(Components.interfaces.nsILoginManager);
	
	//return the login mananger
	return loginManager;
},

		//get the loginInfo component
newLoginInfo : function() {
	var loginInfo =
		Components.classes["@mozilla.org/login-manager/loginInfo;1"]
	                                  .createInstance(Components.interfaces.nsILoginInfo);
	//return the logininfo
	return loginInfo;
},
		
/* Gets the user name and password from the UI and logs the user into the Skeptical Science web site. */ 
logIn : function(e) {
	
	//Retrieve userName and userPassword from input boxes.
	var loginButton = document.getElementById("login-Button");
	var userName = document.getElementById("txt-Username");
	var userPassword = document.getElementById("txt-Password");
	var statusHeader = document.getElementById("optionsStatus-txtBox");
	
	var storedUsrName;
	var storedUsrPassword;
	var emptyUsername = false;
	var emptyPassword = false;
	
    //userNameValue = userName.value;
    //userPasswordValue = userPassword.value;
	
	Skeptical.options.my_optionsState.setUserNameValue(userName.value);
	Skeptical.options.my_optionsState.setUserPasswordValue(userPassword.value);
	
	storedUsrName = Skeptical.options.my_optionsState.getUserNameValue();
	storedUsrPassword = Skeptical.options.my_optionsState.getUserPasswordValue();
	
	if (storedUsrName === "") {
		emptyUsername = true;
	}
	
	if (storedUsrPassword === "") {
		emptyPassword = true;
	}
		
    if (emptyUsername == true && emptyPassword == true) {
    	statusHeader.value = "Please enter a -Username -Password";
    } else if (emptyUsername == true && emptyPassword == false) {
    	statusHeader.value = "Please enter a -Username";
    } else if (emptyUsername == false && emptyPassword == true) {
    	statusHeader.value = "Please enter a -Password";
    } else {
		
	//Create the user details link that will be sent for validation from Skeptical Science.
		this.createUserDetails();
	}
},

//save username and password on execution into firefox passwords (login Manager)
storeUserDetails : function() {
	var username = document.getElementById("txt-Username");
	var password = document.getElementById("txt-Password");
	
	var loginManager = Skeptical.options.getLoginManager();
	
	//find the logins
	//The ? has to be added to the VALIDATE_LOGIN_URL to retain compatibility with previous versions of the add-on
	var logins = loginManager.findLogins({}, Skeptical.CONFIG.SKEPTICAL_URL, Skeptical.CONFIG.VALIDATE_LOGIN_URL+"?", null);
	
	var loginInfo = Skeptical.options.newLoginInfo();
	loginInfo.init(Skeptical.CONFIG.SKEPTICAL_URL, Skeptical.CONFIG.VALIDATE_LOGIN_URL+"?", null, username.value, password.value, "txt-Username", "txt-Password");
	
	//if there are logins
	if (logins.length > 0) {
		
		//modify the login
		loginManager.modifyLogin(logins[0], loginInfo);
		
	} else {
		
		//create new login
		loginManager.addLogin(loginInfo);
	}
},

//loads username and password into form on load
loadIntoForm : function() {
	var username = document.getElementById("txt-Username");
	var password = document.getElementById("txt-Password");
		
	var loginManager = Skeptical.options.getLoginManager();
	
	//find logins
	//The ? has to be added to the VALIDATE_LOGIN_URL to retain compatibility with previous versions of the add-on
	var logins = loginManager.findLogins({}, Skeptical.CONFIG.SKEPTICAL_URL, Skeptical.CONFIG.VALIDATE_LOGIN_URL+"?", null);
	
	//if logins exist return username and password
	if (logins.length > 0) {
		username.value = logins[0].username;
		password.value = logins[0].password;
	}
},


/*Creates the user details link to be passed for validation from skeptical science.*/
createUserDetails : function() {
	var userNameValue = Skeptical.options.my_optionsState.getUserNameValue();
	var userPasswordValue = Skeptical.options.my_optionsState.getUserPasswordValue();
	//Variable to store the Validate Login.
	var userDetails = "username=" + encodeURIComponent(userNameValue) + "&password=" + encodeURIComponent(userPasswordValue);
	
	//Call function to send the userDetails to Skeptical Science (Pass variable with Validate Login Link).
	Skeptical.options.submitUserDetails(userDetails);
},

/*Posts the details link to skeptical science and validates the response text*/
submitUserDetails : function(userDetails) {
	
	var statusHeader = document.getElementById("optionsStatus-txtBox");
	var isUserLoggedIn;
	
	//New XMLHttpRequest.
	var xmlHttpRequest=new XMLHttpRequest();

	//Get the XML source.
	xmlHttpRequest.open("POST", Skeptical.CONFIG.VALIDATE_LOGIN_URL, true); 

	//Send the proper header information along with the request
	xmlHttpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlHttpRequest.setRequestHeader("Content-length", userDetails.length);
	xmlHttpRequest.setRequestHeader("Connection", "close");

	xmlHttpRequest.onreadystatechange = function(){
		if (xmlHttpRequest.readyState == 4) {
			// Request finished and response ready
     		if(xmlHttpRequest.status == 200){
    			// Status ok
				if (xmlHttpRequest.responseText === Skeptical.CONFIG.LOGIN_SUCCESSFUL) {
					Skeptical.options.storeUserDetails();
					statusHeader.value = "You are currently logged in";
					isUserLoggedIn = true; 
				} else if (xmlHttpRequest.responseText === Skeptical.CONFIG.ERROR_INVALID_LOGIN) {
					//set userLogedIn variable to false.;
					statusHeader.value = "Login failed please try again!";
					isUserLoggedIn = false;
				}
     		}
		}
		
		Skeptical.options.my_optionsState.setUserLogedIn(isUserLoggedIn);
		//Retrieve SkepticalOverlay.js (this) object.
		var SkepticalBrowser = window.arguments[0]; //store in SkepticalOverlay.
		
		var userNameValue = Skeptical.options.my_optionsState.getUserNameValue();
		var userPasswordValue = Skeptical.options.my_optionsState.getUserPasswordValue();
		//Determine if user is valid to login to the system.
		SkepticalBrowser.storeLoggedInUser(isUserLoggedIn, userNameValue, userPasswordValue);
		if (isUserLoggedIn === true){
			window.close();
		}
	};
	try{
		xmlHttpRequest.send(userDetails);
	}catch(e){
		statusHeader.value = Skeptical.CONFIG.ERROR_NO_INTERNET;
		statusHeader.style.color = 'red';
		return;
	}
	

},


/*called to close the window when the user clicks away from it*/
lostFocus : function(e) {
	window.close();	
},

/*function to attempt to login on enter key press*/
keyPress : function(e) {
	//code 13 is the enter key
	if(e.keyCode == 13)
	{
		this.logIn();	
	}
},

/*Upon click, load the registration webpage in a seperate window.*/
clickRegister : function(e) {
	var address = "http://www.skepticalscience.com/register.php";
	
	//Retrieve a reference to the SkepticalOverlay object.
	SkepticalBrowser = window.arguments[0];
	
	//Load the registration page into browser.
	SkepticalBrowser.loadRegister(address);
},

/*Upon click load the forgotten password webpage into a seperate window.*/
clickForgotPassword : function(e) {
	var address = "http://www.skepticalscience.com/password.php";
	
	//Retrieve a reference to the SkepticalOverlay object.
	SkepticalBrowser = window.arguments[0];
	
	//Load the registration page into browser.
	SkepticalBrowser.loadForgotPassword(address);

},


/*Upon click load the forgotten password webpage into a seperate window.*/
clickHomePage : function(e) {

	//Retrieve a reference to the SkepticalOverlay object.
	SkepticalBrowser = window.arguments[0];
	
	
	//Load the homepage
	SkepticalBrowser.loadHomePage();

}

};

