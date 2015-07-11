/********************************************************************************
 This file contains the variables and functions that form the select screens of 
 the game. The parsing functions for the opponent.xml file.
 ********************************************************************************/

/**********************************************************************
 *****               Opponent & Group Specification               *****
 **********************************************************************/
 
/**************************************************
 * Stores meta information about opponents.
 **************************************************/
function createNewOpponent (folder, name, from, gender, artist, writer) {
	var newOpponentObject = {folder:folder,
                             name:name, 
                             from:from,
                             gender:gender,
                             artist:artist,
                             writer:writer};
						  
	return newOpponentObject;
}

/**************************************************
 * Stores meta information about groups.
 **************************************************/
function createNewGroup (title, image, opp1, opp2, opp3, opp4) {
	var newGroupObject = {title:title,
                          image:image,
                          opp1:opp1, 
					      opp2:opp2,
				          opp3:opp3,
					      opp4:opp4};
						  
	return newGroupObject;
}
 
/**********************************************************************
 *****                  Select Screen UI Elements                 *****
 **********************************************************************/
 
/* main select screen */
$selectBubbles = [$("#select-bubble-1"),
                  $("#select-bubble-2"),
                  $("#select-bubble-3"),
                  $("#select-bubble-4")];
$selectDialogues = [$("#select-dialogue-1"),
                    $("#select-dialogue-2"),
                    $("#select-dialogue-3"),
                    $("#select-dialogue-4")];
$selectAdvanceButtons = [$("#select-advance-button-1"),
                         $("#select-advance-button-2"),
                         $("#select-advance-button-3"),
                         $("#select-advance-button-4")];
$selectImages = [$("#select-image-1"),
                 $("#select-image-2"),
                 $("#select-image-3"),
                 $("#select-image-4")];
$selectLabels = [$("#select-name-label-1"),
                 $("#select-name-label-2"),
                 $("#select-name-label-3"),
                 $("#select-name-label-4")];
$selectButtons = [$("#select-slot-button-1"),
                  $("#select-slot-button-2"),
                  $("#select-slot-button-3"),
                  $("#select-slot-button-4")];
$selectMainButton = $("#main-select-button");
 
/* individual select screen */
$individualTable = $("#individual-select-table");

$individualBubble = $("#individual-bubble");
$individualDialogue = $("#individual-dialogue");
$individualAdvanceButton = $("#individual-advance-button");
$individualImage = $("#individual-select-image");
$individualLabel = $("#individual-name-label");
$individualButton = $("#individual-select-button");

/* group select screen */
$groupTable = $("#group-select-table");
$groupImage = $("#group-select-image");
$groupLabels = [$("#group-name-label"),
                $("#group-name-label-1"),
                $("#group-name-label-2"),
                $("#group-name-label-3"),
                $("#group-name-label-4")]
$groupButton = $("#group-select-button");

/**********************************************************************
 *****                  Select Screen Variables                   *****
 **********************************************************************/

/* opponent meta file */
var opponentMetaFile = "opponents/opponent.xml";

/* opponent information storage */
var loadedOpponents = [];
var loadedGroups = [];

/* consistence variables */
var selectedSlot = 0;
var storedPlayer = null;
var storedGroup = [null, null, null, null];
 
/**********************************************************************
 *****                    Start Up Functions                      *****
 **********************************************************************/
 
/************************************************************
 * Loads all of the content required to display the title 
 * screen.
 ************************************************************/
function loadSelectScreen () {
    loadOpponentMeta();
    $selectMainButton.attr('disabled', true);
    $individualButton.attr('disabled', true);
    $groupButton.attr('disabled', true);
    
    $selectScreen.show();
}

/************************************************************
 * Loads and parses the opponent meta XML file.
 ************************************************************/
function loadOpponentMeta () {
	/* clear the previous meta */
	loadedOpponents = [];
	loadedGroups = [];
	
	/* grab and parse the opponent meta file */
	$.ajax({
        type: "GET",
		url: opponentMetaFile,
		dataType: "text",
		success: function(xml) {
			/* start by grabbing and parsing the individual listings */
			$individuals = $(xml).find('individuals');
			$individuals.find('opponent').each(function () {
                /* grab all the info for this listing */
				var folder = $(this).attr('folder');
				var name = $(this).attr('name');
				var from = $(this).attr('from');
                var gender = $(this).attr('gender');
                var artist = $(this).attr('artist');
                var writer = $(this).attr('writer');

				var opponent = createNewOpponent(folder, name, from, gender, artist, writer);
                
				/* add the opponent to the list */
				loadedOpponents.push(opponent);
			});
			
			/* load the individual select screen */
			loadIndividualSelectScreen();
			
			/* grab and parse the groups */
            $groups = $(xml).find('groups');
			$groups.find('group').each(function () {
                /* grab all the info for this listing */
				var title = $(this).attr('title');
                var image = $(this).attr('img');
				var opp1 = $(this).attr('opp1');
				var opp2 = $(this).attr('opp2');
                var opp3 = $(this).attr('opp3');
                var opp4 = $(this).attr('opp4');

				var group = createNewGroup(title, image, opp1, opp2, opp3, opp4);
                
				/* add the opponent to the list */
				loadedGroups.push(group);
			});
            
            /* load the group select screen */
			loadGroupSelectScreen();
		}
	});
}

