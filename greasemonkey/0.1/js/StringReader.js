/*!
 * JavaScript tag cloud builder v0.2
 * http://autotagcloud.com/
 *
 * Copyright 2013, Oleg Mazko
 * http://www.opensource.org/licenses/bsd-license.html
 */

function StringReader(input) {

	/* Java origin impl - openjdk/jdk/src/share/classes/java/io/StringReader.java. Exceptions skipped - JFlex don't use them */

	var next = 0, inputLength = input.length;

	this.read = function(cbuf, off, len) {
                
		if (arguments.length !== 3) {
			throw "Expected 3 arguments passed, found: " + arguments.length;
		}

		if (!len) {
			return 0;
		}

		if (next >= inputLength) {
			return -1;
		}
                         
		var n = Math.min(inputLength - next, len), nT = n;

		while (nT--) {
			cbuf[off + nT] = input.charCodeAt(next + nT);
		}

		next += n;	
		return n;
	}
}
