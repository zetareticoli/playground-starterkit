const 
  gulp            = require('gulp'),
  config          = require('./config.json'),
  browserSync     = require('browser-sync').create(),
  del             = require('del'),
  nunjucksRender  = require('gulp-nunjucks-render'),
  scss            = require('gulp-sass'),
  reload          = browserSync.reload;
  fs              = require('fs');

// Set gulp global variables
const {
  src,
  task,
  series,
  dest,
  watch
} = require('gulp');

// Task: Del all compiled folders
gulp.task('del', function () {
  return del([
    config.root
  ]);
});

// Task: Scss files
task('scss', function () {
  return src(config.scss.files)
    .pipe(scss().on('error', scss.logError))
    .pipe(dest(config.scss.dest))
    .pipe(reload({stream: true}));
});

// Task: Handle images
gulp.task('images', function () {
  return src(config.images.files)
    .pipe(dest(
      config.images.dest
    ))
    .pipe(browserSync.stream());
});

// Task: Handle scripts
task('js', function () {
  return src(config.js.files)
    .pipe(dest(
      config.js.dest
    ))
    .pipe(browserSync.reload({stream:true}));
});

// Task: Nunjucks template files
task('nunjucks', function(){
  return gulp.src(config.styleguide.files)
  .pipe(nunjucksRender({
    path: ['src']
  }))
  .pipe(gulp.dest(config.root))
  .pipe(reload({stream: true}));
});

// Task: Watch files
task('watch', function () {

  // Watch scss files
  gulp.watch(
    config.scss.files,
    ['scss']
  );

  // Watch images files
  gulp.watch(
    config.images.files,
    ['images']
  );

  // Watch js files
  gulp.watch(
    config.js.files,
    ['js']
  );

  // Watch styleguide template files
  gulp.watch(
    config.styleguide.files,
    ['nunjucks']
  );

});

// Task: Browser sync
task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: config.root,
            serveStaticOptions : {
              extensions: ['html']
            }
        }
    });
});

// Task: Build
task('build', 
  series(
    'del',
    'scss',
    'images',
    'js',
    'nunjucks',
    'watch',
    'browser-sync'
  )
);
