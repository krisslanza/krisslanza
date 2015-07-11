/********************************************************************************
 This file contains the variables and functions that form the title screen of the 
 game. The parsing functions for the player.xml file, the clothing organization
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

var playerClothingFile = "player/player.xml";
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
    
    $titleScreen.show();
}

/************************************************************
 * Loads and parses the player clothing XML file.
 ************************************************************/
function loadClothing () {
	/* clear previously loaded content */
	clothingChoices = [];
	selectedChoices = [];
	
    /* load the player clothing XML file */
	$.ajax({
        type: "GET",
		url: playerClothingFile,
		dataType: "text",
		success: function(xml) {
			/* fetch the corresponding gender wardrobe */
			$wardrobe = null;
			$(xml).find('wardrobe').each(function () {
				if ($(this).attr('tag') == players[HUMAN_PLAYER].gender) {
					$wardrobe = $(this);
				}
			});
			
			/* string storage */
			var loadedClothing = "";
			
			/* load all clothing by category */
			$wardrobe.find('category').each(function () {
                /* HTML for the clothing label */
				loadedClothing += 
					"<tr><td colspan='42'>"+
					"<div class='title-clothing-label default-font bordered'>";
                
                /* get the clothing label */
				var position = OTHER_ARTICLE;
				if ($(this).attr('label') == "upper") {
					position = UPPER_ARTICLE;
                    loadedClothing += "Upper Body (Minimum: 1)";
				} else if ($(this).attr('label') == "lower") {
					position = LOWER_ARTICLE;
                    loadedClothing += "Lower Body (Minimum: 1)";
				} else {
                    loadedClothing += "Other";
                }
				
                /* close the clothing label */
				loadedClothing += 
					"</div>"+
					"<tr><td>";
					
				/* load all of the clothing in this category */
				$(this).find('clothing').each(function() {
					var proper = $(this).find('proper').text();
					var lower = $(this).find('lower').text();
					var image = $(this).attr('img');
					var type = $(this).attr('type');
					
					clothingChoices.push(createNewClothing(proper, lower, type, position, image));
					
					loadedClothing += 
						"<input type='image' value='' class='title-clothing-image bordered' id='clothing-option-"+
						(clothingChoices.length-1)+"' src='"+image+"' onclick='selectClothing("+(clothingChoices.length-1)+")'>";
						
					/* determine if this is worn by default */
					var defaultClothing = $(this).attr('default');
					if (defaultClothing == 'yes') {
						selectedChoices.push(true);
					} else {
						selectedChoices.push(false);
					}
				});
					
				loadedClothing +=
					"</td></tr>"+
					"</td></tr>";
			});
			
			/* update visuals */
			$clothingTable.html(loadedClothing);
			for (var i = 0; i < selectedChoices.length; i++) {
				if (selectedChoices[i]) {
					$('#clothing-option-'+i).css('opacity', '1');
				} else {
					$('#clothing-option-'+i).css('opacity', '0.4');
				} 
			}
		}
	});
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
		$('#clothing-option-'+id).css('opacity', '0.4');
	} else {
		selectedChoices[id] = true;
		$('#clothing-option-'+id).css('opacity', '1');
	} 
}
 
/************************************************************
 * The player clicked on the start game button on the title 
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
    
    advanceToNextScreen($titleScreen);
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
	
 
 
 