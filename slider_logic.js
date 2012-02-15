/*
 *	Our Slider Logic Class
 */
function sliderLogic(opts) {
	// All our class scope variables
	var sliderArray = new Array();
	var initialArray = new Array();
	var currentEmpty = {row:0,col:0};
	var lastShuffle = {row:0,col:0};

	// All our configurations go in here. Merge this with any that are passed in.
	this._options = merge_options({
		rc:3 // the number of rows and columns
	}, opts);

	/*
	 *	Initialize the class
	 */
	this._init = function() {
		/*
		 *	i is the row dimension, j is the column dimension.
		 *	so for a 3x3 example we'd have:
		 *		[0,0][0,1][0,2]
		 *		[1,0][1,1][1,2]
		 *		[2,0][2,1][2,2]
		 */
		var _count = 0;
		for (i=0; i < this._options.rc; i++) {
			sliderArray[i] = new Array();
			initialArray[i] = new Array();
			for (j=0; j < this._options.rc; j++) {
				_count++;
				sliderArray[i][j] = _count;
				initialArray[i][j] = _count;
			}
		}

		// the last row will be at the very bottom right of the matrix
		var _last = this._options.rc-1;
		// empty out the very last element in the matrix.
		sliderArray[_last][_last] = false;
		initialArray[_last][_last] = false;
		// Let's remember which one is currently empty
		currentEmpty = {row:_last,col:_last};
	};

	/*
	 *	Move the element located at the passed parameter to the empty spot next to it.
	 *	This parameter takes the form: {row:0,col:0}
	 */
	this.move = function(_loc) {
		var aboveEmpty, belowEmpty, leftEmpty, rightEmpty = false;
		// we'll return this later
		var movedTo = currentEmpty;

		// if this one isn't currently next to an empty spot, return false. No move possible!
		if (_loc.row-1 >= 0) { // if there's something above, check it.
			aboveEmpty = !sliderArray[_loc.row-1][_loc.col];
		}
		if (_loc.row+1 < this._options.rc) {
			belowEmpty = !sliderArray[_loc.row+1][_loc.col];
		}
		if (_loc.col-1 >= 0) {
			leftEmpty = !sliderArray[_loc.row][_loc.col-1];
		}
		if (_loc.col+1 < this._options.rc) {
			rightEmpty = !sliderArray[_loc.row][_loc.col+1];
		}

		if (!aboveEmpty && !belowEmpty && !leftEmpty && !rightEmpty) {
			return false;
		}

		// Move the value that was clicked on to the empty spot.
		sliderArray[currentEmpty.row][currentEmpty.col] = sliderArray[_loc.row][_loc.col];
		// The clicked on value becomes the new empty one
		sliderArray[_loc.row][_loc.col] = false;
		currentEmpty = _loc;

		// let the user know where it moved to.
		return movedTo;
	};

	/*
	 *	Used for shuffling the elements around. Different to move() because we have yet to decide which one we're moving.
	 */
	this.shuffle = function(_callback) {
		var _moveLoc = false;
		var _movedTo = currentEmpty; // it will always move to the currently empty slot

		// _vert == 1 ? 'move vertically' : 'move horizontally';
		var _vert = (this.getRand(0,1) == 1);
		var _operand = (this.getRand(0,1) == 1) ? '+' : '-';

		// A different set of rules apply to the most basic version.
		if (this._options.rc == 2) {
			//  if the last move was vertically/horizontally the same, go with the opposite.
			if (
				(_vert && currentEmpty.row == 0 && currentEmpty.row+1 == lastShuffle.row) ||
				(_vert && currentEmpty.row == 1 && currentEmpty.row-1 == lastShuffle.row) ||
				(!_vert && currentEmpty.col == 0 && currentEmpty.col+1 == lastShuffle.col) ||
				(!_vert && currentEmpty.col == 1 && currentEmpty.col-1 == lastShuffle.col)
			) {
				// inverse the value.
				_vert = !_vert;
			}

			// if moving vertically and there's no space to the right OR if moving horizontally and there's no space below: go the other way.
			if (_vert && currentEmpty.row+1 >= 2 || !_vert && currentEmpty.col+1 >= 2) {
				_operand = '-';
			} else {
				_operand = '+';
			}
		} else {
			// make sure we don't shuffle in the same direction as last time. Also ensure that we're not attempting to go out of the bounds of the array
			while (
				(_vert && (eval(currentEmpty.row+_operand+'1') >= 0 && eval(currentEmpty.row+_operand+'1') < this._options.rc) && eval(currentEmpty.row+_operand+'1') == lastShuffle.row) ||
				(_vert && (eval(currentEmpty.row+_operand+'1') < 0 || eval(currentEmpty.row+_operand+'1') >= this._options.rc)) ||
				(!_vert && (eval(currentEmpty.col+_operand+'1') >= 0 && eval(currentEmpty.col+_operand+'1') < this._options.rc) && eval(currentEmpty.col+_operand+'1') == lastShuffle.col) ||
				(!_vert && (eval(currentEmpty.col+_operand+'1') < 0 || eval(currentEmpty.col+_operand+'1') >= this._options.rc))
			) {
				_vert = (this.getRand(0,1) == 1);
				_operand = (this.getRand(0,1) == 1) ? '+' : '-';
			}
		}

		if (_vert) {
			_moveLoc = {row:eval(currentEmpty.row+_operand+'1'),col:currentEmpty.col};
		} else {
			_moveLoc = {row:currentEmpty.row,col:eval(currentEmpty.col+_operand+'1')};
		}

		// remember the last one that was shuffled so we don't shuffle it back to where it just was.
		lastShuffle = currentEmpty;

		sliderArray[currentEmpty.row][currentEmpty.col] = sliderArray[_moveLoc.row][_moveLoc.col];
		sliderArray[_moveLoc.row][_moveLoc.col] = false;

		// the currentEmpty one is the location we're moving FROM
		currentEmpty = _moveLoc;

		_callback.apply(this, Array(_moveLoc, _movedTo));
	};

	/*
	 *	Simply check whether it matches the original.
	 */
	this.complete = function() {
		return sliderArray.toString() == initialArray.toString();
	};

	/*
	 *	Return the current sliderArray
	 */
	this.currentState = function() { return sliderArray; };

	/*
	 *	clear the lastShuffle state.
	 */
	this.clearLastShuffle = function() { lastShuffle = false; };

	/*===== utility functions =====*/

	/*
	 *	Just console logs. Nothing fancy.
	 */
	this.log = function() { if(window.console&&window.console.log)console.log(sliderArray.toString()); };

	/*
	 *	Debug function that displays the array in a fancy format.
	 */
	this.print_array = function() {
		var _dump = '';
		//loop through the array and spit out the values.
		for (i=0; i < sliderArray.length; i++) {
			for (j=0; j < sliderArray[0].length; j++) {
				var _val = sliderArray[i][j];

				_dump += (_val < 10 ? '&nbsp;' : '');
				_dump += (_val ? _val : '&nbsp;')+' | ';
			}
			_dump += '<br />';
		}
		return _dump;
	};

	/*
	 *	Returns a random number between min and max
	 *	Got this one from stack overflow here: http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript
	 */
	this.getRand = function(min, max) {
	    return Math.round(Math.random() * (max - min) + min);
	};

	/*
	 *	Merges two objects together.
	 *	Got this one from stack overflow here (changed var names to make sense relative to this class): http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
	 */
	function merge_options(opt1,opt2){
	    var temp = {};
	    for (attrname in opt1) { temp[attrname] = opt1[attrname]; }
	    for (attrname in opt2) { temp[attrname] = opt2[attrname]; }
	    return temp;
	}
	
	// Let's finally initialize this thing.
	this._init();
}