/*!
 * JavaScript tag cloud builder v0.2
 * http://tagsonflags.com/
 *
 * Copyright 2013, Oleg Mazko
 * http://www.opensource.org/licenses/bsd-license.html
 */

function ShingleStopFilter(input, stopList, newMaxShingleSz, newMaxSzShinglesFIFO, newTokenSeparator) {

	var iIncToken = input.incrementToken;

	var maxShingleSz = newMaxShingleSz || 2;
	var tokenSeparator = newTokenSeparator || " ";
	var maxSzShinglesFIFO = newMaxSzShinglesFIFO || 25;

	if (maxShingleSz < 2)
		throw "Max shingle size must be >= 2, current: " + maxShingleSz;

	var shingleBuf = [], shingles = [];

	function fillShingleBuffer() {
		do {
			if (shingleBuf.length) {
				shingleBuf.pop();
				var token = iIncToken();
				if (token)
					shingleBuf.unshift(token);
			} else {
				do {
					var token = iIncToken();
					if (!token)
						break;
					shingleBuf.unshift(token);
				} while (shingleBuf.length < maxShingleSz);
			}

			var sb = shingleBuf.length;

			if (!sb)
				return shingles.length;

			var allShingles = new Array(sb--);

			var token = shingleBuf[sb], is = isStop(token.term), c = is ? 1 : 0;
			allShingles[sb] = makeItem(token, is, c);

			var i = sb;
			if (i--) {
				var j = i, aToken = shingleBuf[i], tokenTerm = aToken.term, ais = isStop(tokenTerm);
				do {
					var item = makeItem(token.clone(), is, c), itemToken = item.token;
					allShingles[j] = item;
					itemToken.term += tokenSeparator + tokenTerm;
					item.isStopEnd = ais;
					if (ais)
						item.stopCount++;
					itemToken.offset = itemToken.offset.concat(aToken.offset);
				} while (j--);
				while (i--) {
					var j = i, aToken = shingleBuf[i], tokenTerm = aToken.term, ais = isStop(tokenTerm);
					do {
						var item = allShingles[j], itemToken = item.token;
						itemToken.term += tokenSeparator + tokenTerm;
						item.isStopEnd = ais;
						if (ais)
							item.stopCount++;
						itemToken.offset = itemToken.offset
								.concat(aToken.offset);
					} while (j--);
				}
			}

			/*
			 * Boost shingle tokens, witch don't start or end with a stop
			 * word(s), skip shingle tokens with stop word(s) only
			 */

			do {
				var item = allShingles[sb], itemToken = item.token, itol = itemToken.offset.length, isc = item.stopCount;

				if (itol == isc)
					continue;

				//if (item.isStopStart || item.isStopEnd)
				//	itemToken.boost *= 1 - isc / itol;

				shingles.push(itemToken);
			} while (sb--);

		} while (shingles.length < maxSzShinglesFIFO);

		return true;
	}

	function makeItem(token, isStop, stopCount) {
		return {
			"token" : token,
			"isStopStart" : isStop,
			"isStopEnd" : isStop,
			"stopCount" : stopCount
		};
	}

	this.incrementToken = function() {
		if (!shingles.length) {
			if (!fillShingleBuffer())
				return;
		}

		return shingles.shift();
	}

	function isStop(word) {
		return stopList && stopList.hasOwnProperty(word);
	}
}
