/************************************************************
 This file contains the variables and functions that give the
 opponents their uniqueness.
 ************************************************************/

/********************************/	
/*****  Constant Settings   *****/
/********************************/
 
var FLASH_SPEED = 500;
 
/********************************/	
/*****  Behaviour Settings  *****/
/********************************/

/* general variables */
var playerLoaded = [false, false, false, false, false];

var playerNames = [null, null, null, null, null];
var playerGenders = [null, null, null, null, null];

var playerStartingClothing = [0, 0, 0, 0, 0];
var playerClothing = [[], [], [], [], []];
var playerForfeits = [false, false, false, false, false];

var playerImages = [[], [], [], [], []];
var playerDialogue = [[], [], [], [], []];
var playerState = [0, 0, 0, 0, 0];

/* deep variables */
var playerXML = [[], [], [], [], []];

/********************************/	
/***** Behaviour Functions  *****/
/********************************/

/* parse the dialogue states of a player, given the case object */
function parseDialogue (player, caseObject, replace, content) {
	var image = [];
	var dialogue = [];
	
	caseObject.find('state').each(function () {
		image.push($(this).attr('picture'));
		dialogue.push($(this).html());
		
		if (replace && content) {
			for (var i = 0; i < replace.length; i++) {
				dialogue[dialogue.length-1] = dialogue[dialogue.length-1].replace(replace[i], content[i]);
				console.log(dialogue[dialogue.length-1]);
			}
		}
	});
	
	if (image != []) {
		playerImages[player] = image;
		playerDialogue[player] = dialogue;
	}
}

/* parses the loaded XML of the chosen behaviour */
function loadBehaviour (player) {
	$.ajax({
        type: "GET",
		url: playerSources[player] + "behaviour.xml",
		dataType: "text",
		success: function(xml) {
			playerNames[player] = $(xml).find('name').text();
			playerGenders[player] = $(xml).find('gender').text();
			
			$clothing = $(xml).find('clothing');
			$clothing.find('item').each(function () {
				playerStartingClothing[player]++;
				playerClothing[player].push($(this).text());
			});
			
			parseDialogue(player, $(xml).find('start'));
			playerState[player] = 0;
			
			playerXML[player] = xml;
			playerLoaded[player] = true;
		}
	});
}

/* makes the dialogue advance button flash */
function flashAdvanceButton (player) {
	if (playerDialogue[player].length > playerState[player]+1) {
		if (advanceButtons[player].style.opacity < 1) {
			advanceButtons[player].style.opacity = 1;
		} else {
			advanceButtons[player].style.opacity = 0.4;
		}
		window.setTimeout(function(){flashAdvanceButton(player);}, FLASH_SPEED);
	}
}

/* loads the visual state of the chosen player */
function updatePlayerVisual (player) {
	nameLabels[player].innerHTML = playerNames[player];
	imageCells[player].src = playerSources[player] + playerImages[player][playerState[player]];
	dialogueCells[player].innerHTML = playerDialogue[player][playerState[player]];
	
	/* determine whether or not to display the advance dialogue button */
	if (playerDialogue[player].length > playerState[player]+1) {
		advanceButtons[player].style.display = "block";
		window.setTimeout(function(){flashAdvanceButton(player);}, FLASH_SPEED);
	} else {
		advanceButtons[player].style.display = "none";
	}
}

/* loads the visual state for all PLAYERS */
function updateAllPlayerVisuals () {
	for (var i = 1; i < PLAYERS; i++) {
		updatePlayerVisual(i);
	}
}

/* updates the behaviour of the given player based on the provided tag */
function updateBehaviour (player, tag, replace, content) {
	console.log("Updating behaviour of Player "+player+" with "+tag);
	
	var stage = (playerStartingClothing[player] - playerClothing[player].length + 1);
	if (playerForfeits[player] == true) {
		stage += 1;
	}
	
	var found = false;
	$(playerXML[player]).find('behaviour').find('stage').eq(stage-1).find('case').each(function () {
		if ($(this).attr('tag') == tag) {
			parseDialogue(player, $(this), replace, content);
			found = true;
		}
	});
	
	if (!found && tag != "blank") {
		playerDialogue[player] = [""];
		console.log("Couldn't find "+tag+" dialogue for Player "+player+" Stage "+stage);
	}
	
	playerState[player] = 0;
	updatePlayerVisual(player);
}

/* updates the behaviour of all PLAYERS (except the provided player) based on the provided tag */
function updateAllBehaviours (player, tag, replace, content) {
	for (i = 1; i < PLAYERS; i++) {
		if (i != player) {
			updateBehaviour(i, tag, replace, content);
		}
	}
	
	updateAllPlayerVisuals();
}
