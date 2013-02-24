/*!
 * JavaScript tag cloud builder v0.2
 * http://tagsonflags.com/
 *
 * Copyright 2013, Oleg Mazko
 * http://www.opensource.org/licenses/bsd-license.html
 */

function Reader() {

	var pos = 0;

	this.read = function(cbuf, off, len) {
                         
		if (pos >= inputLength) return -1;
		if (!len) return 0;
                         
		var total = 0;
                         
		while (pos < inputLength) {
			cbuf[off + total] = input.charCodeAt(pos++);
			if (++total >= len) break;
		}
			
		return total;
	}
}
