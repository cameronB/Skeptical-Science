/*
 * Skeptical Science * skepCore.js
 * Description:
 *
 * @author Cameron Bradley
 * Change History:
 * Who When Description
 * ------------------------------------------------------------------
 * Michael.G 27/9/10 <<added arguments class to make storage of them easier>>
 */

com_shinetech_namespace('com_shinetech_skepff');

//If function undefined (naming convention)
//- Overlay = attach Skeptical - to browserOverlay eg. (Skeptical.BrowserOverlay).
if ("undefined" == typeof(Skeptical)) {
	var Skeptical = {};
};

/*argument rebuttal class, contains all information related to an arguments
 * description from both skeptics and science, as well as ID and url */
com_shinetech_skepff.ArgumentRebuttal = function() {
	//unique argument ID
	this.argumentID = -1;
	
	//one line heading for skeptic argument
	this.skepticHeading = "";
	
	//skeptic argument
	this.skepticArgument = "";
	
	//science says
	this.scienceArgument = "";
	
	//link to full rebuttal
	this.rebuttalURL = "";
	
};

com_shinetech_skepff.ArgumentRebuttal.prototype.getSkepticHeading = function() {
	return this.skepticHeading;
};

com_shinetech_skepff.ArgumentRebuttal.prototype.setSkepticHeading = function(aHeading) {
	this.skepticHeading = aHeading;
};

com_shinetech_skepff.ArgumentRebuttal.prototype.getRebuttalUrl = function() {
	return this.rebuttalURL;
};

com_shinetech_skepff.ArgumentRebuttal.prototype.setRebuttalUrl = function(aURL) {
	this.rebuttalURL = aURL;
};

com_shinetech_skepff.ArgumentRebuttal.prototype.setArgumentID = function(anID) {
	this.argumentID = anID;
};

com_shinetech_skepff.ArgumentRebuttal.prototype.getArgumentID = function() {
	return this.argumentID;
};

com_shinetech_skepff.ArgumentRebuttal.prototype.setSkepticArgument = function(anArgument) {
	this.skepticArgument = anArgument;
};

com_shinetech_skepff.ArgumentRebuttal.prototype.getSkepticArgument = function() {
	return this.skepticArgument;
};

com_shinetech_skepff.ArgumentRebuttal.prototype.getScienceArgument = function() {
	return this.scienceArgument;
};

com_shinetech_skepff.ArgumentRebuttal.prototype.setScienceArgument = function(anArgument) {
	this.scienceArgument = anArgument;
};

skep_core =
{	//Determine if the application is loaded.
		init: function() {
			//Listerner for browser LOAD.
			window.addEventListener("load", function(e) {
				skep_core.load();
			}, false);

		},

		//OnLoad update the UI (call Skeptical Preferences.JS and setupdateui function:.
		load: function(){
			skep_prefs.setupdateui();
		}
};

skep_core.init();