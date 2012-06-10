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