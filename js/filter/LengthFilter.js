/*!
 * JavaScript tag cloud builder v0.2
 * http://autotagcloud.com/
 *
 * Copyright 2013, Oleg Mazko
 * http://www.opensource.org/licenses/bsd-license.html
 */

function LengthFilter(input, newMinWordLength, newMaxWordLength) {

	var iIncToken = input.incrementToken;

	var maxWordLength = newMaxWordLength || 30;
	var minWordLength = newMinWordLength || 2;

	if (minWordLength < 2)
		throw "Min word length must be > 1, current: " + minWordLength;

	if (maxWordLength < 2)
		throw "Max word length must be > 1, current: " + maxWordLength;

	if (maxWordLength <= minWordLength)
		throw "Max word length must be > Min, current: " + maxWordLength
				+ " : " + minWordLength;

	this.incrementToken = function() {
		var token;
		while (!!(token = iIncToken())) {

			/*
			 * If token consists of multiple parts, newMinWordLength is still limit of
			 * just one part, between parts at least one char (usially one space)
			 */

			var tokenOffset = token.offset, tokenOffsetLength = tokenOffset.length;

			var tokenMinLength = tokenOffsetLength * minWordLength
					+ tokenOffsetLength - 1;
			var tokenLength = tokenOffset[tokenOffsetLength - 1].end
					- tokenOffset[0].start;
			if (tokenLength < tokenMinLength || tokenLength > maxWordLength)
				continue;

			return token;
		}
	}
}
