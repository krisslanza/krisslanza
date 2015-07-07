/************************************************************
 This file contains the variables and functions that give the
 opponents their uniqueness.
 ************************************************************/

/********************************/	
/*****  Constant Settings   *****/
/********************************/
 
var MALE = "male";
var FEMALE = "female"; 

var FLASH_SPEED = 500;

/***********************************/
/********* Replaceable Tags ********/
/***********************************/

var NAME = "~name~";
var PROPER_CLOTHING = "~Clothing~";
var LOWERCASE_CLOTHING = "~clothing~";

 
/********************************/	
/*****  Behaviour Settings  *****/
/********************************/

/* general variables */
var playerLoaded = [false, false, false, false, false];

var playerNames = [null, null, null, null, null];
var playerLabels = [null, null, null, null, null];
var playerGenders = [null, null, null, null, null];

var playerStartingClothing = [0, 0, 0, 0, 0];
var playerClothing = [[], [], [], [], []];
var playerForfeits = [false, false, false, false, false];

var playerImages = [[], [], [], [], []];
var playerDialogue = [[], [], [], [], []];
var playerDirection = [[], [], [], [], []];
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
	var direction = [];
	
	caseObject.find('state').each(function () {
		image.push($(this).attr('img'));
		console.log($(this).attr('img'));
		dialogue.push($(this).html());
		direction.push($(this).attr('direction'));
		
		if (replace && content) {
			for (var i = 0; i < replace.length; i++) {
				dialogue[dialogue.length-1] = dialogue[dialogue.length-1].replace(replace[i], content[i]);
			}
		}
	});
	
	if (image != []) {
		playerImages[player] = image;
	}
	playerDialogue[player] = dialogue;
	if (direction != []) {
		playerDirection[player] = direction;
	}
}

/* parses the loaded XML of the chosen behaviour */
function loadBehaviour (player) {
	$.ajax({
        type: "GET",
		url: playerSources[player] + "behaviour.xml",
		dataType: "text",
		success: function(xml) {
			playerXML[player] = xml;
			
			playerNames[player] = $(xml).find('name').text();
			playerLabels[player] = $(xml).find('label').text();
			playerGenders[player] = $(xml).find('gender').text();
			
			loadOpponentWardrobe(player);
			
			parseDialogue(player, $(xml).find('start'));
			playerState[player] = 0;
			
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
	nameLabels[player].innerHTML = playerLabels[player];
	imageCells[player].src = playerSources[player] + playerImages[player][playerState[player]];
	dialogueCells[player].innerHTML = playerDialogue[player][playerState[player]];
	
	/* direct dialogue bubble */
	if (playerDirection[player][playerState[player]]) {
		dialogueBubbles[player].className = "bordered dialogue-bubble dialogue-"+playerDirection[player][playerState[player]];
	}
	
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


/******************************************/	
/********* XML Parsing Functions **********/
/******************************************/


/**************************************************
 * Parses and loads the wardrobe section of an 
 * opponent's XML file.
 **************************************************/
function loadOpponentWardrobe (player) {
	/* grab the relevant XML file, assuming its already been loaded */
	var xml = playerXML[player];
	
	/* find and grab the wardrobe tag */
	$wardrobe = $(xml).find('wardrobe');
	
	/* find and create all of their clothing */
	$wardrobe.find('clothing').each(function () {
		var properName = $(this).attr('proper-name');
		var lowercase = $(this).attr('lowercase');
		var type = $(this).attr('type');
		var position = $(this).attr('position');
		
		var clothing = newClothing(properName, lowercase, null, type, position);
		
		playerClothing[player].push(clothing);
		playerStartingClothing[player]++;
	});

}