/************************************************************
 * Loads all of the content required to display the 
 * individual select screen.
 ************************************************************/
function loadIndividualSelectScreen () {
    /* create and load all of the individual opponents */
	for (var i = 0; i < loadedOpponents.length; i++) {
        var row = 
            "<tr id='"+i+"' class='"+loadedOpponents[i].gender+"-row opponent-row'>"+
                "<td>"+(i+1)+"</td>"+
                "<td>"+loadedOpponents[i].name+"</td>"+
                "<td>"+loadedOpponents[i].from+"</td>"+
                "<td>"+loadedOpponents[i].artist+"</td>"+
                "<td>"+loadedOpponents[i].writer+"</td>"+
            "</tr>";

        $individualTable.append(row);
    }
    
    /* allow the rows on the individual screen to be selected */
    allowIndividualClickableRows();
}

/************************************************************
 * Loads all of the content required to display the group
 * select screen.
 ************************************************************/
function loadGroupSelectScreen () {
    /* create and load all of the groups */
	for (var i = 0; i < loadedGroups.length; i++) {
        var row = 
            "<tr id='"+i+"' class='group-row'>"+
                "<td>"+(i+1)+"</td>"+
                "<td>"+loadedGroups[i].title+"</td>"+
            "</tr>";

        $groupTable.append(row);
    }
    
    /* allow the rows on the individual screen to be selected */
    allowGroupClickableRows();
}

/**********************************************************************
 *****                   Interaction Functions                    *****
 **********************************************************************/

/************************************************************
 * The player clicked the advance dialogue button on the main
 * select screen.
 ************************************************************/
function advanceSelectDialogue (slot) {
    players[slot].current++;
    
    /* update dialogue */
    $selectDialogues[slot-1].html(players[slot].state[players[slot].current].dialogue);
    
    /* determine if the advance dialogue button should be shown */
    if (players[slot].state.length > players[slot].current+1) {
        $selectAdvanceButtons[slot-1].css({opacity : 1});
    } else {
        $selectAdvanceButtons[slot-1].css({opacity : 0});
    }
    
    /* direct the dialogue bubble */
    if (players[slot].state[players[slot].current].direction) {
        $selectBubbles[slot-1].removeClass();
		$selectBubbles[slot-1].addClass("bordered dialogue-bubble dialogue-"+players[slot].state[players[slot].current].direction);
	} else {
		$selectBubbles[slot-1].removeClass();
		$selectBubbles[slot-1].addClass("bordered dialogue-bubble dialogue-centre");
	}
    
    /* update image */
    $selectImages[slot-1].attr('src', players[slot].folder + players[slot].state[players[slot].current].image);
}
 
/************************************************************
 * The player clicked on an opponent slot.
 ************************************************************/
function selectOpponentSlot (slot) {
    if (!players[slot]) {
        /* add a new opponent */
        selectedSlot = slot;
        
        /* hide selected opponents */
        for (var i = 1; i < players.length; i++) {
            if (players[i]) {
                /* figure out which row belongs to this opponent */
                for (var j = 0; j < loadedOpponents.length; j++) {
                    if (loadedOpponents[j].folder == players[i].folder) {
                        /* this is the opponent's row, check to see if it's selected */
                        if ($('#'+j+'.opponent-row').hasClass('selected-row')) {
                            /* remove the class */
                            $('#'+j+'.opponent-row').removeClass('selected-row');
                            
                            /* clear the screen */
                            $individualDialogue.html("");
                            $individualAdvanceButton.css({opacity : 0});
                            $individualBubble.removeClass();
                            $individualBubble.addClass("bordered dialogue-bubble individual-bubble dialogue-centre");
                            $individualImage.attr('src', BLANK_PLAYER_IMAGE);
                            $individualLabel.html("Opponent");
                            $individualButton.attr('disabled', true);
                        }
                        
                        $('#'+j+'.opponent-row').hide();
                        break;
                    }
                }
            }
        }
        
        /* switch screens */
        $selectScreen.hide();
        $individualSelectScreen.show();
    } else {
        /* unhide their row */
        for (var j = 0; j < loadedOpponents.length; j++) {
            if (loadedOpponents[j].folder == players[slot].folder) {
                /* this is the opponent's row, check to see if it's selected */
                if ($('#'+j+'.opponent-row').hasClass('selected-row')) {
                    /* remove the class */
                    $('#'+j+'.opponent-row').removeClass('selected-row');
                    
                    /* clear the screen */
                    $individualDialogue.html("");
                    $individualAdvanceButton.css({opacity : 0});
                    $individualBubble.removeClass();
                    $individualBubble.addClass("bordered dialogue-bubble individual-bubble dialogue-centre");
                    $individualImage.attr('src', BLANK_PLAYER_IMAGE);
                    $individualLabel.html("Opponent");
                    $individualButton.attr('disabled', true);
                }
                
                $('#'+j+'.opponent-row').show();
                break;
            }
        }
        
        /* remove the opponent that's there */
        players[slot] = null;
        updateSelectionVisuals();
    }
}

