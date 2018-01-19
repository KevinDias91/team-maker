var path = require('path');
var del = require('del');
var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'vinyl-source-stream', 'streamqueue', 'del']
});
// set variable via $ gulp --type production
var environment = $.util.env.type || 'development';
var isProduction = environment === 'production';
var webpackConfig = require('./webpack.config.js').getConfig(environment);

var port = $.util.env.port || 3000;
var app = 'src/client/app/';
var dist = 'dist/';


var plumber = require('gulp-plumber'),
    compass = require('gulp-compass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    customMedia = require("postcss-custom-media"),
    clearfix = require('postcss-clearfix'),
    at2x = require('postcss-at2x'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify');


// https://github.com/ai/autoprefixer
var autoprefixerBrowsers = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 6',
  'opera >= 23',
  'ios >= 6',
  'android >= 4.4',
  'bb >= 10'
];

var onError = function (err) {
    gutil.beep();
    console.log(err);

    this.emit('end');
};


var paths = {
    dist: 'dist/',
    mainCss: 'dist/css/',
    client: 'src/client/',
    src: 'src/client/app/',
    sass: 'src/client/app/scss/**/*.scss',
    es: 'app/js/**/*.js',
    mainSass: 'app/scss/main.scss'
};


gulp.task('scripts', function() {
  return gulp.src(webpackConfig.entry)
    .pipe($.webpack(webpackConfig))
    .pipe(isProduction ? $.uglify() : $.util.noop())
    .pipe(gulp.dest(dist + 'js/'))
    .pipe($.size({ title : 'js' }))
    .pipe($.connect.reload());
});

// copy html from app to dist
gulp.task('html', function() {
  return gulp.src(paths.client + 'index.html')
    .pipe(gulp.dest(dist))
    .pipe($.size({ title : 'html' }))
    .pipe($.connect.reload());
});


gulp.task('styles', function() {
    //var css = fs.readFileSync(destination.css + '/main.css', 'utf8');

    var processors = [
        autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }),
        cssnano,
        customMedia,
        clearfix,
        at2x
    ];


    return gulp.src(paths.src + 'scss/main.scss')
        .pipe(plumber({ errorHandler: onError }))
        .pipe($.sass().on('error', $.sass.logError))
        .pipe(postcss(processors))
        .pipe(gulp.dest(paths.mainCss))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.mainCss))
        .pipe(notify({message: 'Styles task complete'}))
        .pipe($.connect.reload());
});


// add livereload on the given port
gulp.task('serve', function() {
  $.connect.server({
    root: dist,
    port: port,
    livereload: {
      port: 35729
    }
  });
});

// copy images
gulp.task('images', function(cb) {
  return gulp.src(app + 'images/**/*.{png,jpg,jpeg,gif}')
    .pipe($.size({ title : 'images' }))
    .pipe(gulp.dest(dist + 'images/'));
});

// watch styl, html and js file changes
gulp.task('watch', function() {
  gulp.watch(paths.sass, ['styles']);
  // gulp.watch(app + 'index.html', ['html']);
  gulp.watch(app + 'scripts/**/*.js', ['scripts']);
  gulp.watch(app + 'scripts/**/*.jsx', ['scripts']);

});

// remove bundels
gulp.task('clean', function(cb) {
  return del([dist], cb);
});


// by default build project and then watch files in order to trigger livereload
gulp.task('default', ['images','scripts', 'styles', 'watch']);

// waits until clean is finished then builds the project
gulp.task('build', ['clean'], function(){
  gulp.start(['images','scripts','styles']);
});
