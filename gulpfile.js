var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');

gulp.task('compress', function() {
    return gulp.src('dist/swiped.js')
        .pipe(uglify())
        .pipe(rename('swiped.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('lint', function() {
    return gulp.src('dist/swiped.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('default', ['lint', 'compress']);