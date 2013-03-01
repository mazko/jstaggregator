var SnowballFilter = require('./snowballStemModule');

/* http://nodejs.org/api/process.html#process_process_stdin */

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {

	var ptr = 0, stopwords = chunk.split(/\n/);
	var tokenStream = new SnowballFilter({ 
			incrementToken : function() {
				if (ptr < stopwords.length) {
					return { term: stopwords[ptr++] };
				}
			}
		},
		process.argv[process.argv.length - 1]
	);

	var res = [], token;
	while (token = tokenStream.incrementToken()) {
		res.push(token.term);
	}

	process.stdout.write(res.join('\n'));
});
