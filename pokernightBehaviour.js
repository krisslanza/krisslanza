/************************************************************
 This file contains the variables and functions that give the
 opponents their uniqueness.
 ************************************************************/

/********************************/	
/*****  Behaviour Settings  *****/
/********************************/

/* general variables */
var playerLoaded = [false, false, false, false, false];

var playerNames = [null, null, null, null, null];
var playerGender = [null, null, null, null, null];

var playerClothing = [[], [], [], [], []];

var playerImages = [[], [], [], [], []];
var playerDialogue = [[], [], [], [], []];

/* deep variables */
var playerXML = [[], [], [], [], []];

/********************************/	
/***** Behaviour Functions  *****/
/********************************/

/* tries to load the behaviours of the chosen opponents */
function loadBehaviours () {
	var behaviourDiv = document.getElementById("behaviourDiv");
	
	for (var i = 0; i < players; i++) {
		var fileName = playerSources[i] + "behaviour.html";
		behaviourDiv.innerHTML += "<iframe id='opponent"+i+"' src='"+fileName+"' ></iframe>";
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
			
			$clothing = $(xml).find('clothing');
			$clothing.find('item').each(function () {
				playerClothing[player].push($(this).text());
				console.log(playerClothing[player]);
			});
			
			playerImages[player] = $(xml).find('startImage').text();
			playerDialogue[player] = $(xml).find('startDialogue').text();
			
			playerXML[player] = xml;
			playerLoaded[player] = true;
		}
	});
}

/* loads the visual state of the chosen player */
function updatePlayerVisual (player) {
	playerLabels[player].innerHTML = playerNames[player];
	playerImageCells[player].src = playerSources[player] + playerImages[player];
	playerDialogueCells[player].innerHTML = playerDialogue[player];
}

/* updates the behaviour of the given player based on the provided tag */
function updateBehaviour (player, tag, replace, content) {
	playerDialogue[player] = "";
	
	$(playerXML[player]).find('behaviour').find('state').each(function () {
		if ($(this).find('case').text() == tag) {
			playerDialogue[player] = $(this).find('dialogue').text();
			console.log(playerDialogue[player]);
			
			for (var i = 0; i < replace.length; i++) {
				playerDialogue[player] = playerDialogue[player].replace(replace, content);
				console.log(playerDialogue[player]);
			}
		}
	});
}

/* tries to load the basic settings of all players */
function loadBasicSettings (player) {
	var playerFile = document.getElementById("opponent"+player);
	playerDocuments[player] = playerFile.contentDocument;
	
	if (playerDocuments[player].readyState == 'complete') {
		//console.log(playerDocuments[player].readyState);
		//console.log(playerFile);
		//console.log(playerDocuments[player]);
		//console.log(playerDocuments[player].getElementById("name").innerHTML);
		playerNames[player] = playerDocuments[player].getElementById('name').innerHTML;
		
		playerLabels[player].innerHTML = playerNames[player];
		if (player > 0) {
			playerImageCells[player].src = playerSources[player] + "start.jpg";
			playerDialogueCells[player].innerHTML = playerDocuments[player].getElementById('startingDialogue').innerHTML;
		
			// ADD SOME ERROR HANDLING
			var clothingPaths = Number(playerDocuments[player].getElementById('clothingPaths').innerHTML);
			var chosenPath = getRandomNumber(1, clothingPaths);
			
			console.log(chosenPath);
			playerClothingPaths[player] = 0;
		}
	} else {
		/* wait for the data to be loaded */
		window.setTimeout(function() {loadBasicSettings(player)}, 1000);
	}
}

/* updates the speech and image of the chosen player */
function updateState (player) {
	
}