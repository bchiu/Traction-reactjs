var gulp   = require('gulp');
var del    = require('del');
var cssmin = require('gulp-minify-css');
var	uglify = require('gulp-uglify');
var	jshint = require('gulp-jshint');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var reactify = require('reactify');
var watchify = require('watchify');
var browserify = require('browserify');
var sourcemaps = require('gulp-sourcemaps');
var	browserSync = require('browser-sync').create();

var paths = {
    base: 'www',
    js:   'www/js/*.js',
    css:  'www/css/*.css',
    html: 'www/*.html'
};

var paths2 = {
    base: 'www-react',
    js:   'www-react/js/*.js',
    jsx:  'www-react/src/**/*.jsx',
    css:  'www-react/src/**/*.css',
    app:  'www-react/src/app.js',
    html: 'www-react/*.html',
    dist: 'www-react/dist'
};

function compile(watch) {
    var bundler = browserify({
        entries: paths2.app,
        transform: 'reactify',
        debug: true,
        cache: {}, packageCache: {}, fullPaths: true
    });

    function rebundle() {
        bundler
            .on('error', function(err) { console.log(err); this.emit('end'); })
            .external('react')
            .external('react-dom')
            .bundle()
            .pipe(source('app.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths2.dist))
    }

    if (watch) {
        watchify(bundler).on('update', function(ids) { 
            console.log('Modified: ' + ids); 
            rebundle(); 
        });
    }

    rebundle();
}

/*
    gulp clean - delete dist directory
*/
gulp.task('clean', function(cb) {
    del(paths2.dist, cb);
});

/* 
    gulp build - compile app without watch
*/
gulp.task('build', function() { return compile(false) });

/* 
    gulp watch - compile app then watch
*/
gulp.task('watch', function() { return compile(true) });

/*
    gulp vendor - compile vendor libs, bundle -> js/vendor.js
*/
gulp.task('vendor', function() {
    var bundler = browserify({
        debug: true,
        cache: {}, packageCache: {}, fullPaths: true
    });

    bundler
        .on('error', function(err) { console.log(err); this.emit("end"); })
        .require('react')
        .require('react-dom')
        .bundle()
        .pipe(source('vendor.js'))            
        .pipe(gulp.dest(paths2.dist))
});

/*
    gulp server - start browserSync server and reload on changes
*/
gulp.task('server', function() {
    browserSync.init({
        server: { baseDir: paths.base },
        files: [paths.html, paths.css, paths.js],
        logFileChanges: true,
        notify: false,
        open: false
    });
});

gulp.task('server:react', function() {
    browserSync.init({
        server: { baseDir: paths2.base },
        files: [paths2.html, paths2.css, paths2.js],
        logFileChanges: true,
        notify: false,
        open: false
    });
});

/*
    gulp serve
*/
gulp.task('serve', ['server']);
gulp.task('serve:react', ['watch', 'server:react']);
