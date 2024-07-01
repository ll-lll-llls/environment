const gulp = require("gulp");
const sass = require('gulp-dart-sass');
const sassGlob = require('gulp-sass-glob-use-forward');
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');
const webpackStream = require("webpack-stream");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config");

const path_src = {
  css: 'src/scss/',
  js: 'src/js/',
  image: 'src/image/',
}
const path_dest = {
  css: 'assets/dist/css/',
  js: 'assets/dist/js/',
  image: 'assets/dist/image/'
}

const task_style = () => {
  return gulp.src([path_src.css + 'style.scss'],{sourcemaps: true})
  .pipe(sassGlob())
  .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
  .pipe(gulp.dest(path_dest.css).on('error', sass.logError));
}

const task_image = () => {
  return gulp.src([path_src.image + '**/*'])
    .pipe(
      imagemin([
        imagemin.gifsicle({interlaced: true}),
        imageminMozjpeg({
          progressive: true,
          quality: 85
        }),
        imageminPngquant({
          quality: [0.65, 1],
          speed: 1,
        }),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
      ])
    )
    .pipe(gulp.dest(path_dest.image))
}

const task_script = () => {
  return webpackStream(webpackConfig, webpack)
  .pipe(gulp.dest(path_dest.js));
}

const task_watch = () => {
  gulp.watch(path_src.css + '**/*', task_style)
  gulp.watch(path_src.js + '**/*', task_script)
  gulp.watch(path_src.image + '**/*', task_image)
}

exports.default = gulp.series(gulp.series(task_style, task_script, task_image), gulp.parallel(task_watch));
