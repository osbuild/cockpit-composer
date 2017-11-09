/* eslint no-undef: off */
/* eslint no-console: off */
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
        const strCoverage = JSON.stringify(cov);
        const hash = require('crypto').createHmac('sha256', '')
          .update(strCoverage)
          .digest('hex');
        const fileName = `/tmp/coverage-${hash}.json`;
        require('fs').writeFileSync(fileName, strCoverage);

        done();
      })
    .catch(err => console.log(err));
  },

};
