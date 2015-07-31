/********************************************************************************
 This file contains the variables and functions that form the title and setup screens
 of the game. The parsing functions for the player.xml file, the clothing organization
 functions, and human player initialization.
 ********************************************************************************/

/**********************************************************************
 *****                   Title Screen UI Elements                 *****
 **********************************************************************/
 
$nameField = $("#player-name-field");
$genderButtons = [$("#male-gender-button"), $("#female-gender-button")];
$clothingTable = $("#title-clothing-table");
$warningLabel = $("#title-warning-label");

/**********************************************************************
 *****                    Title Screen Variables                  *****
 **********************************************************************/

var clothingChoices = [];
var selectedChoices = [];
 
/**********************************************************************
 *****                    Start Up Functions                      *****
 **********************************************************************/
 
/************************************************************
 * Loads all of the content required to display the title 
 * screen.
 ************************************************************/
function loadTitleScreen () {
    loadClothing();
}

/************************************************************
 * Loads and parses the player clothing XML file.
 ************************************************************/
function loadClothing () {
	/* clear previously loaded content */
	clothingChoices = [];
	selectedChoices = [false, false, true, true, true, false, true, true, true, true];
	
    /* load all hardcoded clothing, it's just easier this way */
	if (players[HUMAN_PLAYER].gender == MALE) {
		clothingChoices.push(null);
		clothingChoices.push(null);
		clothingChoices.push(createNewClothing('Belt', 'belt', EXTRA_ARTICLE, OTHER_ARTICLE, "player/male/belt.jpg", 2));
		clothingChoices.push(createNewClothing('Shirt', 'shirt', MAJOR_ARTICLE, UPPER_ARTICLE, "player/male/shirt.jpg", 1));
		clothingChoices.push(createNewClothing('Undershirt', 'undershirt', IMPORTANT_ARTICLE, UPPER_ARTICLE, "player/male/undershirt.jpg", 0));
		clothingChoices.push(null);
		clothingChoices.push(createNewClothing('Socks', 'socks', EXTRA_ARTICLE, OTHER_ARTICLE, "player/male/socks.jpg", 1));
		clothingChoices.push(createNewClothing('Shoes', 'shoes', MINOR_ARTICLE, OTHER_ARTICLE, "player/male/shoes.jpg", 2));
		clothingChoices.push(createNewClothing('Pants', 'pants', MAJOR_ARTICLE, LOWER_ARTICLE, "player/male/pants.jpg", 1));
		clothingChoices.push(createNewClothing('Boxers', 'boxers', IMPORTANT_ARTICLE, LOWER_ARTICLE, "player/male/boxers.jpg", 0));
	} else if (players[HUMAN_PLAYER].gender == FEMALE) {
		clothingChoices.push(null);
		clothingChoices.push(null);
		clothingChoices.push(createNewClothing('Belt', 'belt', EXTRA_ARTICLE, OTHER_ARTICLE, "player/female/belt.jpg", 2));
		clothingChoices.push(createNewClothing('Tank Top', 'tank top', MAJOR_ARTICLE, UPPER_ARTICLE, "player/female/tanktop.jpg", 1));
		clothingChoices.push(createNewClothing('Bra', 'bra', IMPORTANT_ARTICLE, UPPER_ARTICLE, "player/female/bra.jpg", 0));
		clothingChoices.push(null);
		clothingChoices.push(createNewClothing('Socks', 'socks', EXTRA_ARTICLE, OTHER_ARTICLE, "player/female/socks.jpg", 1));
		clothingChoices.push(createNewClothing('Boots', 'boots', MINOR_ARTICLE, OTHER_ARTICLE, "player/female/boots.jpg", 2));
		clothingChoices.push(createNewClothing('Pants', 'pants', MAJOR_ARTICLE, LOWER_ARTICLE, "player/female/pants.jpg", 1));
		clothingChoices.push(createNewClothing('Panties', 'panties', IMPORTANT_ARTICLE, LOWER_ARTICLE, "player/female/panties.jpg", 0));
	}
	updateTitleClothing();
}

/************************************************************
 * Updates the clothing on the title screen.
 ************************************************************/
function updateTitleClothing () {
	if (players[HUMAN_PLAYER].gender == MALE) {
		$('#female-clothing-container').hide();
		$('#male-clothing-container').show();
	} else if (players[HUMAN_PLAYER].gender == FEMALE) {
		$('#male-clothing-container').hide();
		$('#female-clothing-container').show();
	}
	
	for (var i = 0; i < selectedChoices.length; i++) {
		if (selectedChoices[i]) {
			$('#'+players[HUMAN_PLAYER].gender+'-clothing-option-'+i).css('opacity', '1');
		} else {
			$('#'+players[HUMAN_PLAYER].gender+'-clothing-option-'+i).css('opacity', '0.4');
		}
	}
}
 
 
/**********************************************************************
 *****                   Interaction Functions                    *****
 **********************************************************************/
 
/************************************************************
 * The player clicked on one of the gender icons on the title 
 * screen, or this was called by an internal source.
 ************************************************************/
