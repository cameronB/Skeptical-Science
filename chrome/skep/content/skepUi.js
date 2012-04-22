/*
 * skepUI.js
 * Description: Javascript file for display and placement of toolbar icon
 * @author Cameron Bradley, Michael Gillies 22/9/2010
 * Change History:
 * Who When Description
 * ------------------------------------------------------------------
 * Michael.G 23/09/10 CR-SKEPFF-19 <<coding standards changes>>
 * Michael.G 29/09/10 SKEPFF-56 <<added extra call to insert another button>>
 */


com_shinetech_namespace('com_shinetech_skepff');

var skep_ui =
{	
/*This function displays the SS button in the toolbar next to the URL bar.
If the 'before' element does not exist, the button will be inserted at the start of the toolbar.*/

		show_toolbar_button: function(id, before)
		{
	try {		
		// Get the nav bar
		var nbr = document.getElementById("nav-bar");

		if (!nbr || nbr.currentSet.indexOf(id) != -1) {
			return;
		}

		var box = document.getElementById("navigator-toolbox");

		if (!box) {
			return;
		}

		var bar = box.firstChild;

		while (bar) {
			if (bar.currentSet && bar.currentSet.indexOf(id) != -1) {
				return;
			}
			bar = bar.nextSibling;
		}
		
		//Find the before element.
		var target = document.getElementById(before);

		/*The before element might not exist in the nav-bar.*/
		var elem = nbr.firstChild;

		while (elem) {
			if (elem === target) {
				break;
			}
			elem = elem.nextSibling;
		}
		//Insert the button in front of the before element. 
		nbr.insertItem(id, elem, null, false);
		document.persist("nav-bar", "currentset");
	} catch (e) {
		dump("skep_ui.show_toolbar_button: failed with " + e + "\n");
	}
		},

		//Shows user interface elements.
		show_elements: function()
		{
			this.show_toolbar_button("skep-addButton", "urlbar-container");
			this.show_toolbar_button("skep-viewButton", "skep-addButton");
			
		}
};
