const utils = require('sdk/window/utils');

function highlight(aHighlight, items) {
  var mainWindow = utils.getMostRecentBrowserWindow();
  var finder = mainWindow.getBrowser().finder;

  items.forEach((item) => {
  	finder.highlight(aHighlight, item);
  });
}

exports.highlight = highlight;