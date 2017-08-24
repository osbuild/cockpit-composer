const pageConfig = require('../config');

module.exports = {
  gotoURL: (nightmare, page) => {
    if (pageConfig.root.includes('9090')) {
      nightmare
        .goto(page.url)
        .wait(page.iframeLoadingTime)
        .enterIFrame(page.iframeSelector);
    } else {
      nightmare
        .goto(page.url);
    }
  },
};
