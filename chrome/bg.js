chrome.contextMenus.removeAll();
chrome.contextMenus.create({
      title: "Scrambler App", contexts: ["browser_action"],
      onclick: function() { chrome.tabs.create({ url: "https://play.google.com/store/apps/details?id=com.playbclick.bnoodle" }); }
});