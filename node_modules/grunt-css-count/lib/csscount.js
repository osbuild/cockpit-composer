var parse = require('css-parse');
var fs = require('fs');
var gzipSize = require('gzip-size');

function CSSCount(path) {
  this.path = path;
  this.file = fs.readFileSync(this.path, 'utf8');
  this.parsedData = parse(this.file).stylesheet;
}

var nestingArr;
var countAsterisk;
function selectorSplit(selector) {
  var selectorString = selector.replace('>', ' ').replace('+', ' ').replace('~', ' ').replace(/\s\s+/g, ' ');
  var selectorsDepth = selectorString.split(' ').length - 1;
  if (typeof nestingArr[selectorsDepth] === 'undefined') {
    nestingArr[selectorsDepth] = 1;
  } else {
    nestingArr[selectorsDepth]++;
  }
  countAsterisk += (selectorString.split('*').length - 1);
}

var countRules;
var countSelectors;
var countDeclarations;
function traverse(o) {
  for (var i in o) {
    if (typeof o[i] === 'object') {
      if (o[i].type === 'rule') {
        countRules++;
        countSelectors += o[i].selectors.length;
        for (var j = 0; j < o[i].selectors.length; j++) {
          selectorSplit(o[i].selectors[j] + ' ');
        }
        countDeclarations += o[i].declarations.length;
        continue;
      }
      traverse(o[i]);
    }
  }
}

CSSCount.prototype = {
  fileSize: function() {
    return fs.statSync(this.path).size;
  },
  gzipSize: function () {
    return gzipSize.sync(this.file);
  },
  stats: function(callback) {
    var fileSize = this.fileSize();
    var gzipSize = this.gzipSize();
    var totalRules;
    var totalSelectors;
    var totalDeclarations;
    countRules = 0;
    countSelectors = 0;
    countDeclarations = 0;
    nestingArr = [];
    countAsterisk = 0;
    traverse(this.parsedData);
    callback({
      fileSize: fileSize,
      gzipSize: gzipSize,
      totalRules: countRules,
      totalSelectors: countSelectors,
      totalDeclarations: countDeclarations,
      selectorsPerRule: (countSelectors/countRules).toFixed(1),
      declarationsPerRule: (countDeclarations/countRules).toFixed(1),
      nestingArr: nestingArr,
      totalAsterisk: countAsterisk
    });
  }
};

module.exports = CSSCount;