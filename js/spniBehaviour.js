/********************************************************************************
 This file contains the variables and functions that from the behaviours of the
 AI opponents. All the parsing of their files, as well as the structures to store
 that information are stored in this file.
 ********************************************************************************/

/**********************************************************************
 *****                  State Object Specification                *****
 **********************************************************************/
 
/************************************************************
 * Stores information on AI state.
 ************************************************************/
function createNewState (dialogue, image, direction) {
	var newStateObject = {dialogue:dialogue,
                          image:image,
                          direction:direction};
						  
	return newStateObject;
}

/**********************************************************************
 *****                      All Dialogue Tags                     *****
 **********************************************************************/
 
var NAME = "~name~";
var PROPER_CLOTHING = "~Clothing~";
var LOWERCASE_CLOTHING = "~clothing~";

/**********************************************************************
 *****                    All Dialogue Triggers                   *****
 **********************************************************************/

var BAD_HAND = "bad_hand";
var OKAY_HAND = "okay_hand";
var GOOD_HAND = "good_hand";
 
var PLAYER_MUST_STRIP = "must_strip";
var PLAYER_STRIPPED = "stripped";

var PLAYER_MUST_FORFEIT = "must_forfeit";
var PLAYER_START_FORFEIT = "start_forfeit";
var PLAYER_FORFEITING = "forfeiting";
var PLAYER_HEAVY_FORFEITING = "heavy_forfeiting";
var PLAYER_FINISHING = "finishing";
var PLAYER_FINISHED = "finished";

var MALE_HUMAN_WILL_STRIP = "male_human_will_strip";

var MALE_WILL_REMOVE_ACCESSORY = "male_will_remove_accessory";
var MALE_WILL_REMOVE_MINOR = "male_will_remove_minor";
var MALE_WILL_REMOVE_MAJOR = "male_will_remove_major";
var MALE_CHEST_WILL_BE_VISIBLE = "male_chest_will_be_visible";
var MALE_CROTCH_WILL_BE_VISIBLE = "male_crotch_will_be_visible";

var MALE_REMOVED_ACCESSORY = "male_removed_accessory";
var MALE_REMOVED_MINOR = "male_removed_minor";
var MALE_REMOVED_MAJOR = "male_removed_major";
var MALE_CHEST_IS_VISIBLE = "male_chest_is_visible";
var MALE_CROTCH_IS_VISIBLE = "male_crotch_is_visible";

var MALE_MUST_FORFEIT = "male_must_forfeit";
var MALE_START_FORFEIT = "male_start_forfeit";
var MALE_FORFEITING = "male_forfeiting";
var MALE_HEAVY_FORFEITING = "male_heavy_forfeiting";
var MALE_FINISHED = "male_finished";

var FEMALE_HUMAN_WILL_STRIP = "female_human_will_strip";

var FEMALE_WILL_REMOVE_ACCESSORY = "female_will_remove_accessory";
var FEMALE_WILL_REMOVE_MINOR = "female_will_remove_minor";
var FEMALE_WILL_REMOVE_MAJOR = "female_will_remove_major";
var FEMALE_CHEST_WILL_BE_VISIBLE = "female_chest_will_be_visible";
var FEMALE_CROTCH_WILL_BE_VISIBLE = "female_crotch_will_be_visible";

var FEMALE_REMOVED_ACCESSORY = "female_removed_accessory";
var FEMALE_REMOVED_MINOR = "female_removed_minor";
var FEMALE_REMOVED_MAJOR = "female_removed_major";
var FEMALE_CHEST_IS_VISIBLE = "female_chest_is_visible";
var FEMALE_CROTCH_IS_VISIBLE = "female_crotch_is_visible";

var FEMALE_MUST_FORFEIT = "female_must_forfeit";
var FEMALE_START_FORFEIT = "female_start_forfeit";
var FEMALE_FORFEITING = "female_forfeiting";
var FEMALE_HEAVY_FORFEITING = "female_heavy_forfeiting";
var FEMALE_FINISHED = "female_finished";
 
