var gulp = require('gulp');
var inject = require('gulp-inject');
var wiredep = require('wiredep');

gulp.task('bower-test-inject', function () {
  gulp.src('./test/test.html')
    .pipe(wiredep.stream())
    .pipe(gulp.dest('./test'));
});

gulp.task('inject-test', ['bower-test-inject'], function () {
  gulp.src('./test/test.html')
  .pipe(inject(
    gulp.src(['./test/**/*.js', '!./test/js/**/*.js', '!./test/backbone/**/*.js', '!./test/test.js'], {read: false}), {
      transform: function (filepath) {
        filepath = filepath.replace('/test', '.');
        return inject.transform.apply(inject.transform, arguments);
      }
    }
  ))
  .pipe(gulp.dest('test'));
});
