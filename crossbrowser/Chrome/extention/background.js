// http://stackoverflow.com/questions/21535233/injecting-multiple-scripts-through-executescript-in-google-chrome

function executeScripts(tabId, injectDetailsArray)
{
    function createCallback(tabId, injectDetails, innerCallback) {
        return function () {
            chrome.tabs.executeScript(tabId, injectDetails, innerCallback);
        };
    }

    var callback = null;

    for (var i = injectDetailsArray.length - 1; i >= 0; --i)
        callback = createCallback(tabId, injectDetailsArray[i], callback);

    if (callback !== null)
        callback();   // execute outermost function
}

chrome.browserAction.onClicked.addListener(function (tab) {
    executeScripts(null, [ 
        //{ file: "jquery.js" }, 
        //{ file: "master.js" },
        //{ file: "helper.js" },
        { code: "alert('hello');" }
    ])
});