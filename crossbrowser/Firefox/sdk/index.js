//main.js

const tabs = require("sdk/tabs");
const {ToggleButton} = require("sdk/ui/button/toggle");
const {data} = require("sdk/self");
const selection = require("sdk/selection");
const { find } = require("sdk/util/array");
const highlighter = require("./highlighter.js");

var toggleButton = ToggleButton({
  id: "urim-toolbar-attach-script",
  label: "Attach Urim Sidebar",
  icon: {
    "16": data.url("images/icon-16.png"),
    "32": data.url("images/icon-32.png"),
    "64": data.url("images/icon-64.png")
  },
  onChange: function() {
    // delete the window state for the current window,
    // automatically set when the user click on the button
    this.state('window', null);
    
    // now that the state hierarchy is clean, set the
    // tab state for the current tab
    let { checked } = this.state('tab');
    this.state('tab', {checked: !checked});
  }
});

var workers = [];

function detachWorker(worker, workerArray) {
  var index = workerArray.indexOf(worker);
  if(index != -1) {
    workerArray.splice(index, 1);
    toggleButton.state('tab', {checked: false});
    console.log('detach worker index ' + index);
  }
}

function getTabWorker(tab, workerArray) {
  return find(workerArray, 
    (w) => w.tab && w.tab === tab,
    null);
}

toggleButton.on('change', ({ checked }) => {
  var activeTab = tabs.activeTab;
  var worker = getTabWorker(activeTab, workers);
  if (worker) {
    worker.destroy();
  } else {
    console.log('new artifact for: ' + [activeTab.title, activeTab.id]);
    var worker = activeTab.attach({
      contentScriptOptions: {
        "cssiframes": data.load("css/iframes.css"),
        "cssli": data.load("css/li.css"),
        "csssidebar": data.load("css/sidebar.css"),

        "ca": data.url("images/flags/64/AD.png"),
        "cs": data.url("images/flags/64/CZ.png"),
        "da": data.url("images/flags/64/DK.png"),
        "de": data.url("images/flags/64/DE.png"),
        "en": data.url("images/flags/64/GB.png"),
        "es": data.url("images/flags/64/ES.png"),
        "fi": data.url("images/flags/64/FI.png"),
        "fr": data.url("images/flags/64/FR.png"),
        "ga": data.url("images/flags/64/IE.png"),
        "hu": data.url("images/flags/64/HU.png"),
        "hy": data.url("images/flags/64/AM.png"),
        "it": data.url("images/flags/64/IT.png"),
        "nl": data.url("images/flags/64/NL.png"),
        "no": data.url("images/flags/64/NO.png"),
        "pt": data.url("images/flags/64/PT.png"),
        "ro": data.url("images/flags/64/RO.png"),
        "ru": data.url("images/flags/64/UA.png"),
        "sl": data.url("images/flags/64/SI.png"),
        "sv": data.url("images/flags/64/SE.png"),
        "tr": data.url("images/flags/64/TR.png"),
      },

      contentScriptFile: [
        data.url("3js/jquery.js"), 
        data.url("3js/Snowball.js"), 

        data.url("3js/Taggregator.js"), 
        data.url("3js/stopaddons/ca.js"), 
        data.url("3js/stopaddons/cs.js"), 
        data.url("3js/stopaddons/da.js"), 
        data.url("3js/stopaddons/de.js"), 
        data.url("3js/stopaddons/en.js"), 
        data.url("3js/stopaddons/es.js"), 
        data.url("3js/stopaddons/fi.js"), 
        data.url("3js/stopaddons/fr.js"), 
        data.url("3js/stopaddons/ga.js"), 
        data.url("3js/stopaddons/hu.js"), 
        data.url("3js/stopaddons/hy.js"), 
        data.url("3js/stopaddons/it.js"), 
        data.url("3js/stopaddons/nl.js"), 
        data.url("3js/stopaddons/no.js"), 
        data.url("3js/stopaddons/pt.js"), 
        data.url("3js/stopaddons/ro.js"), 
        data.url("3js/stopaddons/ru.js"), 
        data.url("3js/stopaddons/sl.js"), 
        data.url("3js/stopaddons/sv.js"), 
        data.url("3js/stopaddons/tr.js"), 

        data.url("3js/li/LanguageIdentifier.js"), 
        data.url("3js/li/Lng/ca.js"), 
        data.url("3js/li/Lng/cs.js"), 
        data.url("3js/li/Lng/da.js"), 
        data.url("3js/li/Lng/de.js"), 
        data.url("3js/li/Lng/en.js"), 
        data.url("3js/li/Lng/es.js"), 
        data.url("3js/li/Lng/fi.js"), 
        data.url("3js/li/Lng/fr.js"), 
        data.url("3js/li/Lng/ga.js"), 
        data.url("3js/li/Lng/hu.js"), 
        data.url("3js/li/Lng/hy.js"), 
        data.url("3js/li/Lng/it.js"), 
        data.url("3js/li/Lng/nl.js"), 
        data.url("3js/li/Lng/no.js"), 
        data.url("3js/li/Lng/pt.js"), 
        data.url("3js/li/Lng/ro.js"), 
        data.url("3js/li/Lng/ru.js"), 
        data.url("3js/li/Lng/sl.js"), 
        data.url("3js/li/Lng/sv.js"), 
        data.url("3js/li/Lng/tr.js"), 

        data.url("urim.js")
      ]
    });

    workers.push(worker);

    worker.on('detach', () => detachWorker(worker, workers));

    worker.port.on("urim_get_selection", () => {
      worker.port.emit("urim_on_got_selection", selection.text);
    });

    worker.port.on("urim_tag_clicked", (() => {
      var plain_tags = [];
      return (model) => {
        try {
          console.log('tag clicked ' + JSON.stringify(model));
          var current_tags = model.tags;
          var current_tags_plain = current_tags.join();
          var index = plain_tags.indexOf(current_tags_plain);
          if(index != -1) {
            //plain_tags.splice(index, 1);
            plain_tags = []
            highlighter.highlight(false, current_tags);
          } else {
            plain_tags.push(current_tags_plain);
            highlighter.highlight(true, current_tags);
          }
        } finally {
          worker.port.emit("urim_on_tag_click_processed");
        }
      }
    })());
  }
});