/**********************************************************************
 *****                 Behaviour Parsing Functions                *****
 **********************************************************************/

/************************************************************
 * Loads and parses the start of the behaviour XML file of the 
 * given opponent source folder.
 *
 * The callFunction parameter must be a function capable of 
 * receiving a new player object.
 ************************************************************/
function loadBehaviour (folder, callFunction) {
	$.ajax({
        type: "GET",
		url: folder + "behaviour.xml",
		dataType: "text",
		success: function(xml) {
            var first = $(xml).find('first').text();
            var last = $(xml).find('last').text();
            var label = $(xml).find('label').text();
            var gender = $(xml).find('gender').text();
            var timer = $(xml).find('timer').text();
            
            var newPlayer = createNewPlayer(folder, first, last, label, gender, [], false, "", Number(timer), 0, [], xml);
            
            loadOpponentWardrobe(newPlayer);
            
            newPlayer.current = 0;
			newPlayer.state = parseDialogue($(xml).find('start'), [], []);
			
			callFunction(newPlayer);
		}
	});
}

/************************************************************
 * Parses and loads the wardrobe section of an opponent's XML 
 * file.
 ************************************************************/
function loadOpponentWardrobe (player) {
	/* grab the relevant XML file, assuming its already been loaded */
	var xml = player.xml;
	
	/* find and grab the wardrobe tag */
	$wardrobe = $(xml).find('wardrobe');
	
	/* find and create all of their clothing */
	$wardrobe.find('clothing').each(function () {
		var properName = $(this).attr('proper-name');
		var lowercase = $(this).attr('lowercase');
		var type = $(this).attr('type');
		var position = $(this).attr('position');
		
		var newClothing = createNewClothing(properName, lowercase, type, position, null);
		
		player.clothing.push(newClothing);
	});
}

/************************************************************
 * Parses the dialogue states of a player, given the case object.
 ************************************************************/
function parseDialogue (caseObject, replace, content) {
    var states = [];
	
	caseObject.find('state').each(function () {
        var image = $(this).attr('img');
        var dialogue = $(this).html();
        var direction = $(this).attr('direction');
        
		if (replace && content) {
			for (var i = 0; i < replace.length; i++) {
				dialogue = dialogue.replace(replace[i], content[i]);
			}
		}
        
        states.push(createNewState(dialogue, image, direction));
	});
	
	return states;
}

/************************************************************
 * Updates the behaviour of the given player based on the 
 * provided tag.
 ************************************************************/
function updateBehaviour (player, tag, replace, content) {
    /* determine what stage they are in */
    var stageNum = 0;
    for (var i = 0; i < players[player].clothing.length; i++) {
        /* count the null items */
        if (!players[player].clothing[i]) {
            stageNum++;
        }
    } 

	if (players[player].out) {
        /* determine what their forfeit stage is */
		stageNum += 1;
	}
	
    /* try to find the stage */
    var stage = null;
    $(players[player].xml).find('behaviour').find('stage').each(function () {
       if (Number($(this).attr('id')) == stageNum) {
           stage = $(this);
       } 
    });
    
    /* quick check to see if the stage exists */
    if (!stage) {
        console.log("Error: couldn't find stage "+stage+" for player "+player);
        return;
    }
    
    /* try to find the tag */
	var found = false;
	$(stage).find('case').each(function () {
		if ($(this).attr('tag') == tag) {
            players[player].current = 0;
			players[player].state = parseDialogue($(this), replace, content);
			found = true;
		}
	});
	
    /* quick check to see if the tag exists */
	if (!found) {
		players[player].state = null;
		console.log("Error: couldn't find "+tag+" dialogue for player "+player+" at stage "+stage);
	}
}

/************************************************************
 * Updates the behaviour of all players except the given player 
 * based on the provided tag.
 ************************************************************/
function updateAllBehaviours (player, tag, replace, content) {
	for (i = 1; i < players.length; i++) {
		if (i != player) {
			updateBehaviour(i, tag, replace, content);
		}
	}
}