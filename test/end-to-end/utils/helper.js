const pageConfig = require('../config');
const fs = require('fs');

module.exports = {
  // Switch to welder-web iframe if welder-web is integrated with Cockpit.
  // Cockpit web service is listening on TCP port 9090.
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
  gotoError: (error, nightmare, testSpec) => {
    console.error(`Failed on case ${testSpec.result.fullName} - ${error.toString()} - ${JSON.stringify(error)}`);
    const dtStr = new Date().toISOString()
                            .replace(/T/, '-')
                            .replace(/:/g, '-')
                            .replace(/\..+/, '');
    const imageDir = '/tmp/failed-image/';
    if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir);
    nightmare
      .screenshot(`${imageDir}${testSpec.result.fullName.replace(/ /g, '-')}.${dtStr}.fail.png`)
      .end()
      .then(
        () => console.error(`Screenshot Saved at ${imageDir}${testSpec.result.fullName.replace(/ /g, '-')}.${dtStr}.fail.png`),
      );
  },
};
