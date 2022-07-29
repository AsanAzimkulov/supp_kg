'use strict'

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var rename = require("gulp-rename");
var header = require("gulp-header");
var minify = require('gulp-minify');
var uglify = require('gulp-uglify');
const javascriptObfuscator = require('gulp-javascript-obfuscator');
var fs = require('fs');


gulp.task('sass', function () {
  return gulp.src('./scss/**/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
});

gulp.task('sassBundle', function () {
  return gulp.src('./scss/**/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./css'));
});






// Static Server without watching scss files
gulp.task('serve:lite', function () {

  browserSync.init({
    server: "./",
    ghostMode: false,
    notify: false
  });

  gulp.watch('**/*.css').on('change', browserSync.reload);
  gulp.watch('**/*.html').on('change', browserSync.reload);
  gulp.watch('js/**/*.js').on('change', browserSync.reload);

});

gulp.task('clean:vendors', function () {
  return del([
    'vendors/**/*'
  ]);
});

/*Building vendor scripts needed for basic template rendering*/
gulp.task('buildVendorScripts', function () {
  return gulp.src([
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/popper.js/dist/umd/popper.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.min.js',
    './node_modules/owl.carousel/dist/owl.carousel.min.js',
    './node_modules/aos/dist/aos.js',
    './node_modules/jquery.flipster/dist/jquery.flipster.min.js',
    './node_modules/emailjs-com/dist/email.min.js',
    './node_modules/toastify-js/src/toastify.js',
  ])
    .pipe(concat('vendor.bundle.base.js'))
    .pipe(gulp.dest('./bundle/vendor/js'));
});

gulp.task('generateUpperChunk', function () {
  return gulp.src(['js/utils/utils.js', 'js/cart.js'])
    .pipe(concat('upperChunk.js'))
    .pipe(gulp.dest('bundle/chunks'))
})

gulp.task('buildOwnScripts', function () {
  return gulp.src(
    ['js/**/*.js', '!js/utils/utils.js', '!js/cart.js', '!js/chunks/*.js']
  )
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write('./maps'))
    .pipe(header(fs.readFileSync('bundle/chunks/upperChunk.js')))
    .pipe(gulp.dest('./bundle/js/'))
    .pipe(browserSync.stream());
});


gulp.task('buildVendorStyles', function () {
  return gulp.src(
    './vendors/**/*.css'
  )
    .pipe(concat('vendor.style.css'))
    .pipe(gulp.dest('./bundle/vendor/css'))
    .pipe(browserSync.stream());
});


gulp.task('copyVendorScriptsSourcemaps', function () {
  var aScript1 = gulp.src(['./node_modules/bootstrap/dist/js/bootstrap.min.js.map'])
    .pipe(gulp.dest('bundle/vendor/js'));
  return aScript1;
});

gulp.task('copyAddonsStyles', function () {
  var aStyle1 = gulp.src(['./node_modules/owl.carousel/dist/assets/owl.carousel.css'])
    .pipe(gulp.dest('./vendors/owl.carousel/css'));
  var aStyle2 = gulp.src(['./node_modules/owl.carousel/dist/assets/owl.theme.default.min.css'])
    .pipe(gulp.dest('./vendors/owl.carousel/css'));
  var aStyle3 = gulp.src(['./node_modules/aos/dist/aos.css'])
    .pipe(gulp.dest('./vendors/aos/css'));
  var aStyle4 = gulp.src(['./node_modules/jquery.flipster/dist/jquery.flipster.css'])
    .pipe(gulp.dest('./vendors/jquery-flipster/css'));
  var aStyle5 = gulp.src(['./node_modules/toastify-js/src/toastify.css'])
    .pipe(gulp.dest('./vendors/toastify-js/css'));
  var aStyle6 = gulp.src(['./node_modules/@mdi/font/css/materialdesignicons.min.css'])
    .pipe(gulp.dest('./vendors/mdi/css'));
  var aStyle7 = gulp.src(['./node_modules/@mdi/font/fonts/*'])
    .pipe(gulp.dest('./bundle/vendor/fonts/'))
  return merge(aStyle1, aStyle2, aStyle3, aStyle4, aStyle5, aStyle6, aStyle7);
});

gulp.task('renameFont', function () {
  return gulp.src('./bundle/vendor/fonts/*.*')
    .pipe(rename(function (path) { path.extname = '.eot' }))
    .pipe(gulp.dest('./bundle/vendor/fonts/'));
});



gulp.task('minifyJsBundles', function () {
  return gulp.src(['./bundle/js/main.js', './bundle/vendor/js/vendor.bundle.base.js'], { base: "./" })
    .pipe(minify({
      ext: {
        min: '.min.js'
      },
    }))
    .pipe(javascriptObfuscator({ compact: true }))
    .pipe(gulp.dest('./'));
})

// Static Server + watching scss/html/js files

gulp.task('serve', gulp.series('sass', function () {
  browserSync.init({
    port: 3001,
    server: "./",
    ghostMode: false,
    notify: false
  });
  gulp.series('buildVendorScripts')
  gulp.watch('scss/**/*.scss', gulp.series('sass'));
  gulp.watch('**/*.html').on('change', browserSync.reload);
  gulp.watch('js/**/*.js').on('change', gulp.series('generateUpperChunk', 'buildOwnScripts'));

}));


gulp.task('deployClean', function (done) {
  del(['./bundle/js/main.js', './bundle/vendor/js/vendor.bundle.base.js', './bundle/chunks'])
    .then(() => done())
});

/*sequence for building vendor scripts and styles*/
gulp.task('bundle', gulp.series('clean:vendors', 'buildVendorScripts', 'sassBundle', 'copyVendorScriptsSourcemaps', 'copyAddonsStyles', 'buildVendorStyles', 'renameFont', 'generateUpperChunk', 'buildOwnScripts'));

gulp.task('deployBuild', gulp.series('clean:vendors', 'buildVendorScripts', 'sassBundle', 'copyAddonsStyles', 'buildVendorStyles', 'renameFont', 'generateUpperChunk', 'buildOwnScripts', 'minifyJsBundles', 'deployClean'));


gulp.task('default', gulp.series('serve'));
