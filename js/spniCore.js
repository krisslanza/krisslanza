/********************************************************************************
 This file contains the variables and functions that form the core of the game. 
 The player object, game wide constants, the screen objects, and the overarching 
 flow of the game.
 ********************************************************************************/

/**********************************************************************
 *****                    Game Wide Variables                     *****
 **********************************************************************/

/* source constants */
var imageSource = "img/";
 
/* player constants */
var HUMAN_PLAYER = 0;
 
/* gender constants */
var MALE = "male";
var FEMALE = "female"; 

/* game screens */
$titleScreen = $('#title-screen');
$selectScreen = $('#select-screen');
$individualSelectScreen = $('#individual-select-screen');
$groupSelectScreen = $('#group-select-screen');
$gameScreen = $('#game-screen');
$optionsScreen = $('#options-screen');

/* screen state */
$previousScreen = null;

/* useful variables */
var BLANK_PLAYER_IMAGE = "opponents/blank.jpg";

/* player array */
var players = [null, null, null, null, null];
 
/**********************************************************************
 *****                Player Object Specification                 *****
 **********************************************************************/
 
/************************************************************
 * Creates and returns a new player object based on the 
 * supplied information.
 *
 * folder (string), the path to their folder
 * first (string), their first name.
 * last (string), their last name.
 * gender (constant), their gender.
 * clothing (array of Clothing objects), their clothing.
 * out (boolean), is the player still in the game?
 * forfeit (string), state of their forfeit.
 * timer (integer), time until forfeit is finished.
 * current (integer), their current state.
 * state (array of PlayerState objects), their sequential states.
 * xml (jQuery object), the player's loaded XML file.
 ************************************************************/
function createNewPlayer (folder, first, last, label, gender, clothing, out, forfeit, timer, current, stage, state, xml) {
    var newPlayerObject = {folder:folder,
                           first:first,
                           last:last,
                           label:label,
                           gender:gender,
                           clothing:clothing,
                           out:out,
                           forfeit:forfeit,
                           timer:timer,
                           current:current,
						   stage:stage,
                           state:state,
                           xml:xml};
                           
    return newPlayerObject;
}

/**********************************************************************
 *****              Overarching Game Flow Functions               *****
 **********************************************************************/
 
/************************************************************
 * Loads the initial content of the game.
 ************************************************************/
function initialSetup () {
    /* start by creating the human player object */
    var humanPlayer = createNewPlayer("", "", "", "", MALE, [], false, "", 0, 0, 0, [], null);
    players[HUMAN_PLAYER] = humanPlayer;
    
    /* load the title screen */
    loadTitleScreen();
}
 
/************************************************************
 * Calls the content for the next screen based on the screen
 * provided.
 ************************************************************/
function advanceToNextScreen (screen) {
    if (screen == $titleScreen) {
        /* advance to the select screen */
        $titleScreen.hide();
        loadSelectScreen();
    } else if (screen == $selectScreen) {
        /* advance to the main game screen */
        $selectScreen.hide();
        loadGameScreen();
    }
}

/**********************************************************************
 *****                Multi Interaction Functions                 *****
 **********************************************************************/
 
function toggleTableVisibility () {
	console.log("Hello")
	$(".game-table").fadeOut();
}

/**********************************************************************
 *****                     Utility Functions                      *****
 **********************************************************************/

/************************************************************
 * Returns a random number in a range.
 ************************************************************/
function getRandomNumber (min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}