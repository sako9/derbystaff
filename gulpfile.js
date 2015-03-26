/**
* This file is the build system for this app. There are several arrays where
* dependencies are defined, so if you need to add more dependencies, please
* read the comments carefully before modifying them.
*/

/**
* An array of all javascript libraries to build.
* You should only have to change this if you add new folders
* to scripts/lib/
*/
var lib = [

  './config/config.js',

  './scripts/lib/*',
  './scripts/lib/controllers/*',
  './scripts/lib/directives/*',
  './scripts/lib/filters/*',
  './scripts/lib/services/*'

];

/**
* A list of all css files to build. You really shouldn't ever have to
* change this.
*/
var css = [

  './styles/lib/*'

];

/**
* All bower javascript files. Add to this list to install more dependencies
*/
var bowerJs = [

  './bower_components/socket.io-client/socket.io.js',
  './bower_components/modernizr/modernizr.js',
  './bower_components/jquery/dist/jquery.min.js',
  './bower_components/fastclick/lib/fastclick.js',
  './bower_components/angular/angular.min.js',
  './bower_components/angular-route/angular-route.min.js',
  './bower_components/angular-socket-io/socket.min.js',
  './bower_components/angular-cookies/angular-cookies.min.js',
  './bower_components/moment/min/moment.min.js',
  './bower_components/marked/marked.min.js'

];

/**
* Bower CSS files. Add to this list to install more dependencies
*/
var bowerCss = [

  './bower_components/foundation/css/foundation.css',
  './bower_components/font-awesome/css/font-awesome.css'

];

/**
********************************************************************************
* Define Gulp tasks                                                            *
********************************************************************************
*/
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');

/**
* Build bower javascript files
*/
gulp.task('build-bower-js', function () {
  return gulp.src(bowerJs)
    .pipe(concat('bower.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./scripts/dist/'));
});

/**
* Build programmer-defined javascript files
*/
gulp.task('build-lib', function () {
  return gulp.src(lib)
    .pipe(concat('lib.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./scripts/dist/'));
});

/**
* Build bower css files
*/
gulp.task('build-bower-css', function () {
  return gulp.src(bowerCss)
    .pipe(concat('bower.min.css'))
    .pipe(minify())
    .pipe(gulp.dest('./styles/dist/'));
});

/**
* Move over font-awesome icons so they're next to the fonts directory
*/
gulp.task('font-awesome-icons', function() { 
  return gulp.src('./bower_components/font-awesome/fonts/*') 
    .pipe(gulp.dest('./styles/fonts/')); 
});

/**
* Build programmer-defined css files
*/
gulp.task('build-css', function () {
  return gulp.src(css)
    .pipe(concat('lib.min.css'))
    .pipe(minify())
    .pipe(gulp.dest('./styles/dist/'));
});

/**
* Define the default task
*/
gulp.task('default',
  [
    'build-bower-js',
    'build-lib',
    'build-bower-css',
    'font-awesome-icons',
    'build-css'
  ], function () {

  });