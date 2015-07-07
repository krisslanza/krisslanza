/************************************************************
 This file contains the variables and functions that form the
 core of the game, such as game state and display.
 ************************************************************/
 
var HUMAN_PLAYER = 0; 

/********************************/	
/***** UI Element Variables *****/
/********************************/	

/* game screens */
$introScreen = $('#intro-screen');
$gameScreen = $('#game-screen');

/* source folders */
var imageSource = "images/";
var playerSources = ["", "", "", "", ""];

/* colours */
var currentColour = "#85C5F5"; 	/* indicates current turn */
var clearColour = "#FFFFFF";	/* indicates neutral */
var loserColour = "#F58585";	/* indicates loser of a round */

var enabledColour = "#85C5F5";	/* indicates enabled button */
var disabledColour = "#F5F5F5";	/* indicates disabled button */

/* banner cell */
var gameBanner = document.getElementById("game-banner");

/* player speech cells */
var dialogueCells = [null,
					  document.getElementById("game-dialogue-1"),
					  document.getElementById("game-dialogue-2"),
					  document.getElementById("game-dialogue-3"),
					  document.getElementById("game-dialogue-4")];

/* player dialogue bubbles */
var dialogueBubbles = [null,
					   document.getElementById("game-bubble-1"),
					   document.getElementById("game-bubble-2"),
					   document.getElementById("game-bubble-3"),
					   document.getElementById("game-bubble-4")];
					
/* player image cells */
var imageCells = [null,
					document.getElementById("player-image-1"),
					document.getElementById("player-image-2"),
					document.getElementById("player-image-3"),
					document.getElementById("player-image-4")];
					
/* human player clothing cells */
var clothingCellsLabel = document.getElementById("game-clothing-label");
var clothingCells = [document.getElementById("player-0-clothing-1"),
					 document.getElementById("player-0-clothing-2"),
					 document.getElementById("player-0-clothing-3"),
					 document.getElementById("player-0-clothing-4"),
					 document.getElementById("player-0-clothing-5"),
					 document.getElementById("player-0-clothing-6"),
					 document.getElementById("player-0-clothing-7"),
					 document.getElementById("player-0-clothing-8")];

/* player name labels */
var nameLabels = [document.getElementById("player-name-label-0"),
				  document.getElementById("player-name-label-1"),
				  document.getElementById("player-name-label-2"),
			      document.getElementById("player-name-label-3"),
				  document.getElementById("player-name-label-4")];					

var playerGenderCell = document.getElementById("player-gender");					 

/********************************/	
/*****  Constant Variables  *****/
/********************************/	

var PLAYERS = 5;

/********************************/	
/***** Game State Variables *****/
/********************************/

/* player hands */
var cards = [["unknown", "unknown", "unknown", "unknown", "unknown"], 
			 ["unknown", "unknown", "unknown", "unknown", "unknown"],
             ["unknown", "unknown", "unknown", "unknown", "unknown"],
             ["unknown", "unknown", "unknown", "unknown", "unknown"],
             ["unknown", "unknown", "unknown", "unknown", "unknown"]];
var handStrengths = [null, null, null, null, null];
var handValues = [0, 0, 0, 0, 0];
var tradeIns = [[false, false, false, false, false], 
			    [false, false, false, false, false],
			    [false, false, false, false, false],
			    [false, false, false, false, false],
			    [false, false, false, false, false]];
				
/* game state */
var currentTurn = 0;
var playerInGame = [true, true, true, true, true];
var gameOver = false;


/********************************/		
/*****   Setup Functions    *****/
/********************************/


/**************************************************
 * Loads the initial content of the game, whatever
 * that may be.
 **************************************************/
function initialSetup () {
	/* load the title screen first */
	loadTitleScreen();
}

/**************************************************
 * Loads all of the content required to display the 
 * main game screen.
 **************************************************/
function loadMainGame () {
	$gameScreen.show();
	
	/* hardcoded opponents, for now */
	playerSources = ["player/male/", "opponents/elizabeth/", "opponents/lilith/", "opponents/zoey/", "opponents/laura/"];
	
	/* load opponent behaviours */
	for (var i = 1; i < PLAYERS; i++) {
		loadBehaviour(i);
	}
	
	/* set up the game */
	composeDeck();
	
	/* wait for content to load */
	waitForContent ();
}

/* waits for all content to load before starting the game */
function waitForContent () {
	var loaded = 0;
	for (var i = 1; i < PLAYERS; i++) {
		if (playerLoaded[i]) {
			loaded++;
		}
	}

	if (loaded == PLAYERS-1) {
		startGame();
	} else {
		window.setTimeout(waitForContent, 1);
	}
}

/* quickly sets up the visuals and starts the game */
function startGame () {
	/* set up the visuals */
	mainButton.innerHTML = "Deal";
	updateAllPlayerVisuals();
	
	/* setup initial button states */
	enableButton(mainButton);
}			
					  
/********************************/		
/*****  Utility Functions   *****/
/********************************/

/* returns a random number in a range */
function getRandomNumber (min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}
