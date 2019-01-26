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
