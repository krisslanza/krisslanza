/************************************************************
 This file contains the variables and functions that form the
 core of the game, such as game state and display.
 ************************************************************/
 
/********************************/	
/***** UI Element Variables *****/
/********************************/	

/* source folders */
var imageSource = "images/";
var playerSources = ["player/", "", "", "", ""];

/* colours */
var currentColour = "#85C5F5"; 	/* indicates current turn */
var clearColour = "#FFFFFF";	/* indicates neutral */
var loserColour = "#F58585";	/* indicates loser of a round */

var enabledColour = "#85C5F5";	/* indicates enabled button */
var disabledColour = "#A5A5A5";	/* indicates disabled button */

/* banner cell */
var gameBanner = document.getElementById("gameBanner");

/* player speech cells */
var playerSpeech = [null,
					document.getElementById("player2speech"),
					document.getElementById("player3speech"),
					document.getElementById("player4speech"),
					document.getElementById("player5speech")];
					
/* player image cells */
var playerImages = [null,
					document.getElementById("player2image"),
					document.getElementById("player3image"),
					document.getElementById("player4image"),
					document.getElementById("player5image")];

/* player names */
var playerNames = ["_undefined", "_undefined", "_undefined", "_undefined", "_undefined"];

/* player name labels */
var playerLabels = [document.getElementById("player1label"),
					document.getElementById("player2label"),
					document.getElementById("player3label"),
					document.getElementById("player4label"),
					document.getElementById("player5label")];	

/* player card cells */
var playerCardCells = [[document.getElementById("player1card1"), 
					    document.getElementById("player1card2"),
                        document.getElementById("player1card3"),
						document.getElementById("player1card4"),
                        document.getElementById("player1card5")],
					   [document.getElementById("player2card1"), 
					    document.getElementById("player2card2"),
                        document.getElementById("player2card3"),
						document.getElementById("player2card4"),
                        document.getElementById("player2card5")],
					   [document.getElementById("player3card1"), 
					    document.getElementById("player3card2"),
                        document.getElementById("player3card3"),
						document.getElementById("player3card4"),
                        document.getElementById("player3card5")],
					   [document.getElementById("player4card1"), 
					    document.getElementById("player4card2"),
                        document.getElementById("player4card3"),
						document.getElementById("player4card4"),
                        document.getElementById("player4card5")],
					   [document.getElementById("player5card1"), 
					    document.getElementById("player5card2"),
                        document.getElementById("player5card3"),
						document.getElementById("player5card4"),
                        document.getElementById("player5card5")]];					

/* player card buttons */
var playerButtons = [document.getElementById("player1card1"),
					 document.getElementById("player1card2"),
					 document.getElementById("player1card3"),
					 document.getElementById("player1card4"),
					 document.getElementById("player1card5")];
						
/* main button */
var continueButton = document.getElementById("continueButton");

/********************************/	
/*****   Poker Variables    *****/
/********************************/	

/* hand strengths */
var NONE			= 0;
var HIGH_CARD 		= 1;
var PAIR			= 2;
var TWO_PAIR		= 3;
var THREE_OF_A_KIND	= 4;
var STRAIGHT		= 5;
var FLUSH			= 6;
var FULL_HOUSE		= 7;
var FOUR_OF_A_KIND	= 8;
var STRAIGHT_FLUSH	= 9;
var ROYAL_FLUSH 	= 10;

/********************************/	
/***** Game State Variables *****/
/********************************/

/* pseudo-constants */
var players = 5;
var cardsPerHand = 5;

/* card decks */
var inDeck = [];	/* cards left in the deck */
var outDeck = [];	/* cards waiting to be shuffled into the deck */

/* player hands */
var playerCards = [["unknown", "unknown", "unknown", "unknown", "unknown"], 
			       ["unknown", "unknown", "unknown", "unknown", "unknown"],
                   ["unknown", "unknown", "unknown", "unknown", "unknown"],
                   ["unknown", "unknown", "unknown", "unknown", "unknown"],
                   ["unknown", "unknown", "unknown", "unknown", "unknown"]];
