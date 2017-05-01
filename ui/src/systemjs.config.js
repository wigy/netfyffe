/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      'app': 'app',

      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      '@angular/animations': 'npm:@angular/animations/bundles/animations.umd.js',
      '@angular/animations': 'node_modules/@angular/animations/bundles/animations.umd.min.js',
      '@angular/animations/browser':'node_modules/@angular/animations/bundles/animations-browser.umd.js',
      '@angular/platform-browser/animations': 'node_modules/@angular/platform-browser/bundles/platform-browser-animations.umd.js',

      // other libraries
      'rxjs':                      'npm:rxjs',
      'd3-format': 'npm:d3-format/build/d3-format.min.js',
      'd3-time-format': 'npm:d3-time-format/build/d3-time-format.min.js',
      'd3-array': 'npm:d3-array/build/d3-array.min.js',
      'd3-brush': 'npm:d3-brush/build/d3-brush.min.js',
      'd3-force': 'npm:d3-force/build/d3-force.min.js',
      'd3-interpolate': 'npm:d3-interpolate/build/d3-interpolate.min.js',
      'd3-scale': 'npm:d3-scale/build/d3-scale.min.js',
      'd3-selection': 'npm:d3-selection/build/d3-selection.min.js',
      'd3-shape': 'npm:d3-shape/build/d3-shape.min.js',
      'd3-hierarchy': 'npm:d3-hierarchy/build/d3-hierarchy.min.js',
      'd3-time': 'npm:d3-time/build/d3-time.min.js',
      'd3-dispatch': 'npm:d3-dispatch/build/d3-dispatch.min.js',
      'd3-drag': 'npm:d3-drag/build/d3-drag.min.js',
      'd3-transition': 'npm:d3-transition/build/d3-transition.min.js',
      'd3-quadtree': 'npm:d3-quadtree/build/d3-quadtree.min.js',
      'd3-collection': 'npm:d3-collection/build/d3-collection.min.js',
      'd3-timer': 'npm:d3-timer/build/d3-timer.min.js',
      'd3-color': 'npm:d3-color/build/d3-color.min.js',
      'd3-path': 'npm:d3-path/build/d3-path.min.js',
      'd3-ease': 'npm:d3-ease/build/d3-ease.min.js',
      '@swimlane/ngx-charts': 'npm:@swimlane/ngx-charts/release/index.min.js',
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',

    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        defaultExtension: 'js',
        meta: {
          './*.js': {
            loader: 'systemjs-angular-loader.js'
          }
        }
      },
      rxjs: {
        defaultExtension: 'js'
      }
    }
  });
})(this);
