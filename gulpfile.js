
/**
 * @file
 * Drupalizer subtheme gulpfile.
 */

'use strict';

var argv = require('yargs').argv;
var _dev = false;
var mode = 'development';
var activetheme = 'drupalizer';

if (argv.theme) {
  // Use gulp command with --theme=THEME_NAME to compile subtheme
  activetheme = argv.theme;
}

// Configure variables
var sassStyle = 'compressed',
  autoprefixerBrowsers = ['last 2 versions', '> 2%'],  // https://github.com/ai/browserslist#queries
  themePath = 'web/themes/custom/' + activetheme + '/';

if (argv.dev) {
  // Use gulp command with --dev to compile sourcemaps
  mode = 'development';
  sassStyle = 'expanded';
  _dev = true;
}

// Load plugins
const gulp = require('gulp');
const gutil = require('gulp-util'); // @todo: Deprecated in favor of fancy-log?
const fancyLog = require('fancy-log');
const gulpLoadPlugins = require('gulp-load-plugins');
// const iconfont = require('gulp-iconfont');
// const iconfontCss = require('gulp-iconfont-css');
const rename = require('gulp-rename');
const randomToken = require('random-token');
const replace = require('gulp-replace');
// const drupalBreakpoints = require('drupal-breakpoints-scss');
const gulpStylelint = require('gulp-stylelint');
const $ = gulpLoadPlugins();

fancyLog("[[ ===================================================================");
fancyLog("[[   COMPILING '" + activetheme + "' IN '" + mode + "' MODE");
fancyLog("[[ ===================================================================");

// Configure paths
var paths = {
  // icons: {
  //   src: themePath + 'icons/*.svg',
  //   dest: themePath + 'fonts/'
  // },
  // breakpoints: {
  //   src: themePath + activetheme + '.breakpoints.yml',
  //   dest: themePath + 'sass/config/'
  // },
  styles: {
    src: themePath + 'sass/**/*.scss',
    dest: themePath + 'css/'
  },
  // componentStyles: {
  //   src: themePath + 'components/**/*.scss',
  //   dest: themePath + 'components/'
  // },
  scripts: {
    src: themePath + 'scripts/**/*.js',
    dest: themePath + 'js/'
  },
  // componentScripts: {
  //   src: themePath + 'components/**/!(*.min)*.js',
  //   dest: themePath + 'components/'
  // },
  csscomb: {
    src: themePath + 'sass/**/*.scss',
    dest: themePath
  }
};


// Iconfont task
// function icons() {
//   return gulp
//     .src([paths.icons.src,], {base: themePath})
//     .pipe(iconfontCss({
//       fontName: 'icons',
//       path: themePath + 'icons/_template.scss',
//       targetPath: '../sass/config/_icons.scss',
//       fontPath: paths.icons.dest
//     }))
//     .pipe(iconfont({
//       fontName: 'icons',
//       formats: ['ttf', 'eot', 'woff', 'svg', 'woff2'],
//       normalize: true,
//       fontHeight: 128,
//       descent: 24
//     }))
//     .pipe(replace('{{icon-font-token}}', randomToken(8)))
//     .pipe(gulp.dest(paths.icons.dest));
// }


// Make 'silent' icon version for components
// function iconsComponents() {
//   return gulp
//     .src([paths.icons.src,], {base: themePath})
//     .pipe(iconfontCss({
//       fontName: 'icons',
//       path: themePath + 'icons/_template_components.scss',
//       targetPath: '../components/_helper/_icons.scss',
//       fontPath: paths.icons.dest
//     }))
//     // It's needed to re-do the step below, or weird stuff happens (extra folder with weirdly named svg's)
//     .pipe(iconfont({
//       fontName: 'icons',
//       formats: ['ttf', 'eot', 'woff', 'svg', 'woff2'],
//       normalize: true,
//       fontHeight: 128,
//       descent: 24
//     }))
//     .pipe(gulp.dest(paths.icons.dest));
// }


