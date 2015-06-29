/************************************************************
 This file contains the variables and functions that form the
 the main game flow and player interaction element of the game.
 ************************************************************/

/********************************/		
/***** Game State Variables *****/
/********************************/

/* pseudo-constants */
var gameDelay = 1000;

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
	playerSpeech[currentTurn].innerHTML = "I will exchange "+swap+" cards."; //HARDCODED
	
	/* wait and implement AI action */
	window.setTimeout(implementAIAction, gameDelay);
}

/* implements the AI's chosen action */
function implementAIAction () {
	swapCards(currentTurn);
	//dullPlayerHand(currentTurn);
	
	/* refresh the hand */
	hidePlayerHand(currentTurn);
	
	/* update speech */
	
	
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
			playerSpeech[currentTurn].innerHTML = "How long do I have to keep going?"; //HARDCODED
			
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
		startNewRound();
		
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
		
		endRound();
		
		/* reset the round */
		if (!gameOver) {
			continueButton.innerHTML = "Deal";
			enableButton(continueButton);
		} else {
			continueButton.innerHTML = "Play Again?";
			enableButton(continueButton);	
		}
	} else if (context == "Continue") {
		/* continuing at the end of a round (stripping or status updates) */
		
	}
}





