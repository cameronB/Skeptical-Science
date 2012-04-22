/*
 * skepPrefs.js
 * Description: Javascript file for initiating display of toolbar icon
 * also placeholder for any potential preferences page
 * @author Cameron Bradley, Michael Gillies 22/9/2010
 * Change History:
 * Who When Description
 * ------------------------------------------------------------------
 * Michael.G 23/09/10 CR-SKEPFF-19 <<coding standards changes>>
 */

com_shinetech_namespace('com_shinetech_skepff');

//Naming and reference convention.
var skep_prefs =

{	//Update the UI function.
setupdateui: function()
	{
	try {
		this.updateui = true;
	
		//Sync the tool-bar button.
		skep_ui.show_elements();
	} catch (e) {
		dump("skep_prefs.setupdateui: failed with " + e + "\n");
	}
		}
};

//skep_prefs.init();