/************************************************************
 * The player clicked on the select group slot.
 ************************************************************/
function clickedSelectGroupButton () {
	selectedSlot = 1;
	
	/* switch screens */
	$selectScreen.hide();
	$groupSelectScreen.show();
}

/************************************************************
 * Allows the player to click opponent rows, the internal 
 * function is called whenever the player clicks on an 
 * individual opponent row.
 ************************************************************/
function allowIndividualClickableRows () {
    $('.opponent-row').click(function() {
        /* update the table visual */
        $('.selected-row').removeClass('selected-row');
        $(this).addClass('selected-row');
        
        /* load their XML file */
        var id = $(this).attr('id');
        loadBehaviour(loadedOpponents[id].folder, updateIndividualScreen);
    });
}

/************************************************************
 * Allows the player to click group rows, the internal 
 * function is called whenever the player clicks on an 
 * group opponent row.
 ************************************************************/
function allowGroupClickableRows () {
    $('.group-row').click(function() {
        /* update the table visual */
        $('.selected-row').removeClass('selected-row');
        $(this).addClass('selected-row');

        /* clear the stored group */
        storedGroup = [null, null, null, null];
        
        /* get the ID */
        var id = $(this).attr('id');
        
        /* update some of the visuals */
        $groupImage.attr('src', loadedGroups[id].image);
        $groupLabels[0].html(loadedGroups[id].title);
        
        /* load all of the XML files */
        loadBehaviour(loadedGroups[id].opp1, updateGroupScreen);
        loadBehaviour(loadedGroups[id].opp2, updateGroupScreen);
        loadBehaviour(loadedGroups[id].opp3, updateGroupScreen);
        loadBehaviour(loadedGroups[id].opp4, updateGroupScreen);
    });
}

/************************************************************
 * The player clicked the advance dialogue button on the 
 * individual select screen.
 ************************************************************/
function advanceIndividualDialogue () {
    storedPlayer.current++;
    
    /* update dialogue */
    $individualDialogue.html(storedPlayer.state[storedPlayer.current].dialogue);
    
    /* determine if the advance dialogue button should be shown */
    if (storedPlayer.state.length > storedPlayer.current+1) {
        $individualAdvanceButton.css({opacity : 1});
    } else {
        $individualAdvanceButton.css({opacity : 0});
    }
    
    /* direct the dialogue bubble */
    if (storedPlayer.state[storedPlayer.current].direction) {
        $individualBubble.removeClass();
		$individualBubble.addClass("bordered dialogue-bubble individual-bubble dialogue-"+storedPlayer.state[storedPlayer.current].direction);
	}  else {
		$individualBubble.removeClass();
		$individualBubble.addClass("bordered dialogue-bubble dialogue-centre");
	}
    
    /* update image */
    $individualImage.attr('src', storedPlayer.folder + storedPlayer.state[storedPlayer.current].image);
}

/************************************************************
 * The player clicked the select opponent button on the
 * individual select screen.
 ************************************************************/
function selectIndividualOpponent () {
    /* move the stored player into the selected slot and update visuals */
    players[selectedSlot] = storedPlayer;
    players[selectedSlot].current = 0;
    updateSelectionVisuals();
    
    /* switch screens */
    $individualSelectScreen.hide();
	$selectScreen.show();
}

/************************************************************
 * The player clicked the select group button on the group 
 * select screen.
 ************************************************************/
function selectGroup () {
    /* load the opponents into the first few slots */
    for (var i = 1; i < players.length; i++) {
        players[i] = storedGroup[i-1];
        players[i].current = 0;
    }
    updateSelectionVisuals();
    
    /* switch screens */
    $groupSelectScreen.hide();
	$selectScreen.show();
}

