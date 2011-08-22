var PLAYER = {
	YOUTUBE : 		"YT",
	DAILYMOTION : 	"DM"
}

var currentPlayer = PLAYER.YOUTUBE;
//var currentPlayer = PLAYER.DAILYMOTION;

//////////////
// DAILYMOTION
//////////////

// called when DM player is ready
function onDailymotionPlayerReady(playerId)
{
  dmplayer = document.getElementById("mydmplayer");
}

//////////
// YOUTUBE
//////////

// called when YT player is ready
function onYouTubePlayerReady(playerId) {
	ytplayer = document.getElementById("ytPlayer");
	// This causes the updatePlayerInfo function to be called every 250ms to
	// get fresh data from the player
	setInterval(updatePlayerInfo, 250);
	updatePlayerInfo();
	ytplayer.addEventListener("onStateChange", "onYTPlayerStateChange");
	ytplayer.addEventListener("onError", "onYTPlayerError");
	//Load an initial video into the player
	ytplayer.cueVideoById("ylLzyHk54Z0");
}
// This function is called when an error is thrown by the player
function onYTPlayerError(errorCode) {
	alert("An error occured of type:" + errorCode);
}
// This function is called when the player changes state
function onYTPlayerStateChange(newState) {
	updateHTML("playerState", newState);
}

///////////
// Main App
///////////

// Play the current Video
function playVideo() {
	if (currentPlayer == PLAYER.YOUTUBE && ytplayer) {
		ytplayer.playVideo();
	} else if(currentPlayer == PLAYER.DAILYMOTION && dmplayer) {
		dmplayer.playVideo();
	}
}

//////////
// Helpers
//////////

// Update a particular HTML element with a new value
	function updateHTML(elmId, value) {
	document.getElementById(elmId).innerHTML = value;
}



// Display information about the current state of the player
function updatePlayerInfo() {
	if(ytplayer && ytplayer.getDuration) {
	  updateHTML("videoDuration", ytplayer.getDuration());
	  updateHTML("videoCurrentTime", ytplayer.getCurrentTime());
	  updateHTML("bytesTotal", ytplayer.getVideoBytesTotal());
	  updateHTML("startBytes", ytplayer.getVideoStartBytes());
	  updateHTML("bytesLoaded", ytplayer.getVideoBytesLoaded());
	}
}

// The "main method" of this sample. Called when someone clicks "Run".
function loadYTPlayer() {
	// Lets Flash from another domain call JavaScript
	var params = { allowScriptAccess: "always" };
	// The element id of the Flash embed
	var atts = { id: "ytPlayer" };
	// All of the magic handled by SWFObject (http://code.google.com/p/swfobject/)
	swfobject.embedSWF("http://www.youtube.com/apiplayer?" +
                   "version=3&enablejsapi=1&playerapiid=player1", 
                   "videoDiv", "480", "295", "9", null, null, params, atts);
}

function loadDMPlayer() {
    var params = { allowScriptAccess: "always" };
    var atts = { id: "mydmplayer" };
    swfobject.embedSWF("http://www.dailymotion.com/swf/xikzey&enableApi=1&playerapiid=dmplayer",
                       "videoDiv", "425", "356", "9", null, null, params, atts);
                       // it seams that addind &chromeless=1 breaks it
}

function _run() {
	if (currentPlayer == PLAYER.YOUTUBE) {
		loadYTPlayer();
	} else if(currentPlayer == PLAYER.DAILYMOTION) {
		loadDMPlayer();
	}
}

google.setOnLoadCallback(_run);