var playerHandStrengths = [NONE, NONE, NONE, NONE, NONE];
var playerHandValues = [0, 0, 0, 0, 0];
var playerTradeIns = [[false, false, false, false, false], 
			          [false, false, false, false, false],
			          [false, false, false, false, false],
			          [false, false, false, false, false],
			          [false, false, false, false, false]];

/* game state */
var currentTurn = 0;
var playerStartingClothing = [8, 9, 9, 9, 9];
var playerClothing = [1, 9, 9, 9, 9];
var playerInGame = [true, true, true, true, true];
var gameOver = false;


/********************************/		
/*****   Setup Functions    *****/
/********************************/

/* initial setup of the game */
function initialSetup () {
	/* hardcoded opponents, for now */
	playerSources = ["player/male/", "opponents/elizabeth/", "opponents/lilith/", "opponents/zoey/", "opponents/laura/"];
	
	/* load opponent behaviours */
	loadBehaviours();
	for (var i = 1; i < players; i++) {
		loadBasicSettings(i);
	}
	
	/* set up the game */
	composeDeck();
	
	/* WAIT FOR CONTENT TO LOAD */
	
	/* set up the visuals */
	continueButton.innerHTML = "Deal";
	
	/* setup initial button states */
	enableButton(continueButton);
	
	//displayCards();
}

/* does all the calling for a new round */
function startNewRound () {
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
		dullPlayerHand(i);
	}
}

/* does all the calling for the end of a round */
function endRound () {
	/* revealing cards at the end of a round */
	for (var i = 0; i < players; i++) {
		determineHand(i);
		showPlayerHand(i);
	}
	
	/* determine the lowest hand */
	var lowestPlayer = determineLowestHand();
	console.log("Player "+lowestPlayer+" is the loser.");
	
	/* highlight the loser */
	for (var i = 0; i < players; i++) {
		if (lowestPlayer == i) {
			playerLabels[i].style.backgroundColor = loserColour;
		} else {
			playerLabels[i].style.backgroundColor = clearColour;
		}
	}
	
	/* allow for a pause before stripping any player, continue button */
	
	
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
	}
}

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
		enableButton(playerButtons[i]);
	}
}

/* disables all player interaction buttons */
function disablePlayerActions () {
	for (i = 0; i < 5; i++) {
		disableButton(playerButtons[i]);
	}
}

/********************************/		
/*****    Card Functions    *****/
/********************************/

/* composes a brand new deck */
function composeDeck () {
	var suit = "";
	
	for (var i = 0; i < 4; i++) {
		switch (i) {
			case 0: suit = "spade"; break;
			case 1: suit = "heart"; break;
			case 2: suit = "diamo"; break;
			case 3: suit = "clubs"; break;
		}
		
		for (j = 1; j < 14; j++) {
			inDeck.push(suit + j);
		}
	}
}

