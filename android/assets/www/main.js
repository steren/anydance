/**
 * A record of bumps of accelerometer 
 */
function BumpRecord() {
	/** the absolute timestamp of the start of the simulation */
	this.startTimestamp = 0;
	/** ordered array of the timestamps ( relative to startTimestamp) of the bumps */
	this.timestamps = [];
	/** store the values of the bumps */
	this.norms 		= [];
	this.addBump = function(timestamp, norm) {
		this.timestamps.push(timestamp - this.startTimestamp);
		this.norms.push(norm);
	};
	/** the record is started */
	this.start = function() {
		this.startTimestamp = new Date().getTime();
	}
	/** 
	 * compare with another BumpRecord object
	 * @param BumpRecord record: record to compare to 
	 */
	this.compare = function( record ) {
		var distance = 0;
		for (var i = 0; i < this.timestamps.length; i++ ) {
			if( i  < record.timestamps.length ) {
				distance += Math.abs(this.timestamps[i] - record.timestamps[i]);
			}
		}
		return distance;
	}
	
	/**
	 * @param record : the record to compare to
	 * @param tstart : (absolute)
	 * @param tend	 : (absolute)
	 * @param startIndex (optional) : the index of the first timestamp that is after tstart
	 */
	this.compareRange = function ( record, tstart, tend, startIndex ) {
		tstart = tstart - this.startTimestamp;
		tend = tend - this.startTimestamp;
		
		// if no startIndex specified, find it
		if(startIndex == null) {
			for (var i = 0; i < this.timestamps.length; i++ ) { // TODO OPTIM use a binary search
				if(this.timestamps[i] >= tstart) {
					startIndex = i;
					break;
				}
			}
		}
		
		// find the portion of the record array that corresponds to this Range
		var startRecordIndex;
		for (var i = 0; i < record.timestamps.length; i++ ) {
			if( record.timestamps[i] >= tstart ) {
				startRecordIndex = i;
				break;
			}
		}
		var decay =  startRecordIndex - startIndex;
		
		var distance = 0;
		var tendIndex = 0; 	// the index of the first timestamp after tend
 
		// Compute the distance, this code may change
		for (var i = startIndex; i < this.timestamps.length; i++ ) {
			if( i + decay >= record.timestamps.length ) { break; }
			if( this.timestamps[i] > tend ) { break; }
			tendIndex = i;

			distance += Math.abs(this.timestamps[i] - record.timestamps[i + decay]);
		}
		return distance;
		// TODO return also tendIndex
	}
}

var bumpsReference = new BumpRecord();
for(var i = 0; i < 100; i++) {
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
/** duration between two comparison*/
var compareDuration = 5000;

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
	if( a.timestamp > lastCompareEndTimestamp + compareDuration ) {
		var distanceRange = bumps.compareRange(bumpsReference, lastCompareEndTimestamp, lastCompareEndTimestamp + compareDuration);
		lastCompareEndTimestamp += compareDuration;
		
		document.getElementById('distance').innerHTML = roundNumber( distanceRange );

		var quality = "Bad";
		if(distanceRange < 10) {
			quality = "Perfect!";
		} else if(distanceRange < 500) {
			quality = "Excellent!";
		} else if (distanceRange < 1000) {
			quality = "Good!";
		} else if (distanceRange < 2000) {
			quality = "Ok";
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
