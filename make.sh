#make standalone FlexTokenizer.js
rm jflex/UAX29URLEmailTokenizerImpl.js
java -jar jflex/jflex-1.5.0-SNAPSHOT.jar jflex/UAX29URLEmailTokenizerImpl.jflex

STANDALONE=js/FlexTokenizer.js

sed -i '/function FlexTokenizer(input, progress) {/q' $STANDALONE;
echo '' >> $STANDALONE;
sed '/function UAX29URLEmailTokenizerImpl(zzReader)  {/,$!d' jflex/UAX29URLEmailTokenizerImpl.js | sed 's!^!\t!' >> $STANDALONE;
echo '' >> $STANDALONE;
sed '/function StringReader(input) {/,$!d' js/StringReader.js | sed 's!^!\t!' >> $STANDALONE;
echo '' >> $STANDALONE;
echo 'var impl = new UAX29URLEmailTokenizerImpl(new StringReader(input));' | sed 's!^!\t!' >> $STANDALONE;
echo '' >> $STANDALONE;
sed '/function Token(term, start, end) {/,$!d' js/Token.js | sed 's!^!\t!' >> $STANDALONE;
echo '' >> $STANDALONE;
echo 'var inputLength = input.length;' | sed 's!^!\t!' >> $STANDALONE;
echo '' >> $STANDALONE;
echo 'this.incrementToken = function() {' | sed 's!^!\t!' >> $STANDALONE;
echo '' >> $STANDALONE;
echo 'var token = impl.getNextToken();' | sed 's!^!\t\t!' >> $STANDALONE;
echo 'if (token === null) return null;' | sed 's!^!\t\t!' >> $STANDALONE;
echo '' >> $STANDALONE;
echo 'if (progress) {' | sed 's!^!\t\t!' >> $STANDALONE;
echo 'progress(impl.yychar(), inputLength);' | sed 's!^!\t\t\t!' >> $STANDALONE;
echo '}' | sed 's!^!\t\t!' >> $STANDALONE;
echo '' >> $STANDALONE;
echo 'var content = impl.yytext();' | sed 's!^!\t\t!' >> $STANDALONE;
echo 'return new Token(content, impl.yychar(), impl.yychar() + content.length);' | sed 's!^!\t\t!' >> $STANDALONE;
echo '}' | sed 's!^!\t!' >> $STANDALONE;
echo '}' >> $STANDALONE;

#make standalone Taggregator.js

STANDALONE=js/Taggregator.js

sed -i '/var Taggregator = (function() {/q' $STANDALONE;

echo '' >> $STANDALONE;
sed '/function ShingleStopFilter(input, stopList, maxShingleSz, maxSzShinglesFIFO, tokenSeparator) {/,$!d' js/filter/ShingleStopFilter.js | sed 's!^!\t!' >> $STANDALONE;
echo '' >> $STANDALONE;
sed '/function SnowballFilter(input, language) {/,$!d' js/filter/SnowballFilter.js | sed 's!^!\t!' >> $STANDALONE;
echo '' >> $STANDALONE;
sed '/function LengthFilter(input, newMinWordLength, newMaxWordLength) {/,$!d' js/filter/LengthFilter.js | sed 's!^!\t!' >> $STANDALONE;
echo '' >> $STANDALONE;
sed '/function FlexTokenizer(input, progress) {/,$!d' js/FlexTokenizer.js | sed 's!^!\t!' >> $STANDALONE;
echo '' >> $STANDALONE;

echo 'var STOPLIST = {};' | sed 's!^!\t!' >> $STANDALONE;
echo 'return {' | sed 's!^!\t!' >> $STANDALONE;
echo 'addStopList : function(lng, stoplist) {' | sed 's!^!\t\t!' >> $STANDALONE;
echo 'if (STOPLIST.hasOwnProperty(lng)) {' | sed 's!^!\t\t\t!' >> $STANDALONE;
echo 'throw "Stopwords for " + lng + " already added";' | sed 's!^!\t\t\t\t!' >> $STANDALONE;
echo '}' | sed 's!^!\t\t\t!' >> $STANDALONE;
echo 'STOPLIST[lng] = stoplist;' | sed 's!^!\t\t\t!' >> $STANDALONE;
echo '},' | sed 's!^!\t\t!' >> $STANDALONE;
echo 'create : function(text, lng, progress) {' | sed 's!^!\t\t!' >> $STANDALONE;
echo 'var tokenStream = new LengthFilter(' | sed 's!^!\t\t\t!' >> $STANDALONE;
echo 'new ShingleStopFilter(' | sed 's!^!\t\t\t\t!' >> $STANDALONE;
echo 'new SnowballFilter(' | sed 's!^!\t\t\t\t\t!' >> $STANDALONE;
echo 'new FlexTokenizer(text, progress),' | sed 's!^!\t\t\t\t\t\t!' >> $STANDALONE;
echo 'lng' | sed 's!^!\t\t\t\t\t\t!' >> $STANDALONE;
echo '),' | sed 's!^!\t\t\t\t\t!' >> $STANDALONE;
echo 'STOPLIST[lng],' | sed 's!^!\t\t\t\t\t!' >> $STANDALONE;
echo '3 /* tags 3 words max */' | sed 's!^!\t\t\t\t\t!' >> $STANDALONE;
echo '),' | sed 's!^!\t\t\t\t!' >> $STANDALONE;
echo '2 /* Skip tags < 2 total chars */, 50 /* Skip tags > 50 total chars */' | sed 's!^!\t\t\t\t!' >> $STANDALONE;
echo ');' | sed 's!^!\t\t\t!' >> $STANDALONE;
echo 'return tokenStream;' | sed 's!^!\t\t\t!' >> $STANDALONE;
echo '}' | sed 's!^!\t\t!' >> $STANDALONE;
echo '};' | sed 's!^!\t!' >> $STANDALONE;
echo '}());' >> $STANDALONE;
