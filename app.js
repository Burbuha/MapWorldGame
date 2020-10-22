const browserSync = require("browser-sync").create();

browserSync.init({
  "server": "app",
  "port": 9000,
  "proxy": false,
  "files": ["app/*.html", "app/styles/*.css", "app/src/**/*.js"],
  "ghostMode": false,
  "reloadDelay": 10,
  "reloadDebounce": 800,
  "injectChanges": false,
  "minify": false,
  "open": true,
  "notify": false,
});
