// https://developer.chrome.com/extensions/background_pages

(function() {

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

	tabs_workers = [];

	function removeTabFromWorkers(tabId) {
		var tab_index = tabs_workers.indexOf(tabId);
		if (tab_index !== -1) {
			tabs_workers.splice(tab_index, 1);
			console.log('Removed tab ID: ' + tabId + ', Index: ' + tab_index);
		}
	}

	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
		removeTabFromWorkers(tabId);
		console.log('Updated tab ID: ' + tabId);
	});

	chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
		removeTabFromWorkers(tabId);
	});

	chrome.browserAction.onClicked.addListener(function (tab) {
		if (tabs_workers.indexOf(tab.id) !== -1) {
			removeTabFromWorkers(tab.id);
			chrome.tabs.sendMessage(tab.id, {method: 'detach'});
		} else {
			tabs_workers.push(tab.id);
			chrome.tabs.sendMessage(tab.id, {method: 'cloud'}, function(response) {
    			if (response && response.result === 'OK') {
    				console.log('old artifact for: ' + [tab.title, tab.id]);
    			} else {
					console.log('new artifact for: ' + [tab.title, tab.id]);
				    executeScripts(null, [ 
				        { file: "data/3js/jquery.js" }, 
				        { file: "data/3js/Snowball.js" }, 
				        { file: "data/3js/ReadabilityWrapper.js" }, 

				        { file: "data/3js/Taggregator.js" },
				        { file: "data/3js/stopaddons/ca.js"},
				        { file: "data/3js/stopaddons/cs.js"}, 
				        { file: "data/3js/stopaddons/da.js"}, 
				        { file: "data/3js/stopaddons/de.js"}, 
				        { file: "data/3js/stopaddons/en.js"}, 
				        { file: "data/3js/stopaddons/es.js"}, 
				        { file: "data/3js/stopaddons/fi.js"}, 
				        { file: "data/3js/stopaddons/fr.js"}, 
				        { file: "data/3js/stopaddons/ga.js"}, 
				        { file: "data/3js/stopaddons/hu.js"}, 
				        { file: "data/3js/stopaddons/hy.js"}, 
				        { file: "data/3js/stopaddons/it.js"}, 
				        { file: "data/3js/stopaddons/nl.js"}, 
				        { file: "data/3js/stopaddons/no.js"}, 
				        { file: "data/3js/stopaddons/pt.js"}, 
				        { file: "data/3js/stopaddons/ro.js"}, 
				        { file: "data/3js/stopaddons/ru.js"}, 
				        { file: "data/3js/stopaddons/sl.js"}, 
				        { file: "data/3js/stopaddons/sv.js"}, 
				        { file: "data/3js/stopaddons/tr.js"}, 

				        { file: "data/3js/li/LanguageIdentifier.js"},  
				        { file: "data/3js/li/Lng/ca.js"},  
				        { file: "data/3js/li/Lng/cs.js"}, 
				        { file: "data/3js/li/Lng/da.js"},  
				        { file: "data/3js/li/Lng/de.js"},  
				        { file: "data/3js/li/Lng/en.js"},  
				        { file: "data/3js/li/Lng/es.js"},  
				        { file: "data/3js/li/Lng/fi.js"},  
				        { file: "data/3js/li/Lng/fr.js"},  
				        { file: "data/3js/li/Lng/ga.js"},  
				        { file: "data/3js/li/Lng/hu.js"},  
				        { file: "data/3js/li/Lng/hy.js"},  
				        { file: "data/3js/li/Lng/it.js"},  
				        { file: "data/3js/li/Lng/nl.js"},  
				        { file: "data/3js/li/Lng/no.js"},  
				        { file: "data/3js/li/Lng/pt.js"},  
				        { file: "data/3js/li/Lng/ro.js"},  
				        { file: "data/3js/li/Lng/ru.js"},  
				        { file: "data/3js/li/Lng/sl.js"},  
				        { file: "data/3js/li/Lng/sv.js"},  
				        { file: "data/3js/li/Lng/tr.js"},  

						{ file: "data/urim.js"}
				    ]);
    			}
  			});
		}
	});
})();