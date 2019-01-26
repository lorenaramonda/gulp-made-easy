# Gulp made easy

A ready-made gulp that only needs config setup to work :)  
Supports sass/scss and js.

## Installation

```
npm install @loreena/gulp-made-easy --save-dev
cp node_modules/gulp-made-easy/gulp.config.js ./
```

This will install and copy the configuration file into the root of your project.

Add this scripts to your package.json:

```
"scripts": {
    "dev": "cross-env NODE_ENV=development gulp --cwd --gulpfile ./node_modules/@loreena/gulp-made-easy/gulpfile.js",
    "build": "cross-env NODE_ENV=production gulp build --cwd --gulpfile ./node_modules/@loreena/gulp-made-easy/gulpfile.js"
  }
```

## Configuration

This is how the config file appears at first:

```
// set config
module.exports = {
  css: {
    path: {
      src: "./src/scss/",
      dest: "./css/"
    },
    output: "compressed", // nested | compact | expanded | compressed
    files: []
  },
  js: {
    path: {
      src: "./src/js/",
      dest: "./js/"
    },
    files: {}
  }
};
```

### css.path.src

(_string_)

Path to sass source files

### css.path.dest

(_string_)

Path to css destination files

### css.output

(_string_)

Type of output style for css, could be one of: nested | compact | expanded | compressed

### css.files

(_array_)

Array of sass source files name in src path to be compiled

### js.path.src

(_string_)

Path to javascript source files

### js.path.dest

(_string_)

Path to javascript destination files

### js.files

(_assosiative array_)

Assosiative array to javascript source files name in src path to be compiled, can be splitted in multiple dest files

So, for instance, you may want to bundle all vendor js together in one file and keep your projects js together. You will write something like this:

```
// set config
module.exports = {
  ...
  js: {
    ...
    files: {
      vendor: {
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/foundation-sites/dist/js/foundation.min.js'
      },
      my-app: {
        './src/js/component1.js',
        './src/js/component2.js'
      }
    }
  }
};
```

and this will produce the following files: `js/vendor.js` and `js/my-app.js`.
