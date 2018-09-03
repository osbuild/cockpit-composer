/* eslint-disable no-console, global-require */
const fs = require('fs');
const del = require('del');
const ejs = require('ejs');
const glob = require('glob');
const mkdirp = require('mkdirp');
const path = require('path');
const webpack = require('webpack');
// TODO: Update configuration settings
const config = {
  title: 'Patternfly React Starter',        // Your website title
  url: 'https://patternfly-react-starter.firebaseapp.com',          // Your website URL
  project: 'patternfly-react-starter',      // Firebase project. See README.md -> How to Deploy
  trackingID: 'UA-XXXXX-Y',                 // Google Analytics Site's ID
};
const tasks = new Map(); // The collection of automation tasks ('clean', 'build', 'publish', etc.)
function run(task) {
  const start = new Date();
  console.log(`Starting '${task}'...`);
  return Promise.resolve().then(() => tasks.get(task)()).then(() => {
    console.log(`Finished '${task}' after ${new Date().getTime() - start.getTime()}ms`);
  }, err => console.error(err.stack));
}
//
// Clean up the output directory
// -----------------------------------------------------------------------------
tasks.set('clean', () => del(['public/dist/*', '!public/dist/.git', 'public/po.*.js', 'build/localeLoader.js'], { dot: true }));

//
// Copy ./index.html into the /public folder
// -----------------------------------------------------------------------------
tasks.set('html', () => {
  const webpackConfig = require('./webpack.config');
  const assets = JSON.parse(fs.readFileSync('./public/dist/assets.json', 'utf8'));
  const template = fs.readFileSync('./public/index.ejs', 'utf8');
  const render = ejs.compile(template, { filename: './public/index.ejs' });
  const output = render({ debug: webpackConfig.debug, bundle: assets.main.js, config });
  fs.writeFileSync('./public/index.html', output, 'utf8');
});

//
// Create a module to handle loading the necessary locale data
// -----------------------------------------------------------------------------
tasks.set('locale-data', () => {
  return new Promise((resolve, error) => {
    // If the translations file does not exist, create an empty one
    const translationsPath = './build/translations.json';
    if (!fs.existsSync(translationsPath)) {
      mkdirp.sync('./build');
      fs.writeFileSync(translationsPath, "{}");
    }

    // Read the translation data to get a list of available languages
    var translationsData = JSON.parse(fs.readFileSync(translationsPath));

    // Create a module that imports and loads each language's locale data
    var languages = [... new Set(Object.keys(translationsData).map(lang => lang.split('_')[0]))];
    const outputName = './build/localeLoader.js';
    var outputData = `define(['react-intl',
  ${languages.map((lang) => `'react-intl/locale-data/${lang}'`).join(', ')}], function() {
  ${languages.map((lang, idx) => `arguments[0].addLocaleData(arguments[${idx + 1}]);`).join("\n")}
  return {};
})
`;
    fs.writeFileSync(outputName, outputData);

    // For cockpit, for each language, run po2json on the original .po file to output a module
    // to public/po.<lang>.js containing the necessary initialization code and data. 
    
    const exec = require('child_process').exec;
    var pofiles = glob.sync('./build/po/*.po');
    pofiles.forEach((filename) => {
      var language = path.basename(filename, '.po');
      exec(`node ./po/po2json -m ./po/po.empty.js -o public/po.${language}.js ${filename}`,
        (err) => {
          if (err !== null) {
            console.error(`Unable to create cockpit module for ${language}`);
            error(err);
          }
        });
    });

    resolve();
  });
});

//
// Bundle JavaScript, CSS and image files with Webpack
// -----------------------------------------------------------------------------
tasks.set('bundle', () => {
  const webpackConfig = require('./webpack.config');
  return new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        console.log(stats.toString(webpackConfig.stats));
        resolve();
      }
    });
  });
});
//
// Build website into a distributable format
// -----------------------------------------------------------------------------
tasks.set('build', () => {
  const exec = require('child_process').exec;
  global.DEBUG = process.argv.includes('--debug') || false;

  // Get the build information from git and write it to ./core/build-version.json
  exec('git describe --always',
    (error, stdout) => {
      const buildVersion = { 'build-version': stdout.trim() };
      if (error !== null) {
        buildVersion['build-version'] = 'UNKNOWN';
      }
      const output = JSON.stringify(buildVersion);
      fs.writeFileSync('./core/build-version.json', output, 'utf8');
    });

  return Promise.resolve()
    .then(() => run('clean'))
    .then(() => run('locale-data'))
    .then(() => run('bundle'))
    .then(() => run('html'));
});
//
// Build and publish the website
// -----------------------------------------------------------------------------
tasks.set('publish', () => {
  /* firebase is huge, and not required for development, so install on demand */
  let firebase;
  try {
    firebase = require('firebase-tools');  // eslint-disable-line import/no-unresolved
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      const execSync = require('child_process').execSync;
      execSync('npm install --no-save firebase-tools', { stdio: ['pipe', 'inherit', 'inherit'] });
      firebase = require('firebase-tools');  // eslint-disable-line import/no-unresolved
    } else {
      throw err;
    }
  }
  return run('build')
    .then(() => firebase.login({ nonInteractive: false }))
    .then(() => firebase.deploy({
      project: config.project,
      cwd: __dirname,
    }))
    .then(() => { setTimeout(() => process.exit()); });
});
//
// Build website and launch it in a browser for testing (default)
// -----------------------------------------------------------------------------
tasks.set('start', () => {
  let count = 0;
  global.HMR = !process.argv.includes('--no-hmr'); // Hot Module Replacement (HMR)
  return run('clean')
    .then(() => run('locale-data'))
    .then(() => new Promise(resolve => {
    const bs = require('browser-sync').create();
    const webpackConfig = require('./webpack.config');
    const compiler = webpack(webpackConfig);
    // Node.js middleware that compiles application in watch mode with HMR support
    // http://webpack.github.io/docs/webpack-dev-middleware.html
    const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
      publicPath: webpackConfig.output.publicPath,
      stats: webpackConfig.stats,
    });
    compiler.plugin('done', stats => {
      // Generate index.html page
      const bundle = stats.compilation.chunks.find(x => x.name === 'main').files[0];
      const template = fs.readFileSync('./public/index.ejs', 'utf8');
      const render = ejs.compile(template, { filename: './public/index.ejs' });
      const output = render({ debug: true, bundle: `/dist/${bundle}`, config });
      fs.writeFileSync('./public/index.html', output, 'utf8');
      // Launch Browsersync after the initial bundling is complete
      // For more information visit https://browsersync.io/docs/options
      if (++count === 1) {
        bs.init({
          port: process.env.PORT || 3000,
          ui: { port: Number(process.env.PORT || 3000) + 1 },
          server: {
            baseDir: 'public',
            middleware: [
              webpackDevMiddleware,
              require('webpack-hot-middleware')(compiler),
              require('connect-history-api-fallback')(),
            ],
          },
        }, resolve);
      }
    });
  }));
});
// Execute the specified task or default one. E.g.: node run build
run(/^\w/.test(process.argv[2] || '') ? process.argv[2] : 'start' /* default */);
