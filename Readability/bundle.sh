STANDALONE='ReadabilityWrapper.js'

echo 'function ReadabilityWrapper(urimDocument) {' > $STANDALONE;
sed 's!^!\t!' ./Readability/JSDOMParser.js >> $STANDALONE;

cat <<EOT >> $STANDALONE;
  /* fake global scope */
  var Node = this.Node,
      Comment = this.Comment,
      Document = this.Document,
      Element = this.Element,
      Text = this.Text,
      JSDOMParser = this.JSDOMParser;
EOT

sed 's!^!\t!' ./Readability/Readability.js >> $STANDALONE;

cat <<EOT >> $STANDALONE;
  return (function () {
    var doc = urimDocument || document;
    var location = doc.location;
    var uri = {
      spec: location.href,
      host: location.host,
      prePath: location.protocol + "//" + location.host,
      scheme: location.protocol.substr(0, location.protocol.indexOf(":")),
      pathBase: location.protocol + "//" + location.host + location.pathname.substr(0, location.pathname.lastIndexOf("/") + 1)
    };
    var serializedDocument = new XMLSerializer().serializeToString(doc);
    return new Readability(uri, 
      new JSDOMParser().parse(serializedDocument));
  })();
}
EOT