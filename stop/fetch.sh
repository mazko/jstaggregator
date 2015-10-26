LUCENE_VERSION='5.3.1'

#download Lucene latest, compile
javac -cp lucene-analyzers-common-${LUCENE_VERSION}.jar:lucene-core-${LUCENE_VERSION}.jar java/LuceneStopFetcher.java

#start fetching stop words from Lucene
LuceneStopFetcher="java -cp java:java.LuceneStopFetcher:lucene-analyzers-common-${LUCENE_VERSION}.jar:lucene-core-${LUCENE_VERSION}.jar LuceneStopFetcher"
$LuceneStopFetcher ca CatalanAnalyzer > words/ca
$LuceneStopFetcher cz CzechAnalyzer > words/cs
$LuceneStopFetcher da DanishAnalyzer > words/da
$LuceneStopFetcher de GermanAnalyzer > words/de
$LuceneStopFetcher en EnglishAnalyzer > words/en
$LuceneStopFetcher es SpanishAnalyzer > words/es
$LuceneStopFetcher fi FinnishAnalyzer > words/fi
$LuceneStopFetcher fr FrenchAnalyzer > words/fr
$LuceneStopFetcher ga IrishAnalyzer > words/ga
$LuceneStopFetcher hu HungarianAnalyzer > words/hu
$LuceneStopFetcher hy ArmenianAnalyzer > words/hy
$LuceneStopFetcher it ItalianAnalyzer > words/it
$LuceneStopFetcher nl DutchAnalyzer > words/nl
$LuceneStopFetcher no NorwegianAnalyzer > words/no
$LuceneStopFetcher pt PortugueseAnalyzer > words/pt
$LuceneStopFetcher ro RomanianAnalyzer > words/ro
$LuceneStopFetcher ru RussianAnalyzer > words/ru
#$LuceneStopFetcher sl ? > words/sl
$LuceneStopFetcher sv SwedishAnalyzer > words/sv
$LuceneStopFetcher tr TurkishAnalyzer > words/tr

#cleanup
#rm java/LuceneStopFetcher.class lucene-analyzers-common-${LUCENE_VERSION}.jar lucene-core-${LUCENE_VERSION}.jar
