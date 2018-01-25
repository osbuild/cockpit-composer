/* eslint no-undef: off */
/* eslint global-require: off */
/* eslint no-underscore-dangle: off */


// collects coverage from the tested page,
// calls nightmare.end() and calls done()
module.exports = {
  coverage: (nightmare, done) => {
    nightmare
      .evaluate(() => window.__coverage__)
      .end()
      .then((cov) => {
        if (cov) {
          const fs = require('fs');
          const strCoverage = JSON.stringify(cov);
          const hash = require('crypto').createHmac('sha256', '')
            .update(strCoverage)
            .digest('hex');
          const covOutDir = '/tmp/.nyc_output/';
          if (!fs.existsSync(covOutDir)) fs.mkdirSync(covOutDir);
          const fileName = `${covOutDir}coverage-${hash}.json`;
          fs.writeFileSync(fileName, strCoverage);
        }
        done();
      })
      .catch(err => console.error(err));
  },

};
