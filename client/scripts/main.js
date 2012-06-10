require(["app/BumpRecord", "conf", "strings"], function(BumpRecord, conf, Strings) {
    
var bumpsReference = new BumpRecord();
for(var i = 1; i < 100; i++) {
	bumpsReference.addBump(i * 2000, 20);
}

var deviceInfo = function() {
    document.getElementById("platform").innerHTML = device.platform;
    document.getElementById("version").innerHTML = device.version;
    document.getElementById("uuid").innerHTML = device.uuid;
    document.getElementById("name").innerHTML = device.name;
    document.getElementById("width").innerHTML = screen.width;
    document.getElementById("height").innerHTML = screen.height;
};

var vibrate = function() {
    navigator.notification.vibrate(0);
};

function roundNumber(num) {
    var dec = 3;
    var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    return result;
}

var accelerationWatch = null;

/** acceleration norm */
var an, anmin, anmax;
/** timestamp of the latest bump detected */
var lastBumpTimestamp = 0;

/** end absolute time of the latest comparison */
var lastCompareEndTimestamp = 0;

/** the currently recorded bumps */
var /* BumpRecord */ bumps;

function updateAcceleration(a) {
	an = Math.sqrt(a.x*a.x + a.y*a.y + a.z*a.z);

	if( anmin == null || an < anmin ) {
		anmin = an;
	}
	if( anmax == null || an > anmax ) {
		anmax = an;
	}
	
	if(an == 0) {
		anmin = null;
		anmax = null;
	}
	
	// if we detect a bump
	if(an > 20 && a.timestamp - lastBumpTimestamp > 500) {
		lastBumpTimestamp = a.timestamp;
		bumps.addBump(a.timestamp, an);
	}
	
	// compare if necessary
	if( a.timestamp > lastCompareEndTimestamp + conf.COMPAREDURATION ) {
		var distanceRange = bumps.compareRange(bumpsReference, lastCompareEndTimestamp, lastCompareEndTimestamp + conf.COMPAREDURATION);
		lastCompareEndTimestamp += conf.COMPAREDURATION;
		
		document.getElementById('distance').innerHTML = roundNumber( distanceRange );

		var quality = Strings["rangeScoreQuality.bad"];
		if(distanceRange < conf.MAX_RANGESCOREQUALITY_PERFECT) {
			quality = Strings["rangeScoreQuality.perfect"];
		} else if(distanceRange < conf.MAX_RANGESCOREQUALITY_EXCELLENT) {
			quality = Strings["rangeScoreQuality.excellent"];
		} else if (distanceRange < conf.MAX_RANGESCOREQUALITY_GOOD) {
			quality = Strings["rangeScoreQuality.good"];
		} else if (distanceRange < conf.MAX_RANGESCOREQUALITY_OK) {
			quality = Strings["rangeScoreQuality.ok"];
		}
		document.getElementById('quality').innerHTML = quality;
	}
	
    document.getElementById('x').innerHTML = roundNumber(a.x);
    document.getElementById('y').innerHTML = roundNumber(a.y);
    document.getElementById('z').innerHTML = roundNumber(a.z);
    document.getElementById('timestamp').innerHTML = a.timestamp - bumps.startTimestamp;
    document.getElementById('norm').innerHTML = roundNumber( an );
    document.getElementById('normmin').innerHTML = roundNumber( anmin );
    document.getElementById('normmax').innerHTML = roundNumber( anmax );
    document.getElementById('bumps').innerHTML = roundNumber( bumps.timestamps.length );
}

var toggleAccel = function() {
    if (accelerationWatch !== null) {
    	navigator.accelerometer.clearWatch(accelerationWatch);
        updateAcceleration({
            x : 0,
            y : 0,
            z : 0
        });
        accelerationWatch = null;
        
        vibrate();
        
        alert("score: " + bumps.compare(bumpsReference));
    } else {
        bumps = new BumpRecord();
        bumps.start();
        lastCompareEndTimestamp = new Date().getTime();
        var options = {};
        options.frequency = 100;
        accelerationWatch = navigator.accelerometer.watchAcceleration(
                updateAcceleration, function(ex) {
                    alert("accel fail (" + ex.name + ": " + ex.message + ")");
                }, options);
    }
};

function fail(msg) {
    alert(msg);
}

var networkReachableCallback = function(reachability) {
    // There is no consistency on the format of reachability
    var networkState = reachability.code || reachability;

    var currentState = {};
    currentState[NetworkStatus.NOT_REACHABLE] = 'No network connection';
    currentState[NetworkStatus.REACHABLE_VIA_CARRIER_DATA_NETWORK] = 'Carrier data connection';
    currentState[NetworkStatus.REACHABLE_VIA_WIFI_NETWORK] = 'WiFi connection';

    confirm("Connection type:\n" + currentState[networkState]);
};

function check_network() {
    navigator.network.isReachable("www.google.com",
            networkReachableCallback, {});
}

function init() {
    document.addEventListener("deviceready", deviceInfo, true);
}

document.getElementById('accelbutton').onclick = toggleAccel;
document.getElementById('checknetworkbutton').onclick = check_network;

init();


});