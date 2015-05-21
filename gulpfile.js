var concat = require('gulp-concat')
var connect = require('gulp-connect')
var gulp = require('gulp')
var gutil = require('gulp-util')
var htmlJsStr = require('js-string-escape')
var inject = require('gulp-inject')
var plumber = require('gulp-plumber')
var rimraf = require('rimraf')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')
var spawn = require("child_process").spawn
var streamqueue = require('streamqueue')
var svgmin = require('gulp-svgmin')
var svgstore = require('gulp-svgstore')
var uglify = require('gulp-uglify')


//
// Variables
//
var srcDir = './lib';
var distDir = './build';
var isDebug = !gutil.env.prod;
var isMin = gutil.env.min;

//
// Default
//
gulp.task('default', ['build'], function() {
  gulp.start('watch');
});

//
// Clean
//
gulp.task('clean', function(cb) {
  rimraf(distDir, cb);
});

//
// Build
//
gulp.task('build', ['clean'], function() {
  gulp.start('scripts', 'styles');
});

//
// Watch
//
gulp.task('watch', ['server'], function() {
  gulp.watch(srcDir + '/js/**/*.js', ['scripts']);

  gulp.watch(srcDir + '/css/**/*.scss', ['styles']);
});

//
// Server
//
gulp.task('server', function() {
  connect.server({
    root: './',
    port: 2222,
    livereload: false
  });
});

//
// Javascript
//
gulp.task('scripts', function () {
  var svgs = gulp.src(srcDir + '/icons/*.svg')
    .pipe(svgmin())
    .pipe(svgstore({inlineSvg: true}))
    // .pipe(gulp.dest(distDir));

  function fileContents (filePath, file) {
    return file.contents.toString();
  }

  var files = [
    srcDir + '/js/core/darkroom.js',//all the other files use Darkroom global var, so darkroom.js must be first
    srcDir + '/js/core/*.js',
    // srcDir + '/js/plugins/*.js',
    srcDir + '/js/plugins/darkroom.history.js',
    srcDir + '/js/plugins/darkroom.rotate.js',
    srcDir + '/js/plugins/darkroom.crop.js',
    //srcDir + '/js/plugins/darkroom.save.js',
    //srcDir + '/js/plugins/darkroom.brightness.js',
    //srcDir + '/js/plugins/darkroom.dragndrop.js',
    //srcDir + '/js/plugins/darkroom.thumbnail.js',
    //srcDir + '/js/plugins/darkroom.watermark.js',
    //srcDir + '/js/plugins/darkroom.zoom.js',
  ];

  gulp.src(files)
    .pipe(plumber())
    .pipe(isDebug ? sourcemaps.init() : gutil.noop())
      .pipe(concat('darkroom.js', {newLine: ';'}))
      .pipe(inject(svgs, { transform: fileContents }))
      .pipe(isMin ? uglify({mangle: false}) : gutil.noop())
    .pipe(isDebug ? sourcemaps.write() : gutil.noop())
    .pipe(gulp.dest(distDir))
})

//
// Stylesheet
//
gulp.task('styles', function () {
  gulp.src(srcDir + '/css/darkroom.scss')
    .pipe(plumber())
    .pipe(isDebug ? sourcemaps.init() : gutil.noop())
      .pipe(sass({
        outputStyle: isMin ? 'compressed' : 'nested'
      }))
    .pipe(isDebug ? sourcemaps.write() : gutil.noop())
    .pipe(gulp.dest(distDir))
})
