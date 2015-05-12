/**
 * Copyright 2015 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
/*jshint node: true*/
module.exports = function (grunt) {
   'use strict';

   var pkg = grunt.file.readJSON( 'package.json' );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var banner = '/** Copyright 2015 aixigo AG, Released under the MIT license: http://laxarjs.org/license */';

   // mark dependencies that will be satisfied by other bundles
   var DEFER = 'empty:';

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var base = {
      baseUrl: 'bower_components',
      name: pkg.name,
      packages: [ {
         name: pkg.name,
         location: pkg.name,
         main: pkg.name
      } ],
      exclude: [ 'text', 'json' ],
      paths: {
         text: 'requirejs-plugins/lib/text',
         json: 'requirejs-plugins/src/json',

         // provided with laxar:
         'laxar': DEFER,
         'angular': DEFER,

         'json-patch': DEFER
      },
      out: 'dist/' + pkg.name,
      optimize: 'none',
      generateSourceMaps: false
   };

   // internal dependencies:
   var fullPaths = options( {
      'json-patch': 'fast-json-patch/src/json-patch-duplex'
   }, base.paths );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   grunt.initConfig( {
      requirejs: {
         options: base,

         // Just LaxarJS Patterns itself, no dependencies
         // Allows (and requires) you to configure all dependencies yourself.
         'default': {
            options: {
               out: base.out + '.js'
            }
         },

         // LaxarJS Patterns, with internal dependencies
         'with-deps': {
            options: {
               paths: fullPaths,
               shim: {
                  'json-patch': {
                     exports: 'jsonpatch'
                  }
               },
               out: base.out + '.with-deps.js'
            }
         }
      },

      // For the non-testing bundles, create minified versions as well:
      uglify: {
         options: {
            sourceMap: true,
            banner: banner
         },

         'default': {
            files: {
               'dist/laxar-patterns.min.js': [ 'dist/laxar-patterns.js' ]
            }
         },

         'with-deps': {
            files: {
               'dist/laxar-patterns.with-deps.min.js': [ 'dist/laxar-patterns.with-deps.js' ]
            }
         }
      }
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   grunt.loadNpmTasks( 'grunt-contrib-uglify' );
   grunt.loadNpmTasks( 'grunt-laxar' );

   grunt.registerTask( 'dist', [ 'requirejs', 'uglify' ] );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function options( source, defaults ) {
      var target = {};
      [ defaults, source ].forEach( function( src ) {
         for( var key in src ) {
            if( src.hasOwnProperty( key ) ) {
               target[ key ] = src[ key ];
            }
         }
      } );
      return target;
   }
};
