// Include gulp
var gulp = require('gulp');
var package = require('./package.json');

// Include Our Plugins
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// Lint
gulp.task('lint', function() {

  return gulp.src('./dev/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));

});

// Minify
gulp.task('minify', function() {

  gulp.src('./dev/jquery.lighterbox.js')
    .pipe(rename(function (path) {
      if(path.extname === '.js') {
        path.basename += '.' + package.version;
      }
    }))
    .pipe(gulp.dest('./'));

  gulp.src('./dev/jquery.lighterbox.js')
    .pipe(uglify())
    .pipe(rename(function (path) {
      if(path.extname === '.js') {
        path.basename += '.' + package.version + '.min';
      }
    }))
    .pipe(gulp.dest('./'));

});

// Default
gulp.task('default', ['lint', 'minify']);