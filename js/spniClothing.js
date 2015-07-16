/********************************************************************************
 This file contains the variables and functions that store information on player 
 clothing and player stripping.
 ********************************************************************************/
 
/**********************************************************************
 *****                Clothing Object Specification               *****
 **********************************************************************/
 
/* clothing types */
var IMPORTANT_ARTICLE = "important";
var MAJOR_ARTICLE = "major";
var MINOR_ARTICLE = "minor";
var EXTRA_ARTICLE = "extra";

/* clothing positions */
var UPPER_ARTICLE = "upper";
var LOWER_ARTICLE = "lower";
var OTHER_ARTICLE = "other";

/************************************************************
 * Stores information on an article of clothing.
 ************************************************************/
function createNewClothing (proper, lower, type, position, image) {
	var newClothingObject = {proper:proper, 
						     lower:lower, 
						     type:type, 
						     position:position,
                             image:image};
						  
	return newClothingObject;
}

/**********************************************************************
 *****                    Stripping Variables                     *****
 **********************************************************************/
 
/* stripping modal */
$stripModal = $("#stripping-modal");
$stripClothing = $("#stripping-clothing-area");
$stripButton = $("#stripping-modal-button");

/* consistence */
var selectedClothing = 0;

/**********************************************************************
 *****                      Strip Functions                       *****
 **********************************************************************/
 
 /************************************************************
 * Fetches the appropriate dialogue trigger for the provided
 * article of clothing, based on whether the article is going 
 * to be removed or has been removed. Written to prevent duplication.
 ************************************************************/
function getClothingTrigger (player, clothing, removed) {
	var type = clothing.type;
	var pos = clothing.position;
	var gender = players[player].gender;

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
					return MALE_REMOVING_MAJOR;
				}
			} else if (gender == FEMALE) {
				if (removed) {
					return FEMALE_REMOVED_MAJOR;
				} else {
					return FEMALE_REMOVING_MAJOR;
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
				return MALE_REMOVING_MAJOR;
			}
		} else if (gender == FEMALE) {
			if (removed) {
				return FEMALE_REMOVED_MAJOR;
			} else {
				return FEMALE_REMOVING_MAJOR;
			}
		}
	}
	/* next minor articles */
	else if (type == MINOR_ARTICLE) {
		if (gender == MALE) {
			if (removed) {
				return MALE_REMOVED_MINOR;
			} else {
				return MALE_REMOVING_MINOR;
			}
		} else if (gender == FEMALE) {
			if (removed) {
				return FEMALE_REMOVED_MINOR;
			} else {
				return FEMALE_REMOVING_MINOR;
			}
		}
	}
	/* next accessories */
	else if (type == EXTRA_ARTICLE) {
		if (gender == MALE) {
			if (removed) {
				return MALE_REMOVED_ACCESSORY;
			} else {
				return MALE_REMOVING_ACCESSORY;
			}
		} else if (gender == FEMALE) {
			if (removed) {
				return FEMALE_REMOVED_ACCESSORY;
			} else {
				return FEMALE_REMOVING_ACCESSORY;
			}
		}
	}
}

/************************************************************
 * Manages the dialogue triggers before a player strips or forfeits.
 ************************************************************/
function playerMustStrip (player) {
	/* count the clothing the player has remaining */
    var clothes = 0;
    for (var i = 0; i < players[player].clothing.length; i++) {
        if (players[player].clothing[i]) {
            clothes++;
        }
    }
    var startingClothes = players[player].clothing.length;
	
	if (clothes > 0) {
		/* the player has clothes and will strip */
		if (player == HUMAN_PLAYER) {
			if (players[HUMAN_PLAYER].gender == MALE) {
				updateAllBehaviours(player, MALE_HUMAN_MUST_STRIP, [NAME], [players[player].first]);
			} else {
				updateAllBehaviours(player, FEMALE_HUMAN_MUST_STRIP, [NAME], [players[player].first]);
			}
		} else {
			if (players[player].gender == MALE) {
				updateAllBehaviours(player, MALE_MUST_STRIP, [NAME], [players[player].first]);
			} else {
				updateAllBehaviours(player, FEMALE_MUST_STRIP, [NAME], [players[player].first]);
			}
			updateBehaviour(player, PLAYER_MUST_STRIP, [NAME], [players[player].first]);
		}
	} else {
		/* the player has no clothes and will have to accept a forfeit */
		if (players[player].gender == MALE) {
			updateAllBehaviours(player, MALE_MUST_MASTURBATE, [NAME], [players[player].first]);
		} else if (players[player].gender == FEMALE) {
			updateAllBehaviours(player, FEMALE_MUST_MASTURBATE, [NAME], [players[player].first]);
		}

		if (player != HUMAN_PLAYER) {
			updateBehaviour(player, PLAYER_MUST_MASTURBATE, [NAME], [players[player].first]);
		}
	}
	
	return clothes;
}