/* returns a random number in a range */
function getRandomNumber (min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

/* returns the numeric value of the card */
function getCardValue (card) {
	return Number(card.substring(5));
}

/* returns the string suit of the card */
function getCardSuit (card) {
	return card.substring(0, 5);
}

/* returns the numeric suit of the card */
function getCardSuitValue (card) {
	var suit = card.substring(0, 5);
	
	if (suit == "spade") {
		return 0;
	} else if (suit == "heart") {
		return 1;
	} else if (suit == "diamo") {
		return 2;
	} else {
		return 3;
	}
}

/* returns a card to full opacity */
function fillCard (player, card) {
	playerCardCells[player][card].style.opacity = "1";
}

/* reduces the opacity of a card */
function dullCard (player, card) {
	playerCardCells[player][card].style.opacity = "0.4";
}

/* shows and fills a player's hand */
function showPlayerHand (player) {
	for (var i = 0; i < cardsPerHand; i++) {
		playerCardCells[player][i].src = imageSource + playerCards[player][i] + ".jpg";
		fillCard(player, i);
	}
}

/* shows but dulls a player's hand, for cheating purposes */
function dullPlayerHand (player) {
	for (var i = 0; i < cardsPerHand; i++) {
		playerCardCells[player][i].src = imageSource + playerCards[player][i] + ".jpg";
		dullCard(player, i);
	}
}

/* hides a player's hand */
function hidePlayerHand (player) {
	for (var i = 0; i < cardsPerHand; i++) {
		playerCardCells[player][i].src = imageSource + "unknown.jpg";
	}
}

/* collects a player's hand into the outDeck */
function collectPlayerHand (player) {
	/* collect cards from the hand into the outDeck */
	for (var i = 0; i < cardsPerHand; i++) {
		if (playerCards[player][i] != "unknown") {
			outDeck.push(playerCards[player][i]);
			playerCards[player][i] = "unknown";
			playerCardCells[player][i].src = imageSource + "unknown.jpg";
		}
	}
}

/* shuffles the deck */
function shuffleDeck () {
	/* shuffle the cards from the outDeck into the inDeck */
	for (var i = 0; i < outDeck.length; i++) {
		inDeck.push(outDeck[i]);
	}
	
	/* empty the outDeck */
	outDeck = [];
}

/* deals out new cards to the selected player */
function dealNewHand (player) {
	/* collect their old hand */
	collectPlayerHand (player);
	
	/* first make sure the deck has enough cards */
	if (inDeck.length < cardsPerHand) {
		shuffleDeck();
	}
	
	/* deal the new cards */
	var drawnCard;
	for (var i = 0; i < cardsPerHand; i++) {
		drawnCard = getRandomNumber(0, inDeck.length);
		playerCards[player][i] = inDeck[drawnCard];
		inDeck.splice(drawnCard, 1);
	}
}

/* swaps the chosen cards for the chosen player */
function swapCards (player) {
	/* determine how many cards are being swapped */
	var swap = 0;
	for (var i = 0; i < cardsPerHand; i++) {
		if (playerTradeIns[player][i]) {
			swap++;
		}
	}
	
	/* make sure the deck has enough cards */
	if (inDeck.length < swap) {
		shuffleDeck();
	}
	
	/* collect their old cards */
	for (var i = 0; i < cardsPerHand; i++) {
		if (playerTradeIns[player][i] && playerCards[player][i] != "unknown") {
			outDeck.push(playerCards[player][i]);
			playerCards[player][i] = "unknown";
			playerCardCells[player][i].src = imageSource + "unknown.jpg";
		}
	}
	
	/* take the new cards */
	var drawnCard;
	for (var i = 0; i < cardsPerHand; i++) {
		if (playerTradeIns[player][i]) {
			drawnCard = getRandomNumber(0, inDeck.length);
			playerCards[player][i] = inDeck[drawnCard];
			inDeck.splice(drawnCard, 1);
		}
	}
}

/********************************/		
/*****   Poker Functions    *****/
/********************************/

/* maps the hand strength to a string */
function handStrengthToString (number) {
	switch (number) {
		case NONE: 				return "Nothing";
		case HIGH_CARD: 		return "High Card";
		case PAIR: 				return "One Pair";
		case TWO_PAIR: 			return "Two Pair";
		case THREE_OF_A_KIND: 	return "Three of a Kind";
		case STRAIGHT: 			return "Straight";
		case FLUSH: 			return "Flush";
		case FULL_HOUSE: 		return "Full House";
		case FOUR_OF_A_KIND:	return "Four of a Kind";
		case STRAIGHT_FLUSH: 	return "Straight Flush";
		case ROYAL_FLUSH: 		return "Royal Flush";
	}
}

/* returns the player number with the lowest hand */
function determineLowestHand () {
	var lowestStrength = 11;
	var lowestPlayers = [];
	
	for (i = 0; i < players; i++) {
		if (playerHandStrengths[i] < lowestStrength) {
			lowestStrength = playerHandStrengths[i];
			lowestPlayers = [i];
		} else if (playerHandStrengths[i] == lowestStrength) {
			lowestPlayers.push(i);
		}
	}
	
	if (lowestPlayers.length == 1) {
		return lowestPlayers[0];
	} else {
		/* need to break a tie */
		if (lowestStrength > TWO_PAIR) {
			/* anything higher than two pair only has one tie breaker */
			
		} else {
			/* two pair, pair, and high card have multiple tie breakers */
			var lowestValue = 15;
			var currentTieBreaker = 0;
			var tiedPlayers = lowestPlayers;
			var failSafe = 0;
			
			while (lowestPlayers.length > 1 && currentTieBreaker < playerHandValues[lowestPlayers[0]].length && failSafe <= cardsPerHand) {
				lowestValue = 15;
				tiedPlayers = lowestPlayers;
				console.log("Players Tied: "+tiedPlayers+" failSafe: "+failSafe);
				
				for (i = 0; i < tiedPlayers.length; i++) {
					if (playerHandValues[tiedPlayers[i]][currentTieBreaker] < lowestValue) {
						lowestValue = playerHandValues[tiedPlayers[i]][currentTieBreaker];
						console.log("Player "+tiedPlayers[i]+" is the new lowest with: "+playerHandValues[tiedPlayers[i]][currentTieBreaker]);
						lowestPlayers = [tiedPlayers[i]];
					} else if (playerHandValues[tiedPlayers[i]][currentTieBreaker] == lowestValue) {
						lowestPlayers.push(tiedPlayers[i]);
						console.log("Player "+tiedPlayers[i]+" is tied with: "+playerHandValues[tiedPlayers[i]][currentTieBreaker]);
					}
				}
				
				currentTieBreaker++;
				failSafe++;
			}
			
			if (lowestPlayers.length == 1) {
				return lowestPlayers[0];
			} else {
				/* unresolvable tie */
				return -1;
			}
		}
	}
}

/* determine value of a player's hand */
function determineHand (player) {
	/* start by getting a shorthand variable and resetting */
	var hand = playerCards[player];
	playerHandStrengths[player] = NONE;
	playerHandValues[player] = 0;
	
	/* look for each strength, in composition */
	var have_pair = [-1, -1];
	var have_three_kind = -1;
	var have_straight = -1;
	var have_flush = -1;
	
	/* start by collecting the ranks and suits of the cards */
	var cardRanks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var cardSuits = [0, 0, 0, 0];
	
	for (var i = 0; i < hand.length; i++) {
		cardRanks[getCardValue(hand[i]) - 1]++;
		if (getCardValue(hand[i]) == 1) {
			cardRanks[13]++;
		}
		cardSuits[getCardSuitValue(hand[i])]++;
	}
	
	/* look for four of a kind, three of a kind, and pairs */
	for (var i = 0; i < cardRanks.length - 1; i++) {
		if (cardRanks[i] == 4) {
			playerHandStrengths[player] = FOUR_OF_A_KIND;
			playerHandValues[player] = i+1;
			break;
		} else if (cardRanks[i] == 3) {
			have_three_kind = i+1;
		} else if (cardRanks[i] == 2) {
			if (have_pair[0] == -1) {
				have_pair[0] = i+1;
			} else {
				have_pair[1] = i+1;
			}
		}
	}
	
	/* determine full house, three of a kind, two pair, and pair */
	if (playerHandStrengths[player] == NONE) {
		if (have_three_kind >= 0 && have_pair[0] >= 0) {
			playerHandStrengths[player] = FULL_HOUSE;
			playerHandValues[player] = have_three_kind;
		} else if (have_three_kind >= 0) {
			playerHandStrengths[player] = THREE_OF_A_KIND;
			playerHandValues[player] = have_three_kind;
		} else if (have_pair[0] >= 0 && have_pair[1] >= 0) {
			playerHandStrengths[player] = TWO_PAIR;
			
			var leftover = 0;
			for (var i = 1; i < cardRanks.length; i++) {
				if (cardRanks[i] == 1) {
					leftover = i+1;
				}
			}
			
			if (have_pair[0] == 1) {
				playerHandValues[player] = [14, have_pair[1], leftover];
			} else {
				playerHandValues[player] = [have_pair[0], have_pair[1], leftover];
			}
		} else if (have_pair[0] >= 0) {
			playerHandStrengths[player] = PAIR;
			if (have_pair[0] == 1) {
				playerHandValues[player] = [14];
			} else {
				playerHandValues[player] = [have_pair[0]];
			}
			
			for (var i = cardRanks.length-1; i > 0; i--) {
				if (cardRanks[i] == 1) {
					playerHandValues[player].push(i+1);
				}
			}
		}
	}
	
	/* look for straights and flushes */
	var sequence = 0;
	
	if (playerHandStrengths[player] == NONE) {
		/* first, straights */
		for (var i = 0; i < cardRanks.length; i++) {
			if (cardRanks[i] == 1) {
				sequence++;
				if (sequence == hand.length) {
					/* this is a straight */
					have_straight = i+1;
					break;
				}
			} else if (cardRanks[i] > 1) {
				/* can't have a straight */
				break;
			} else if (sequence > 0) {
				/* can't have a straight */
				break;
			}
		}
		
		/* second, flushes */
		for (var i = 0; i < cardSuits.length; i++) {
			if (cardSuits[i] == hand.length) {
				/* this is a flush */
				have_flush = 1;
				break;
			} else if (cardSuits[i] > 0) {
				/* can't have a flush */
				break;
			}
		}
		
		/* determine royal flush, straight flush, flush, straight, and high card */
		if (have_flush >= 0 && have_straight == 14) {
			playerHandStrengths[player] = ROYAL_FLUSH;
			playerHandValues[player] = have_straight;
		} else if (have_flush >= 0 && have_straight >= 0) {
			playerHandStrengths[player] = STRAIGHT_FLUSH;
			playerHandValues[player] = have_straight;
		} else if (have_straight >= 0) {
			playerHandStrengths[player] = STRAIGHT;
			playerHandValues[player] = have_straight;
		} else if (have_flush >= 0) {
			playerHandStrengths[player] = FLUSH;
			playerHandValues[player] = [];
			
			for (var i = cardRanks.length-1; i > 0; i--) {
				if (cardRanks[i] == 1) {
					playerHandValues[player].push(i+1);
				}
			}
		} else {
			playerHandStrengths[player] = HIGH_CARD;
			playerHandValues[player] = [];
			
			for (var i = cardRanks.length-1; i > 0; i--) {
				if (cardRanks[i] == 1) {
					playerHandValues[player].push(i+1);
				}
			}
		}
	}

	/* stats for the log */
	console.log("Player "+player+" Hand Analysis");
	console.log("Rank: "+cardRanks);
	console.log("Suit: "+cardSuits);
	console.log("Player has " +handStrengthToString(playerHandStrengths[player])+" of value "+playerHandValues[player]);
	console.log();
}

/********************************/		
/*****   Strip Functions    *****/
/********************************/

/* removes an article of clothing from the selected player */
function stripPlayer(player) {
	console.log("Player "+player+" is being stripped.");
	
	playerClothing[player]--;
	if (playerClothing[player] == 0) {
		playerInGame[player] = false;
	}
	
	if (player == 0) {
		/* human player */
	} else {
		/* AI player */
		/* ALL OF THIS IS HARDCODED AND IT SHOULDNT BE */
		var stage = playerStartingClothing[player] - playerClothing[player];
		playerImages[player].src = playerSources[player] + "stage" + stage + "calm.jpg";
		
		if (playerClothing[player] > 1) {
			playerSpeech[player].innerHTML = "There goes another article of clothing..."; //HARDCODED
		} else if (playerClothing[player] == 1) {
			playerSpeech[player].innerHTML = "I guess I'm naked..."; //HARDCODED
		} else {
			playerSpeech[player].innerHTML = "Like this?"; //HARDCODED
		}
	}
	
	console.log("Player "+player+" has been stripped.");
}











