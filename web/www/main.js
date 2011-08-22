/* enum */
var PLAYERTYPE = {
	YOUTUBE : 		"YT",
	DAILYMOTION : 	"DM"
}

var PLAYERPARAMS = {
	WIDTH: 480,
	LENGTH: 295
}

var currentPlayer = PLAYERTYPE.YOUTUBE;
//var currentPlayer = PLAYERTYPE.DAILYMOTION;

// the Video Player object, it should implement the same methods than the Youtube player
var videoplayer;

//////////////
// DAILYMOTION
//////////////

// called when DM player is ready
function onDailymotionPlayerReady(playerId)
{
  videoplayer = document.getElementById("mydmplayer");
  afterPlayerReady();
}

//////////
// YOUTUBE
//////////

// called when YT player is ready
function onYouTubePlayerReady(playerId) {
	videoplayer = document.getElementById("ytPlayer");
	//Load an initial video into the player
	videoplayer.cueVideoById("ylLzyHk54Z0");
	afterPlayerReady();
}

//////////
// BOTH
//////////

// Called after the player have been created
function afterPlayerReady() {
	videoplayer.addEventListener("onStateChange", "onPlayerStateChange");
	videoplayer.addEventListener("onError", "onPlayerError");
	// This causes the updatePlayerInfo function to be called every 250ms to
	// get fresh data from the player
	setInterval(updatePlayerInfo, 250);
	updatePlayerInfo();
}
// This function is called when an error is thrown by the player
function onPlayerError(errorCode) {
	alert("An error occured of type:" + errorCode);
}
// This function is called when the player changes state
function onPlayerStateChange(newState) {
	updateHTML("playerState", newState);
}

//////////
// Helpers
//////////

// Update a particular HTML element with a new value
	function updateHTML(elmId, value) {
	document.getElementById(elmId).innerHTML = value;
}

///////////
// Main App
///////////

// Play the current Video
function playVideo() {
	if (videoplayer) {
		videoplayer.playVideo();
	}
}




// Display information about the current state of the player
function updatePlayerInfo() {
	if(videoplayer && videoplayer.getDuration) {
	  updateHTML("videoDuration", videoplayer.getDuration());
	  updateHTML("videoCurrentTime", videoplayer.getCurrentTime());
	  updateHTML("bytesTotal", videoplayer.getVideoBytesTotal());
	  updateHTML("bytesLoaded", videoplayer.getVideoBytesLoaded());
	}
}

function loadYTPlayer() {
	// Lets Flash from another domain call JavaScript
	var params = { allowScriptAccess: "always" };
	// The element id of the Flash embed
	var atts = { id: "ytPlayer" };
	// All of the magic handled by SWFObject (http://code.google.com/p/swfobject/)
	swfobject.embedSWF("http://www.youtube.com/apiplayer?" +
                   "version=3&enablejsapi=1&playerapiid=player1", 
                   "videoDiv", PLAYERPARAMS.WIDTH, PLAYERPARAMS.LENGTH, "9", null, null, params, atts);
}

function loadDMPlayer() {
    var params = { allowScriptAccess: "always" };
    var atts = { id: "mydmplayer" };
    swfobject.embedSWF("http://www.dailymotion.com/swf/xikzey&enableApi=1&playerapiid=videoplayer",
                       "videoDiv", PLAYERPARAMS.WIDTH, PLAYERPARAMS.LENGTH, "9", null, null, params, atts);
                       // it seams that addind &chromeless=1 breaks it
}

function _run() {
	if (currentPlayer == PLAYERTYPE.YOUTUBE) {
		loadYTPlayer();
	} else if(currentPlayer == PLAYERTYPE.DAILYMOTION) {
		loadDMPlayer();
	}
}

google.setOnLoadCallback(_run);
