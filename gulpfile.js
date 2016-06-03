var gulp = require('gulp');
var Server = require('karma').Server;
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var path = require('path');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');
var concatCss = require('gulp-concat-css');
var templateCache = require('gulp-angular-templatecache');
var eventStream = require('event-stream');
var webserver = require('gulp-webserver');

/**
 * File patterns
 **/

// Root directory
var rootDirectory = path.resolve('./');

// Source directory for build process
var sourceDirectory = path.join(rootDirectory, './modules');

var sourceFiles = [

    // Make sure module files are handled first
    path.join(sourceDirectory, '/**/*.module.js'),

    // Then add all JavaScript files
    path.join(sourceDirectory, '/**/*.js')
];

var stylesheets = [
    path.join(sourceDirectory, '/**/*.css')
];

var templates = [
    path.join(sourceDirectory, '/**/*.tpl.html')
];

var lintFiles = [
    'gulpfile.js',
    // Karma configuration
    'karma-*.conf.js'
].concat(sourceFiles);

function getTemplateCache() {
    return gulp.src(templates)
        .pipe(plumber())
        .pipe(templateCache({
            module: 'angular-bubbletree.directives'
        }));
}

gulp.task('build', function() {
    return eventStream.merge(gulp.src(sourceFiles), getTemplateCache())
        .pipe(plumber())
        .pipe(concat('angular-bubbletree.js'))
        .pipe(gulp.dest('./dist/'))
        .pipe(uglify())
        .pipe(rename('angular-bubbletree.min.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-stylesheets', function() {
    return gulp.src(stylesheets)
        .pipe(plumber())
        .pipe(concatCss('angular-bubbletree.css'))
        .pipe(gulp.dest('./dist'));
});

/**
 * Process
 */
gulp.task('process-all', function(done) {
    runSequence('jshint', 'test-src', 'build', done);
});

/**
 * Watch task
 */
gulp.task('watch', function() {

    // Watch JavaScript files
    gulp.watch([sourceFiles, templates], ['process-all']);
    gulp.watch([stylesheets], ['build-stylesheets']);
});

/**
 * Validate source JavaScript
 */
gulp.task('jshint', function() {
    gulp.src(lintFiles)
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

/**
 * Run test once and exit
 */
gulp.task('test-src', function(done) {
    new Server({
        configFile: __dirname + '/karma-src.conf.js',
        singleRun: true
    }, done).start();

});

/**
 * Run test once and exit
 */
gulp.task('test-dist-concatenated', function(done) {
    new Server({
        configFile: __dirname + '/karma-dist-concatenated.conf.js',
        singleRun: true
    }, done).start();
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-minified', function(done) {
    new Server({
        configFile: __dirname + '/karma-dist-minified.conf.js',
        singleRun: true
    }, done).start();

    // karma.start({
    //   configFile: __dirname + '/karma-dist-minified.conf.js',
    //   singleRun: true
    // }, done);
});

gulp.task('webserver', function() {
    gulp.src('./')
        .pipe(webserver({
            host: 'localhost',
            port: 8000,
            open: 'http://localhost:8000/example.html',
            livereload: true,
            directoryListing: true
            // open: true
        }));
});

gulp.task('default', function() {
    runSequence('process-all', 'build-stylesheets', 'watch', 'webserver');
});