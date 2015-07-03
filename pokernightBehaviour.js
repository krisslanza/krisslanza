/************************************************************
 This file contains the variables and functions that give the
 opponents their uniqueness.
 ************************************************************/

/********************************/	
/*****  Constant Settings   *****/
/********************************/
 
var buttonFlashSpeed = 500;
 
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
function parseDialogue (player, caseObject) {
	image = [];
	dialogue = [];
	
	caseObject.find('state').each(function () {
		image.push($(this).attr('picture'));
		dialogue.push($(this).html());
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
		window.setTimeout(function(){flashAdvanceButton(player);}, buttonFlashSpeed);
	}
}

/* loads the visual state of the chosen player */
function updatePlayerVisual (player) {
	playerLabels[player].innerHTML = playerNames[player];
	playerImageCells[player].src = playerSources[player] + playerImages[player][playerState[player]];
	playerDialogueCells[player].innerHTML = playerDialogue[player][playerState[player]];
	
	console.log(playerDialogue[player].length + " "+(playerState[player]));
	if (playerDialogue[player].length > playerState[player]+1) {
		advanceButtons[player].style.display = "block";
		window.setTimeout(function(){flashAdvanceButton(player);}, buttonFlashSpeed);
	} else {
		advanceButtons[player].style.display = "none";
	}
}

/* loads the visual state for all players */
function updateAllPlayerVisuals () {
	for (var i = 1; i < players; i++) {
		updatePlayerVisual(i);
	}
}

/* updates the behaviour of the given player based on the provided tag */
function updateBehaviour (player, tag, replace, content) {
	var dialogue = "";
	var image = "";
	console.log("Updating behaviour of Player "+player);
	
	var stage = (playerStartingClothing[player] - playerClothing[player].length + 1);
	if (playerForfeits[player] == true) {
		stage += 1;
	}
	
	$(playerXML[player]).find('behaviour').find('stage').eq(stage-1).find('case').each(function () {
		if ($(this).find('tag').text() == tag) {
			/* roll a die to determine which dialogue to take */
			var random = (getRandomNumber(1, $(this).find('state').size()) - 1);
			
			dialogue = $(this).find('state').eq(random).find('dialogue').text();
			image = $(this).find('state').eq(random).find('picture').text();
			console.log(image);
			console.log(dialogue);
			
			for (var i = 0; i < replace.length; i++) {
				dialogue = dialogue.replace(replace[i], content[i]);
				console.log(dialogue);
			}
		}
	});
	
	playerDialogue[player] = [dialogue];
	console.log("Player IMAGE: "+image);
	if (image != "") {
		playerImages[player] = [image];
	}
	
	if (dialogue == "" && tag != "blank") {
		console.log("Couldn't find "+tag+" dialogue for Player "+player+" Stage "+stage);
	}
	
	playerState[player] = 0;
	updatePlayerVisual(player);
}

/* updates the behaviour of all players (except the provided player) based on the provided tag */
function updateAllBehaviours (player, tag, replace, content) {
	for (i = 1; i < players; i++) {
		if (i != player) {
			updateBehaviour(i, tag, replace, content);
		}
	}
	
	updateAllPlayerVisuals();
}
