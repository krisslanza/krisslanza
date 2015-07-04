/************************************************************
 This file contains the variables and functions that form the
 the introduction and opponent select screens of the game.
 ************************************************************/
 
/********************************/	
/***** UI Element Variables *****/
/********************************/	

var introScreen = document.getElementById("introScreen");
var gameScreen = document.getElementById("gameScreen");

var warningLabel = document.getElementById("warningLabel");

var nameField = document.getElementById("playerNameField");

var genderButtons = [document.getElementById("maleButton"),
					 document.getElementById("femaleButton")];

var clothingImages = [[document.getElementById("introClothing11"), 
					   document.getElementById("introClothing12"),
                       document.getElementById("introClothing13"),
					   document.getElementById("introClothing14"),
					   document.getElementById("introClothing15"),
                       document.getElementById("introClothing16")],
					  [document.getElementById("introClothing21"), 
					   document.getElementById("introClothing22"),
                       document.getElementById("introClothing23"),
					   document.getElementById("introClothing24"),
					   document.getElementById("introClothing25"),
                       document.getElementById("introClothing26")],
					  [document.getElementById("introClothing31"), 
					   document.getElementById("introClothing32"),
                       document.getElementById("introClothing33"),
                       document.getElementById("introClothing34"),
					   document.getElementById("introClothing35"),
                       document.getElementById("introClothing36")],
					  [document.getElementById("introClothing41"), 
					   document.getElementById("introClothing42"),
                       document.getElementById("introClothing43"),
					   document.getElementById("introClothing44"),
					   document.getElementById("introClothing45"),
                       document.getElementById("introClothing46")]];
					 
var maleClothing = [["player/male/shirt.jpg", "player/male/undershirt.jpg"],
					["player/male/pants.jpg", "player/male/boxers.jpg"],
					["player/male/shoes.jpg", "player/male/socks.jpg", "player/male/belt.jpg"],
					[]];
					
var maleClothingNames = [["shirt", "undershirt"],
						 ["pants", "boxers"],
						 ["shoes", "socks", "belt"],
						 []];
					 
var femaleClothing = [["player/female/tanktop.jpg", "player/female/bra.jpg"],
					  ["player/female/pants.jpg", "player/female/panties.jpg"],
					  ["player/female/boots.jpg", "player/female/socks.jpg", "player/female/belt.jpg"],
					  []];

var femaleClothingNames = [["tank top", "bra"],
						   ["pants", "panties"],
						   ["shoes", "socks", "belt"],
						   []];
					  
var selectedClothing = [[false, false, false, false, false, false],
						[false, false, false, false, false, false],
						[false, false, false, false, false, false],
						[false, false, false, false, false, false]];
						
var clothingLayer = [[0, 0, 0, 0, 0, 0],
					 [0, 0, 0, 0, 0, 0],
					 [0, 0, 0, 0, 0, 0],
					 [0, 0, 0, 0, 0, 0]];

var singleListings = document.getElementById('opponentListings');
var groupListings = document.getElementById('groupListings');
					 
/********************************/	
/*****  Clothing Functions  *****/
/********************************/	
				
function loadClothing () {
	var clothingSet = femaleClothing;
	
	if (playerGenders[0] == "male") {
		/* default clothing */
		selectedClothing = [[true, true, false, false, false, false],
							[true, true, false, false, false, false],
							[true, true, true, false, false, false],
							[false, false, false, false, false, false]];
		clothingLayer = [[12, 2, 0, 0, 0, 0],
						 [11, 1, 0, 0, 0, 0],
						 [72, 71, 51, 0, 0, 0],
						 [0, 0, 0, 0, 0, 0]];
							
		clothingSet = maleClothing;
	} else {
		/* default clothing */
		selectedClothing = [[true, true, false, false, false, false],
							[true, true, false, false, false, false],
							[true, true, true, false, false, false],
							[false, false, false, false, false, false]];
		clothingLayer = [[12, 2, 0, 0, 0, 0],
						 [11, 1, 0, 0, 0, 0],
						 [72, 71, 51, 0, 0, 0],
						 [0, 0, 0, 0, 0, 0]];
		
		clothingSet = femaleClothing;
	}
	
	/* set up the images */
	for (var i = 0; i < clothingImages.length; i++) {
		for (var j = 0; j < clothingImages[i].length; j++) {
			if (clothingSet[i].length > j) {
				clothingImages[i][j].src = clothingSet[i][j];

				if (selectedClothing[i][j]) {
					/* worn by default */
					clothingImages[i][j].style.opacity = 1;
				} else {
					clothingImages[i][j].style.opacity = 0.4;
				}
				clothingImages[i][j].disabled = false;
			} else {
				clothingImages[i][j].style.opacity = 0;
				clothingImages[i][j].disabled = true;
			}
		}
	}
}

/* the player clicked on a clothing button */
function takeClothing (x, y) {
	console.log(x+" "+y);
	if (selectedClothing[x][y]) {
		selectedClothing[x][y] = false;
		clothingImages[x][y].style.opacity = 0.4;
	} else {
		selectedClothing[x][y] = true;
		clothingImages[x][y].style.opacity = 1;
	} 
}
				
