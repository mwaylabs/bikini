var gulp = require('gulp');
var taskListing = require('gulp-task-listing');
var requireDir = require('require-dir');
requireDir('./gulp-tasks');

gulp.task('default', taskListing);
