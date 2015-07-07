/************************************************************
 This file contains the variables and functions that store
 information on player clothing and player stripping.
 ************************************************************/


/******************************************/
/********** Clothing Object Spec **********/
/******************************************/
 
 
/* safety null */
var UNDEFINED_ARTICLE = null;

/* clothing types */
var IMPORTANT_ARTICLE = "important";
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


/******************************************/
/********* Strip Dialogue Triggers ********/
/******************************************/
 

var PLAYER_MUST_STRIP = "must_strip";
var PLAYER_STRIPPED = "stripped";

var PLAYER_MUST_FORFEIT = "must_forfeit";
var PLAYER_START_FORFEIT = "start_forfeit";
var PLAYER_FORFEITING = "forfeiting";
var PLAYER_HEAVY_FORFEITING = "heavy_forfeiting";
var PLAYER_FINISHING = "finishing";
var PLAYER_FINISHED = "finished";

var MALE_WILL_REMOVE_ACCESSORY = "male_will_remove_accessory";
var MALE_WILL_REMOVE_MINOR = "male_will_remove_minor";
var MALE_WILL_REMOVE_MAJOR = "male_will_remove_major";
var MALE_CHEST_WILL_BE_VISIBLE = "male_chest_will_be_visible";
var MALE_CROTCH_WILL_BE_VISIBLE = "male_crotch_will_be_visible";

var MALE_REMOVED_ACCESSORY = "male_removed_accessory";
var MALE_REMOVED_MINOR = "male_removed_minor";
var MALE_REMOVED_MAJOR = "male_removed_major";
var MALE_CHEST_IS_VISIBLE = "male_chest_is_visible";
var MALE_CROTCH_IS_VISIBLE = "male_crotch_is_visible";

var MALE_MUST_FORFEIT = "male_must_forfeit";
var MALE_START_FORFEIT = "male_start_forfeit";
var MALE_FORFEITING = "male_forfeiting";
var MALE_HEAVY_FORFEITING = "male_heavy_forfeiting";
var MALE_FINISHED = "male_finished";

var FEMALE_WILL_REMOVE_ACCESSORY = "female_will_remove_accessory";
var FEMALE_WILL_REMOVE_MINOR = "female_will_remove_minor";
var FEMALE_WILL_REMOVE_MAJOR = "female_will_remove_major";
var FEMALE_CHEST_WILL_BE_VISIBLE = "female_chest_will_be_visible";
var FEMALE_CROTCH_WILL_BE_VISIBLE = "female_crotch_will_be_visible";

var FEMALE_REMOVED_ACCESSORY = "female_removed_accessory";
var FEMALE_REMOVED_MINOR = "female_removed_minor";
var FEMALE_REMOVED_MAJOR = "female_removed_major";
var FEMALE_CHEST_IS_VISIBLE = "female_chest_is_visible";
var FEMALE_CROTCH_IS_VISIBLE = "female_crotch_is_visible";

var FEMALE_MUST_FORFEIT = "female_must_forfeit";
var FEMALE_START_FORFEIT = "female_start_forfeit";
var FEMALE_FORFEITING = "female_forfeiting";
var FEMALE_HEAVY_FORFEITING = "female_heavy_forfeiting";
var FEMALE_FINISHED = "female_finished";


/******************************************/		
/**********   Strip Functions    **********/
/******************************************/

/**************************************************
 * Fetches the appropriate dialogue trigger for the 
 * provided article of clothing, based on whether
 * the article is going to be removed or has been
 * removed. Written to prevent duplication.
 **************************************************/
