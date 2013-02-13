/*!
 * JavaScript tag cloud builder v0.2
 * http://nongreedy.ru/
 *
 * Copyright 2013, Oleg Mazko
 * http://www.opensource.org/licenses/bsd-license.html
 */

function Token(term, start, end) {
	this.term = term;
	this.offset = [];
	this.boost = 1;
	this.addOffset(start, end);
}

Token.prototype.addOffset = function(start, end) {
	if (start < end)
		return this.offset.push({
					"start" : start,
					"end" : end
				});
	else {
		throw "Bad token offset start: " + start + ", end: " + end;
	}
}

Token.prototype.clone = function() {
        function CloneToken() {};
        CloneToken.prototype = Token.prototype;
	var cloneToken = new CloneToken();
	cloneToken.offset = this.offset.slice();
	cloneToken.boost = this.boost;
        cloneToken.term = this.term;

	return cloneToken;
}
