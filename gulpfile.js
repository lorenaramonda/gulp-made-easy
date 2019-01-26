/**
 * Every task could be run with a parameter --env which accept production and develpment as value (production is the default
 * and it will act differently depending on the parameter passed.
 * @type {Gulp}
 * @params
 * --env development | production
 */

// import modules
const path = require("path"),
  basePath = process.cwd() + "/",
  pkg = require(basePath + "package.json"),
  config = require(basePath + "gulp.config"),
  gulp = require("gulp"),
  autoprefixer = require("gulp-autoprefixer"),
  sass = require("gulp-sass"),
  concat = require("gulp-concat"),
  gulpif = require("gulp-if"),
  insert = require("gulp-insert"),
  uglify = require("gulp-uglify"),
  cleanCSS = require("gulp-clean-css"),
  notify = require("gulp-notify"),
  sourcemaps = require("gulp-sourcemaps");
// set variables
const minimist = require("minimist");
const knownOptions = {
  string: "env",
  default: { env: process.env.NODE_ENV || "production" }
};
const options = minimist(process.argv.slice(2), knownOptions);

// config tasks
config.css.files.forEach(stylesheet => {
  gulp.task("css-" + stylesheet.substr(0, stylesheet.indexOf(".")), () => {
    return gulp
      .src(path.resolve(basePath + config.css.path.src + stylesheet))
      .pipe(gulpif(options.env !== "production", sourcemaps.init()))
      .pipe(
        sass({
          outputStyle: config.css.output,
          includePaths: [path.resolve(basePath + "node_modules/")],
          errLogToConsole: true
        }).on("error", sass.logError)
      )
      .pipe(autoprefixer({ browsers: ["last 2 versions"] }))
      .pipe(gulpif(options.env !== "production", sourcemaps.write("./maps")))
      .pipe(
        gulpif(
          options.env === "production",
          insert.prepend("/*" + pkg.name + ": " + new Date() + "*/\n")
        )
      )
      .pipe(gulp.dest(config.css.path.dest))
      .pipe(notify({ message: "Successfully compiled Sass" }));
  });
});

gulp.task(
  "css",
  config.css.files.map(e => "css-" + e.substr(0, e.indexOf("."))),
  () => {
    console.log("All css files are compiled!");
  }
);

Object.keys(config.js.files).forEach(item => {
  gulp.task("js-" + item, () => {
    console.log("Compiling " + item + " js...");
    return gulp
      .src(config.js.files[item].map(e => path.resolve(basePath + e))) // object value
      .pipe(gulpif(options.env !== "production", sourcemaps.init()))
      .pipe(concat(item + ".js")) // object key
      .pipe(gulpif(options.env === "production", uglify()))
      .pipe(gulpif(options.env !== "production", sourcemaps.write("./maps")))
      .pipe(
        gulpif(
          options.env === "production",
          insert.prepend("/*" + pkg.name + ": " + new Date() + "*/\n")
        )
      )
      .pipe(gulp.dest(config.js.path.dest))
      .pipe(notify({ message: "Successfully compiled Javascript" }));
  });
});

gulp.task("js", Object.keys(config.js.files).map(e => "js-" + e), () => {
  console.log("All js files are compiled!");
});

gulp.task(
  "watch",
  []
    .concat(config.css.files.map(e => "css-" + e.substr(0, e.indexOf("."))))
    .concat(
      Object.keys(config.js.files).map(function(e) {
        return "js-" + e;
      })
    ),
  () => {
    gulp
      .watch(
        [path.resolve(basePath + config.css.path.src + "**/*.scss")],
        ["css"]
      )
      .on("change", function(event) {
        console.info(
          "File " + event.path + " was " + event.type + ", running tasks..."
        );
      });
    gulp
      .watch([path.resolve(basePath + config.js.path.src + "**/*.js")], ["js"])
      .on("change", function(event) {
        console.info(
          "File " + event.path + " was " + event.type + ", running tasks..."
        );
      });
  }
);

gulp.task("default", ["watch"], done => {
  done();
  console.log("Watching files...");
});

gulp.task("build", ["css"], done => {
  done();
  console.log("All files compiled and minified! Ready for production!");
});