/************************************************************
 * Manages the dialogue triggers as player beings to strip
 * or forfeit.
 ************************************************************/
function prepareToStripPlayer (player) {
    /* count the clothing the player has remaining */
    var clothes = 0;
    for (var i = 0; i < players[player].clothing.length; i++) {
        if (players[player].clothing[i]) {
            clothes++;
        }
    }
    var startingClothes = players[player].clothing.length;
    
	/* determine the situation */
	if (clothes > 0) {
		/* the player has clothes left and will strip */
        if (player == HUMAN_PLAYER) {
            if (players[HUMAN_PLAYER].gender == MALE) {
                updateAllBehaviours(player, MALE_HUMAN_MUST_STRIP, [NAME], [players[player].first]);
            } else {
                updateAllBehaviours(player, FEMALE_HUMAN_MUST_STRIP, [NAME], [players[player].first]);
            }
        } else {
            var toBeRemovedClothing = players[player].clothing[startingClothes - 1];
            var dialogueTrigger = getClothingTrigger(player, toBeRemovedClothing, false);
            
            /* set up the replaceable tags and content */
            var replace = [NAME, PROPER_CLOTHING, LOWERCASE_CLOTHING];
            var content = [players[player].first, toBeRemovedClothing.proper, toBeRemovedClothing.lower];
        
            updateAllBehaviours(player, dialogueTrigger, replace, content);
            updateBehaviour(player, PLAYER_STRIPPING, replace, content);
        }
	} else {
		/* the player has no clothes and will have to accept a forfeit */
		if (players[player].gender == MALE) {
			updateAllBehaviours(player, MALE_MUST_MASTURBATE, [NAME], [players[player].first]);
		} else if (players[player].gender == FEMALE) {
			updateAllBehaviours(player, FEMALE_MUST_MASTURBATE, [NAME], [players[player].first]);
		}

		if (player != HUMAN_PLAYER) {
			updateBehaviour(player, PLAYER_MUST_MASTURBATE, [NAME], [players[player].first]);
		}
	}
}

/************************************************************
 * Sets up and displays the stripping modal, so that the human
 * player can select an article of clothing to remove.
 ************************************************************/
function showStrippingModal () {
    console.log("The stripping modal is being set up.");
    
    /* clear the area */
    $stripClothing.html("");
    selectedClothing = -1;
    
    /* determine the highest level of clothing left */
    var highestPosition = "";
    var highestLevel = "";
    for (var i = 0; i < players[HUMAN_PLAYER].clothing.length; i++) {
        if (players[HUMAN_PLAYER].clothing[i]) {
            /* highest level */
            if (players[HUMAN_PLAYER].clothing[i].position == OTHER_ARTICLE) {
                highestPosition = OTHER_ARTICLE;
                highestLevel = "";
                break;
            }

            /* minor level */
            if (players[HUMAN_PLAYER].clothing[i].type == MINOR_ARTICLE) {
                highestLevel = MINOR_ARTICLE;
            }
            
            /* major level */
            if (players[HUMAN_PLAYER].clothing[i].type == MAJOR_ARTICLE && highestLevel != MINOR_ARTICLE) {
                highestLevel = MAJOR_ARTICLE;
            }
            
            /* important level */
            if (players[HUMAN_PLAYER].clothing[i].type == IMPORTANT_ARTICLE && highestLevel != MINOR_ARTICLE && highestLevel != MAJOR_ARTICLE) {
                highestLevel = IMPORTANT_ARTICLE;
            }
        }
    }
    
    /* load the clothing into the modal */
    for (var i = 0; i < players[HUMAN_PLAYER].clothing.length; i++) {
        if (players[HUMAN_PLAYER].clothing[i] && (players[HUMAN_PLAYER].clothing[i].position == highestPosition
                                              ||  players[HUMAN_PLAYER].clothing[i].type == highestLevel)) {
            var clothingCard = 
                "<input type='image' id='"+i+"' class='bordered modal-clothing-image' src="+
                players[HUMAN_PLAYER].clothing[i].image+" onclick='selectClothingToStrip("+i+")'/>";
            
            $stripClothing.append(clothingCard);
        }
    }
    
    /* disable the strip button */
    $stripButton.attr('disabled', true);
    
    /* display the stripping modal */
    $stripModal.modal('show');
}

/************************************************************
 * The human player clicked on an article of clothing in
 * the stripping modal.
 ************************************************************/
 
function selectClothingToStrip (id) {
    console.log(id);
    
    /* save the selected article */
    selectedClothing = id;
    
    /* designate the selected article */
    $(".modal-selected-clothing-image").removeClass("modal-selected-clothing-image");
    $("#"+id+".modal-clothing-image").addClass("modal-selected-clothing-image");
    
    /* enable the strip button */
    $stripButton.attr('disabled', false);
}
 
/************************************************************
 * The human player closed the stripping modal. Removes an 
 * article of clothing from the human player. 
 ************************************************************/
 
