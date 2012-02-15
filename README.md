# Slider Puzzle Logic Class

## About

This was literally just born from a brain-fart I had one night around June/July 2011. I'm no genius at maths, so I know I could probably have done this a gazillion times easier/better using Matrix Mathematics. It works well enough the way it is, and I just wanted to throw it out there in case anyone actually finds it useful.

It's worth noting that if I had the time, I'd probably change quite a few things in here since I've learned quite a lot since writing this. The first and foremost of which would be to allow a different number of rows and columns.

## Demo

I have no good demo for you at this point unfortunately. I'll see if I can get something up sometime in the future.

## Usage

As the name suggests, this is literally just the logic class, so it provides the data you can use to do the displaying of the actual slider puzzle.

Another thing to bear in mind is that because we're using arrays, all row/column values (or locations) are 0-based.

Having established that, here's what you'll need:

### Initializing

To initialize the class, you just have to call it:

	var logic = new sliderLogic();

There is an optional object you can pass in that will define the number of rows and columns. As indicated above, this is *1* option that defines both rows *and* columns (the default is 3).

	var logic = new sliderLogic({ rc:5 });

### Shuffling

This function moves *1* randomly chosen element next to the open spot. Said element is chosen with some level of intelligence as to what the last move was (if there was one) so as to avoid repeating the same move.

Example:

	logic.shuffle(function(from, to) {
		// Perform your magic here
	});

As you can see, you need to pass this function a callback that will receive the following:

* `from` - The location of the element that we're moving from.
* `to` - The location the element is moving to (ie: the previously empty space).

Both of these take the format: `{ row:0, col:0 }` (obviously with the 0 representing the respective row and column)

You will need to place the call to this function in a recursive function if you want to shuffle the whole array. Once I get the demo up and running it will give a good idea of what I mean.

### Moving a given tile

This function moves the tile at the passed in co-ordinates to the open spot next to it (if available). This function will return `false` if the move isn't a viable one (ie: if you click on a tile without an open space next to it), or it will return the location the object will move to (same format as in the shuffle function).

Example:

	logic.move({ row:0, col:0 });

### Checking whether the puzzle is completed

There is a simple function you can use to check whether the puzzle is completed. Returns `true` or `false`:

	logic.complete();

### Getting the current state of the array

Should you wish to get a peek at the entire layout of the current array (mostly for debugging purposes), the following functions will give you a peek:

To get the array as an Array object:

	logic.currentState();

To get the array as a nicely formatted string (for easy to read console logging):

	logic.print_array();