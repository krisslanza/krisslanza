/************************************************************
 This file contains the variables and functions that form the
 the main game flow and player interaction element of the game.
 ************************************************************/

/********************************/		
/***** Game State Variables *****/
/********************************/

/* pseudo-constants */
var gameDelay = 500;

/* slight saved state */
var lowestPlayer = 0;

/********************************/		
/***** Interact UI Elements *****/
/********************************/

/* player advance buttons */
var advanceButtons = [null,
					  document.getElementById("advance-button-1"),
					  document.getElementById("advance-button-2"),
					  document.getElementById("advance-button-3"),
					  document.getElementById("advance-button-4")];

/* player card buttons */
var cardButtons = [document.getElementById("player-0-card-1"),
				   document.getElementById("player-0-card-2"),
				   document.getElementById("player-0-card-3"),
				   document.getElementById("player-0-card-4"),
				   document.getElementById("player-0-card-5")];

/* main button */
var mainButton = document.getElementById("main-button");



/********************************/		
/*****   Button Functions   *****/
/********************************/

/* enables and highlights a button */
function enableButton (button) {
	button.disabled = false;
	button.style.backgroundColor = enabledColour;
}

/* disables and dulls a button */
function disableButton (button) {
	button.disabled = true;
	button.style.backgroundColor = disabledColour;
}

/* enables all player action buttons */
function enablePlayerActions () {
	for (i = 0; i < 5; i++) {
		enableButton(cardButtons[i]);
	}
}

/* disables all player interaction buttons */
function disablePlayerActions () {
	for (i = 0; i < 5; i++) {
		disableButton(cardButtons[i]);
	}
}

/********************************/		
/***** Game Flow Functions  *****/
/********************************/

/* sets up the UI for the player's turn */
function playersTurn () {
	/* allow the player to swap their cards */
	mainButton.innerHTML = "Exchange";
	enableButton(mainButton);
}

/* determines what the AI's action will be */
function makeAIDecision () {	
	/* determine the AI's decision */
	determineAIAction(currentTurn);
	
	/* dull the cards they are trading in */
	for (var i = 0; i < tradeIns[currentTurn].length; i++) {
		if (tradeIns[currentTurn][i]) {
			dullCard(currentTurn, i);
		}
	}
	
	/* update speech */
	/* determine how many cards are being swapped */
	var swap = 0;
	for (var i = 0; i < CARDS_IN_HAND; i++) {
		if (tradeIns[currentTurn][i]) {
			swap++;
		}
	}
	
	/* this is hardcoded, but should be fine */
	dialogueCells[currentTurn].innerHTML = "I will exchange "+swap+" cards.";
	
	/* wait and implement AI action */
	window.setTimeout(implementAIAction, gameDelay);
}

/* implements the AI's chosen action */
function implementAIAction () {
	swapCards(currentTurn);
	
	/* refresh the hand */
	hideHand(currentTurn);
	
	/* update behaviour */
	determineHand(currentTurn);
	if (handStrengths[currentTurn] == HIGH_CARD) {
		updateBehaviour(currentTurn, "bad_hand", [], []);
	} else if (handStrengths[currentTurn] <= TWO_PAIR) {
		updateBehaviour(currentTurn, "okay_hand", [], []);
	} else {
		updateBehaviour(currentTurn, "good_hand", [], []);
	}
	
	/* wait and then advance the turn */
	window.setTimeout(advanceTurn, gameDelay);
}

/* advances the turn or ends the round */
function advanceTurn () {
	currentTurn++;
	if (currentTurn >= PLAYERS) {
		currentTurn = 0;
	}
	
	/* check to see if they are still in the game */
	if (!playerInGame[currentTurn]) {
		/* skip their turn */
		if (currentTurn == 0) {
			/* skip the exchange phase */
			mainButton.innerHTML = "Reveal";
			pressedMainButton();
		} else {
			/* update speech */
			updateBehaviour(currentTurn, "forfeiting", [], []);
			
			advanceTurn();
		}
		return;
	}
	
	/* highlight the player who's turn it is */
	for (var i = 0; i < PLAYERS; i++) {
		if (currentTurn == i) {
			nameLabels[i].style.backgroundColor = currentColour;
		} else {
			nameLabels[i].style.backgroundColor = clearColour;
		}
	}
	
	/* allow them to take their turn */
	if (currentTurn == 0) {
		playersTurn();
	} else {
		makeAIDecision();
	}
}

