/************************************************************
 This file contains the variables and functions that store
 information on player clothing.
 ************************************************************/

/********** Clothing Enumeration **********/
 
/* safety null */
var UNDEFINED_ARTICLE = null;

/* clothing types */
var CRITICAL_ARTICLE = "critical";
var MAJOR_ARTICLE = "major";
var MINOR_ARTICLE = "minor";
var EXTRA_ARTICLE = "extra";

/* clothing positions */
var UPPER_ARTICLE = "upper";
var LOWER_ARTICLE = "lower";
var OTHER_ARTICLE = "other";
 
/**************************************************
 * Loads all of the content required to display the 
 * title screen.
 **************************************************/
function newClothing (proper, lower, image, type, position) {
	var clothingObject = {proper:proper, 
						  lower:lower, 
						  image:image, 
						  type:type, 
						  position:position};
						  
	return clothingObject;
}