function closeStrippingModal () {
    if (selectedClothing >= 0) {
        /* grab the removed article of clothing and determine its dialogue trigger */
        var removedClothing = players[HUMAN_PLAYER].clothing[selectedClothing];
        players[HUMAN_PLAYER].clothing[selectedClothing] = null;
        var dialogueTrigger = getClothingTrigger(HUMAN_PLAYER, removedClothing, true);
        
        /* display the remaining clothing */
        displayHumanPlayerClothing();
        
        /* count the clothing the player has remaining */
        var clothes = 0;
        for (var i = 0; i < players[HUMAN_PLAYER].clothing.length; i++) {
            if (players[HUMAN_PLAYER].clothing[i]) {
                clothes++;
            }
        }
        var startingClothes = players[HUMAN_PLAYER].clothing.length;
        
        /* update label */
        if (clothes > 0) {
            $gameClothingLabel.html("<b>Your Remaining Clothing</b>");
        } else {
            $gameClothingLabel.html("<b>You're Naked</b>");
        }
            
        /* set up the replaceable tags and content */
        var replace = [NAME, PROPER_CLOTHING, LOWERCASE_CLOTHING];
        var content = [players[HUMAN_PLAYER].first, removedClothing.proper, removedClothing.lower];
        
        /* update behaviour */
        updateAllBehaviours(HUMAN_PLAYER, dialogueTrigger, replace, content);
        updateAllGameVisuals();
		
		/* allow progression */
		endRound();
    } else {
        /* how the hell did this happen? */
        console.log("Error: there was no selected article.");
        showStrippingModal();
    }
}

/************************************************************
 * Removes an article of clothing from an AI player. Also 
 * handles all of the dialogue triggers involved in the process.
 ************************************************************/
function stripAIPlayer (player) {
	console.log("Opponent "+player+" is being stripped.");
	
	/* grab the removed article of clothing and determine its dialogue trigger */
	var removedClothing = players[player].clothing.pop();
    players[player].clothing.unshift(null);
	var dialogueTrigger = getClothingTrigger(player, removedClothing, true);
	
	/* determine new AI stage */
	var clothes = 0;
    for (var i = 0; i < players[player].clothing.length; i++) {
        if (players[player].clothing[i]) {
            clothes++;
        }
    }
    var startingClothes = players[player].clothing.length;
	
	players[player].stage = startingClothes - clothes;
	
	/* set up the replaceable tags and content */
	var replace = [NAME, PROPER_CLOTHING, LOWERCASE_CLOTHING];
	var content = [players[player].first, removedClothing.proper, removedClothing.lower];
	
	/* update behaviour */
	updateAllBehaviours(player, dialogueTrigger, replace, content);
	updateBehaviour(player, PLAYER_STRIPPED, replace, content);
	
	/* allow progression */
	endRound();
}

/************************************************************
 * Removes an article of clothing from the selected player.
 * Also handles all of the dialogue triggers involved in the 
 * process.
 ************************************************************/ 
function stripPlayer (player) {
    /* count the clothing the player has remaining */
    var clothes = 0;
    for (var i = 0; i < players[player].clothing.length; i++) {
        if (players[player].clothing[i]) {
            clothes++;
        }
    }
    var startingClothes = players[player].clothing.length;
    
	/* determine the situation */
	if (clothes > 0) {
		/* the player has clothes left and will strip */
		if (player == HUMAN_PLAYER) {
			showStrippingModal();
		} else {
			stripAIPlayer(player);
		}
	} else {
		/* the player has no clothes and will have to accept a forfeit */
		players[player].forfeit = [PLAYER_MASTURBATING, CAN_SPEAK];
		players[player].out = true;
		
		/* update behaviour */
		if (player == HUMAN_PLAYER) {
			if (players[HUMAN_PLAYER].gender == MALE) {
				updateAllBehaviours(HUMAN_PLAYER, MALE_START_MASTURBATING, [NAME], [players[HUMAN_PLAYER].first]);
			} else if (players[HUMAN_PLAYER].gender == FEMALE) {
				updateAllBehaviours(HUMAN_PLAYER, FEMALE_START_MASTURBATING, [NAME], [players[HUMAN_PLAYER].first]);
			}
			$gameClothingLabel.html("<b>You're Masturbating...</b>");
		} else {
			if (players[HUMAN_PLAYER].gender == MALE) {
				updateAllBehaviours(player, MALE_START_MASTURBATING, [NAME], [players[player].first]);
			} else if (players[HUMAN_PLAYER].gender == FEMALE) {
				updateAllBehaviours(player, FEMALE_START_MASTURBATING, [NAME], [players[player].first]);
			}
			updateBehaviour(player, PLAYER_START_MASTURBATING, [NAME], [players[player].first]);
			setForfeitTimer(player);
		}
		
		/* allow progression */
		endRound();
	}
}