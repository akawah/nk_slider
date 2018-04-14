'use strict';
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const debug = require('gulp-debug');
const gulpIf = require('gulp-if');
const del = require('del');
const newer = require('gulp-newer');
const gcmq = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const svgmin = require('gulp-svgmin');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

//const isDev = false;
const isDev = true;

gulp.task('clean', function(){
    return del('build');
});

gulp.task('sass', function(){
    return gulp.src('app/*.scss')
        .pipe(plumber({
            errorHandler: notify.onError(function(err){
                return {
                    title: 'Sass',
                    message: err.message
                };
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(gulpIf(isDev, sass({outputStyle: 'expanded'}),
                            sass({outputStyle: 'compressed'})))
        .pipe(debug({title: 'sass'}))
        .pipe(gulpIf(!isDev, gcmq()))
        .pipe(gulpIf(!isDev, debug({title: 'group-css-media-queries'})))
        .pipe(gulpIf(!isDev, autoprefixer({ browsers: ['> 0.1%'], cascade: false })))
        .pipe(gulpIf(!isDev, debug({title: 'autoprefixer'})))
        .pipe(gulpIf(isDev, sourcemaps.write(), sourcemaps.write('.')))
        .pipe(gulp.dest('build'));
});

gulp.task('html', function(){
    return gulp.src('app/*.html')
        .pipe(gulp.dest('build'));
});

gulp.task('assets', function(){
    return gulp.src('app/img/*') //, {base: 'app/img'}) //, since: gulp.lastRun('img')
        .pipe(newer('build'))
        .pipe(debug({title: 'assets'}))
        .pipe(gulp.dest('build/img'));
});

gulp.task('js', function(){
    return gulp.src('app/*.js') //, {since: gulp.lastRun('js')}
        .pipe(gulpIf(!isDev, babel({ presets: ['env'] })))
        .pipe(gulpIf(!isDev, debug({title: 'babel'})))
        .pipe(gulpIf(!isDev, uglify()))
        .pipe(gulpIf(!isDev, debug({title: 'uglify-js'})))
        .pipe(gulp.dest('build'));
});

gulp.task('build', gulp.parallel('sass', 'html', 'assets', 'js'));

gulp.task('watch', function(){
    gulp.watch('app/*.scss', gulp.series('sass'));
    gulp.watch('app/*.html', gulp.series('html'));
    gulp.watch('app/*.js', gulp.series('js'));
});

gulp.task('serve', function(){
    browserSync.init({
        browser: 'opera',
        notify: false,
        server : {
            baseDir: 'build'
        }
    });
    browserSync.watch('build/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));

gulp.task('svgmin', function () {
    return gulp.src('app/img/**/*.svg')
        .pipe(svgmin({
            plugins: [
                { removeDoctype: true },
                { removeComments: true },
                { cleanupNumericValues: { floatPrecision: 2 } },
                { convertColors: { names2hex: true, rgb2hex: true } }
            ]
        }))
        .pipe(gulp.dest('build'));
});