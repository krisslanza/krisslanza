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

/* capitalizes the first letter of the given string */
function capitalizeFirstLetter (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/********************************/		
/*****   Strip Functions    *****/
/********************************/

/* removes an article of clothing from the selected player */
function stripPlayer(player) {
	if (playerClothing[player].length > 0) {
		/* player still has something they can remove */
		var removedClothing = playerClothing[player].pop();
		var capRemovedClothing = capitalizeFirstLetter(removedClothing);
		//console.log("Player "+player+" has to remove their "+removedClothing);
		
		/* actually strip and update the player */
		if (player == 0) {
			/* human player */
			
			/* shift all of the clothing images */
			var firstClothingImage = clothingCells[player].src;
			for (var i = 0; i < playerStartingClothing[player]-1; i++) {
				clothingCells[i].src = clothingCells[i+1].src;
			}
			clothingCells[playerStartingClothing[player]-1].src = firstClothingImage;
			
			/* dull the lost clothing */
			for (var i = playerStartingClothing[0]; i > playerClothing[player].length; i--) {
				clothingCells[i-1].style.opacity = 0;
			}
			
			if (playerClothing[player].length > 0) {
				var clothingName = capitalizeFirstLetter(playerClothing[player][playerClothing[player].length - 1]);
				clothingCellsLabel.innerHTML = "Your Bet: <b>"+clothingName+"</b>";
				
				/* update behaviour */
				if (playerGenders[player] == "male") {
					updateAllBehaviours(player, "male_human_stripped", ["~name~", "~clothing~", "~Clothing~"], [playerNames[player], removedClothing, capRemovedClothing]);
				} else if (playerGenders[player] == "female") {
					updateAllBehaviours(player, "female_human_stripped", ["~name~", "~clothing~", "~Clothing~"], [playerNames[player], removedClothing, capRemovedClothing]);
				}
			} else {
				clothingCellsLabel.innerHTML = "Bet: <b>A Forfeit</b>";
				
				/* update behaviour */
				if (playerGenders[player] == "male") {
					updateAllBehaviours(player, "male_human_stripped_naked", ["~name~", "~clothing~", "~Clothing~"], [playerNames[player], removedClothing, capRemovedClothing]);
				} else if (playerGenders[player] == "female") {
					updateAllBehaviours(player, "female_human_stripped_naked", ["~name~", "~clothing~", "~Clothing~"], [playerNames[player], removedClothing, capRemovedClothing]);
				}
			}
			
			
		} else {
			/* AI player */
			
			/* update behaviour */
			if (playerClothing[player].length > 0) {
				if (playerGenders[player] == "male") {
					updateAllBehaviours(player, "male_ai_stripped", ["~name~", "~clothing~", "~Clothing~"], [playerNames[player], removedClothing, capRemovedClothing]);
				} else if (playerGenders[player] == "female") {
					updateAllBehaviours(player, "female_ai_stripped", ["~name~", "~clothing~", "~Clothing~"], [playerNames[player], removedClothing, capRemovedClothing]);
				}
				updateBehaviour(player, "stripped", ["~clothing~", "~Clothing~"], [removedClothing, capRemovedClothing]);
			} else {
				if (playerGenders[player] == "male") {
					updateAllBehaviours(player, "male_ai_stripped_naked", ["~name~", "~clothing~", "~Clothing~"], [playerNames[player], removedClothing, capRemovedClothing]);
				} else if (playerGenders[player] == "female") {
					updateAllBehaviours(player, "female_ai_stripped_naked", ["~name~", "~clothing~", "~Clothing~"], [playerNames[player], removedClothing, capRemovedClothing]);
				}
				updateBehaviour(player, "stripped", ["~clothing~", "~Clothing~"], [removedClothing, capRemovedClothing]);
			}
		}
		
		var genderNoun = null;
		if (playerGenders[player] == "male") {
			genderNoun = "his";
		} else if (playerGenders[player] == "female") {
			genderNoun = "her";
		} else {
			genderNoun = "their";
		}
		
		gameBanner.innerHTML = playerNames[player]+" has removed "+genderNoun+" "+removedClothing+"!";
	} else if (playerClothing[player].length == 0) {
		/* player has nothing left to remove */
		playerForfeits[player] = true;
		playerInGame[player] = false;
		
		/* update behaviour */
		if (player == 0) {
			if (playerGenders[player] == "male") {
				updateAllBehaviours(player, "male_human_forfeit", ["~name~"], [playerNames[player]]);
			} else if (playerGenders[player] == "female") {
				updateAllBehaviours(player, "female_human_forfeit", ["~name~"], [playerNames[player]]);
			}
		} else {
			if (playerGenders[player] == "male") {
				updateAllBehaviours(player, "male_ai_forfeit", ["~name~"], [playerNames[player]]);
			} else if (playerGenders[player] == "female") {
				updateAllBehaviours(player, "female_ai_forfeit", ["~name~"], [playerNames[player]]);
			}
			updateBehaviour(player, "forfeiting", [], []);
		}
	} else {
		/* this function shouldn't have been called on this player */
		console.log("Error: Invalid call to stripPlayer("+player+")");
	}
}
