var gulp = require("gulp");
var babel = require("gulp-babel");
var es2015 = require("babel-preset-es2015");
var webpack = require("gulp-webpack");
var uglify = require('gulp-uglify');
gulp.task("default", function () {
  return gulp.src("src/js/**/*.js")
    .pipe(babel({presets:[es2015]}))
    .pipe(gulp.dest("dist/js"))
    .pipe(webpack({//babel编译import会转成require，webpack再包装以下代码让代码里支持require
      output:{
        filename:"app.js",
      },
      stats:{
        colors:true
      }
    }))
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"));//包装好的js目录
});