function getClothingTrigger (player, clothing, removed) {
	var type = clothing.type;
	var pos = clothing.position;
	var gender = playerGenders[player];
	console.log(player);
	/* starting with important articles */
	if (type == IMPORTANT_ARTICLE) {
		if (pos == UPPER_ARTICLE) {
			if (gender == MALE) {
				if (removed) {
					return MALE_CHEST_IS_VISIBLE;
				} else {
					return MALE_CHEST_WILL_BE_VISIBLE;
				}
			} else if (gender == FEMALE) {
				if (removed) {
					return FEMALE_CHEST_IS_VISIBLE;
				} else {
					return FEMALE_CHEST_WILL_BE_VISIBLE;
				}
			}
		} else if (pos == LOWER_ARTICLE) {
			if (gender == MALE) {
				if (removed) {
					return MALE_CROTCH_IS_VISIBLE;
				} else {
					return MALE_CROTCH_WILL_BE_VISIBLE;
				}
			} else if (gender == FEMALE) {
				if (removed) {
					return FEMALE_CROTCH_IS_VISIBLE;
				} else {
					return FEMALE_CROTCH_WILL_BE_VISIBLE;
				}
			}
		} else {
			/* this shouldn't happen, but if it does then just pretend it's a major article */
			if (gender == MALE) {
				if (removed) {
					return MALE_REMOVED_MAJOR;
				} else {
					return MALE_WILL_REMOVE_MAJOR;
				}
			} else if (gender == FEMALE) {
				if (removed) {
					return FEMALE_REMOVED_MAJOR;
				} else {
					return FEMALE_WILL_REMOVE_MAJOR;
				}
			}
		}
	}
	/* next major articles */
	else if (type == MAJOR_ARTICLE) {
		if (gender == MALE) {
			if (removed) {
				return MALE_REMOVED_MAJOR;
			} else {
				return MALE_WILL_REMOVE_MAJOR;
			}
		} else if (gender == FEMALE) {
			if (removed) {
				return FEMALE_REMOVED_MAJOR;
			} else {
				return FEMALE_WILL_REMOVE_MAJOR;
			}
		}
	}
	/* next minor articles */
	else if (type == MINOR_ARTICLE) {
		if (gender == MALE) {
			if (removed) {
				return MALE_REMOVED_MINOR;
			} else {
				return MALE_WILL_REMOVE_MINOR;
			}
		} else if (gender == FEMALE) {
			if (removed) {
				return FEMALE_REMOVED_MINOR;
			} else {
				return FEMALE_WILL_REMOVE_MINOR;
			}
		}
	}
	/* next accessories */
	else if (type == EXTRA_ARTICLE) {
		if (gender == MALE) {
			if (removed) {
				return MALE_REMOVED_ACCESSORY;
			} else {
				return MALE_WILL_REMOVE_ACCESSORY;
			}
		} else if (gender == FEMALE) {
			if (removed) {
				return FEMALE_REMOVED_ACCESSORY;
			} else {
				return FEMALE_WILL_REMOVE_ACCESSORY;
			}
		}
	}
}

/**************************************************
 * Manages the dialogue triggers before a player
 * strips or forfeits.
 **************************************************/
function prepareToStripPlayer (player) {
	/* determine the situation */
	if (playerClothing[player].length > 0) {
		/* the player has clothes left and will strip */
		var toBeRemovedClothing = playerClothing[player][playerClothing[player].length - 1];
		var dialogueTrigger = getClothingTrigger(player, toBeRemovedClothing, false);
		
		/* set up the replaceable tags and content */
		var replace = [NAME, PROPER_CLOTHING, LOWERCASE_CLOTHING];
		var content = [playerNames[player], toBeRemovedClothing.proper, toBeRemovedClothing.lower];
	
		updateAllBehaviours(player, dialogueTrigger, replace, content);

		if (player != HUMAN_PLAYER) {
			updateBehaviour(player, PLAYER_MUST_STRIP, replace, content);
		}
	} else {
		/* the player has no clothes and will have to accept a forfeit */
		if (playerGenders[player] == MALE) {
			updateAllBehaviours(player, MALE_MUST_FORFEIT, [NAME], [playerNames[player]]);
		} else if (playerGenders[player] == FEMALE) {
			updateAllBehaviours(player, FEMALE_MUST_FORFEIT, [NAME], [playerNames[player]]);
		}

		if (player != HUMAN_PLAYER) {
			updateBehaviour(player, PLAYER_MUST_FORFEIT, [NAME], [playerNames[player]]);
		}
	}
}

/**************************************************
 * Removes an article of clothing from the human
 * player. Also handles all of the dialogue triggers
 * involved in the process.
 **************************************************/