/************************************************************
 * The player clicked on  back button on the individual or
 * group select screen.
 ************************************************************/
function backToSelect () {
    /* switch screens */
    $individualSelectScreen.hide();
    $groupSelectScreen.hide();
	$selectScreen.show();
}

/************************************************************
 * The player clicked on the start game button on the main 
 * select screen.
 ************************************************************/
function advanceSelectScreen () {
    advanceToNextScreen($selectScreen);
}

/**********************************************************************
 *****                     Display Functions                      *****
 **********************************************************************/
 
/************************************************************
 * Displays all of the current players on the main select
 * screen.
 ************************************************************/
function updateSelectionVisuals () {
    /* update all opponents */
    for (var i = 1; i < players.length; i++) {
        if (players[i]) {
            /* update dialogue */
            $selectDialogues[i-1].html(players[i].state[players[i].current].dialogue);
            
            /* determine if the advance dialogue button should be shown */
            if (players[i].state.length > players[i].current+1) {
                $selectAdvanceButtons[i-1].css({opacity : 1});
            } else {
                $selectAdvanceButtons[i-1].css({opacity : 0});
            }
            
            /* direct the dialogue bubble */
            if (players[i].state[players[i].current].direction) {
                $selectBubbles[i-1].removeClass();
                $selectBubbles[i-1].addClass("bordered dialogue-bubble dialogue-"+players[i].state[players[i].current].direction);
            } else {
                $selectBubbles[i-1].removeClass();
                $selectBubbles[i-1].addClass("bordered dialogue-bubble dialogue-centre");
            }
            
            /* update image */
            $selectImages[i-1].attr('src', players[i].folder + players[i].state[players[i].current].image);
            
            /* update label */
            $selectLabels[i-1].html(players[i].label);
            
            /* change the button */
            $selectButtons[i-1].html("Remove Opponent");
            $selectButtons[i-1].addClass("smooth-button-red");
        } else {
            /* clear the view */
            $selectDialogues[i-1].html("");
            $selectAdvanceButtons[i-1].css({opacity : 0});
            $selectBubbles[i-1].removeClass();
            $selectBubbles[i-1].addClass("bordered dialogue-bubble dialogue-centre");
            $selectImages[i-1].attr('src', BLANK_PLAYER_IMAGE);
            $selectLabels[i-1].html("Opponent "+i);
            
            /* change the button */
            $selectButtons[i-1].html("Select Opponent");
            $selectButtons[i-1].removeClass("smooth-button-red");
        }
    }
    
    /* check to see if all opponents are loaded */
    var loaded = 0;
    for (var i = 1; i < players.length; i++) {
        if (players[i]) {
            loaded++;
        }
    }
    
    /* if all opponents are loaded, then enable progression */
    if (loaded == players.length - 1) {
        $selectMainButton.attr('disabled', false);
    } else {
        $selectMainButton.attr('disabled', true);
    }
}
 
/************************************************************
 * This is the callback for the individual clicked rows, it
 * displays the returned opponent on the individual screen.
 ************************************************************/
function updateIndividualScreen (playerObject) {
    storedPlayer = playerObject;
    
    /* update dialogue */
    $individualDialogue.html(playerObject.state[playerObject.current].dialogue);
    
    /* determine if the advance dialogue button should be shown */
    if (playerObject.state.length > 1) {
        $individualAdvanceButton.css({opacity : 1});
    } else {
        $individualAdvanceButton.css({opacity : 0});
    }
    
    /* direct the dialogue bubble */
    if (playerObject.state[playerObject.current].direction) {
        $individualBubble.removeClass();
		$individualBubble.addClass("bordered dialogue-bubble individual-bubble dialogue-"+playerObject.state[playerObject.current].direction);
	} else {
        $individualBubble.removeClass();
		$individualBubble.addClass("bordered dialogue-bubble individual-bubble dialogue-centre");
	}
    
    /* update image */
    $individualImage.attr('src', playerObject.folder + playerObject.state[playerObject.current].image);
    
    /* update label */
    $individualLabel.html(playerObject.label);
    
    /* enable the button */
    $individualButton.attr('disabled', false);
}

/************************************************************
 * This is the callback for the group clicked rows, it
 * updates information on the group screen.
 ************************************************************/
function updateGroupScreen (playerObject) {
    /* find a spot to store this player */
    for (var i = 0; i < storedGroup.length; i++) {
        if (!storedGroup[i]) {
            storedGroup[i] = playerObject;
            $groupLabels[i+1].html(playerObject.label);
            break;
        }
    }
    
    /* update label */
    //$groupLabel.html(playerObject.label);
    
    /* enable the button */
    $groupButton.attr('disabled', false);
}