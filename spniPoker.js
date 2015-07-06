/************************************************************
 This file contains the variables and functions that relate to
 the game of poker.
 ************************************************************/

/********************************/		
/*****  Poker UI Elements   *****/
/********************************/
 
/* player card cells */
var cardCells = [[document.getElementById("player-0-card-1"), 
				  document.getElementById("player-0-card-2"),
				  document.getElementById("player-0-card-3"),
				  document.getElementById("player-0-card-4"),
				  document.getElementById("player-0-card-5")],
			     [document.getElementById("player-1-card-1"), 
				  document.getElementById("player-1-card-2"),
				  document.getElementById("player-1-card-3"),
				  document.getElementById("player-1-card-4"),
			  	  document.getElementById("player-1-card-5")],
			     [document.getElementById("player-2-card-1"), 
				  document.getElementById("player-2-card-2"),
			  	  document.getElementById("player-2-card-3"),
				  document.getElementById("player-2-card-4"),
				  document.getElementById("player-2-card-5")],
			     [document.getElementById("player-3-card-1"), 
				  document.getElementById("player-3-card-2"),
				  document.getElementById("player-3-card-3"),
				  document.getElementById("player-3-card-4"),
				  document.getElementById("player-3-card-5")],
			     [document.getElementById("player-4-card-1"), 
				  document.getElementById("player-4-card-2"),
				  document.getElementById("player-4-card-3"),
				  document.getElementById("player-4-card-4"),
				  document.getElementById("player-4-card-5")]];	
 
/********************************/	
/*****  Constant Variables  *****/
/********************************/	

var ANIMATE_TIME = 1000;
var CARDS_IN_HAND = 5;

/* suit names */
var SPADES   = "spade";
var HEARTS   = "heart";
var CLUBS    = "clubs";
var DIAMONDS = "diamo";

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
/*****   Poker Variables    *****/
/********************************/

/* card decks */
var inDeck = [];	/* cards left in the deck */
var outDeck = [];	/* cards waiting to be shuffled into the deck */

/* animation variables */
var animationCounter = 0;

/********************************/		
/*****    Card Functions    *****/
/********************************/

/* composes a brand new deck */
function composeDeck () {
	var suit = "";
	
	for (var i = 0; i < 4; i++) {
		switch (i) {
			case 0: suit = SPADES;   break;
			case 1: suit = HEARTS;   break;
			case 2: suit = CLUBS;    break;
			case 3: suit = DIAMONDS; break;
		}
		
		for (j = 1; j < 14; j++) {
			inDeck.push(suit + j);
		}
	}
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
	
	if (suit == SPADES) {
		return 0;
	} else if (suit == HEARTS) {
		return 1;
	} else if (suit == CLUBS) {
		return 2;
	} else if (suit == DIAMONDS) {
		return 3;
	} else {
		return 4;
	}
}

/********************************/		
/*****  Card UI Functions   *****/
/********************************/

/* returns a card to full opacity */
function fillCard (player, card) {
	cardCells[player][card].style.opacity = "1";
}

/* reduces the opacity of a card */
function dullCard (player, card) {
	cardCells[player][card].style.opacity = "0.4";
}

/* shows and fills a player's hand */
function showHand (player) {
	for (var i = 0; i < CARDS_IN_HAND; i++) {
		cardCells[player][i].src = imageSource + cards[player][i] + ".jpg";
		fillCard(player, i);
	}
}

/* shows but dulls a player's hand, for AI testing purposes */
function dullHand (player) {
	for (var i = 0; i < CARDS_IN_HAND; i++) {
		cardCells[player][i].src = imageSource + cards[player][i] + ".jpg";
		dullCard(player, i);
	}
}

/* hides a player's hand */
function hideHand (player) {
	for (var i = 0; i < CARDS_IN_HAND; i++) {
		cardCells[player][i].src = imageSource + "unknown.jpg";
		fillCard(player, i);
	}
}

