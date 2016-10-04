var CSSCount = require('../lib/csscount');
var glob = require('glob');

module.exports = function(grunt) {
  grunt.registerMultiTask('csscount', 'CSS count', function() {
    var done = this.async();
    var options = this.options();

    function createNestingTextAndDepth(nestingArr, totalAsterisk, stats) {
      var maxDepth = 0;
      var nestingText = '';
      nestingArr.forEach(function(val, ind){
        nestingText += ' D' + ind + ': ' + val + ' (' + Math.round((val/stats.totalSelectors)*100) + '%) |';
        if (ind > maxDepth) maxDepth = ind;
      });
      stats.maxDepth = maxDepth;
      nestingText += '| ' + '* ' + totalAsterisk;
      return nestingText;
    }

    function analyseFiles(files) {
      grunt.util.async.forEachSeries(files, function(path, next) {
        new CSSCount(path).stats(function(stats) {

          grunt.log.writeln('');
          grunt.log.writeln(path.grey);

          var printMe = 'Selectors: ' + stats.totalSelectors;
          printMe += ' | Declr: ' + stats.totalDeclarations;
          printMe += ' | Rules: ' + stats.totalRules;
          printMe += ' | S/R: ' + stats.selectorsPerRule;
          printMe += ' | D/R: ' + stats.declarationsPerRule;
          printMe += ' || '+ Math.ceil((stats.fileSize/1000).toFixed()) +'k ('+ Math.ceil((stats.gzipSize/1000).toFixed()) +'k gzip)';

          grunt.log.writeln(printMe);

          printMe = '|' + createNestingTextAndDepth(stats.nestingArr, stats.totalAsterisk, stats);

          grunt.log.writeln(printMe);

          var errMessage;
          if (options.maxSelectors && (stats.totalSelectors > options.maxSelectors)) {
            errMessage = 'exceeded max selector count (' + stats.totalSelectors + '/' + options.maxSelectors + ')';
            if (options.beForgiving) {
              grunt.log.warn(errMessage.red);
            } else {
              grunt.fail.warn(errMessage.red);
            }
          }

          if (options.maxSelectorDepth && (stats.maxDepth > options.maxSelectorDepth)) {
            errMessage = 'exceeded max selector depth (' + stats.maxDepth + '/' + options.maxSelectorDepth + ')';
            if (options.beForgiving) {
              grunt.log.warn(errMessage.red);
            } else {
              grunt.fail.warn(errMessage.red);
            }
          }

          next();
        });
      }, function() {
        done();
      });
    }

    var filesToBeAnalysed = [];
    grunt.util.async.forEachSeries(this.data.src, function(f, next) {
      glob(f, options, function(er, files) {
        for (var j = 0; j < files.length; j++) {
          if (filesToBeAnalysed.indexOf(files[j]) < 0) {
            filesToBeAnalysed.push(files[j]);
          }
        }
        next();
      });
    }, function() {
      analyseFiles(filesToBeAnalysed);
    });

  });
};