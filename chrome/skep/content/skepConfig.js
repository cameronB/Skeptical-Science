/*
 * skepConfig.js
 * Description: 
 * @author Cameron Bradley, Michael Gillies 22/9/2010
 * Change History:
 * Who When Description
 * ------------------------------------------------------------------
 * Michael.G 23/09/10 CR-SKEPFF-27 <<added Error constants and comment header>>
 * Michael.G 29/09/10 <<Added extra error constants NO_ARGUMENT and NO_ARGUMENT_SUPPLIED>>
 * Michael.G 30/09/10 <<Updated version number to 2.2 and ARGUMENT_DETAILS_URL>>
 * Michael.G 5/10/10  <<Added colour URL const, and argument xml const>>
 * Michael.G 11/10/10 SKEPFF-92 <<added constant for font consistency>>
 * Michael.G 19/10/10 <<added consts for displaying no information and invalid page>>
 * Michael.G 28/10/10 <<changed version to 1.1>>
 */
if ("undefined" == typeof(Skeptical)) {
	var Skeptical = {};
};

Skeptical.CONFIG = {
	
	skep_PLATFORM : "firefox",
	skep_VERSION : "1.1.2",
	skep_GUID : "{1bedbcc0-a50c-11df-981c-0800200c9a66}",
	FONT_PREFIX : '<font size="2" face="Tahoma">',
	SKEPTICAL_URL : "http://www.skepticalscience.com",
	ARTICLE_EXISTING_ARGUMENTS_URL : "http://www.skepticalscience.com/getlinkdetails.php?article=",
	ARGUMENT_DETAILS_URL : "http://www.skepticalscience.com/getargumentdetails.php?argument=",
	//URL to retrieve information about website (icon colour, argument count, optional tooltip
	ARTICLE_COLOUR_DETAILS_URL : "http://www.skepticalscience.com/getlinkinfo.php?article=",
	//URL to retrieve all available aguments
	RETRIEVE_ALL_ARGUMENTS_URL : "http://www.skepticalscience.com/firefox.xml",
	VALIDATE_LOGIN_URL : "https://secure4.ilisys.com.au/skept/validatelogin_post.php",
	SAVE_LINK_URL : "https://secure4.ilisys.com.au/skept/savelink_post.php",
	
	//message received from skeptical science on successful login
	LOGIN_SUCCESSFUL : "OK",
	//message received from skeptical science on successful submission of argument
 	ARGUMENT_ADDED_OK : "OK: Argument added",

	//error messages received from Skeptical Science
 	ERROR_NO_ARTICLE_FOUND : "ERROR: No article found",
 	ERROR_ARGUMENT_ALREADY_EXISTS : "ERROR: That argument already submitted for this article",
 	ERROR_INVALID_LOGIN : "ERROR",
 	ERROR_NO_ARGUMENT : "ERROR: No argument found",
 	ERROR_NO_ARGUMENT_SUPPLIED : "ERROR: No argument supplied",

	//status messages displayed to user
 	ERROR_INCORRECT_LOGIN : "Login incorrect, try again please",
 	ERROR_NO_LOGIN_DETAILS : "Login to send report",
 	ERROR_NO_INTERNET : "Status: No Internet Connection Found!",
 	ERROR_NO_INFORMATION : "Status: No information for current page.",
 	ERROR_INVALID_PAGE : "Status: Invalid page."
};


