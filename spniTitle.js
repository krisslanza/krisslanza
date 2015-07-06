/************************************************************
 This file contains the variables and functions that form the
 the title screen of the game.
 ************************************************************/

/***********************************/
/********** File Settings **********/
/***********************************/

var playerClothingFile = "player/player.xml";
 
/******************************************/
/********** UI Element Variables **********/
/******************************************/

var nameField = document.getElementById("player-name-field");

var genderButtons = [document.getElementById("male-button"),
					 document.getElementById("female-button")];

var clothingTable = document.getElementById("title-clothing-table");				 

var warningLabel = document.getElementById("warning-label");	

var clothingChoices = [];
var selectedClothing = [];


/****************************************/
/********** Start Up Functions **********/
/****************************************/


/**************************************************
 * Loads all of the content required to display the 
 * title screen.
 **************************************************/
function loadTitleScreen () {
	/* set the default human player gender */
	playerGenders[HUMAN_PLAYER] = "male";
	
	loadClothing();
}


/**************************************************
 * Loads and parses the player clothing XML file.
 **************************************************/
function loadClothing () {
	/* clear some content */
	clothingChoices = [];
	selectedClothing = [];
	
	$.ajax({
        type: "GET",
		url: playerClothingFile,
		dataType: "text",
		success: function(xml) {
			
			/* fetch the corresponding gender wardrobe */
			$wardrobe = null;
			$(xml).find('wardrobe').each(function () {
				if ($(this).attr('tag') == playerGenders[HUMAN_PLAYER]) {
					$wardrobe = $(this);
				}
			});
			
			/* string storage */
			var loadedClothing = "";
			
			/* load all clothing by category */
			$wardrobe.find('category').each(function () {
				var position = OTHER_ARTICLE;
				if ($(this).attr('label') == "Upper Body") {
					position = UPPER_ARTICLE;
				} else if ($(this).attr('label') == "Lower Body") {
					position = LOWER_ARTICLE;
				}
				
				/* clothing label */
				loadedClothing += 
					"<tr><td colspan='42'>"+
					"<div class='title-clothing-label default-font bordered'>"+$(this).attr('label');
					
				if ($(this).attr('warning')) {
					loadedClothing += 
						" "+$(this).attr('warning');
				}
				
				loadedClothing += 
					"</div>"+
					"<tr><td>";
					
				/* load all of the clothing in this category */
				$(this).find('clothing').each(function() {
					var proper = $(this).find('proper').text();
					var lower = $(this).find('lower').text();
					var image = $(this).attr('img');
					var type = $(this).attr('type');
					
					clothingChoices.push(newClothing(proper, lower, image, type, position));
					
					loadedClothing += 
						"<input type='image' class='title-clothing-image bordered' id='clothing-option-"+
						(clothingChoices.length-1)+"' src='"+image+"' onclick='selectClothing("+(clothingChoices.length-1)+")'>";
						
					/* determine if this is worn by default */
					var defaultClothing = $(this).attr('default');
					if (defaultClothing == 'yes') {
						selectedClothing.push(true);
					} else {
						selectedClothing.push(false);
					}
				});
					
				loadedClothing +=
					"</td></tr>"+
					"</td></tr>";
			});
			
			/* update visuals */
			clothingTable.innerHTML = loadedClothing;
			for (var i = 0; i < selectedClothing.length; i++) {
				if (selectedClothing[i]) {
					$('#clothing-option-'+i).css('opacity', '1');
				} else {
					$('#clothing-option-'+i).css('opacity', '0.4');
				} 
			}
		}
	});
}					 


/*******************************************/
/********** Interaction Functions **********/
/*******************************************/
	
	
/**************************************************
 * The player clicked on one of the gender icons on
 * the title screen, or this was called by an
 * internal source.
 **************************************************/
function changePlayerGender (gender) {
	playerGenders[HUMAN_PLAYER] = gender;
	
	/* update visuals */
	if (gender == 'male') {
		genderButtons[0].style.opacity = 1;
		genderButtons[1].style.opacity = 0.4;
	} else if (gender == 'female') {
		genderButtons[0].style.opacity = 0.4;
		genderButtons[1].style.opacity = 1;
	}
	
	loadClothing();
}

/**************************************************
 * The player clicked on an article of clothing on
 * the title screen.
 **************************************************/
function selectClothing (id) {
	if (selectedClothing[id]) {
		selectedClothing[id] = false;
		$('#clothing-option-'+id).css('opacity', '0.4');
	} else {
		selectedClothing[id] = true;
		$('#clothing-option-'+id).css('opacity', '1');
	} 
}

/**************************************************
 * The player clicked on start game button on the
 * title screen.
 **************************************************/
