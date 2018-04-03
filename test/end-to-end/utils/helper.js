const pageConfig = require('../config');
const fs = require('fs');

module.exports = {
  // Switch to welder-web iframe if welder-web is integrated with Cockpit.
  // Cockpit web service is listening on TCP port 9090.
  gotoURL: (nightmare, page) => {
    if (pageConfig.root.includes('9090')) {
      let waitTime = 0.6 * pageConfig.nightmareOptions.waitTimeout;
      // don't wait longer than 5 seconds! when waitTimeout increases
      // this can become ridiculuously slow and cause timeouts in CI
      if (waitTime > 5000) {
        waitTime = 5000;
      }

      return nightmare
        .goto(page.url)
        // note: waiting for the iframe to load should be less than waitTimeout
        // with the default values this is around 3 seconds
        .wait(waitTime)
        .enterIFrame(page.iframeSelector);
    }

    return nightmare
      .goto(page.url);
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