// Breakpoint task
// function breakpoints() {
//   return gulp
//     .src(paths.breakpoints.src)
//     .pipe(drupalBreakpoints.ymlToScss())
//     .pipe(rename('_breakpoints.scss'))
//     .pipe(gulp.dest(paths.breakpoints.dest));
// }


// Sass lint
function lintsass() {
  return gulp
    .src(paths.styles.src)
    .pipe(gulpStylelint({
      failAfterError: false,
      reporters: [
        {formatter: 'string', console: true}
      ]
    }));
}

// Sass lint components
// function lintsassComponents() {
//   return gulp
//     .src(paths.componentStyles.src)
//     .pipe(gulpStylelint({
//       failAfterError: false,
//       reporters: [
//         {formatter: 'string', console: true}
//       ]
//     }));
// }


// Sass compile + prefix task
function sass() {
  return gulp
    .src(paths.styles.src)
    .pipe($.plumber())
    .pipe(_dev ? $.sourcemaps.init() : gutil.noop())
    .pipe($.sass({
      outputStyle: sassStyle
    }).on('error', $.sass.logError))
    // Add pixel fallback for rem values.
    //.pipe($.pixrem('1rem', {atrules: true}))
    // Prefix CSS depending in required browser support.
    .pipe($.autoprefixer({
      overrideBrowserslist: autoprefixerBrowsers,
      cascade: false
    }))
    .pipe(_dev ? $.sourcemaps.write('./') : gutil.noop())
    .pipe(gulp.dest(paths.styles.dest));
}

// Sass compile + prefix task
function sassComponents() {
  return gulp
    .src(paths.componentStyles.src)
    .pipe($.plumber())
    .pipe(_dev ? $.sourcemaps.init() : gutil.noop())
    .pipe($.sass({
      outputStyle: sassStyle
    }).on('error', $.sass.logError))
    // Add pixel fallback for rem values.
    //.pipe($.pixrem('1rem', {atrules: true}))
    // Prefix CSS depending in required browser support.
    .pipe($.autoprefixer({
      overrideBrowserslist: autoprefixerBrowsers,
      cascade: false
    }))
    .pipe(_dev ? $.sourcemaps.write('./') : gutil.noop())
    .pipe(gulp.dest(paths.componentStyles.dest));
}


// Javascript minify task
function scripts() {
  return gulp
    .src(paths.scripts.src)
    .pipe($.plumber())
    .pipe($.uglify({ mangle: { reserved: ['Drupal'] } }))
    .pipe($.rename(function (path) {
      path.basename += '.min';
    }))
    .pipe(gulp.dest(paths.scripts.dest));
}

// Javascript minify task
// function scriptsComponents() {
//   return gulp
//     .src(paths.componentScripts.src)
//     .pipe($.plumber())
//     .pipe($.uglify({ mangle: { reserved: ['Drupal'] } }))
//     .pipe($.rename(function (path) {
//       path.basename += '.min';
//     }))
//     .pipe(gulp.dest(paths.componentScripts.dest));
// }


// Watch files
function watchFiles() {
  // gulp.watch(paths.breakpoints.src, {usePolling: true}, breakpoints());
  gulp.watch(paths.styles.src, {usePolling: true}, gulp.series(sass, lintsass, sassComponents));
  // gulp.watch(paths.componentStyles.src, {usePolling: true}, gulp.series(sassComponents, lintsassComponents));
  gulp.watch(paths.scripts.src, {usePolling: true}, scripts);
  // gulp.watch(paths.componentScripts.src, {usePolling: true}, scriptsComponents);
}


// Commands
// const build = gulp.series(icons, iconsComponents, gulp.parallel(gulp.series(sass, lintsass, sassComponents, lintsassComponents), scripts, scriptsComponents));
const build = gulp.series(gulp.parallel(gulp.series(sass, lintsass), scripts));
const watch = gulp.series(build, watchFiles);
const sasslint = gulp.series(lintsass);

exports.build = build;
exports.watch = watch;
exports.sasslint = sasslint;
exports.default = build;
