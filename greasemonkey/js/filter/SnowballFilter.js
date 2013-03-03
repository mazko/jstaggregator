/*!
 * JavaScript tag cloud builder v0.2
 * http://tagsonflags.com/
 *
 * Copyright 2013, Oleg Mazko
 * http://www.opensource.org/licenses/bsd-license.html
 */

function SnowballFilter(input, language) {

	var iIncToken = input.incrementToken;

	function loadStemmer() {
		switch (language) {
			case "it" :
				return new Snowball("italian");
			case "hu" :
				return new Snowball("hungarian");
			case "sv" :
				return new Snowball("swedish");
			case "fr" :
				return new Snowball("french");
			case "ru" :
				return new Snowball("russian");
			case "fi" :
				return new Snowball("finnish");
			case "es" :
				return new Snowball("spanish");
			case "en" :
				return new Snowball("english");
			case "pt" :
				return new Snowball("portuguese");
			case "de" :
				return new Snowball("german");
			case "da" :
				return new Snowball("danish");
			case "no" :
				return new Snowball("norwegian");
			case "nl" :
				return new Snowball("dutch");
			case "ro" :
				return new Snowball("romanian");
			case "tr" :
				return new Snowball("turkish");
			case "sl" :
				return new Snowball("slovene");
			case "ca" :
				return new Snowball("catalan");
			case "cs" :
				return new Snowball("czech");
			case "ga" :
				return new Snowball("irish");
			case "hy" :
				return new Snowball("armenian");
			default :
				throw "Unsupported language: " + language;
		}
	}

	var stem = (function() {
		var stemmer = loadStemmer();
		return function(word) {
			stemmer.setCurrent(word);
			stemmer.stem();

			return stemmer.getCurrent();
		}
	})();

	this.incrementToken = function() {
		var token = iIncToken();
		if (!token)
			return;

		var termForStem = token.term.toLowerCase(); // Need check for Finnish - there were problems in Urim
		token.term = stem(termForStem);

		return token;
	}
}
