module.exports = function(grunt) {

  grunt.initConfig({
    csscount: {
      dev: {
        src: [
          'test/style.css'
        ],
        options: {
          maxSelectors: 10,
          maxSelectorDepth: 5,
          beForgiving: true
        }
      }
    },
    jshint: {
      files: [
        'Gruntfile.js',
        'lib/*.js',
        'tasks/*.js'
      ],
    }
  });

  grunt.loadNpmTasks('grunt-css-count');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['csscount', 'jshint']);

};