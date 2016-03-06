module.exports = function(gulp, $, paths) {
  // Transpiles and copies the style file(s)
  gulp.task('scss:copy', function () {
    return gulp
    .src(paths.style.from)
    .pipe($.sass())
    .pipe(gulp.dest(paths.style.to));
  });
};
