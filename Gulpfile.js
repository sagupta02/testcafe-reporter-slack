const gulp = require('gulp');
const babel = require('gulp-babel');
const mocha = require('gulp-mocha');
const del = require('del');

gulp.task('clean', function (cb) {
  del('lib', cb);
});

gulp.task('build', function () {
  return gulp
    .src('src/index.js')
    .pipe(babel({
      presets: ['@babel/env']
  }))
    .pipe(gulp.dest('lib'));
});

gulp.task('watch', function () {
  gulp.watch('src/*.js', ['build']);
});

gulp.task('test', function () {
  return gulp
    .src('test/**.js')
    .pipe(mocha({
      ui: 'bdd',
      reporter: 'spec',
      timeout: typeof v8debug === 'undefined' ? 2000 : Infinity // NOTE: disable timeouts in debug
    }));
});

gulp.task('preview', function () {
  const buildReporterPlugin = require('testcafe').embeddingUtils.buildReporterPlugin;
  const pluginFactory = require('./lib');
  const reporterTestCalls = require('./test/utils/reporter-test-calls');
  const plugin = buildReporterPlugin(pluginFactory);

  reporterTestCalls.forEach(function (call) {
    plugin[call.method].apply(plugin, call.args);
  });

  process.exit(0);
});
