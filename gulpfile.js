var gulp = require('gulp');
var run = require('gulp-run');
var es = require('event-stream');
var exec = require('child_process').exec;
var debounce = require('debounce');
var throttle = require("throttle-debounce").throttle;

const build = function(es){
    return es.map(function(file, cb) {

      exec('cd '+file._base+' && npm run build', function (err, stdout, stderr) {
          cb(err);
        });
      return cb();
    });
}

gulp.task('build-js', function() {
  return gulp
  .src([
      'auth/service/package.json',
      'auth/events/package.json',
      'utils/package.json',
      
    ])
  .pipe(build(es))
    
});

gulp.task('watch:js', function () {
    gulp.watch('./**/**/*.js', throttle(5*1000, gulp.series("build-js")));
});

//gulp.task("watch", ["watch:js"]);
//gulp.task('default', ['build-js']);