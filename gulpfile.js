var gulp   = require('gulp'),
    mocha  = require('gulp-mocha'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');

gulp.task('mocha', function () {
    return gulp.src(['test/*_spec.js'], { read: false })
               .pipe(mocha());
});

gulp.task('uglify', function () {
    return gulp.src('jquery-state.js')
           .pipe(gulp.dest('./'))
           .pipe(uglify())
           .pipe(rename({ extname: '.min.js' }))
           .pipe(gulp.dest('./'));
});

gulp.task('default', [
    'mocha'
]);
