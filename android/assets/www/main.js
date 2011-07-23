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

var an, anmin, anmax;
var bumps = 0;
var bumptimestamp = 0;

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
		bumps = 0;
	}
	
	if(an > 20 && a.timestamp - bumptimestamp > 500) {
		bumps++;
		bumptimestamp = a.timestamp;
	}
	
    document.getElementById('x').innerHTML = roundNumber(a.x);
    document.getElementById('y').innerHTML = roundNumber(a.y);
    document.getElementById('z').innerHTML = roundNumber(a.z);
    document.getElementById('timestamp').innerHTML = a.timestamp;
    document.getElementById('norm').innerHTML = roundNumber( an );
    document.getElementById('normmin').innerHTML = roundNumber( anmin );
    document.getElementById('normmax').innerHTML = roundNumber( anmax );
    document.getElementById('bumps').innerHTML = roundNumber( bumps );    
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
    } else {
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
    navigator.network.isReachable("www.mobiledevelopersolutions.com",
            networkReachableCallback, {});
}

function init() {
    document.addEventListener("deviceready", deviceInfo, true);
}