/********************************/	
/*****   Intro Functions    *****/
/********************************/	

/* loads the intro screen content */
function loadIntroScreen() {
	playerGenders[0] = "male";
	loadClothing();
}

/* the player clicked on a gender button */
function changeGender (gender) {
	switch (gender) {
		case 1: 
			playerGenders[0] = "male";
			genderButtons[0].style.opacity = 1;
			genderButtons[1].style.opacity = 0.4;
			break;
		case 2: 
			playerGenders[0] = "female";
			genderButtons[0].style.opacity = 0.4;
			genderButtons[1].style.opacity = 1;
			break;
		default: 
			playerGenders[0] = "female";
	}
	
	loadClothing();
}

/* the player advanced the state of an AI */
function advanceIntro () {
	if (nameField.value != "") {
		playerNames[0] = nameField.value;
	} else if (playerGenders[0] == "male") {
		playerNames[0] = "Mister";
	} else {
		playerNames[0] = "Missy";
	}
	playerLabels[0].innerHTML = playerNames[0];
	
	/* count clothing */
	var clothes = [0, 0, 0, 0, 0];
	for (var i = 0; i < clothingImages.length; i++) {
		for (var j = 0; j < clothingImages[i].length; j++) {
			if (selectedClothing[i][j]) {
				clothes[i+1]++;
				clothes[0]++;
			}
		}
	}
	
	if (clothes[0] < 2) {
		warningLabel.innerHTML = "You must wear at least 2 articles of clothing.";
		return;
	} else if (clothes[0] > 8) {
		warningLabel.innerHTML = "You can't wear more than 8 articles of clothing.";
		return;
	}
	
	wearClothing(clothes[0]);
	
	if (playerGenders[0] == "male") {
		playerGenderCell.src = "images/male.jpg";
	} else {
		playerGenderCell.src = "images/female.jpg";
	}
	
	$('#introScreen').hide();
	$('#gameScreen').show();
}

/* sort and wear clothing, called as the round starts */
function wearClothing (clothes) {
	var lowestValue = 0;
	var lowestIndex = [0, 0];
	
	playerStartingClothing[0] = clothes;
	
	for (var c = clothes-1; c >= 0; c--) {
		lowestValue = 0;
		lowestIndex = [0, 0];
		
		for (var i = 0; i < clothingLayer.length; i++) {
			for (var j = 0; j < clothingLayer[i].length; j++) {
				if (selectedClothing[i][j] && ((lowestValue == 0 && clothingLayer[i][j] != 0) || (clothingLayer[i][j] < lowestValue && clothingLayer[i][j] != 0))) {
					lowestValue = clothingLayer[i][j];
					lowestIndex = [i, j];
				}
			}
		}

		if (playerGenders[0] == "male") {
			playerClothing[0].push(maleClothingNames[lowestIndex[0]][lowestIndex[1]]);
			humanPlayerClothingCells[c].src = maleClothing[lowestIndex[0]][lowestIndex[1]];
		} else {
			playerClothing[0].push(femaleClothingNames[lowestIndex[0]][lowestIndex[1]]);
			humanPlayerClothingCells[c].src = femaleClothing[lowestIndex[0]][lowestIndex[1]];
		}
		console.log(playerClothing[0]);
		clothingLayer[lowestIndex[0]][lowestIndex[1]] = 0;
	}
	
	var clothingName = capitalizeFirstLetter(playerClothing[0][playerClothing[0].length - 1]);
	humanPlayerClothingCellsLabel.innerHTML = "Your Clothing</br>Bet: <b>"+clothingName+"</b>";
	
	for (var c = clothes; c < 8; c++) {
		humanPlayerClothingCells[c].style.opacity = 0;
	}
}

/********************************/	
/*****   Select Functions   *****/
/********************************/	

/* loads the select screen content */
function loadSelectScreen () {
	$.ajax({
        type: "GET",
		url: "opponents/opponent.xml",
		dataType: "text",
		success: function(xml) {
			var number = 0;
			
			$singles = $(xml).find('singles');
			singleListings.innerHTML += "<tr>";
			$singles.find('opponent').each(function () {
				console.log($(this).text());
				var folder = $(this).attr('folder');
				var headshot = $(this).attr('headshot');
				var picture = $(this).attr('picture');
				var gender = $(this).attr('gender');
				var name = $(this).text();
				
				var genderImage = "images/female.jpg";
				if (gender == "male") {
					genderImage = "images/male.jpg";
				}
				
				singleListings.innerHTML += 
					"<td><button class='opponentCard'>"+
						"<table class='opponentCardInner'>"+
						"<tr><td><img class='smallHeadshot' id='card"+number+"' src=opponents/"+(folder+headshot)+"/></td></tr>"+
						"<tr><td><p class='opponentNameLabel' id='card"+number+"name'>"+name+"</p></td></tr>";
						"</table>"+
					"</button></td>";
				
				number++;
			});
			singleListings.innerHTML += "</tr>";
			
			$groups = $(xml).find('groups');
			$groups.find('group').each(function () {
				console.log($(this));
				
				$(this).find('opponent').each(function () {
					console.log($(this).text());
				});
			});
		}
	});
}





