function stripHumanPlayer () {
	console.log("The human player is being stripped.");
	
	/* grab the removed article of clothing and determine its dialogue trigger */
	var removedClothing = playerClothing[HUMAN_PLAYER].pop();
	var dialogueTrigger = getClothingTrigger(HUMAN_PLAYER, removedClothing, true);
	
	/* shift all of the clothing images */
	var firstClothingImage = clothingCells[HUMAN_PLAYER].src;
	for (var i = 0; i < playerStartingClothing[HUMAN_PLAYER]-1; i++) {
		clothingCells[i].src = clothingCells[i+1].src;
	}
	clothingCells[playerStartingClothing[HUMAN_PLAYER]-1].src = firstClothingImage;
	
	/* dull the lost clothing */
	for (var i = playerStartingClothing[0]; i > playerClothing[HUMAN_PLAYER].length; i--) {
		clothingCells[i-1].style.opacity = 0;
	}
	
	/* update label */
	if (playerClothing[HUMAN_PLAYER].length > 0) {
		var clothingName = playerClothing[HUMAN_PLAYER][playerClothing[HUMAN_PLAYER].length - 1].proper;
		clothingCellsLabel.innerHTML = "Your Bet: <b>"+clothingName+"</b>";
	} else {
		clothingCellsLabel.innerHTML = "Your Bet: <b>A Forfeit</b>";
	}
		
	/* set up the replaceable tags and content */
	var replace = [NAME, PROPER_CLOTHING, LOWERCASE_CLOTHING];
	var content = [playerNames[HUMAN_PLAYER], removedClothing.proper, removedClothing.lower];
	
	/* update behaviour */
	updateAllBehaviours(HUMAN_PLAYER, dialogueTrigger, replace, content);
	
}

/**************************************************
 * Removes an article of clothing from an AI
 * player. Also handles all of the dialogue triggers
 * involved in the process.
 **************************************************/
function stripAIPlayer (player) {
	console.log("Opponent "+player+" is being stripped.");
	
	/* grab the removed article of clothing and determine its dialogue trigger */
	var removedClothing = playerClothing[player].pop();
	var dialogueTrigger = getClothingTrigger(player, removedClothing, true);
	
	/* set up the replaceable tags and content */
	var replace = [NAME, PROPER_CLOTHING, LOWERCASE_CLOTHING];
	var content = [playerNames[player], removedClothing.proper, removedClothing.lower];
	
	/* update behaviour */
	updateAllBehaviours(player, dialogueTrigger, replace, content);
	updateBehaviour(player, PLAYER_STRIPPED, replace, content);
}

/**************************************************
 * Removes an article of clothing from the selected
 * player. Also handles all of the dialogue triggers
 * involved in the process.
 **************************************************/
function stripPlayer (player) {
	/* determine the situation */
	if (playerClothing[player].length > 0) {
		/* the player has clothes left and will strip */
		if (player == HUMAN_PLAYER) {
			stripHumanPlayer();
		} else {
			stripAIPlayer(player);
		}
	} else {
		/* the player has no clothes and will have to accept a forfeit */
		playerForfeits[player] = true;
		playerInGame[player] = false;
		
		/* update behaviour */
		if (player == HUMAN_PLAYER) {
			if (playerGenders[HUMAN_PLAYER] == MALE) {
				updateAllBehaviours(HUMAN_PLAYER, MALE_START_FORFEIT, [NAME], [playerNames[HUMAN_PLAYER]]);
			} else if (playerGenders[HUMAN_PLAYER] == FEMALE) {
				updateAllBehaviours(HUMAN_PLAYER, FEMALE_START_FORFEIT, [NAME], [playerNames[HUMAN_PLAYER]]);
			}
			clothingCellsLabel.innerHTML = "<b>Keep Forfeiting...</b>";
		} else {
			if (playerGenders[player] == MALE) {
				updateAllBehaviours(player, MALE_START_FORFEIT, [NAME], [playerNames[player]]);
			} else if (playerGenders[player] == FEMALE) {
				updateAllBehaviours(player, FEMALE_START_FORFEIT, [NAME], [playerNames[player]]);
			}
			updateBehaviour(player, PLAYER_START_FORFEIT, [NAME], [playerNames[player]]);
		}
	}
	
	
	/* HARD STOP BEFORE OLD CONTENT */
	return;
	
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