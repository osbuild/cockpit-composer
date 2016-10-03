grunt-css-count
===============

Count CSS selectors, nesting depth, declarations and rules in CSS files.

* To monitor simplicity of CSS files (depth/nesting of selectors and etc.)
* To watch for 4096 selector limit in IE9.

## Getting Started

This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-css-count --save-dev
```

## Sample Output

```
test/style.css
Selectors: 17 | Declr: 16 | Rules: 11 | S/R: 1.5 | D/R: 1.5 || 1k (1k gzip)
| D1: 7 (41%) | D2: 3 (18%) | D3: 4 (24%) | D4: 2 (12%) | D6: 1 (6%) || * 4
```

*Line 1:* Location of the CSS file being counted.

*Line 2:* General statistics and size of file.

S/R: selectors to rules ratio
D/R: declarations to rules ratio

*Line 3:* Depth of selectors (nesting count) and number of used global CSS selectors (*).

Nesting depth explanation:

D1:
```.selector-1 { ... }```

D2:
```.selector-1 .selector-2 { ... }```

D3:
```.selector-1 .selector-2 .selector-3 { ... }```

...

## Examples

Example of a Grunt config ([Gruntfile.js](http://gruntjs.com/sample-gruntfile)) containing the csscount task.

```js
grunt.initConfig({
  csscount: {
    dev: {
      src: [
        'css/compiled/styles.css',
        'assets/styles/*.min.css'
      ],
      options: {
        maxSelectors: 4000,
        maxSelectorDepth: 5
      }
    }
  }
});

grunt.loadNpmTasks('grunt-css-count');

grunt.registerTask('default', ['csscount']);
```

## Options

##### maxSelectors

Type: `Number`
Default: `∞`

Maximum number of selectors within CSS file. (IE9 limit is 4096)

##### maxSelectorDepth

Type: `Number`
Default: `∞`

Maximum depth (nesting) within selectors.

##### beForgiving

Type: `Boolean`
Default: `false`

Whether Grunt to fail or not on 'maxSelectors' and 'maxSelectorDepth' errors.

***

## Credits

* [@visionmedia](https://github.com/visionmedia) for the great [css-parse](https://github.com/visionmedia/css-parse) library.
* Original work from [@phamann](https://github.com/phamann)'s [grunt-css-metrics](https://github.com/phamann/grunt-css-metrics)