function advanceTitle () {
	/* determine the player's name */
	if (nameField.value != "") {
		playerNames[HUMAN_PLAYER] = nameField.value;
	} else if (playerGenders[HUMAN_PLAYER] == "male") {
		playerNames[HUMAN_PLAYER] = "Mister";
	} else if (playerGenders[HUMAN_PLAYER] == "female") {
		playerNames[HUMAN_PLAYER] = "Missy";
	}
	nameLabels[HUMAN_PLAYER].innerHTML = playerNames[HUMAN_PLAYER];
	
	/* determine the player's gender */
	
	
	/* count clothing */
	var clothingCount = [0, 0, 0, 0];
	for (var i = 0; i < clothingChoices.length; i++) {
		if (selectedClothing[i]) {
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
		warningLabel.innerHTML = "You must be wearing at least 1 article of clothing on your upper body.";
		return;
	} else if (clothingCount[1] < 1) {
		warningLabel.innerHTML = "You must be wearing at least 1 article of clothing on your lower body.";
		return;
	} else if (clothingCount[3] < 2) {
		warningLabel.innerHTML = "You must be wearing at least 2 articles of clothing.";
		return;
	} else if (clothingCount[3] > 8) {
		warningLabel.innerHTML = "You cannot wear more than 8 articles of clothing.";
		return;
	}
	
	/* dress the player */
	wearClothing ();
	
	/* load the next screen */
	$introScreen.hide();
	loadMainGame();
}


/******************************************/
/********** Additional Functions **********/
/******************************************/


/**************************************************
 * Takes all of the clothing selected by the player
 * and adds it, in a particular order, to the list
 * of clothing they are wearing.
 **************************************************/
function wearClothing () {
	var imageList = [];
	
	/* wear any critical clothing on the lower body */
	for (var i = 0; i < clothingChoices.length; i++) {
		if (selectedClothing[i] && clothingChoices[i].type == CRITICAL_ARTICLE && clothingChoices[i].position == LOWER_ARTICLE) {
			playerClothing[HUMAN_PLAYER].push(clothingChoices[i].lower);
			imageList.push(clothingChoices[i].image);
			playerStartingClothing[HUMAN_PLAYER]++;
		}
	}
	
	/* wear any critical clothing on the upper body */
	for (var i = 0; i < clothingChoices.length; i++) {
		if (selectedClothing[i] && clothingChoices[i].type == CRITICAL_ARTICLE && clothingChoices[i].position == UPPER_ARTICLE) {
			playerClothing[HUMAN_PLAYER].push(clothingChoices[i].lower);
			imageList.push(clothingChoices[i].image);
			playerStartingClothing[HUMAN_PLAYER]++;
		}
	}
	
	/* wear any major clothing on the lower body */
	for (var i = 0; i < clothingChoices.length; i++) {
		if (selectedClothing[i] && clothingChoices[i].type == MAJOR_ARTICLE && clothingChoices[i].position == LOWER_ARTICLE) {
			playerClothing[HUMAN_PLAYER].push(clothingChoices[i].lower);
			imageList.push(clothingChoices[i].image);
			playerStartingClothing[HUMAN_PLAYER]++;
		}
	}
	
	/* wear any major clothing on the upper body */
	for (var i = 0; i < clothingChoices.length; i++) {
		if (selectedClothing[i] && clothingChoices[i].type == MAJOR_ARTICLE && clothingChoices[i].position == UPPER_ARTICLE) {
			playerClothing[HUMAN_PLAYER].push(clothingChoices[i].lower);
			imageList.push(clothingChoices[i].image);
			playerStartingClothing[HUMAN_PLAYER]++;
		}
	}
	
	/* wear any minor clothing on the lower body */
	for (var i = 0; i < clothingChoices.length; i++) {
		if (selectedClothing[i] && clothingChoices[i].type == MINOR_ARTICLE && clothingChoices[i].position == LOWER_ARTICLE) {
			playerClothing[HUMAN_PLAYER].push(clothingChoices[i].lower);
			imageList.push(clothingChoices[i].image);
			playerStartingClothing[HUMAN_PLAYER]++;
		}
	}
	
	/* wear any minor clothing on the upper body */
	for (var i = 0; i < clothingChoices.length; i++) {
		if (selectedClothing[i] && clothingChoices[i].type == MINOR_ARTICLE && clothingChoices[i].position == UPPER_ARTICLE) {
			playerClothing[HUMAN_PLAYER].push(clothingChoices[i].lower);
			imageList.push(clothingChoices[i].image);
			playerStartingClothing[HUMAN_PLAYER]++;
		}
	}
	
	/* wear any accessories */
	for (var i = 0; i < clothingChoices.length; i++) {
		if (selectedClothing[i] && clothingChoices[i].type == EXTRA_ARTICLE) {
			playerClothing[HUMAN_PLAYER].push(clothingChoices[i].lower);
			imageList.push(clothingChoices[i].image);
			playerStartingClothing[HUMAN_PLAYER]++;
		}
	}
	
	/* update the visuals */
	console.log(playerClothing[HUMAN_PLAYER]);
	var clothingName = capitalizeFirstLetter(playerClothing[HUMAN_PLAYER][playerClothing[HUMAN_PLAYER].length - 1]);
	clothingCellsLabel.innerHTML = "Your Bet: <b>"+clothingName+"</b>";
	
	imageList.reverse();
	for (var i = 0; i < 8; i++) {
		if (imageList[i]) {
			clothingCells[i].src = imageList[i];
		} else {
			clothingCells[i].style.opacity = 0;
		}
	}
}
	