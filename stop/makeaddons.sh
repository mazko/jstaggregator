#download Snowball.js
wget http://mazko.github.com/jssnowball/lib/Snowball.js

#prepare Snowball stem stream editor using Node.js
echo "module.exports = " > snowballStemModule.js
cat ../js/filter/SnowballFilter.js >> snowballStemModule.js
cat Snowball.js >> snowballStemModule.js

#generate lng addons
for FILE in words/*
do
	LNG=`basename $FILE .ngp`
	echo "/*!" > ../js/stopaddons/$LNG.js
	echo " * $LNG stopwords addon for JavaScript tag cloud builder v0.2" >> ../js/stopaddons/$LNG.js
	echo " * http://tagsonflags.com/" >> ../js/stopaddons/$LNG.js
	echo " *" >> ../js/stopaddons/$LNG.js
	echo " * Copyright `date +'%Y.%m.%d'`, Oleg Mazko" >> ../js/stopaddons/$LNG.js
	echo " * http://www.opensource.org/licenses/bsd-license.html" >> ../js/stopaddons/$LNG.js
	echo " */" >> ../js/stopaddons/$LNG.js
	echo "(function() {" >> ../js/stopaddons/$LNG.js
	echo "var stopwords = {" >> ../js/stopaddons/$LNG.js
	node streamstem.js < words/$LNG $LNG | sort -u | perl -CSD -p -e 's{([^\t\n\x20-\x7E])}{sprintf "\\u%04x", ord $1}eg' | sed '/^$/d;s/^/\"/;s/$/\" : null,/'>> ../js/stopaddons/$LNG.js
	sed -i '$s/,$//' ../js/stopaddons/$LNG.js
	echo "};" >> ../js/stopaddons/$LNG.js
	echo "Taggregator.addStopList('$LNG', stopwords);" >> ../js/stopaddons/$LNG.js
	echo "}());" >> ../js/stopaddons/$LNG.js
done

#cleanup
rm Snowball.js* snowballStemModule.js
