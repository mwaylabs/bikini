var gulp = require('gulp');
var paths = gulp.paths;
var bs = require('browser-sync').create();
var chalk = require('chalk');
var modRewrite = require('connect-modrewrite');
var nodemon = require('gulp-nodemon');
var preprocess = require('gulp-preprocess');


gulp.task('scripts', function() {
  gulp.src(['./src/bikini.js'])
    .pipe(preprocess())
    .pipe(gulp.dest('./test/.tmp'))
});

gulp.task('start-test-server', function() {
  nodemon({
    script: 'server/server.js'
    , ext: 'js html'
    , env: { 'NODE_ENV': 'development' }
  })
});

var bsInit = function() {
  var bsOptions = {
    port: 3000,
    ui: {
      port: 5000
    },
    server: {
      baseDir: ['.tmp', 'test'],
      routes: {
        '../.tmp': '.tmp'
      },
      middleware: [
        modRewrite([  // for HTML5 mode support
          '!\\.\\w+$ /index.html [L]'
        ])
      ]
    }
  }

  return bs.init(bsOptions);
};

gulp.task('serve-test', ['inject-test', 'start-test-server', 'scripts'], function() {
  bsInit();
  gulp.watch('./test/**/*.js', function() {
    bs.reload();
  });
  gulp.watch('./src/**/*.*', function() {
    gulp.start('scripts');
    bs.reload();
  });
});
