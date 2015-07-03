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
/***** Game Flow Functions  *****/
/********************************/

/* sets up the UI for the player's turn */
function playersTurn () {
	/* allow the player to swap their cards */
	continueButton.innerHTML = "Exchange";
	enableButton(continueButton);
}

/* determines what the AI's action will be */
function makeAIDecision () {	
	/* determine the AI's decision */
	determineAIAction(currentTurn);
	
	/* dull the cards they are trading in */
	for (var i = 0; i < playerTradeIns[currentTurn].length; i++) {
		if (playerTradeIns[currentTurn][i]) {
			dullCard(currentTurn, i);
		}
	}
	
	/* update speech */
	/* determine how many cards are being swapped */
	var swap = 0;
	for (var i = 0; i < cardsPerHand; i++) {
		if (playerTradeIns[currentTurn][i]) {
			swap++;
		}
	}
	
	/* this is hardcoded, but should be fine */
	playerDialogueCells[currentTurn].innerHTML = "I will exchange "+swap+" cards.";
	
	/* wait and implement AI action */
	window.setTimeout(implementAIAction, gameDelay);
}

/* implements the AI's chosen action */
function implementAIAction () {
	swapCards(currentTurn);
	
	/* refresh the hand */
	hidePlayerHand(currentTurn);
	
	/* update behaviour */
	determineHand(currentTurn);
	if (playerHandStrengths[currentTurn] == HIGH_CARD) {
		updateBehaviour(currentTurn, "bad_hand", [], []);
	} else if (playerHandStrengths[currentTurn] <= TWO_PAIR) {
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
	if (currentTurn >= players) {
		currentTurn = 0;
	}
	
	/* check to see if they are still in the game */
	if (!playerInGame[currentTurn]) {
		/* skip their turn */
		if (currentTurn == 0) {
			/* skip the exchange phase */
			continueButton.innerHTML = "Reveal";
			pressedContinue();
		} else {
			/* update speech */
			playerDialogueCells[currentTurn].innerHTML = "How long do I have to keep going?"; //HARDCODED
			
			advanceTurn();
		}
		return;
	}
	
	/* highlight the player who's turn it is */
	for (var i = 0; i < players; i++) {
		if (currentTurn == i) {
			playerLabels[i].style.backgroundColor = currentColour;
		} else {
			playerLabels[i].style.backgroundColor = clearColour;
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
	playerTradeIns[0][card] = !playerTradeIns[0][card];
	
	if (playerTradeIns[0][card]) {
		dullCard(0, card);
	} else {
		fillCard(0, card);
	}
}

/* the player clicked the continue button */
function pressedContinue () {
	var context = continueButton.innerHTML;
	
	if (context == "Deal") {
		/* disable button to prevent multi-calling */
		disableButton(continueButton);
		continueButton.innerHTML = "Exchange";
		
		/* starting a new round */
		console.log("-----------------------------------");
		console.log("|            New Round            |");
		console.log("-----------------------------------");
		
		/* set starting card state */
		for (var i = 0; i < players; i ++) {
			if (playerInGame[i]) {
				dealNewHand(i);
			} else {
				collectPlayerHand(i);
			}
		}
			
		/* reset some information */
		for (var i = 0; i < players; i++) {
			for (var j = 0; j < players; j++) {
				playerTradeIns[i][j] = false;
			}
		}
		
		/* set visual state */
		showPlayerHand(0);
		for (var i = 1; i < players; i++) {
			hidePlayerHand(i);
		}
		
		/* update behaviour */
		updateAllBehaviours(0, "start_of_round", [], []);
		
		/* allow each of the AIs to take their actions */
		enablePlayerActions();
		currentTurn = 0;
		advanceTurn();
		
	} else if (context == "Exchange") {
		/* disable button to prevent multi-calling */
		disableButton(continueButton);
		disablePlayerActions();
		
		/* exchange player cards */
		swapCards(0);
		showPlayerHand(0);
		
		/* swap the player's cards */
		continueButton.innerHTML = "Reveal";
		enableButton(continueButton);
		
	} else if (context == "Reveal") {
		/* disable button to prevent multi-calling */
		disableButton(continueButton);
		continueButton.innerHTML = "Continue";
		
		/* revealing cards at the end of a round */
		for (var i = 0; i < players; i++) {
			determineHand(i);
			showPlayerHand(i);
		}
		
		/* determine the lowest hand */
		lowestPlayer = determineLowestHand();
		console.log("Player "+lowestPlayer+" is the loser.");
		
		if (lowestPlayer == -1) {
			console.log("Absolute tie");
			/* reset the round */
			continueButton.innerHTML = "Deal";
			enableButton(continueButton);
		}
		
		/* highlight the loser */
		for (var i = 0; i < players; i++) {
			if (lowestPlayer == i) {
				playerLabels[i].style.backgroundColor = loserColour;
			} else {
				playerLabels[i].style.backgroundColor = clearColour;
			}
		}
		
		/* update behaviour */
		if (playerClothing[lowestPlayer].length > 0) {
			/* the player is stripping */
			var removedClothing = playerClothing[lowestPlayer][playerClothing[lowestPlayer].length - 1];
			var capRemovedClothing = capitalizeFirstLetter(removedClothing);
			
			if (lowestPlayer != 0) {
				if (playerGenders[lowestPlayer] == "male") {
					updateAllBehaviours(lowestPlayer, "male_ai_will_strip", ["~name~", "~clothing~", "~Clothing~"], [playerNames[lowestPlayer], removedClothing, capRemovedClothing]);
				} else if (playerGenders[lowestPlayer] == "female") {
					updateAllBehaviours(lowestPlayer, "female_ai_will_strip", ["~name~", "~clothing~", "~Clothing~"], [playerNames[lowestPlayer], removedClothing, capRemovedClothing]);
				}
				updateBehaviour(lowestPlayer, "lost", ["~clothing~", "~Clothing~"], [removedClothing, capRemovedClothing]);
			} else {
				if (playerGenders[lowestPlayer] == "male") {
					updateAllBehaviours(lowestPlayer, "male_human_will_strip", ["~name~", "~clothing~", "~Clothing~"], [playerNames[lowestPlayer], removedClothing, capRemovedClothing]);
				} else if (playerGenders[lowestPlayer] == "female") {
					updateAllBehaviours(lowestPlayer, "female_human_will_strip", ["~name~", "~clothing~", "~Clothing~"], [playerNames[lowestPlayer], removedClothing, capRemovedClothing]);
				}
			}
		} else {
			/* the player is forfeiting */
		}
		
		/* reset the round */
		continueButton.innerHTML = "Strip";
		enableButton(continueButton);
	} else if (context == "Strip") {
		/* continuing at the end of a round (stripping or status updates) */
		disableButton(continueButton);
		
		/* strip the player with the lowest hand */
		stripPlayer(lowestPlayer);
		
		/* check to see how many players are still in the game */
		var inGame = 0;
		var lastPlayer = 0;
		for (var i = 0; i < players; i++) {
			if (playerInGame[i]) {
				inGame++;
				lastPlayer = i;
			}
		}
		
		/* if there is only one player left, end the game */
		if (inGame == 1) {
			gameBanner.innerHTML = "Game Over! "+playerNames[lastPlayer]+" won Strip Poker Night at the Inventory!";
			gameOver = true;
			continueButton.innerHTML = "Play Again?";
			enableButton(continueButton);
		} else {
			continueButton.innerHTML = "Deal";
			enableButton(continueButton);
		}
	}
}