/********************************/		
/*****  Interact Functions  *****/
/********************************/

/* the player selected one of their cards */
function selectCard (card) {
	tradeIns[0][card] = !tradeIns[0][card];
	
	if (tradeIns[0][card]) {
		dullCard(0, card);
	} else {
		fillCard(0, card);
	}
}

/* the player advanced the state of an AI */
function advanceState (player) {
	playerState[player] += 1;
	updatePlayerVisual(player);
}

/* the player clicked the continue button */
function pressedMainButton () {
	var context = mainButton.innerHTML;
	
	if (context == "Deal") {
		/* disable button to prevent multi-calling */
		disableButton(mainButton);
		mainButton.innerHTML = "Exchange";
		
		/* starting a new round */
		console.log("-----------------------------------");
		console.log("|            New Round            |");
		console.log("-----------------------------------");
		
		/* set starting card state */
		for (var i = 0; i < PLAYERS; i ++) {
			if (playerInGame[i]) {
				dealHand(i);
			} else {
				collectPlayerHand(i);
			}
		}
			
		/* reset some information */
		for (var i = 0; i < PLAYERS; i++) {
			for (var j = 0; j < PLAYERS; j++) {
				tradeIns[i][j] = false;
			}
		}
		
		/* set visual state */
		showHand(0);
		for (var i = 1; i < PLAYERS; i++) {
			hideHand(i);
		}
		
		/* update behaviour */
		updateAllBehaviours(0, "start_of_round", [], []);
		
		/* allow each of the AIs to take their actions */
		if (playerInGame[HUMAN_PLAYER]) {
			enablePlayerActions();
		}
		currentTurn = 0;
		advanceTurn();
		
	} else if (context == "Exchange") {
		/* disable button to prevent multi-calling */
		disableButton(mainButton);
		disablePlayerActions();
		
		/* exchange player cards */
		swapCards(0);
		showHand(0);
		
		/* swap the player's cards */
		mainButton.innerHTML = "Reveal";
		enableButton(mainButton);
		
	} else if (context == "Reveal") {
		/* disable button to prevent multi-calling */
		disableButton(mainButton);
		mainButton.innerHTML = "Continue";
		
		/* revealing cards at the end of a round */
		for (var i = 0; i < PLAYERS; i++) {
			determineHand(i);
			showHand(i);
		}
		
		/* determine the lowest hand */
		lowestPlayer = determineLowestHand();
		console.log("Player "+lowestPlayer+" is the loser.");
		
		if (lowestPlayer == -1) {
			console.log("Absolute tie");
			/* reset the round */
			mainButton.innerHTML = "Deal";
			enableButton(mainButton);
		}
		
		/* highlight the loser */
		for (var i = 0; i < PLAYERS; i++) {
			if (lowestPlayer == i) {
				nameLabels[i].style.backgroundColor = loserColour;
			} else {
				nameLabels[i].style.backgroundColor = clearColour;
			}
		}
		
		/* update behaviour */
		prepareToStripPlayer(lowestPlayer);
		
		/* reset the round */
		mainButton.innerHTML = "Strip";
		enableButton(mainButton);
	} else if (context == "Strip") {
		/* continuing at the end of a round (stripping or status updates) */
		disableButton(mainButton);
		
		/* strip the player with the lowest hand */
		stripPlayer(lowestPlayer);
		
		/* check to see how many players are still in the game */
		var inGame = 0;
		var lastPlayer = 0;
		for (var i = 0; i < PLAYERS; i++) {
			if (playerInGame[i]) {
				inGame++;
				lastPlayer = i;
			}
		}
		
		/* if there is only one player left, end the game */
		if (inGame == 1) {
			gameBanner.innerHTML = "Game Over! "+playerNames[lastPlayer]+" won Strip Poker Night at the Inventory!";
			gameOver = true;
			mainButton.innerHTML = "Restart?";
			//mainButton.onclick = function () { location.reload(); };
			enableButton(mainButton);
		} else {
			mainButton.innerHTML = "Deal";
			enableButton(mainButton);
		}
	}
}