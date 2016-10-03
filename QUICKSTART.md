# Using Red Hat Common User Experience (RCUE) - Guide to move from PatternFly to RCUE

RCUE is based on [PatternFly](https://www.patternfly.org/), which is based on [Bootstrap v3](http://getbootstrap.com/).  Think of RCUE as a "skinned" version of PatternFly. **RCUE is meant to be used as a replacement for PatternFly**, so please don't include the PatternFly (or Bootstrap) CSS if you are including the RCUE CSS in your project.

This guide will walk the steps to go from a PatternFly to RCUE styles:

## 1. Make a copy of your project
The first step is to make a copy of your PatternFly based project.
This is where you will replace PatternFly by RCUE.

## 2. Get RCUE repo
Now it's time to get the code from the [RCUE git repository on GitHub](https://github.com/patternfly/rcue). You can download it, fork it or clone it.

RCUE is a private repository, if you don't have access please cotact [the UXD team](mailto:uxd-team@redhat.com) and ask for access.


### What's Included

Within the download you'll find the following directories and files, logically grouping common assets and providing both compiled and minified variations. You'll see something like this:

```
rcue/
├── dist/
│   ├── css/
│   │   │── rcue.min.css (* need to include)
│   │   │── rcue-additions.min.css (* need to include)
│   └── img/
│   │   │── branding materials and loading indicators
├── less/
│   ├── variables, mixin, and component Less files (may need to include if you want to customize the already built CSS)
└── test-src/
    ├── example markup source files
```

RCUE provides compiled CSS (`rcue.*`), as well as compiled and minified CSS (`rcue.min.*`). CSS [source maps](https://developer.chrome.com/devtools/docs/css-preprocessors) (`rcue.*.map`) are available for use with certain browsers' developer tools.

## 3. Replace PatternFly with RCUE
Look for the PatternFly folder on your project and replace it with the RCUE folder you've just downloaded.

This swap will brake your project paths, but don't worry! it's an easy fix we will discuss later on.

## 4. Get the dependencies

RCUE includes a number of dependencies that are not committed to this repository.

You'll need node and npm to get them. If you do not already have nodejs and npm, you can easily do it by getting the [node installer](https://nodejs.org/en/).

### Install NPM Dependencies

Now that NPM is available, we can install the required development components:

```
npm install
```

At this point, you should now have a top level `node_modules/` folder with all dependencies listed in the `package.json` file installed.


```
rcue/
├── node_modules/
│   ├── third-party repos (may need to pull in additional JS includes based on usage, but no additional CSS includes are needed)
├── dist/
│   ├── css/
│   │   │── rcue.min.css (* need to include)
│   │   │── rcue-additions.min.css (* need to include)
│   └── img/
│   │   │── branding materials and loading indicators
├── less/
│   ├── variables, mixin, and component Less files (may need to include if you want to customize the already built CSS)
└── test-src/
    ├── example markup source files
```

### Keeping NPM Dependencies Updated

Anytime you pull a new version of RCUE, make sure you also run

```
npm update
```

so you get the latest version of the components specified in bower.json.

Celebrate by working on integrating RCUE and its dependencies in your app!

## 5. Using RCUE In Your Application

Your last task is to change the paths of your project and point them to the new RCUE folder.

1. Add the following CSS includes to your HTML file(s), adjusting path where needed:

        <!-- RCUE Styles -->
        <!-- Note: No other CSS files are needed regardless of what other JS packages you decide to pull in -->
        <link rel="stylesheet" href="PATH-TO/dist/css/rcue.min.css" />
        <link rel="stylesheet" href="PATH-TO/dist/css/rcue-additions.min.css" />

2. Add the following script includes to your HTML file(s), adjusting where necessary to pull in only what you need:

        <!-- jQuery -->
        <script src="PATH-TO/node_modules/patternfly/node_modules/jquery/dist/jquery.js"></script>

        <!-- Bootstrap JS -->
        <script src="PATH-TO/node_modules/patternfly/node_modules/bootstrap/dist/js/bootstrap.js"></script>

        <!-- C3, D3 - Charting Libraries -->
        <script src="PATH-TO/node_modules/patternfly/node_modules/c3/c3.min.js"></script>
        <script src="PATH-TO/node_modules/patternfly/node_modules/d3/d3.min.js"></script>

        <!-- Datatables, jQuery Grid Component -->
        <!-- Note: jquery.dataTables.js must occur in the html source before patternfly*.js.-->
        <script src="PATH-TO/node_modules/patternfly/node_modules/datatables/media/js/jquery.dataTables.js"></script>
        <script src="PATH-TO/node_modules/patternfly/node_modules/drmonty-datatables-colvis/js/dataTables.colVis.js"></script>
        <script src="PATH-TO/node_modules/patternfly/node_modules/datatables.net-colreorder/js/dataTables.colReorder.js"></script>

        <!-- Patternfly Custom Componets -  Sidebar, Popovers and Datatables Customizations -->
        <!-- Note: jquery.dataTables.js must occur in the html source before patternfly*.js.-->
        <script src="PATH-TO/node_modules/patternfly/dist/js/patternfly.js"></script>

        <!-- Bootstrap Date Picker -->
        <script src="PATH-TO/node_modules/patternfly/node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js"></script>

        <!-- Bootstrap Combobox -->
        <script src="PATH-TO/node_modules/patternfly/node_modules/patternfly-bootstrap-combobox/js/bootstrap-combobox.js"></script>

        <!-- Bootstrap Select -->
        <script src="PATH-TO/node_modules/patternfly/node_modules/bootstrap-select/dist/js/bootstrap-select.min.js"></script>

        <!-- Bootstrap Tree View -->
        <script src="PATH-TO/node_modules/patternfly/node_modules/patternfly-bootstrap-treeview/dist/bootstrap-treeview.min.js"></script>

        <!-- Google Code Prettify - Syntax highlighting of code snippets -->
        <script src="PATH-TO/node_modules/patternfly/node_modules/google-code-prettify/bin/prettify.min.js"></script>

        <!-- MatchHeight - Used to make sure dashboard cards are the same height -->
        <script src="PATH-TO/node_modules/patternfly/node_modules/jquery-match-height/dist/jquery.matchHeight.js"></script>

        <!-- Angular Application? You May Want to Consider Pulling Angular-Patternfly And Angular-UI Bootstrap instead of bootstrap.js -->
        <!-- See https://github.com/patternfly/angular-patternfly for more information -->

## 6. Enjoy

You are done :smile:

If you have any question please contact [the UXD team](mailto:uxd-team@redhat.com).