/* collects a player's hand into the outDeck */
function collectPlayerHand (player) {
	/* collect cards from the hand into the outDeck */
	for (var i = 0; i < CARDS_IN_HAND; i++) {
		if (cards[player][i] != "unknown" && cards[player][i] != "blankcard") {
			outDeck.push(cards[player][i]);
			cards[player][i] = "blankcard";
			cards[player][i].src = imageSource + "blankcard.jpg";
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
function dealHand (player) {
	/* collect their old hand */
	collectPlayerHand (player);
	
	/* first make sure the deck has enough cards */
	if (inDeck.length < CARDS_IN_HAND) {
		shuffleDeck();
	}
	
	/* deal the new cards */
	var drawnCard;
	for (var i = 0; i < CARDS_IN_HAND; i++) {
		drawnCard = getRandomNumber(0, inDeck.length);
		cards[player][i].src = imageSource + "unknown.jpg";
		cards[player][i] = inDeck[drawnCard];
		inDeck.splice(drawnCard, 1);
	}
}

/* swaps the chosen cards for the chosen player */
function swapCards (player) {
	/* determine how many cards are being swapped */
	var swap = 0;
	for (var i = 0; i < CARDS_IN_HAND; i++) {
		if (tradeIns[player][i]) {
			swap++;
		}
	}
	
	/* make sure the deck has enough cards */
	if (inDeck.length < swap) {
		shuffleDeck();
	}
	
	/* collect their old cards */
	for (var i = 0; i < CARDS_IN_HAND; i++) {
		if (tradeIns[player][i] && cards[player][i] != "unknown") {
			outDeck.push(cards[player][i]);
			cards[player][i] = "unknown";
			cardCells[player][i].src = imageSource + "unknown.jpg";
		}
	}
	
	/* take the new cards */
	var drawnCard;
	for (var i = 0; i < CARDS_IN_HAND; i++) {
		if (tradeIns[player][i]) {
			drawnCard = getRandomNumber(0, inDeck.length);
			cards[player][i] = inDeck[drawnCard];
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
	
	for (i = 0; i < PLAYERS; i++) {
		if (playerInGame[i]) {
			if (handStrengths[i] < lowestStrength) {
				lowestStrength = handStrengths[i];
				lowestPlayers = [i];
			} else if (handStrengths[i] == lowestStrength) {
				lowestPlayers.push(i);
			}
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
			
			while (lowestPlayers.length > 1 && currentTieBreaker < handValues[lowestPlayers[0]].length && failSafe <= CARDS_IN_HAND) {
				lowestValue = 15;
				tiedPlayers = lowestPlayers;
				console.log("Players Tied: "+tiedPlayers+" failSafe: "+failSafe);
				
				for (i = 0; i < tiedPlayers.length; i++) {
					if (handValues[tiedPlayers[i]][currentTieBreaker] < lowestValue) {
						lowestValue = handValues[tiedPlayers[i]][currentTieBreaker];
						console.log("Player "+tiedPlayers[i]+" is the new lowest with: "+handValues[tiedPlayers[i]][currentTieBreaker]);
						lowestPlayers = [tiedPlayers[i]];
					} else if (handValues[tiedPlayers[i]][currentTieBreaker] == lowestValue) {
						lowestPlayers.push(tiedPlayers[i]);
						console.log("Player "+tiedPlayers[i]+" is tied with: "+handValues[tiedPlayers[i]][currentTieBreaker]);
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
	var hand = cards[player];
	handStrengths[player] = NONE;
	handValues[player] = 0;
	
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
			handStrengths[player] = FOUR_OF_A_KIND;
			handValues[player] = i+1;
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
	if (handStrengths[player] == NONE) {
		if (have_three_kind >= 0 && have_pair[0] >= 0) {
			handStrengths[player] = FULL_HOUSE;
			handValues[player] = have_three_kind;
		} else if (have_three_kind >= 0) {
			handStrengths[player] = THREE_OF_A_KIND;
			handValues[player] = have_three_kind;
		} else if (have_pair[0] >= 0 && have_pair[1] >= 0) {
			handStrengths[player] = TWO_PAIR;
			
			var leftover = 0;
			for (var i = 1; i < cardRanks.length; i++) {
				if (cardRanks[i] == 1) {
					leftover = i+1;
				}
			}
			
			if (have_pair[0] == 1) {
				handValues[player] = [14, have_pair[1], leftover];
			} else {
				handValues[player] = [have_pair[0], have_pair[1], leftover];
			}
		} else if (have_pair[0] >= 0) {
			handStrengths[player] = PAIR;
			if (have_pair[0] == 1) {
				handValues[player] = [14];
			} else {
				handValues[player] = [have_pair[0]];
			}
			
			for (var i = cardRanks.length-1; i > 0; i--) {
				if (cardRanks[i] == 1) {
					handValues[player].push(i+1);
				}
			}
		}
	}
	
	/* look for straights and flushes */
	var sequence = 0;
	
	if (handStrengths[player] == NONE) {
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
			handStrengths[player] = ROYAL_FLUSH;
			handValues[player] = have_straight;
		} else if (have_flush >= 0 && have_straight >= 0) {
			handStrengths[player] = STRAIGHT_FLUSH;
			handValues[player] = have_straight;
		} else if (have_straight >= 0) {
			handStrengths[player] = STRAIGHT;
			handValues[player] = have_straight;
		} else if (have_flush >= 0) {
			handStrengths[player] = FLUSH;
			handValues[player] = [];
			
			for (var i = cardRanks.length-1; i > 0; i--) {
				if (cardRanks[i] == 1) {
					handValues[player].push(i+1);
				}
			}
		} else {
			handStrengths[player] = HIGH_CARD;
			handValues[player] = [];
			
			for (var i = cardRanks.length-1; i > 0; i--) {
				if (cardRanks[i] == 1) {
					handValues[player].push(i+1);
				}
			}
		}
	}

	/* stats for the log */
	console.log("Player "+player+" Hand Analysis");
	console.log("Rank: "+cardRanks);
	console.log("Suit: "+cardSuits);
	console.log("Player has " +handStrengthToString(handStrengths[player])+" of value "+handValues[player]);
	console.log();
}