function changePlayerGender (gender) {
	players[HUMAN_PLAYER].gender = gender;
	
	/* update visuals */
	if (gender == MALE) {
		$genderButtons[0].css({opacity: 1});
		$genderButtons[1].css({opacity: 0.4});
	} else if (gender == FEMALE) {
		$genderButtons[0].css({opacity: 0.4});
		$genderButtons[1].css({opacity: 1});
	}
	loadClothing();
}

/************************************************************
 * The player clicked on an article of clothing on the title 
 * screen.
 ************************************************************/
function selectClothing (id) {
	if (selectedChoices[id]) {
		selectedChoices[id] = false;
	} else {
		selectedChoices[id] = true;
	} 
	updateTitleClothing();
}
 
/************************************************************
 * The player clicked on the advance button on the title 
 * screen.
 ************************************************************/
function validateTitleScreen () {
    /* determine the player's name */
	if ($nameField.val() != "") {
		players[HUMAN_PLAYER].first = $nameField.val();
        players[HUMAN_PLAYER].label = $nameField.val();
	} else if (players[HUMAN_PLAYER].gender == "male") {
		players[HUMAN_PLAYER].first = "Mister";
		players[HUMAN_PLAYER].label = "Mister";
	} else if (players[HUMAN_PLAYER].gender == "female") {
		players[HUMAN_PLAYER].first = "Missy";
		players[HUMAN_PLAYER].label = "Missy";
	}
	$gameLabels[HUMAN_PLAYER].html(players[HUMAN_PLAYER].label);
	
	/* count clothing */
	var clothingCount = [0, 0, 0, 0];
	for (var i = 0; i < clothingChoices.length; i++) {
		if (selectedChoices[i]) {
			console.log(clothingChoices[i]);
			if (clothingChoices[i].position == UPPER_ARTICLE) {
				clothingCount[0]++;
			} else if (clothingChoices[i].position == LOWER_ARTICLE) {
				clothingCount[1]++;
			} else {
				clothingCount[2]++;
			}
			clothingCount[3]++;
		}
	}
	console.log(clothingCount);

	/* ensure the player is wearing enough clothing */
	if (clothingCount[0] < 1) {
		$warningLabel.html("You must wear at least 1 article of clothing on your upper body.");
		return;
	} else if (clothingCount[1] < 1) {
		$warningLabel.html( "You must wear at least 1 article of clothing on your lower body.");
		return;
	} else if (clothingCount[3] < 2) {
		$warningLabel.html("You must be wearing at least 2 articles of clothing.");
		return;
	} else if (clothingCount[3] > 8) {
		$warningLabel.html("You cannot wear more than 8 articles of clothing.");
		return;
	}
    
    /* dress the player */
    wearClothing();
	console.log(players[0]);
    
    advanceToNextScreen($titleScreen);
}

/************************************************************
 * The player clicked on the back button on the setup screen.
 ************************************************************/
function backSetupScreen () {
	returnToPreviousScreen($setupScreen);
}

/**********************************************************************
 *****                    Additional Functions                    *****
 **********************************************************************/

/************************************************************
 * Takes all of the clothing selected by the player and adds it, 
 * in a particular order, to the list of clothing they are wearing.
 ************************************************************/
function wearClothing () {
	var position = [[], [], []];
	var importantWorn = [false, false];
	
	/* sort the clothing by position */
	for (var i = clothingChoices.length - 1; i >= 0; i--) {
		if (selectedChoices[i] && clothingChoices[i].position == UPPER_ARTICLE) {
			position[0].push(clothingChoices[i]);
		} else if (selectedChoices[i] && clothingChoices[i].position == LOWER_ARTICLE) {
			position[1].push(clothingChoices[i]);
		} else if (selectedChoices[i]) {
			position[2].push(clothingChoices[i]);
		}
	}
	
	/* wear the clothing is sorted order */
	for (var i = 0; i < position[0].length || i < position[1].length; i++) {
		/* wear a lower article, if any remain */
		if (i < position[1].length) {
			if (position[1][i].type == IMPORTANT_ARTICLE) {
				importantWorn[1] = true;
			} else if (!importantWorn[1]) {
				position[1][i].type = IMPORTANT_ARTICLE;
			}
			
			players[HUMAN_PLAYER].clothing.push(position[1][i]);
		}
		
		/* wear an upper article, if any remain */
		if (i < position[0].length) {
			if (position[0][i].type == IMPORTANT_ARTICLE) {
				importantWorn[0] = true;
			} else if (!importantWorn[0]) {
				position[0][i].type = IMPORTANT_ARTICLE;
			}
			
			players[HUMAN_PLAYER].clothing.push(position[0][i]);
		}
	}
	
	/* wear any other clothing */
	for (var i = 0; i < position[2].length; i++) {
		players[HUMAN_PLAYER].clothing.push(position[2][i]);
	}
	
	/* update the visuals */
    displayHumanPlayerClothing();
}
	
 
 
 